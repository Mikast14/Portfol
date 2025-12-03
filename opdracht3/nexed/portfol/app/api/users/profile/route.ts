import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Project from "@/models/Project";
import Comment from "@/models/Comment";
import Bookmark from "@/models/Bookmark";
import { verifyToken } from "@/lib/jwt";

export const runtime = "nodejs";
export const maxDuration = 30;

// Helper function to get current user ID from request headers
function getCurrentUserId(request: Request): string | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.substring(7); // Remove "Bearer " prefix
  const decoded = verifyToken(token);
  return decoded ? decoded.userId : null;
}

// Update profile image or username
export async function PUT(request: Request) {
  try {
    const userId = getCurrentUserId(request);
    if (!userId) {
      return NextResponse.json(
        { ok: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    await connectDB();
    const body = await request.json();
    const { profileImage, username } = body;

    // At least one field must be provided
    if (!profileImage && !username) {
      return NextResponse.json(
        { ok: false, error: "Either profileImage or username must be provided" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { ok: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Update profile image if provided
    if (profileImage !== undefined) {
      // Validate URL format if it's not empty
      if (profileImage && profileImage.trim() !== "") {
        try {
          new URL(profileImage);
        } catch {
          return NextResponse.json(
            { ok: false, error: "Profile image must be a valid URL" },
            { status: 400 }
          );
        }
      }
      user.profileImage = profileImage?.trim() || null;
    }

    // Update username if provided
    if (username !== undefined) {
      const trimmedUsername = username.trim();
      
      // Validate username
      if (!trimmedUsername || trimmedUsername.length < 3) {
        return NextResponse.json(
          { ok: false, error: "Username must be at least 3 characters long" },
          { status: 400 }
        );
      }

      if (trimmedUsername.length > 30) {
        return NextResponse.json(
          { ok: false, error: "Username must be less than 30 characters" },
          { status: 400 }
        );
      }

      // Check if username is already taken by another user
      const existingUser = await User.findOne({ 
        username: { $regex: new RegExp(`^${trimmedUsername}$`, "i") },
        _id: { $ne: userId }
      });

      if (existingUser) {
        return NextResponse.json(
          { ok: false, error: "Username is already taken" },
          { status: 400 }
        );
      }

      user.username = trimmedUsername;
    }

    await user.save();

    return NextResponse.json({
      ok: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        profileImage: user.profileImage || null,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { ok: false, error: "Error updating profile", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// Delete account
export async function DELETE(request: Request) {
  try {
    const userId = getCurrentUserId(request);
    if (!userId) {
      return NextResponse.json(
        { ok: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    await connectDB();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { ok: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Delete all user's projects
    await Project.deleteMany({ userId: userId });

    // Delete all comments by the user
    await Comment.deleteMany({ userId: userId });

    // Delete all bookmarks by the user
    await Bookmark.deleteMany({ userId: userId });

    // Delete the user account
    await User.findByIdAndDelete(userId);

    return NextResponse.json({
      ok: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json(
      { ok: false, error: "Error deleting account", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

