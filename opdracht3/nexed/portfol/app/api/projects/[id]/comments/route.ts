import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/jwt";
import Project from "@/models/Project";
import Comment from "@/models/Comment";
import User from "@/models/User";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    await connectDB();
    const resolved = params instanceof Promise ? await params : params;
    const projectId = resolved.id;

    // Ensure project exists (optional but nice)
    const project = await Project.findById(projectId).select("_id");
    if (!project) {
      return NextResponse.json({ ok: false, error: "Project not found" }, { status: 404 });
    }

    const comments = await Comment.find({ projectId })
      .populate("userId", "username profileImage")
      .sort({ createdAt: -1 })
      .lean();

    // Transform comments to include profileImage from populated userId
    // Also handle case where populate might not work with lean() by manually fetching if needed
    const transformedComments = await Promise.all(comments.map(async (comment: any) => {
      let profileImage = null;
      
      if (comment.userId) {
        // Check if userId is populated (object) or still an ObjectId string
        if (typeof comment.userId === 'object' && comment.userId !== null && !comment.userId.toString) {
          // It's populated - extract profileImage
          profileImage = comment.userId.profileImage || null;
        } else if (typeof comment.userId === 'string' || (comment.userId && comment.userId.toString)) {
          // userId is still an ObjectId string - manually fetch user
          try {
            const user = await User.findById(comment.userId).select("profileImage").lean();
            if (user) {
              profileImage = user.profileImage || null;
            }
          } catch (err) {
            // If fetch fails, profileImage stays null
            console.error("Error fetching user for comment:", err);
          }
        }
      }
      
      return {
        _id: comment._id,
        username: comment.username,
        content: comment.content,
        createdAt: comment.createdAt,
        profileImage: profileImage,
        userId: typeof comment.userId === 'object' && comment.userId !== null && comment.userId._id 
          ? comment.userId._id.toString() 
          : comment.userId?.toString() || comment.userId,
      };
    }));

    return NextResponse.json({ ok: true, data: transformedComments });
  } catch (error) {
    return NextResponse.json({ ok: false, error: "Error fetching comments" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    await connectDB();

    // Auth
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ ok: false, error: "Authentication required" }, { status: 401 });
    }
    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ ok: false, error: "Invalid token" }, { status: 401 });
    }

    const resolved = params instanceof Promise ? await params : params;
    const projectId = resolved.id;
    const { content } = await request.json();

    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json({ ok: false, error: "Content is required" }, { status: 400 });
    }

    const project = await Project.findById(projectId).select("userId");
    if (!project) {
      return NextResponse.json({ ok: false, error: "Project not found" }, { status: 404 });
    }

    // Prevent project owners from commenting on their own projects
    if (project.userId.toString() === decoded.userId) {
      return NextResponse.json({ ok: false, error: "You cannot comment on your own project" }, { status: 403 });
    }

    const doc = await Comment.create({
      projectId,
      userId: decoded.userId,
      username: decoded.username,
      content: content.trim(),
    });

    // Populate userId to get profileImage
    await doc.populate("userId", "username profileImage");

    // Transform to match frontend format
    const docObj = doc.toObject();
    let profileImage = null;
    if (docObj.userId) {
      if (typeof docObj.userId === 'object' && docObj.userId.profileImage) {
        profileImage = docObj.userId.profileImage;
      }
    }
    const transformedDoc = {
      ...docObj,
      profileImage: profileImage,
      userId: docObj.userId?._id?.toString() || docObj.userId?.toString() || decoded.userId,
    };

    return NextResponse.json({ ok: true, data: transformedDoc }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ ok: false, error: "Error posting comment" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    await connectDB();

    // Auth
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ ok: false, error: "Authentication required" }, { status: 401 });
    }
    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ ok: false, error: "Invalid token" }, { status: 401 });
    }

    const resolved = params instanceof Promise ? await params : params;
    const projectId = resolved.id;
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get("commentId");
    const deleteAll = searchParams.get("deleteAll") === "true";

    // Handle delete all comments
    if (deleteAll) {
      // Verify the user owns the project
      const project = await Project.findById(projectId).select("userId");
      if (!project) {
        return NextResponse.json({ ok: false, error: "Project not found" }, { status: 404 });
      }

      if (project.userId.toString() !== decoded.userId) {
        return NextResponse.json({ ok: false, error: "You can only delete all comments on your own projects" }, { status: 403 });
      }

      // Delete all comments for this project
      await Comment.deleteMany({ projectId });

      return NextResponse.json({ ok: true, message: "All comments deleted successfully" });
    }

    // Handle delete single comment
    if (!commentId) {
      return NextResponse.json({ ok: false, error: "Comment ID is required" }, { status: 400 });
    }

    // Find the comment
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return NextResponse.json({ ok: false, error: "Comment not found" }, { status: 404 });
    }

    // Verify the comment belongs to the project
    if (comment.projectId.toString() !== projectId) {
      return NextResponse.json({ ok: false, error: "Comment does not belong to this project" }, { status: 400 });
    }

    // Verify the user owns the comment
    if (comment.userId.toString() !== decoded.userId) {
      return NextResponse.json({ ok: false, error: "You can only delete your own comments" }, { status: 403 });
    }

    // Delete the comment
    await Comment.findByIdAndDelete(commentId);

    return NextResponse.json({ ok: true, message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json({ ok: false, error: "Error deleting comment" }, { status: 500 });
  }
}