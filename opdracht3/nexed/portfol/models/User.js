import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true, // Each email can only be used once
            lowercase: true, // Store emails in lowercase
        },
        username: {
            type: String,
            required: true,
            unique: true, // Each username can only be used once
        },
        password: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
    }
);

// Check if the model already exists to prevent re-compilation errors
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;

