"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";

export default function RegistrationPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        if (!acceptedTerms) {
            setError("Je moet akkoord gaan met de voorwaarden");
            return;
        }
        if (password !== confirmPassword) {
            setError("Wachtwoorden komen niet overeen");
            return;
        }
        if (password.length < 8) {
            setError("Wachtwoord moet minimaal 8 tekens lang zijn");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, username }),
            });
            const data = await res.json();
            if (!res.ok || !data.ok) {
                throw new Error(data?.error || "Registratie mislukt");
            }
            setSuccess("Account is aangemaakt. Je wordt doorgestuurd naar inloggen...");
            setTimeout(() => router.push("/login"), 1000);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Er ging iets mis";
            setError(message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen font-sans bg-background">
            <Navbar />

            <main className="pt-24 pb-16 px-6 flex items-center justify-center min-h-[calc(100vh-96px)]">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-large p-8 shadow-elevated">
                        <h1 className="text-3xl font-bold mb-2 text-foreground text-center">Registreren</h1>
                        <p className="text-gray-600 text-center mb-8">Maak een nieuw account aan om verder te gaan.</p>

                        <form noValidate className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-black mb-2">Volledige naam</label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    autoComplete="name"
                                    placeholder="Username"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-base text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-black mb-2">E-mailadres</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="jouw@email.com"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-base text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-black mb-2">Wachtwoord</label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-base text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                    minLength={8}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-black mb-2">Bevestig wachtwoord</label>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    autoComplete="new-password"
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-base text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                    minLength={8}
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>

                            <div className="flex items-center">
                                <input
                                    id="terms"
                                    name="terms"
                                    type="checkbox"
                                    className="h-4 w-4 text-accent border-gray-300 rounded mr-2"
                                    checked={acceptedTerms}
                                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                                />
                                <label htmlFor="terms" className="text-sm text-black">Ik ga akkoord met de voorwaarden</label>
                            </div>

                            {error && (
                                <p className="text-sm text-red-600">{error}</p>
                            )}
                            {success && (
                                <p className="text-sm text-green-600">{success}</p>
                            )}

                            <button
                                type="submit"
                                className="w-full bg-accent text-white rounded-full px-6 py-3 hover:bg-primary-hover transition font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                                disabled={loading}
                            >
                                {loading ? "Bezig..." : "Account aanmaken"}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm text-gray-600">
                            Heb je al een account?{" "}
                            <a href="/login" className="text-accent hover:text-primary-hover font-medium transition">Inloggen</a>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}


