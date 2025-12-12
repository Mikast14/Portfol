import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: false, // Optional if sharing a project
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: false, // Optional - for sharing projects
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Index for efficient querying of conversations
messageSchema.index({ senderId: 1, receiverId: 1, createdAt: -1 });
messageSchema.index({ receiverId: 1, senderId: 1, createdAt: -1 });

// Delete cached model in development to ensure schema changes are picked up
if (process.env.NODE_ENV === 'development' && mongoose.models.Message) {
  delete mongoose.models.Message;
}

const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);

export default Message;

