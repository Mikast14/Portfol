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
      validate: {
        validator: function(platforms) {
          const validPlatforms = ["windows", "macos", "web", "linux", "game", "app", "website", "ios", "android", "playstation", "xbox", "nintendo"];
          if (!Array.isArray(platforms) || platforms.length === 0) {
            return false;
          }
          // Validate each platform (handle both string and already lowercased values)
          return platforms.every(platform => {
            if (typeof platform !== 'string') return false;
            const normalized = platform.trim().toLowerCase();
            return validPlatforms.includes(normalized);
          });
        },
        message: "Each platform must be one of: windows, macos, web, linux, game, app, website, ios, android, playstation, xbox, nintendo"
      }
    },
    image: {
      type: String, // Path to the primary image file (for backward compatibility)
      required: false,
    },
    images: {
      type: [String], // Array of paths to image files
      required: false,
    },
    video: {
      type: String, // Primary video URL (optional)
      required: false,
    },
    videos: {
      type: [String], // Additional video URLs
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
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Delete cached model in development to ensure schema changes are picked up
if (process.env.NODE_ENV === 'development' && mongoose.models.Project) {
  delete mongoose.models.Project;
}

// Check if the model already exists to prevent re-compilation errors
const Project =
  mongoose.models.Project || mongoose.model("Project", projectSchema);

export default Project;

