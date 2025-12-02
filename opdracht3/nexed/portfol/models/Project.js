import mongoose from "mongoose";

const githubDisplaySettingsSchema = new mongoose.Schema(
  {
    activeStatus: {
      type: String,
      enum: ["auto", "active", "inactive", "hide"],
      default: "auto",
    },
    contributors: {
      type: String,
      enum: ["auto", "hide"],
      default: "auto",
    },
    stars: {
      type: String,
      enum: ["auto", "hide"],
      default: "auto",
    },
    forks: {
      type: String,
      enum: ["auto", "hide"],
      default: "auto",
    },
    language: {
      type: String,
      enum: ["auto", "hide"],
      default: "auto",
    },
  },
  { _id: false }
);

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
      enum: ["windows", "macos", "web", "linux", "game", "app"],
    },
    image: {
      type: String, // Path to the primary image file (for backward compatibility)
      required: false,
    },
    images: {
      type: [String], // Array of paths to image files
      required: false,
    },
    githubDisplaySettings: {
      type: githubDisplaySettingsSchema,
      required: false,
      default: undefined,
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

