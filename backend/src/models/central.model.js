import mongoose from "mongoose";

const centralSchema = new mongoose.Schema(
  {
    // optional descriptive information about this central record
    info: { type: String, trim: true },

    // total available balance held centrally
    total_balance: { type: Number, default: 10000000, min: 0 },

    // total funds released from the central pool
    total_released: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

// There should typically be a single Central document. Provide a simple
// index to make lookups efficient if more than one exists accidentally.
centralSchema.index({ createdAt: 1 });

const Central =
  mongoose.models.Central || mongoose.model("Central", centralSchema);

export default Central;
