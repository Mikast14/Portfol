import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import { verifyToken } from "@/lib/jwt";
import mongoose from "mongoose";

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

// POST - Like a project
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const userId = getCurrentUserId(request);
    if (!userId) {
      return NextResponse.json(
        { ok: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    await connectDB();

    // Handle both Promise and direct params (for Next.js 13.4+ compatibility)
    const resolvedParams = params instanceof Promise ? await params : params;
    const projectId = resolvedParams.id;
    const project = await Project.findById(projectId);

    if (!project) {
      return NextResponse.json(
        { ok: false, error: "Project not found" },
        { status: 404 }
      );
    }

    // Initialize likes array if it doesn't exist (for older projects)
    if (!project.likes) {
      project.likes = [];
    }

    // Convert userId string to ObjectId for comparison and storage
    const userIdObjectId = new mongoose.Types.ObjectId(userId);

    // Check if user already liked the project
    const alreadyLiked = project.likes.some(
      (likeId: any) => likeId.toString() === userIdObjectId.toString()
    );

    if (alreadyLiked) {
      return NextResponse.json(
        { ok: false, error: "Project already liked" },
        { status: 400 }
      );
    }

    // Check if user is trying to like their own project
    if (project.userId?.toString() === userId) {
      return NextResponse.json(
        { ok: false, error: "You cannot like your own project" },
        { status: 400 }
      );
    }

    // Add like
    project.likes.push(userIdObjectId);
    await project.save();

    return NextResponse.json({
      ok: true,
      message: "Project liked successfully",
      data: { likesCount: project.likes.length },
    });
  } catch (error) {
    console.error("Error liking project:", error);
    return NextResponse.json(
      {
        ok: false,
        error: "Error liking project",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// DELETE - Unlike a project
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const userId = getCurrentUserId(request);
    if (!userId) {
      return NextResponse.json(
        { ok: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    await connectDB();

    // Handle both Promise and direct params (for Next.js 13.4+ compatibility)
    const resolvedParams = params instanceof Promise ? await params : params;
    const projectId = resolvedParams.id;
    const project = await Project.findById(projectId);

    if (!project) {
      return NextResponse.json(
        { ok: false, error: "Project not found" },
        { status: 404 }
      );
    }

    // Initialize likes array if it doesn't exist (for older projects)
    if (!project.likes) {
      project.likes = [];
    }

    // Check if user has liked the project
    const userIdObjectId = new mongoose.Types.ObjectId(userId);
    const likedIndex = project.likes.findIndex(
      (likeId: any) => likeId.toString() === userIdObjectId.toString()
    );

    if (likedIndex === -1) {
      return NextResponse.json(
        { ok: false, error: "Project not liked" },
        { status: 400 }
      );
    }

    // Remove like
    project.likes.splice(likedIndex, 1);
    await project.save();

    return NextResponse.json({
      ok: true,
      message: "Project unliked successfully",
      data: { likesCount: project.likes.length },
    });
  } catch (error) {
    console.error("Error unliking project:", error);
    return NextResponse.json(
      {
        ok: false,
        error: "Error unliking project",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// GET - Check if project is liked by current user
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const userId = getCurrentUserId(request);
    if (!userId) {
      return NextResponse.json({
        ok: true,
        data: { isLiked: false, likesCount: 0 },
      });
    }

    await connectDB();

    // Handle both Promise and direct params (for Next.js 13.4+ compatibility)
    const resolvedParams = params instanceof Promise ? await params : params;
    const projectId = resolvedParams.id;
    const project = await Project.findById(projectId);

    if (!project) {
      return NextResponse.json(
        { ok: false, error: "Project not found" },
        { status: 404 }
      );
    }

    // Initialize likes array if it doesn't exist (for older projects)
    if (!project.likes) {
      project.likes = [];
    }

    const userIdObjectId = new mongoose.Types.ObjectId(userId);
    const isLiked = project.likes.some(
      (likeId: any) => likeId.toString() === userIdObjectId.toString()
    );

    return NextResponse.json({
      ok: true,
      data: {
        isLiked,
        likesCount: project.likes.length,
      },
    });
  } catch (error) {
    console.error("Error checking like status:", error);
    return NextResponse.json(
      {
        ok: false,
        error: "Error checking like status",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

