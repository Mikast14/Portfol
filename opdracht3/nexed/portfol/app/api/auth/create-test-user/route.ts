import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    await connectDB();

    const testEmail = "test@example.com";
    const testPassword = "test123";

    // Check if user already exists
    const existingUser = await User.findOne({ email: testEmail });
    if (existingUser) {
      return NextResponse.json({
        ok: true,
        message: "Test user already exists!",
        user: {
          email: testEmail,
          password: testPassword,
        },
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(testPassword, 10);

    // Create user
    const user = new User({
      email: testEmail,
      password: hashedPassword,
    });

    await user.save();

    return NextResponse.json({
      ok: true,
      message: "Test user created successfully! ✅",
      user: {
        email: testEmail,
        password: testPassword,
      },
    });
  } catch (error) {
    console.error("Error creating test user:", error);
    return NextResponse.json(
      { ok: false, error: "Error creating test user: " + (error as Error).message },
      { status: 500 }
    );
  }
}

