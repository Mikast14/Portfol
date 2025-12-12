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
            required: false, // Make it optional - validation handled in pre-save hook
        },
        githubId: {
            type: String,
            unique: true,
            sparse: true, // Allows multiple null values
        },
        profileImage: {
            type: String,
            required: false,
        },
        followers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        following: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
    }
);

// Pre-save hook to validate password requirement
userSchema.pre('save', function(next) {
    // For OAuth users (with githubId), password is completely optional
    if (this.githubId) {
        // Remove password field if it's empty for OAuth users
        if (!this.password || this.password === '') {
            this.password = undefined;
        }
        return next();
    }
    
    // For non-OAuth users, password is required only on new documents
    if (this.isNew && (!this.password || this.password === '')) {
        return next(new Error('Password is required for non-OAuth users'));
    }
    
    next();
});

// Delete existing model to force recompilation with new schema
if (mongoose.models.User) {
    delete mongoose.models.User;
}

// Check if the model already exists to prevent re-compilation errors
const User = mongoose.model("User", userSchema);

export default User;

