import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

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

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        // Check if password is correct
        if (!isPasswordValid) {
            return NextResponse.json(
                { ok: false, error: "Ongeldig e-mailadres of wachtwoord" },
                { status: 401 }
            );
        }

        // Login successful! Return success response
        return NextResponse.json({
            ok: true,
            message: "Login succesvol! ✅",
            user: {
                id: user._id,
                email: user.email,
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

