"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useRouter, useSearchParams } from "next/navigation";

export default function Login() {
  // State variables to store form data and UI state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Shows loading spinner
  const [message, setMessage] = useState(""); // Shows success/error messages
  const [githubLoading, setGithubLoading] = useState(false);
  const router = useRouter(); // Used to navigate to other pages
  const searchParams = useSearchParams();

  // Handle OAuth callback
  useEffect(() => {
    const token = searchParams.get("token");
    const success = searchParams.get("success");
    const error = searchParams.get("error");

    if (token && success === "true") {
      // OAuth login successful
      localStorage.setItem("token", token);
      setMessage("Login met GitHub succesvol! ✅");
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 1500);
    } else if (error) {
      // OAuth error
      setMessage(`Fout: ${decodeURIComponent(error)}`);
    }
  }, [searchParams, router]);

  // Handle GitHub OAuth login
  const handleGitHubLogin = () => {
    setGithubLoading(true);
    window.location.href = "/api/auth/github";
  };

  // This function runs when the form is submitted
  const handleSubmit = async (e: React.FormEvent) => {
    // Prevent the page from refreshing (default form behavior)
    e.preventDefault();

    // Show loading state and clear any previous messages
    setLoading(true);
    setMessage("");

    try {
      // Send login request to the API
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      // Parse the response from the server
      const data = await response.json();

      if (data.ok) {
        // Login successful! Store token in localStorage
        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        setMessage(data.message || "Login succesvol! ✅");

        // Redirect to home page after 1.5 seconds
        setTimeout(() => {
          router.push("/");
          router.refresh(); // Refresh to update auth state
        }, 1500);
      } else {
        // Login failed - show error message
        setMessage(data.error || "Er is een fout opgetreden");
        setLoading(false);
      }
    } catch (error) {
      // Handle network errors or other issues
      console.error("Login error:", error);
      setMessage("Er is een fout opgetreden bij het inloggen");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-sans bg-background">
      <Navbar />

      <main className="pt-24 pb-16 px-6 flex items-center justify-center min-h-[calc(100vh-96px)]">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-large p-8 shadow-elevated">
            <h1 className="text-3xl font-bold mb-2 text-foreground text-center">
              Inloggen
            </h1>
            <p className="text-gray-600 text-center mb-8">
              Welkom terug! Log in op je account.
            </p>

            {/* GitHub OAuth Button */}
            <button
              type="button"
              onClick={handleGitHubLogin}
              disabled={loading || githubLoading}
              className="w-full bg-gray-900 text-white rounded-full px-6 py-3 hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium mb-6 flex items-center justify-center gap-2"
            >
              {githubLoading ? (
                "Bezig..."
              ) : (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                  </svg>
                  Inloggen met GitHub
                </>
              )}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">of</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email input field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
                  E-mailadres
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jouw@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-base text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  disabled={loading || githubLoading}
                  required
                />
              </div>

              {/* Password input field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-black mb-2">
                  Wachtwoord
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-300 rounded-base text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  disabled={loading || githubLoading}
                  required
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading || githubLoading}
                className="w-full bg-accent text-white rounded-full px-6 py-3 hover:bg-primary-hover transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? "Bezig..." : "Inloggen"}
              </button>

              {/* Show message if there is one */}
              {message && (
                <div
                  className={`p-4 rounded-base text-center ${message.includes("✅") ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
                    }`}
                >
                  {message}
                </div>
              )}
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Nog geen account?{" "}
              <a href="/login/registration" className="text-accent hover:text-primary-hover font-medium transition">
                Registreer je hier
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}