import mongoose from "mongoose";

const { Schema, model } = mongoose;

const grantSchema = new Schema(
  {
    grant_id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    // Beneficiary information
    beneficiary: {
      type: Schema.Types.ObjectId,
      ref: "Beneficiary",
      required: true,
      index: true,
    },
    beneficiary_name: {
      type: String,
      trim: true,
    },
    // NGO information
    ngo: {
      type: Schema.Types.ObjectId,
      ref: "NGO",
      required: true,
      index: true,
    },
    ngo_name: {
      type: String,
      required: true,
      trim: true,
    },
    // Scheme and project details
    scheme_name: {
      type: String,
      required: true,
      trim: true,
    },
    project_title: {
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
    // Financial details
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    amount_released: {
      type: Number,
      default: 0,
      min: 0,
    },
    amount_utilized: {
      type: Number,
      default: 0,
      min: 0,
    },
    // Timeline
    date_awarded: {
      type: Date,
      required: true,
      index: true,
    },
    start_date: {
      type: Date,
    },
    expected_end_date: {
      type: Date,
    },
    actual_end_date: {
      type: Date,
    },
    duration_months: {
      type: Number,
      min: 1,
    },
    // Status tracking
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed", "On Hold", "Cancelled"],
      default: "Pending",
      index: true,
    },
    outcome_percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    // Beneficiary feedback
    beneficiary_feedback: {
      type: String,
      trim: true,
    },
    beneficiary_rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    // Impact metrics
    impact_metrics: {
      employment_generated: { type: Number, default: 0 },
      skills_acquired: [{ type: String, trim: true }],
      income_improvement: { type: Number, default: 0 },
      quality_of_life_score: { type: Number, min: 0, max: 10 },
    },
    // Documents
    documents: [
      {
        name: { type: String, required: true, trim: true },
        type: {
          type: String,
          required: true,
          enum: ["Contract", "UC", "Report", "Certificate", "Other"],
          trim: true,
        },
        url: { type: String, trim: true },
        uploaded_date: { type: Date, default: Date.now },
        uploaded_by: { type: Schema.Types.ObjectId, ref: "User" },
      },
    ],
    // Milestones
    milestones: [
      {
        title: { type: String, required: true, trim: true },
        status: {
          type: String,
          enum: ["Pending", "In Progress", "Completed", "Failed"],
          default: "Pending",
        },
        date: { type: Date },
        description: { type: String, trim: true },
        completion_percentage: { type: Number, default: 0, min: 0, max: 100 },
      },
    ],
    // Approval tracking
    approved_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    approved_at: {
      type: Date,
    },
    // Location
    implementation_location: {
      state: { type: String, trim: true },
      district: { type: String, trim: true },
      city: { type: String, trim: true },
      pincode: { type: String, trim: true },
    },
    // Additional metadata
    remarks: {
      type: String,
      trim: true,
    },
    cancellation_reason: {
      type: String,
      trim: true,
    },
    cancelled_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    cancelled_at: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
grantSchema.index({ beneficiary: 1, status: 1 });
grantSchema.index({ ngo: 1, status: 1 });
grantSchema.index({ date_awarded: -1 });
grantSchema.index({ category: 1, status: 1 });

// Virtual for utilization percentage
grantSchema.virtual("utilization_percentage").get(function () {
  if (this.amount_released > 0) {
    return (this.amount_utilized / this.amount_released) * 100;
  }
  return 0;
});

// Pre-save middleware to update beneficiary and NGO grant counts
grantSchema.post("save", async function (doc) {
  const Beneficiary = mongoose.model("Beneficiary");
  const NGO = mongoose.model("NGO");

  // Update beneficiary grant count
  const grantCount = await mongoose.model("Grant").countDocuments({
    beneficiary: doc.beneficiary,
  });
  await Beneficiary.findByIdAndUpdate(doc.beneficiary, {
    no_of_grants: grantCount,
  });

  // Check if beneficiary should be put on hold (5 or more grants)
  if (grantCount >= 5) {
    await Beneficiary.findByIdAndUpdate(doc.beneficiary, {
      on_hold: true,
      hold_start: new Date(),
      hold_reason: "Maximum grant limit reached (5 grants)",
    });
  }
});

const Grant = model("Grant", grantSchema);

export default Grant;
