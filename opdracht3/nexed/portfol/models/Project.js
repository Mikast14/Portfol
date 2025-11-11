import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    githubRepo: {
      type: String,
      required: true,
    },
    platforms: {
      type: [String],
      required: true,
      enum: ["windows", "macos", "web", "linux"],
    },
    image: {
      type: String, // Path to the image file
      required: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Optional for now until auth is fully implemented
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Check if the model already exists to prevent re-compilation errors
const Project =
  mongoose.models.Project || mongoose.model("Project", projectSchema);

export default Project;

