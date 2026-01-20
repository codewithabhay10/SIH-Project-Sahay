import mongoose from "mongoose";

const ActivitySchema = new mongoose.Schema(
  {
    activity: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const PhaseSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    start_date: { type: Date },
    end_date: { type: Date },
  },
  { _id: false }
);

const BudgetItemSchema = new mongoose.Schema(
  {
    category: { type: String, trim: true },
    description: { type: String, trim: true },
    amount: { type: Number, default: 0, min: 0 },
  },
  { _id: false }
);

const DocumentSchema = new mongoose.Schema(
  {
    filename: { type: String, trim: true },
    url: { type: String, trim: true },
  },
  { _id: false }
);

const ProposalSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, trim: true },
    district: { type: String, trim: true },
    estimated_budget: { type: Number, default: 0, min: 0 },
    start_date: { type: Date },
    end_date: { type: Date },

    expected_beneficiary_count: { type: Number, default: 0, min: 0 },
    target_groups: [
      {
        type: String,
        enum: [
          "Women",
          "Youth (<35)",
          "SC/ST",
          "Minorities",
          "Disabled",
          "BPL Families",
          "Farmers",
          "Rural Poor",
        ],
      },
    ],
    eligibility_criteria: { type: String, trim: true },

    objective: { type: String, trim: true },
    activities: { type: [ActivitySchema], default: [] },
    expected_outcomes: { type: String, trim: true },

    implementation_partners: [
      {
        type: String,
        enum: [
          "State Government",
          "District Administration",
          "Educational Institutions",
          "NGOs",
          "Community Organizations",
        ],
      },
    ],
    implementation_timeline: { type: [PhaseSchema], default: [] },

    convergence_needs: [
      { type: String, enum: ["MGNREGA", "State Skill Development", "Others"] },
    ],

    budget_breakup: { type: [BudgetItemSchema], default: [] },

    supporting_documents: { type: [DocumentSchema], default: [] },
  },
  { timestamps: true }
);

ProposalSchema.index({ title: 1 });

// optional relations and workflow status
ProposalSchema.add({
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: {
    type: String,
    enum: [
      "draft",
      "submitted",
      "in_progress",
      "approved",
      "rejected",
    ],
    default: "draft",
  },
});

const Proposal =
  mongoose.models.Proposal || mongoose.model("Proposal", ProposalSchema);

export default Proposal;
