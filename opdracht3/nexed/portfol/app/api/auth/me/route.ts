import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(request: Request) {
    try {
        // Get token from Authorization header
        const authHeader = request.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                { ok: false, error: "Geen token gevonden" },
                { status: 401 }
            );
        }

        const token = authHeader.substring(7); // Remove "Bearer " prefix

        // Verify token
        const decoded = verifyToken(token);
        if (!decoded) {
            return NextResponse.json(
                { ok: false, error: "Ongeldig token" },
                { status: 401 }
            );
        }

        // Connect to database and get user
        await connectDB();
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return NextResponse.json(
                { ok: false, error: "Gebruiker niet gevonden" },
                { status: 404 }
            );
        }

        // Return user info
        return NextResponse.json({
            ok: true,
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
            },
        });
    } catch (error) {
        console.error("Error verifying token:", error);
        return NextResponse.json(
            { ok: false, error: "Er is een fout opgetreden" },
            { status: 500 }
        );
    }
}




