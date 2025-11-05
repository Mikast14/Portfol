import mongoose from "mongoose";

const textEntrySchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Check if the model already exists to prevent re-compilation errors
const TextEntry =
  mongoose.models.TextEntry || mongoose.model("TextEntry", textEntrySchema);

export default TextEntry;
