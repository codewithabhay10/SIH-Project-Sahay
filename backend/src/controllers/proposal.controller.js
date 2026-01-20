import Proposal from "../models/proposal.model.js";

// Create and save a draft proposal
const saveDraft = async (req, res) => {
  try {
    let data = req.body || {};

    // If a nested 'proposal' JSON string is provided (multipart), safely parse and merge
    if (typeof req.body?.proposal === "string") {
      try {
        const parsed = JSON.parse(req.body.proposal);
        data = { ...data, ...parsed };
      } catch (e) {
        // ignore parsing errors and proceed with raw body
      }
    }

    // Attach uploaded supporting documents (from multer + Cloudinary)
    if (req.files && req.files.length) {
      data.supporting_documents = req.files.map((f) => ({
        filename: f.originalname,
        url: f.path || f.secure_url || f.location,
        mimeType: f.mimetype,
        size: f.size,
      }));
    }

    // Attach creator if available
    if (req.user && req.user._id) data.created_by = req.user._id;

    // Ensure status is draft for this endpoint
    data.status = "draft";

    const proposal = await Proposal.create(data);

    return res.status(201).json({
      message: "Draft saved successfully",
      success: true,
      proposal,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message, success: false });
  }
};

// Submit a proposal (only users with role 'state' allowed)
const submitProposal = async (req, res) => {
  try {
    // Must be authenticated
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Not authenticated", success: false });
    }

    // Only 'state' role can submit
    if (req.user.role !== "state") {
      return res
        .status(403)
        .json({ message: "Forbidden: insufficient role", success: false });
    }

    let data = req.body || {};

    // If a nested 'proposal' JSON string is provided (multipart), safely parse and merge
    if (typeof req.body?.proposal === "string") {
      try {
        const parsed = JSON.parse(req.body.proposal);
        data = { ...data, ...parsed };
      } catch (e) {
        // ignore parsing errors and proceed with raw body
      }
    }

    // Attach uploaded supporting documents
    if (req.files && req.files.length) {
      data.supporting_documents = req.files.map((f) => ({
        filename: f.originalname,
        url: f.path || f.secure_url || f.location,
        mimeType: f.mimetype,
        size: f.size,
      }));
    }
    data.created_by = req.user._id;
    data.status = "submitted";

    // Minimal validation: require title and estimated_budget when submitting
    if (!data.title || (typeof data.title === "string" && !data.title.trim())) {
      return res
        .status(400)
        .json({ message: "Title is required to submit", success: false });
    }

    const proposal = await Proposal.create(data);

    return res.status(201).json({
      message: "Proposal submitted successfully",
      success: true,
      proposal,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message, success: false });
  }
};

export { saveDraft, submitProposal };

// List proposals with pagination and filters
const listProposals = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 100);

    const filter = {};

    // Filters: status, district, category, search (title)
    if (req.query.status) filter.status = req.query.status;
    if (req.query.district) filter.district = req.query.district;
    if (req.query.category) filter.category = req.query.category;

    if (req.query.search) {
      filter.title = { $regex: req.query.search, $options: "i" };
    }

    const total = await Proposal.countDocuments(filter);

    const proposals = await Proposal.find(filter)
      .populate({
        path: "project",
        select: "state district IA_code SNA_code project_name",
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const pages = Math.max(Math.ceil(total / limit), 1);

    return res.json({
      success: true,
      message: "Proposals fetched successfully",
      meta: { total, page, limit, pages },
      proposals,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message, success: false });
  }
};

export { listProposals };

// Get a single proposal by id
const getProposalById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ message: "Proposal id is required", success: false });
    }

    const proposal = await Proposal.findById(id)
      .populate({
        path: "project",
        select: "state district IA_code SNA_code project_name",
      })
      .lean();

    if (!proposal) {
      return res
        .status(404)
        .json({ message: "Proposal not found", success: false });
    }

    return res.json({ success: true, proposal });
  } catch (err) {
    return res.status(500).json({ message: err.message, success: false });
  }
};

export { getProposalById };

// Update proposal status (allow submitted -> in_progress)
const updateProposalStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body || {};

    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Not authenticated", success: false });
    }
    if (!id) {
      return res
        .status(400)
        .json({ message: "Proposal id is required", success: false });
    }
    if (!status) {
      return res
        .status(400)
        .json({ message: "Target status is required", success: false });
    }

    const proposal = await Proposal.findById(id);
    if (!proposal) {
      return res
        .status(404)
        .json({ message: "Proposal not found", success: false });
    }

    const current = (proposal.status || "").toLowerCase();
    const target = (status || "").toLowerCase();

    // Only allow submitted -> in_progress transition via this endpoint
    if (!(current === "submitted" && target === "in_progress")) {
      return res.status(400).json({
        message:
          "Invalid status transition: only submitted -> in_progress allowed",
        success: false,
      });
    }

    proposal.status = "in_progress";
    await proposal.save();

    return res.json({ success: true, message: "Status updated", proposal });
  } catch (err) {
    return res.status(500).json({ message: err.message, success: false });
  }
};

export { updateProposalStatus };

// Approve a proposal
const approveProposal = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Not authenticated", success: false });
    }
    if (!id) {
      return res
        .status(400)
        .json({ message: "Proposal id is required", success: false });
    }

    const proposal = await Proposal.findById(id);
    if (!proposal) {
      return res
        .status(404)
        .json({ message: "Proposal not found", success: false });
    }

    const current = (proposal.status || "").toLowerCase();
    // Allow approval from submitted/in_review/under_review/in_progress
    if (
      !["submitted", "in_review", "under_review", "in_progress"].includes(
        current
      )
    ) {
      return res
        .status(400)
        .json({
          message: "Cannot approve proposal from current status",
          success: false,
        });
    }

    proposal.status = "approved";
    await proposal.save();
    return res.json({ success: true, message: "Proposal approved", proposal });
  } catch (err) {
    return res.status(500).json({ message: err.message, success: false });
  }
};

// Reject a proposal
const rejectProposal = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body || {};
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Not authenticated", success: false });
    }
    if (!id) {
      return res
        .status(400)
        .json({ message: "Proposal id is required", success: false });
    }

    const proposal = await Proposal.findById(id);
    if (!proposal) {
      return res
        .status(404)
        .json({ message: "Proposal not found", success: false });
    }

    const current = (proposal.status || "").toLowerCase();
    // Allow rejection from submitted/in_review/under_review/in_progress
    if (
      !["submitted", "in_review", "under_review", "in_progress"].includes(
        current
      )
    ) {
      return res
        .status(400)
        .json({
          message: "Cannot reject proposal from current status",
          success: false,
        });
    }

    proposal.status = "rejected";
    // Optionally we could store rejection reason in a field; skipping if model lacks it
    await proposal.save();
    return res.json({ success: true, message: "Proposal rejected", proposal });
  } catch (err) {
    return res.status(500).json({ message: err.message, success: false });
  }
};

export { approveProposal, rejectProposal };
