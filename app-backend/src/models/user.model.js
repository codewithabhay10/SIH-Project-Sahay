import mongoose from "mongoose";
const { Schema } = mongoose;

const ROLE_ENUM = ["beneficary", "enumerator"];

const userSchema = new Schema(
  {
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
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
    // Role-based relation fields. Only one is expected to be populated depending on `role`.
    beneficaryInfo: {
      type: Schema.Types.ObjectId,
      ref: "Beneficary",
    },
    enumeratorInfo: {
      type: Schema.Types.ObjectId,
      ref: "Enumerator",
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
