import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Message from "@/models/Message";
import { verifyToken } from "@/lib/jwt";

export const runtime = "nodejs";
export const maxDuration = 30;

function getCurrentUserId(request: Request): string | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.substring(7);
  const decoded = verifyToken(token);
  return decoded ? decoded.userId : null;
}

// GET messages with a specific user
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
    const otherUserId = searchParams.get("userId");
    const since = searchParams.get("since"); // Optional timestamp to fetch only new messages

    if (!otherUserId) {
      return NextResponse.json(
        { ok: false, error: "userId parameter is required" },
        { status: 400 }
      );
    }

    // Build query - if 'since' is provided, only get messages after that timestamp
    const query: any = {
      $or: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId },
      ],
    };

    if (since) {
      try {
        const sinceDate = new Date(since);
        query.createdAt = { $gt: sinceDate };
      } catch (e) {
        // Invalid date, ignore the since parameter
      }
    }

    // Get messages between current user and the other user
    const messages = await Message.find(query)
      .populate("senderId", "username profileImage email")
      .populate("receiverId", "username profileImage email")
      .populate("projectId", "name description image githubRepo platforms")
      .sort({ createdAt: 1 }); // Oldest first

    // Mark messages as read where current user is the receiver (only for new messages)
    if (messages.length > 0) {
      await Message.updateMany(
        {
          senderId: otherUserId,
          receiverId: userId,
          read: false,
          _id: { $in: messages.map((m) => m._id) },
        },
        { read: true }
      );
    }

    return NextResponse.json({ ok: true, data: messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { ok: false, error: "Error fetching messages" },
      { status: 500 }
    );
  }
}

// POST a new message
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
    const { receiverId, content, projectId } = body;

    if (!receiverId) {
      return NextResponse.json(
        { ok: false, error: "receiverId is required" },
        { status: 400 }
      );
    }

    // At least content or projectId must be provided
    if (!content && !projectId) {
      return NextResponse.json(
        { ok: false, error: "Either content or projectId is required" },
        { status: 400 }
      );
    }

    // Create the message
    const message = new Message({
      senderId: userId,
      receiverId,
      content: content || undefined,
      projectId: projectId || undefined,
      read: false,
    });

    await message.save();

    // Populate the message before returning
    await message.populate("senderId", "username profileImage email");
    await message.populate("receiverId", "username profileImage email");
    if (projectId) {
      await message.populate("projectId", "name description image githubRepo platforms");
    }

    return NextResponse.json(
      { ok: true, data: message },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { ok: false, error: "Error sending message" },
      { status: 500 }
    );
  }
}

