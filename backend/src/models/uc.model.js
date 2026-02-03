import mongoose from "mongoose";

const ucSchema = new mongoose.Schema(
  {
    ucNumber: { type: String, required: true, unique: true, trim: true },
    filename: { type: String, required: true, trim: true },
    fileUrl: { type: String, trim: true },
    project: { type: String, required: true, trim: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    period: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    remarks: { type: String, trim: true },
    status: {
      type: String,
      enum: ["Approved", "Rejected", "Pending"],
      default: "Pending",
    },
    uploadedBy: { type: String, trim: true },
    uploadedById: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    iaId: { type: String, trim: true },
    verificationResult: {
      overallStatus: { type: String },
      overallScore: { type: Number },
      reasons: [{ type: String }],
      metadata: {
        producer: { type: String },
        creator: { type: String },
        author: { type: String },
        creationDate: { type: String },
      },
    },
  },
  { timestamps: true }
);

// ucNumber already has unique: true which creates an index
ucSchema.index({ iaId: 1 });
ucSchema.index({ projectId: 1 });
ucSchema.index({ status: 1 });

const UC = mongoose.models.UC || mongoose.model("UC", ucSchema);

export default UC;
