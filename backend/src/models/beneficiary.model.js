import mongoose from "mongoose";

const { Schema, model } = mongoose;

const beneficiarySchema = new Schema(
  {
    beneficiary_id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    aadhar_no: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    district: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    no_of_grants: {
      type: Number,
      default: 0,
      min: 0,
    },
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
    // Additional beneficiary information
    date_of_birth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    occupation: {
      type: String,
      trim: true,
    },
    income_level: {
      type: String,
      enum: ["Below Poverty Line", "Above Poverty Line", "Marginalized"],
    },
    family_size: {
      type: Number,
      min: 1,
    },
    bank_account: {
      account_number: { type: String, trim: true },
      ifsc_code: { type: String, trim: true },
      bank_name: { type: String, trim: true },
      branch: { type: String, trim: true },
    },
    // Track all grants received
    grants: [
      {
        type: Schema.Types.ObjectId,
        ref: "Grant",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
beneficiarySchema.index({ state: 1, district: 1 });
beneficiarySchema.index({ verified: 1 });
beneficiarySchema.index({ on_hold: 1 });
beneficiarySchema.index({ no_of_grants: 1 });

const Beneficiary = model("Beneficiary", beneficiarySchema);

export default Beneficiary;
