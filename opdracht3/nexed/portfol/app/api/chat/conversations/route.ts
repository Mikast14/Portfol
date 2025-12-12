import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Message from "@/models/Message";
import User from "@/models/User";
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

    // Get all unique conversations for this user
    // A conversation is between userId and another user
    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    })
      .populate("senderId", "username profileImage email")
      .populate("receiverId", "username profileImage email")
      .populate("projectId", "name description image")
      .sort({ createdAt: -1 });

    // Group messages by conversation partner
    const conversationsMap = new Map();

    messages.forEach((message) => {
      const partnerId =
        message.senderId._id.toString() === userId
          ? message.receiverId._id.toString()
          : message.senderId._id.toString();

      const partner =
        message.senderId._id.toString() === userId
          ? message.receiverId
          : message.senderId;

      if (!conversationsMap.has(partnerId)) {
        conversationsMap.set(partnerId, {
          userId: partnerId,
          username: partner.username,
          profileImage: partner.profileImage,
          email: partner.email,
          lastMessage: message,
          unreadCount: 0,
        });
      }

      // Update unread count if message is unread and receiver is current user
      if (
        !message.read &&
        message.receiverId._id.toString() === userId
      ) {
        const conv = conversationsMap.get(partnerId);
        conv.unreadCount += 1;
      }
    });

    // Convert map to array and sort by last message time
    const conversations = Array.from(conversationsMap.values()).sort(
      (a, b) =>
        new Date(b.lastMessage.createdAt).getTime() -
        new Date(a.lastMessage.createdAt).getTime()
    );

    return NextResponse.json({ ok: true, data: conversations });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { ok: false, error: "Error fetching conversations" },
      { status: 500 }
    );
  }
}

