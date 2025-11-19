import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/jwt";

export async function POST(request: Request) {
    try {
        // Connect to the database
        await connectDB();

        // Get email and password from the request body
        const body = await request.json();
        const { email, password } = body;

        // Validate that both email and password are provided
        if (!email || !password) {
            return NextResponse.json(
                { ok: false, error: "E-mailadres en wachtwoord zijn verplicht" },
                { status: 400 }
            );
        }

        // Find user by email (convert to lowercase for consistency)
        const user = await User.findOne({ email: email.toLowerCase() });

        // Check if user exists
        if (!user) {
            return NextResponse.json(
                { ok: false, error: "Ongeldig e-mailadres of wachtwoord" },
                { status: 401 }
            );
        }

        // Check if user is an OAuth user (no password)
        if (!user.password) {
            return NextResponse.json(
                { ok: false, error: "Dit account gebruikt GitHub login. Log in met GitHub." },
                { status: 401 }
            );
        }

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        // Check if password is correct
        if (!isPasswordValid) {
            return NextResponse.json(
                { ok: false, error: "Ongeldig e-mailadres of wachtwoord" },
                { status: 401 }
            );
        }

        // Generate JWT token
        const token = generateToken({
            userId: user._id.toString(),
            email: user.email,
            username: user.username,
        });

        // Login successful! Return success response with token
        return NextResponse.json({
            ok: true,
            message: "Login succesvol! ✅",
            token,
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
            },
        });
    } catch (error) {
        console.error("Error during login:", error);
        return NextResponse.json(
            { ok: false, error: "Er is een fout opgetreden bij het inloggen" },
            { status: 500 }
        );
    }
}

