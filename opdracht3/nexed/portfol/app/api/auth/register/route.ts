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
        const { email, password, username } = body;

        // Validate that both email and password are provided
        if (!email || !password) {
            return NextResponse.json(
                { ok: false, error: "E-mailadres en wachtwoord zijn verplicht" },
                { status: 400 }
            );
        }

        // Validate username is provided
        if (!username || !username.trim()) {
            return NextResponse.json(
                { ok: false, error: "Gebruikersnaam is verplicht" },
                { status: 400 }
            );
        }

        const trimmedUsername = username.trim();

        // Validate username length
        if (trimmedUsername.length < 3) {
            return NextResponse.json(
                { ok: false, error: "Gebruikersnaam moet minimaal 3 tekens lang zijn" },
                { status: 400 }
            );
        }

        if (trimmedUsername.length > 30) {
            return NextResponse.json(
                { ok: false, error: "Gebruikersnaam mag maximaal 30 tekens lang zijn" },
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

        // Check if user already exists by email
        const existingUserByEmail = await User.findOne({ email: email.toLowerCase() });
        if (existingUserByEmail) {
            return NextResponse.json(
                { ok: false, error: "Dit e-mailadres is al geregistreerd" },
                { status: 400 }
            );
        }

        // Check if username is already taken (case-insensitive)
        const existingUserByUsername = await User.findOne({ 
            username: { $regex: new RegExp(`^${trimmedUsername}$`, "i") }
        });
        if (existingUserByUsername) {
            return NextResponse.json(
                { ok: false, error: "Deze gebruikersnaam is al in gebruik" },
                { status: 400 }
            );
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = new User({
            email: email.toLowerCase(),
            username: trimmedUsername,
            password: hashedPassword,
        });

        // Save user to database
        try {
            await user.save();
        } catch (error: any) {
            // Handle duplicate key errors (shouldn't happen due to pre-checks, but handle just in case)
            if (error.code === 11000) {
                const duplicateField = Object.keys(error.keyPattern || {})[0];
                if (duplicateField === 'username') {
                    return NextResponse.json(
                        { ok: false, error: "Deze gebruikersnaam is al in gebruik" },
                        { status: 400 }
                    );
                }
                if (duplicateField === 'email') {
                    return NextResponse.json(
                        { ok: false, error: "Dit e-mailadres is al geregistreerd" },
                        { status: 400 }
                    );
                }
            }
            throw error;
        }

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

