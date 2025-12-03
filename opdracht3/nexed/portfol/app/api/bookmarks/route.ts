import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Bookmark from "@/models/Bookmark";
import Project from "@/models/Project";
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

// POST - Bookmark a project
export async function POST(request: Request) {
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
    const { projectId } = body;

    if (!projectId) {
      return NextResponse.json(
        { ok: false, error: "Project ID is required" },
        { status: 400 }
      );
    }

    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return NextResponse.json(
        { ok: false, error: "Project not found" },
        { status: 404 }
      );
    }

    // Check if bookmark already exists
    const existingBookmark = await Bookmark.findOne({ userId, projectId });
    if (existingBookmark) {
      return NextResponse.json(
        { ok: false, error: "Project already bookmarked" },
        { status: 400 }
      );
    }

    // Create bookmark
    const bookmark = new Bookmark({
      userId,
      projectId,
    });

    await bookmark.save();

    return NextResponse.json(
      { ok: true, message: "Project bookmarked successfully", data: bookmark },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error bookmarking project:", error);
    // Handle duplicate key error (unique constraint)
    if (error instanceof Error && error.message.includes("duplicate")) {
      return NextResponse.json(
        { ok: false, error: "Project already bookmarked" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { ok: false, error: "Error bookmarking project" },
      { status: 500 }
    );
  }
}

// DELETE - Unbookmark a project
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

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        { ok: false, error: "Project ID is required" },
        { status: 400 }
      );
    }

    const bookmark = await Bookmark.findOneAndDelete({ userId, projectId });

    if (!bookmark) {
      return NextResponse.json(
        { ok: false, error: "Bookmark not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { ok: true, message: "Project unbookmarked successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error unbookmarking project:", error);
    return NextResponse.json(
      { ok: false, error: "Error unbookmarking project" },
      { status: 500 }
    );
  }
}

// GET - Get all bookmarked projects for the current user
export async function GET(request: Request) {
  try {
    const userId = getCurrentUserId(request);
    if (!userId) {
      return NextResponse.json(
        { ok: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const checkProjectId = searchParams.get("check");

    // If check parameter is provided, check if a specific project is bookmarked
    if (checkProjectId) {
      const bookmark = await Bookmark.findOne({
        userId,
        projectId: checkProjectId,
      });
      return NextResponse.json({
        ok: true,
        data: { isBookmarked: !!bookmark },
      });
    }

    // Otherwise, get all bookmarked projects
    const bookmarks = await Bookmark.find({ userId })
      .populate({
        path: "projectId",
        populate: {
          path: "userId",
          select: "username email profileImage",
        },
      })
      .sort({ createdAt: -1 });

    // Filter out any bookmarks where the project was deleted
    const validBookmarks = bookmarks.filter(
      (bookmark) => bookmark.projectId !== null
    );

    // Extract projects from bookmarks
    const projects = validBookmarks.map((bookmark) => bookmark.projectId);

    return NextResponse.json({ ok: true, data: projects });
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return NextResponse.json(
      { ok: false, error: "Error fetching bookmarks" },
      { status: 500 }
    );
  }
}

