import mongoose from "mongoose";

const { Schema, model } = mongoose;

const ngoProjectSchema = new Schema(
  {
    project_id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    // NGO reference
    ngo: {
      type: Schema.Types.ObjectId,
      ref: "NGO",
      required: true,
      index: true,
    },
    ngo_name: {
      type: String,
      trim: true,
    },
    // Project details
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    // Status
    status: {
      type: String,
      enum: [
        "Draft",
        "Submitted",
        "Approved",
        "In Progress",
        "Successful",
        "Failed",
        "Cancelled",
      ],
      default: "Draft",
      required: true,
      index: true,
    },
    // Financial details
    budget: {
      type: Number,
      required: true,
      min: 0,
    },
    actual_spent: {
      type: Number,
      default: 0,
      min: 0,
    },
    funding_source: {
      type: String,
      required: true,
      trim: true,
    },
    // Timeline
    start_date: {
      type: Date,
      required: true,
      index: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
    duration_months: {
      type: Number,
      required: true,
      min: 1,
    },
    // Location
    location: {
      state: { type: String, required: true, trim: true },
      district: { type: String, required: true, trim: true },
      city: { type: String, trim: true },
      pincode: { type: String, trim: true },
    },
    // Beneficiary information
    target_beneficiaries: {
      type: Number,
      required: true,
      min: 1,
    },
    beneficiaries_count: {
      type: Number,
      default: 0,
      min: 0,
    },
    beneficiary_demographics: {
      male: { type: Number, default: 0 },
      female: { type: Number, default: 0 },
      children: { type: Number, default: 0 },
      elderly: { type: Number, default: 0 },
      differently_abled: { type: Number, default: 0 },
    },
    // Team information
    team_size: {
      type: Number,
      required: true,
      min: 1,
    },
    project_manager: {
      name: { type: String, trim: true },
      email: { type: String, trim: true },
      phone: { type: String, trim: true },
    },
    // Performance metrics
    outcome_percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    impact_score: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
    // For failed projects
    failure_reason: {
      type: String,
      trim: true,
    },
    lessons_learned: {
      type: String,
      trim: true,
    },
    // Achievements
    key_achievements: [
      {
        type: String,
        trim: true,
      },
    ],
    challenges_faced: [
      {
        type: String,
        trim: true,
      },
    ],
    // Milestones
    milestones: [
      {
        title: { type: String, required: true, trim: true },
        description: { type: String, trim: true },
        status: {
          type: String,
          enum: ["Pending", "In Progress", "Completed", "Failed"],
          default: "Pending",
        },
        date: { type: Date },
        planned_date: { type: Date },
        completion_percentage: { type: Number, default: 0, min: 0, max: 100 },
      },
    ],
    // Documents
    documents: [
      {
        name: { type: String, required: true, trim: true },
        type: {
          type: String,
          required: true,
          trim: true,
        },
        url: { type: String, trim: true },
        date: { type: Date, default: Date.now },
        uploaded_by: { type: Schema.Types.ObjectId, ref: "User" },
      },
    ],
    // Approval workflow
    submitted_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    submitted_at: {
      type: Date,
    },
    approved_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    approved_at: {
      type: Date,
    },
    rejection_reason: {
      type: String,
      trim: true,
    },
    rejected_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    rejected_at: {
      type: Date,
    },
    // Monitoring and evaluation
    monitoring_reports: [
      {
        report_date: { type: Date, required: true },
        findings: { type: String, trim: true },
        recommendations: { type: String, trim: true },
        uploaded_by: { type: Schema.Types.ObjectId, ref: "User" },
        document_url: { type: String, trim: true },
      },
    ],
    // Sustainability plan
    sustainability_plan: {
      type: String,
      trim: true,
    },
    post_project_impact: {
      type: String,
      trim: true,
    },
    // Collaboration
    partner_organizations: [
      {
        name: { type: String, trim: true },
        type: { type: String, trim: true },
        contribution: { type: String, trim: true },
      },
    ],
    // Additional metadata
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    remarks: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
ngoProjectSchema.index({ ngo: 1, status: 1 });
ngoProjectSchema.index({ category: 1, status: 1 });
ngoProjectSchema.index({ start_date: -1 });
ngoProjectSchema.index({ "location.state": 1, "location.district": 1 });

// Virtual for budget utilization percentage
ngoProjectSchema.virtual("budget_utilization_percentage").get(function () {
  if (this.budget > 0) {
    return (this.actual_spent / this.budget) * 100;
  }
  return 0;
});

// Virtual for beneficiary reach percentage
ngoProjectSchema.virtual("beneficiary_reach_percentage").get(function () {
  if (this.target_beneficiaries > 0) {
    return (this.beneficiaries_count / this.target_beneficiaries) * 100;
  }
  return 0;
});

// Pre-save middleware to update NGO project counts
ngoProjectSchema.post("save", async function (doc) {
  if (doc.status === "Successful" || doc.status === "Failed") {
    const NGO = mongoose.model("NGO");
    const successfulCount = await mongoose.model("NGOProject").countDocuments({
      ngo: doc.ngo,
      status: "Successful",
    });
    const failedCount = await mongoose.model("NGOProject").countDocuments({
      ngo: doc.ngo,
      status: "Failed",
    });

    await NGO.findByIdAndUpdate(doc.ngo, {
      no_of_successful_projects: successfulCount,
      no_of_failed_projects: failedCount,
    });

    // Check if NGO should be blocked (failure rate >= 20%)
    const totalProjects = successfulCount + failedCount;
    if (totalProjects > 0) {
      const failureRate = failedCount / totalProjects;
      if (failureRate >= 0.2) {
        await NGO.findByIdAndUpdate(doc.ngo, {
          blocked: true,
          blocked_at: new Date(),
          blocked_reason: "High failure rate (≥20%)",
        });
      }
    }

    // Check if NGO should be put on hold (20+ projects)
    if (totalProjects >= 20 && failedCount / totalProjects < 0.2) {
      await NGO.findByIdAndUpdate(doc.ngo, {
        on_hold: true,
        hold_start: new Date(),
        hold_reason: "Maximum project limit reached (20 projects)",
      });
    }
  }
});

const NGOProject = model("NGOProject", ngoProjectSchema);

export default NGOProject;
