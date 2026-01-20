import UC from "../models/uc.model.js";
import fs from "fs";
import path from "path";

// Create new UC record
export const createUC = async (req, res) => {
  try {
    const {
      ucNumber,
      project,
      projectId,
      period,
      amount,
      remarks,
      iaId,
      uploadedBy,
      uploadedById,
      verificationResult,
      status,
    } = req.body;

    if (!ucNumber || !project || !period || !amount) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: ucNumber, project, period, amount",
      });
    }

    // Check if file was uploaded
    let fileUrl = "";
    let filename = "";
    
    if (req.file) {
      filename = req.file.originalname;
      // Move file to permanent storage
      const permanentPath = path.join(process.cwd(), "public", "uc-uploads");
      
      // Ensure directory exists
      if (!fs.existsSync(permanentPath)) {
        fs.mkdirSync(permanentPath, { recursive: true });
      }
      
      const newFilePath = path.join(permanentPath, `${ucNumber}_${filename}`);
      fs.renameSync(req.file.path, newFilePath);
      
      fileUrl = `/uc-uploads/${ucNumber}_${filename}`;
    }

    const ucData = {
      ucNumber,
      filename,
      fileUrl,
      project,
      projectId: projectId || null,
      period,
      amount: parseFloat(amount),
      remarks,
      iaId,
      uploadedBy,
      uploadedById: uploadedById || null,
      verificationResult: verificationResult ? JSON.parse(verificationResult) : null,
      status: status || "Pending",
    };

    const newUC = await UC.create(ucData);

    res.status(201).json({
      success: true,
      message: "UC uploaded successfully",
      data: newUC,
    });
  } catch (error) {
    console.error("Error creating UC:", error);
    
    // Cleanup uploaded file on error
    if (req.file?.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {
        console.warn("Could not delete temp file:", e.message);
      }
    }
    
    res.status(500).json({
      success: false,
      error: error.message || "Error creating UC record",
    });
  }
};

// Get all UCs (with optional filters)
export const getUCs = async (req, res) => {
  try {
    const { iaId, status, projectId } = req.query;

    const filter = {};
    if (iaId) filter.iaId = iaId;
    if (status && status !== "All Status") filter.status = status;
    if (projectId) filter.projectId = projectId;

    const ucs = await UC.find(filter)
      .populate("projectId", "project_name project_id")
      .populate("uploadedById", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: ucs.length,
      data: ucs,
    });
  } catch (error) {
    console.error("Error fetching UCs:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Error fetching UC records",
    });
  }
};

// Get single UC by ID
export const getUCById = async (req, res) => {
  try {
    const { id } = req.params;

    const uc = await UC.findById(id)
      .populate("projectId", "project_name project_id")
      .populate("uploadedById", "name email");

    if (!uc) {
      return res.status(404).json({
        success: false,
        error: "UC not found",
      });
    }

    res.status(200).json({
      success: true,
      data: uc,
    });
  } catch (error) {
    console.error("Error fetching UC:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Error fetching UC record",
    });
  }
};

// Update UC status
export const updateUCStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;

    if (!["Approved", "Rejected", "Pending"].includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Invalid status value",
      });
    }

    const updatedUC = await UC.findByIdAndUpdate(
      id,
      { status, $set: { remarks } },
      { new: true, runValidators: true }
    );

    if (!updatedUC) {
      return res.status(404).json({
        success: false,
        error: "UC not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "UC status updated successfully",
      data: updatedUC,
    });
  } catch (error) {
    console.error("Error updating UC status:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Error updating UC status",
    });
  }
};

// Delete UC
export const deleteUC = async (req, res) => {
  try {
    const { id } = req.params;

    const uc = await UC.findById(id);
    if (!uc) {
      return res.status(404).json({
        success: false,
        error: "UC not found",
      });
    }

    // Delete file if exists
    if (uc.fileUrl) {
      const filePath = path.join(process.cwd(), "public", uc.fileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await UC.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "UC deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting UC:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Error deleting UC record",
    });
  }
};
