import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/jwt";
import Project from "@/models/Project";
import Comment from "@/models/Comment";

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
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ ok: true, data: comments });
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

    const project = await Project.findById(projectId).select("_id");
    if (!project) {
      return NextResponse.json({ ok: false, error: "Project not found" }, { status: 404 });
    }

    const doc = await Comment.create({
      projectId,
      userId: decoded.userId,
      username: decoded.username,
      content: content.trim(),
    });

    return NextResponse.json({ ok: true, data: doc }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ ok: false, error: "Error posting comment" }, { status: 500 });
  }
}