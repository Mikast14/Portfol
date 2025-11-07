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

        // Validate password length (minimum 6 characters)
        if (password.length < 6) {
            return NextResponse.json(
                { ok: false, error: "Wachtwoord moet minimaal 6 tekens lang zijn" },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return NextResponse.json(
                { ok: false, error: "Dit e-mailadres is al geregistreerd" },
                { status: 400 }
            );
        }

        // Hash the password before saving (for security)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = new User({
            email: email.toLowerCase(),
            password: hashedPassword,
        });

        // Save user to database
        await user.save();

        // Registration successful!
        return NextResponse.json(
            {
                ok: true,
                message: "Account succesvol aangemaakt! ✅",
                user: {
                    id: user._id,
                    email: user.email,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error during registration:", error);
        return NextResponse.json(
            { ok: false, error: "Er is een fout opgetreden bij het aanmaken van het account" },
            { status: 500 }
        );
    }
}

