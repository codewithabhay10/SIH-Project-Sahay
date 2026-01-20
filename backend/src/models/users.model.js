import mongoose from "mongoose";

const { Schema, model } = mongoose;

const ROLE_ENUM = ["mosje", "state", "pacc", "sna", "ia", "beneficary"];

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ROLE_ENUM,
      required: true,
      default: "beneficary",
    },
  },
  {
    timestamps: true,
  }
);

// add an index to ensure unique email and phone at DB level
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ phone: 1 }, { unique: true });

const User = model("User", userSchema);

export default User;
