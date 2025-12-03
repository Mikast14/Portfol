import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Create a compound index to ensure a user can only bookmark a project once
bookmarkSchema.index({ userId: 1, projectId: 1 }, { unique: true });

// Check if the model already exists to prevent re-compilation errors
const Bookmark =
  mongoose.models.Bookmark || mongoose.model("Bookmark", bookmarkSchema);

export default Bookmark;

