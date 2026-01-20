import Project from "../models/project.model.js";
import Proposal from "../models/proposal.model.js";

// Helper: safe JSON parse for fields coming from form-data
function safeParseJSON(value) {
  if (!value) return null;
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch (e) {
    return null;
  }
}

// Attach files metadata array from multer to target object
function filesToDocs(files) {
  if (!files || !files.length) return [];
  return files.map((f) => ({
    filename: f.originalname,
    url: f.path || f.secure_url || f.location,
    mimeType: f.mimetype,
    size: f.size,
  }));
}

// Save or update a draft project. If `projectId` provided, update existing draft.
const saveDraftProject = async (req, res) => {
  try {
    const body = req.body || {};
    const files = req.files || [];

    // Build project payload safely
    const payload = {};
    payload.project_name = body.project_name || body.title || null;
    payload.project_id = body.project_id || null;
    payload.district = body.district || null;
    payload.state = body.state || null;
    payload.IA_code = body.IA_code || body.ia_code || null;
    payload.SNA_code = body.SNA_code || body.sna_code || null;
    payload.allocated_amount = Number(body.allocated_amount) || 0;
    payload.released_amount = Number(body.released_amount) || 0;

    // Attach files at project level (if any and proposal not provided)
    const docs = filesToDocs(files);
    if (docs.length) payload.supporting_documents = docs;

    // Handle nested proposal if provided (frontend may send JSON string)
    const proposalRaw = body.proposal || body.proposal_data;
    const proposalData = safeParseJSON(proposalRaw);

    if (proposalData) {
      // attach any uploaded files to proposal specifically
      const propDocs = docs.length ? docs : [];
      const proposalPayload = {
        ...proposalData,
        supporting_documents: propDocs,
      };
      if (req.user && req.user._id) proposalPayload.created_by = req.user._id;

      const createdProposal = await Proposal.create(proposalPayload);
      payload.proposal = createdProposal._id;
    }

    // Attach creator if authenticated
    if (req.user && req.user._id) payload.created_by = req.user._id;

    // If updating existing draft
    const projectId = body._id || body.projectId || null;
    let project;
    if (projectId) {
      project = await Project.findById(projectId);
      if (project) {
        // Only allow update if it's a draft or creator matches
        if (
          project.status !== "draft" &&
          (!req.user || String(project.created_by) !== String(req.user._id))
        ) {
          return res
            .status(403)
            .json({ message: "Cannot modify this project", success: false });
        }
        Object.assign(project, payload);
        await project.save();
        return res.json({ message: "Draft updated", success: true, project });
      }
    }

    // Create new draft
    payload.status = "draft";
    const created = await Project.create(payload);
    return res
      .status(201)
      .json({ message: "Draft saved", success: true, project: created });
  } catch (err) {
    console.error("saveDraftProject error", err);
    return res.status(500).json({
      message: "Failed to save draft",
      error: err.message,
      success: false,
    });
  }
};

// Submit project: only role 'state' allowed. Can accept proposal as nested object.
const submitProject = async (req, res) => {
  try {
    if (!req.user)
      return res
        .status(401)
        .json({ message: "Not authenticated", success: false });
    if (req.user.role !== "state")
      return res.status(403).json({
        message: "Only state users can submit projects",
        success: false,
      });

    const body = req.body || {};
    const files = req.files || [];

    // Minimal required fields check
    const project_name = body.project_name || body.title;
    if (!project_name)
      return res
        .status(400)
        .json({ message: "project_name is required", success: false });

    // Build payload
    const payload = {};
    payload.project_name = project_name;
    payload.project_id = body.project_id || null;
    payload.district = body.district || null;
    payload.state = body.state || null;
    payload.IA_code = body.IA_code || body.ia_code || null;
    payload.SNA_code = body.SNA_code || body.sna_code || null;
    payload.allocated_amount = Number(body.allocated_amount) || 0;
    payload.released_amount = Number(body.released_amount) || 0;

    // Files
    const docs = filesToDocs(files);
    if (docs.length) payload.supporting_documents = docs;

    // Handle nested proposal
    const proposalRaw = body.proposal || body.proposal_data;
    const proposalData = safeParseJSON(proposalRaw);
    if (proposalData) {
      const proposalPayload = { ...proposalData, supporting_documents: docs };
      proposalPayload.created_by = req.user._id;
      const createdProposal = await Proposal.create(proposalPayload);
      payload.proposal = createdProposal._id;
    }

    payload.created_by = req.user._id;
    payload.status = "submitted";

    const created = await Project.create(payload);
    return res
      .status(201)
      .json({ message: "Project submitted", success: true, project: created });
  } catch (err) {
    console.error("submitProject error", err);
    return res.status(500).json({
      message: "Failed to submit project",
      error: err.message,
      success: false,
    });
  }
};

export { saveDraftProject, submitProject };

// Get all projects with pagination and optional filters
const getAllProjects = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, district, state, search } = req.query;

    const q = {};
    if (status) q.status = status;
    if (district) q.district = district;
    if (state) q.state = state;
    if (search) q.project_name = { $regex: search, $options: "i" };

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const lim = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

    const total = await Project.countDocuments(q);
    const projects = await Project.find(q)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * lim)
      .limit(lim)
      .populate({ path: "proposal", select: "title estimated_budget" })
      .populate({ path: "created_by", select: "name email role" })
      .lean();

    return res.json({
      success: true,
      meta: { total, page: pageNum, limit: lim, pages: Math.ceil(total / lim) },
      projects,
    });
  } catch (err) {
    console.error("getAllProjects error", err);
    return res.status(500).json({
      message: "Failed to fetch projects",
      error: err.message,
      success: false,
    });
  }
};

// Approve a project (only 'pacc' role allowed)
const approveProject = async (req, res) => {
  try {
    if (!req.user)
      return res
        .status(401)
        .json({ message: "Not authenticated", success: false });
    if (req.user.role !== "pacc")
      return res.status(403).json({
        message: "Only pacc users can approve projects",
        success: false,
      });

    const { id } = req.params;
    if (!id)
      return res
        .status(400)
        .json({ message: "Project id is required", success: false });

    const project = await Project.findById(id);
    if (!project)
      return res
        .status(404)
        .json({ message: "Project not found", success: false });

    if (project.status === "approved")
      return res
        .status(400)
        .json({ message: "Project already approved", success: false });

    // Only allow approving submitted projects
    if (project.status !== "submitted" && project.status !== "in_progress") {
      return res.status(400).json({
        message: `Cannot approve project in status ${project.status}`,
        success: false,
      });
    }

    project.status = "approved";

    // If project has a linked proposal, ensure allocated_amount is at least the proposal's estimated_budget
    try {
      if (project.proposal) {
        const prop = await Proposal.findById(project.proposal).lean();
        const estimated = prop ? Number(prop.estimated_budget || 0) : 0;
        const currentAllocated = Number(project.allocated_amount || 0);
        project.allocated_amount = Math.max(currentAllocated, estimated);
      }
    } catch (e) {
      // don't block approval if proposal fetch fails; log and proceed
      console.warn(
        "approveProject: could not read proposal to set allocated_amount",
        e.message
      );
    }

    project.approved_by = req.user._id;
    project.approved_at = new Date();
    await project.save();

    const result = await Project.findById(id)
      .populate({ path: "created_by", select: "name email role" })
      .populate({ path: "proposal", select: "title estimated_budget" })
      .lean();

    return res.json({
      message: "Project approved",
      success: true,
      project: result,
    });
  } catch (err) {
    console.error("approveProject error", err);
    return res.status(500).json({
      message: "Failed to approve project",
      error: err.message,
      success: false,
    });
  }
};

// Reject a project (only 'pacc' role allowed)
const rejectProject = async (req, res) => {
  try {
    if (!req.user)
      return res
        .status(401)
        .json({ message: "Not authenticated", success: false });
    if (req.user.role !== "pacc")
      return res.status(403).json({
        message: "Only pacc users can reject projects",
        success: false,
      });

    const { id } = req.params;
    if (!id)
      return res
        .status(400)
        .json({ message: "Project id is required", success: false });

    const { reason } = req.body || {};

    const project = await Project.findById(id);
    if (!project)
      return res
        .status(404)
        .json({ message: "Project not found", success: false });

    if (project.status === "rejected")
      return res
        .status(400)
        .json({ message: "Project already rejected", success: false });

    // Allow rejecting submitted or in_progress projects
    if (project.status !== "submitted" && project.status !== "in_progress") {
      return res.status(400).json({
        message: `Cannot reject project in status ${project.status}`,
        success: false,
      });
    }

    project.status = "rejected";
    project.rejected_by = req.user._id;
    project.rejected_at = new Date();
    if (reason) project.rejection_reason = String(reason).trim();
    await project.save();

    const result = await Project.findById(id)
      .populate({ path: "created_by", select: "name email role" })
      .populate({ path: "proposal", select: "title estimated_budget" })
      .lean();

    return res.json({
      message: "Project rejected",
      success: true,
      project: result,
    });
  } catch (err) {
    console.error("rejectProject error", err);
    return res.status(500).json({
      message: "Failed to reject project",
      error: err.message,
      success: false,
    });
  }
};

export { getAllProjects, approveProject, rejectProject };
