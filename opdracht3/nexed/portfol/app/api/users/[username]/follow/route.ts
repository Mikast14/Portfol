import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
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

async function resolveUsername(params: Promise<{ username: string }> | { username: string }) {
  const resolved = params instanceof Promise ? await params : params;
  let { username } = resolved || { username: "" };

  if (!username) {
    return null;
  }

  try {
    if (username.includes("%")) {
      username = decodeURIComponent(username);
    }
  } catch {
    // ignore decode errors and use raw username
  }

  return username.trim();
}

async function findUserByUsername(username: string) {
  const escapedUsername = username.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return User.findOne({
    username: { $regex: new RegExp(`^${escapedUsername}$`, "i") },
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ username: string }> | { username: string } }
) {
  try {
    const userId = getCurrentUserId(request);
    if (!userId) {
      return NextResponse.json({ ok: false, error: "Authentication required" }, { status: 401 });
    }

    const username = await resolveUsername(params);
    if (!username) {
      return NextResponse.json({ ok: false, error: "Username is required" }, { status: 400 });
    }

    await connectDB();

    const [currentUser, targetUser] = await Promise.all([
      User.findById(userId),
      findUserByUsername(username),
    ]);

    if (!currentUser) {
      return NextResponse.json({ ok: false, error: "Current user not found" }, { status: 404 });
    }

    if (!targetUser) {
      return NextResponse.json({ ok: false, error: "User not found" }, { status: 404 });
    }

    if (targetUser._id.toString() === userId) {
      return NextResponse.json({ ok: false, error: "You cannot follow yourself" }, { status: 400 });
    }

    currentUser.following = currentUser.following || [];
    targetUser.followers = targetUser.followers || [];

    const alreadyFollowing = currentUser.following.some((followerId) =>
      followerId.toString() === targetUser._id.toString()
    );

    if (alreadyFollowing) {
      return NextResponse.json({
        ok: true,
        message: "Already following user",
        followerCount: targetUser.followers.length,
        isFollowing: true,
      });
    }

    currentUser.following.push(targetUser._id);
    targetUser.followers.push(currentUser._id);

    await Promise.all([currentUser.save(), targetUser.save()]);

    return NextResponse.json({
      ok: true,
      message: "Follow request sent",
      followerCount: targetUser.followers.length,
      isFollowing: true,
    });
  } catch (error) {
    console.error("Error following user:", error);
    return NextResponse.json({ ok: false, error: "Failed to follow user" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ username: string }> | { username: string } }
) {
  try {
    const userId = getCurrentUserId(request);
    if (!userId) {
      return NextResponse.json({ ok: false, error: "Authentication required" }, { status: 401 });
    }

    const username = await resolveUsername(params);
    if (!username) {
      return NextResponse.json({ ok: false, error: "Username is required" }, { status: 400 });
    }

    await connectDB();

    const [currentUser, targetUser] = await Promise.all([
      User.findById(userId),
      findUserByUsername(username),
    ]);

    if (!currentUser) {
      return NextResponse.json({ ok: false, error: "Current user not found" }, { status: 404 });
    }

    if (!targetUser) {
      return NextResponse.json({ ok: false, error: "User not found" }, { status: 404 });
    }

    currentUser.following = currentUser.following || [];
    targetUser.followers = targetUser.followers || [];

    const wasFollowing = currentUser.following.some((followerId) =>
      followerId.toString() === targetUser._id.toString()
    );

    if (!wasFollowing) {
      return NextResponse.json({
        ok: true,
        message: "You are not following this user",
        followerCount: targetUser.followers.length,
        isFollowing: false,
      });
    }

    currentUser.following = currentUser.following.filter(
      (followerId) => followerId.toString() !== targetUser._id.toString()
    );
    targetUser.followers = targetUser.followers.filter(
      (followerId) => followerId.toString() !== currentUser._id.toString()
    );

    await Promise.all([currentUser.save(), targetUser.save()]);

    return NextResponse.json({
      ok: true,
      message: "Unfollowed user",
      followerCount: targetUser.followers.length,
      isFollowing: false,
    });
  } catch (error) {
    console.error("Error unfollowing user:", error);
    return NextResponse.json({ ok: false, error: "Failed to unfollow user" }, { status: 500 });
  }
}
