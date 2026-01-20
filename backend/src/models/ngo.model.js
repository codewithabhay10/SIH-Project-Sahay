import mongoose from "mongoose";

const { Schema, model } = mongoose;

const ngoSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    certificate_no: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    district: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    establishment_year: {
      type: Number,
      required: true,
    },
    contact_person: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    // Registration details
    registration_number: {
      type: String,
      trim: true,
    },
    pan_number: {
      type: String,
      trim: true,
    },
    fcra_registration: {
      type: Boolean,
      default: false,
    },
    fcra_number: {
      type: String,
      trim: true,
    },
    // Project statistics
    no_of_successful_projects: {
      type: Number,
      default: 0,
      min: 0,
    },
    no_of_failed_projects: {
      type: Number,
      default: 0,
      min: 0,
    },
    total_projects: {
      type: Number,
      default: 0,
      min: 0,
    },
    success_rate: {
      type: Number,
      default: 0,
      min: 0,
      max: 1,
    },
    failure_rate: {
      type: Number,
      default: 0,
      min: 0,
      max: 1,
    },
    // Status tracking
    on_hold: {
      type: Boolean,
      default: false,
    },
    hold_start: {
      type: Date,
    },
    hold_reason: {
      type: String,
      trim: true,
    },
    blocked: {
      type: Boolean,
      default: false,
    },
    blocked_at: {
      type: Date,
    },
    blocked_reason: {
      type: String,
      trim: true,
    },
    blocked_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    // Verification status
    verified: {
      type: Boolean,
      default: false,
    },
    verified_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    verified_at: {
      type: Date,
    },
    // Financial information
    bank_details: {
      account_number: { type: String, trim: true },
      ifsc_code: { type: String, trim: true },
      bank_name: { type: String, trim: true },
      branch: { type: String, trim: true },
    },
    total_funds_received: {
      type: Number,
      default: 0,
      min: 0,
    },
    total_funds_utilized: {
      type: Number,
      default: 0,
      min: 0,
    },
    // Additional details
    areas_of_operation: [
      {
        type: String,
        trim: true,
      },
    ],
    target_beneficiaries: [
      {
        type: String,
        trim: true,
      },
    ],
    board_members: [
      {
        name: { type: String, trim: true },
        designation: { type: String, trim: true },
        email: { type: String, trim: true },
        phone: { type: String, trim: true },
      },
    ],
    // Documents
    documents: [
      {
        name: { type: String, trim: true },
        type: { type: String, trim: true },
        url: { type: String, trim: true },
        uploaded_at: { type: Date, default: Date.now },
      },
    ],
    // Reference to all projects
    projects: [
      {
        type: Schema.Types.ObjectId,
        ref: "NGOProject",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
ngoSchema.index({ state: 1, district: 1 });
ngoSchema.index({ category: 1 });
ngoSchema.index({ verified: 1 });
ngoSchema.index({ blocked: 1 });
ngoSchema.index({ on_hold: 1 });

// Pre-save middleware to calculate rates
ngoSchema.pre("save", function (next) {
  if (
    this.isModified("no_of_successful_projects") ||
    this.isModified("no_of_failed_projects")
  ) {
    this.total_projects =
      this.no_of_successful_projects + this.no_of_failed_projects;
    if (this.total_projects > 0) {
      this.success_rate = this.no_of_successful_projects / this.total_projects;
      this.failure_rate = this.no_of_failed_projects / this.total_projects;
    } else {
      this.success_rate = 0;
      this.failure_rate = 0;
    }
  }
  next();
});

const NGO = model("NGO", ngoSchema);

export default NGO;
