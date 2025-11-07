import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ ok: true, status: "connected" });
  } catch (error) {
    return NextResponse.json(
      { ok: false, status: "disconnected", error: (error as Error).message },
      { status: 500 }
    );
  }
}


