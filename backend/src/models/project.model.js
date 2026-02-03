import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    project_name: { type: String, required: true, trim: true },
    project_id: { type: String, required: true, unique: true, trim: true },
    district: { type: String, trim: true },
    state: { type: String, trim: true, default: "MH" },
    IA_code: { type: String, trim: true },
    SNA_code: { type: String, trim: true },
    status: {
      type: String,
      enum: ["draft", "submitted", "in_progress", "approved", "rejected"],
      default: "draft",
    },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    supporting_documents: [
      {
        filename: { type: String, trim: true },
        url: { type: String, trim: true },
        mimeType: { type: String, trim: true },
        size: { type: Number },
      },
    ],
    allocated_amount: { type: Number, default: 0, min: 0 },
    released_amount: { type: Number, default: 0, min: 0 },
    // approval / rejection metadata
    approved_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    approved_at: { type: Date },
    rejected_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    rejected_at: { type: Date },
    rejection_reason: { type: String, trim: true },
    proposal: { type: mongoose.Schema.Types.ObjectId, ref: "Proposal" },
  },
  { timestamps: true }
);

// project_id already has unique: true which creates an index

const Project =
  mongoose.models.Project || mongoose.model("Project", projectSchema);

export default Project;
