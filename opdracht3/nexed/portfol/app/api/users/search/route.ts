import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { ok: true, data: [] },
        { status: 200 }
      );
    }

    // Search for users by username (case-insensitive, partial match)
    // Limit to 10 results for explore page
    const users = await User.find({
      username: { $regex: new RegExp(query.trim(), "i") }
    })
      .select("username profileImage email")
      .limit(10)
      .sort({ username: 1 });

    // Format users for search results
    const formattedUsers = users.map((user) => ({
      id: user._id.toString(),
      username: user.username,
      profileImage: user.profileImage || null,
      email: user.email,
    }));

    return NextResponse.json({
      ok: true,
      data: formattedUsers,
    });
  } catch (error) {
    console.error("Error searching users:", error);
    return NextResponse.json(
      { ok: false, error: "Error searching users" },
      { status: 500 }
    );
  }
}
