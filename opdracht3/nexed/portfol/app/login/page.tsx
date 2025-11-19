"use client";

import { useState } from "react";
import Navbar from "../Navbar";
import { useRouter } from "next/navigation";

export default function Login() {
  // State variables to store form data and UI state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Shows loading spinner
  const [message, setMessage] = useState(""); // Shows success/error messages
  const router = useRouter(); // Used to navigate to other pages

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
                  disabled={loading}
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
                  disabled={loading}
                  required
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
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