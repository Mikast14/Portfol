import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Project from "@/models/Project";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> | { username: string } }
) {
  try {
    await connectDB();

    // Handle both Promise and direct params (for Next.js 13.4+ compatibility)
    const resolvedParams = params instanceof Promise ? await params : params;
    let { username } = resolvedParams;

    if (!username) {
      return NextResponse.json(
        { ok: false, error: "Username is required" },
        { status: 400 }
      );
    }

    // Decode the username in case it's URL encoded (Next.js may or may not decode it)
    try {
      // Only decode if it contains encoded characters
      if (username.includes('%')) {
        username = decodeURIComponent(username);
      }
    } catch (e) {
      // If decoding fails, use the original username
      console.warn("Failed to decode username, using as-is:", username);
    }
    username = username.trim();

    console.log("Looking for user with username:", username);

    // Escape special regex characters in username for safe regex matching
    const escapedUsername = username.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Find user by username (case-insensitive)
    // Use regex for case-insensitive matching
    const user = await User.findOne({ 
      username: { $regex: new RegExp(`^${escapedUsername}$`, "i") } 
    }).select("-password");

    if (!user) {
      // Log for debugging - check if any users exist with similar usernames
      // Escape special regex characters for safe partial matching
      const escapedForPartial = username.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const similarUsers = await User.find({
        username: { $regex: new RegExp(escapedForPartial, "i") }
      }).select("username").limit(5);
      
      console.log("User not found. Searched for:", username);
      console.log("Similar usernames found:", similarUsers.map(u => u.username));
      
      return NextResponse.json(
        { ok: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Fetch all projects for this user
    const projects = await Project.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .select("-githubDisplaySettings");

    // Return user info and projects
    return NextResponse.json({
      ok: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email, // Include email for now, can be made optional later
          profileImage: user.profileImage || null,
          createdAt: user.createdAt,
        },
        projects: projects,
      },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { ok: false, error: "Error fetching user profile" },
      { status: 500 }
    );
  }
}

