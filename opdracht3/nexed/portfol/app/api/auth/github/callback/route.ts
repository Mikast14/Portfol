import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { generateToken } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const code = searchParams.get("code");
        const state = searchParams.get("state");
        const error = searchParams.get("error");

        console.log("GitHub OAuth callback received:", { code: code ? "present" : "missing", state: state ? "present" : "missing", error });

        // Check for OAuth errors
        if (error) {
            console.error("GitHub OAuth error from callback:", error);
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/login?error=${encodeURIComponent(error)}`
            );
        }

        // Validate state to prevent CSRF attacks
        let cookieStore;
        try {
            cookieStore = await cookies();
            const storedState = cookieStore.get("github_oauth_state")?.value;
            
            console.log("State validation:", { received: state ? "present" : "missing", stored: storedState ? "present" : "missing" });
            
            if (!state || state !== storedState) {
                console.error("State mismatch:", { received: state, stored: storedState });
                const errorResponse = NextResponse.redirect(
                    `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/login?error=${encodeURIComponent("Invalid state parameter")}`
                );
                // Clear the state cookie
                errorResponse.cookies.delete("github_oauth_state");
                return errorResponse;
            }
        } catch (cookieError: any) {
            console.error("Error reading cookies:", cookieError);
            // Continue without state validation if cookies fail (for development)
            if (process.env.NODE_ENV === 'production') {
                throw cookieError;
            }
        }

        if (!code) {
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/login?error=${encodeURIComponent("No authorization code received")}`
            );
        }

        const clientId = process.env.GITHUB_CLIENT_ID;
        const clientSecret = process.env.GITHUB_CLIENT_SECRET;
        const redirectUri = process.env.GITHUB_REDIRECT_URI || `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/auth/github/callback`;

        console.log("OAuth config check:", { 
            hasClientId: !!clientId, 
            hasClientSecret: !!clientSecret, 
            redirectUri 
        });

        if (!clientId || !clientSecret) {
            console.error("Missing GitHub OAuth credentials");
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/login?error=${encodeURIComponent("GitHub OAuth is not configured")}`
            );
        }

        // Exchange code for access token
        const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                client_id: clientId,
                client_secret: clientSecret,
                code: code,
                redirect_uri: redirectUri,
            }),
        });

        const tokenData = await tokenResponse.json();

        console.log("GitHub token response:", { 
            hasError: !!tokenData.error, 
            error: tokenData.error,
            hasAccessToken: !!tokenData.access_token 
        });

        if (tokenData.error) {
            console.error("GitHub token error:", tokenData);
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/login?error=${encodeURIComponent(tokenData.error_description || tokenData.error || "Failed to get access token")}`
            );
        }

        const accessToken = tokenData.access_token;

        if (!accessToken) {
            console.error("No access token received:", tokenData);
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/login?error=${encodeURIComponent("Failed to get access token from GitHub")}`
            );
        }

        // Get user info from GitHub
        const userResponse = await fetch("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: "application/vnd.github.v3+json",
            },
        });

        const githubUser = await userResponse.json();

        if (!githubUser.id || !githubUser.login) {
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/login?error=${encodeURIComponent("Failed to get user info from GitHub")}`
            );
        }

        // Get user email (may need to fetch from emails endpoint if not in user object)
        let email = githubUser.email;
        if (!email) {
            const emailsResponse = await fetch("https://api.github.com/user/emails", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    Accept: "application/vnd.github.v3+json",
                },
            });
            const emails = await emailsResponse.json();
            const primaryEmail = emails.find((e: any) => e.primary) || emails[0];
            email = primaryEmail?.email;
        }

        if (!email) {
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/login?error=${encodeURIComponent("No email found in GitHub account")}`
            );
        }

        // Connect to database
        await connectDB();

        // Find or create user
        let user = await User.findOne({ githubId: githubUser.id.toString() });

        if (!user) {
            // Check if user with this email already exists
            const existingUser = await User.findOne({ email: email.toLowerCase() });
            
            if (existingUser) {
                // Link GitHub account to existing user
                existingUser.githubId = githubUser.id.toString();
                existingUser.profileImage = githubUser.avatar_url || existingUser.profileImage;
                await existingUser.save();
                user = existingUser;
            } else {
                // Check if username is already taken
                let username = githubUser.login;
                let usernameTaken = await User.findOne({ username });
                
                // If username is taken, append a number
                if (usernameTaken) {
                    let counter = 1;
                    while (await User.findOne({ username: `${githubUser.login}${counter}` })) {
                        counter++;
                    }
                    username = `${githubUser.login}${counter}`;
                }

                // Create new user
                try {
                    user = new User({
                        email: email.toLowerCase(),
                        username: username,
                        githubId: githubUser.id.toString(),
                        profileImage: githubUser.avatar_url,
                        // OAuth users don't need a password - omit the field
                    });
                    await user.save();
                } catch (error: any) {
                    // Handle duplicate key errors
                    if (error.code === 11000) {
                        return NextResponse.redirect(
                            `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/login?error=${encodeURIComponent("Er is een fout opgetreden bij het aanmaken van het account")}`
                        );
                    }
                    throw error;
                }
            }
        } else {
            // Update profile image if it exists and is different
            if (githubUser.avatar_url && user.profileImage !== githubUser.avatar_url) {
                user.profileImage = githubUser.avatar_url;
                await user.save();
            }
        }

        // Generate JWT token
        const token = generateToken({
            userId: user._id.toString(),
            email: user.email,
            username: user.username,
        });

        // Redirect to login page with token in URL (will be handled by frontend)
        const redirectUrl = new URL(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/login`);
        redirectUrl.searchParams.set("token", token);
        redirectUrl.searchParams.set("success", "true");

        const response = NextResponse.redirect(redirectUrl.toString());
        // Clear the state cookie
        response.cookies.delete("github_oauth_state");
        return response;
    } catch (error: any) {
        console.error("Error in GitHub OAuth callback:", error);
        const errorMessage = error?.message || "Er is een fout opgetreden bij het inloggen met GitHub";
        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/login?error=${encodeURIComponent(errorMessage)}`
        );
    }
}

