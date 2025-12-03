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
    const { username } = resolvedParams;

    if (!username) {
      return NextResponse.json(
        { ok: false, error: "Username is required" },
        { status: 400 }
      );
    }

    // Find user by username (case-insensitive)
    const user = await User.findOne({ 
      username: { $regex: new RegExp(`^${username}$`, "i") } 
    }).select("-password");

    if (!user) {
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

