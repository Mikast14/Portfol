"use client";

import { useState, useEffect } from "react";
import Navbar from "../Navbar";

interface TextEntry {
    _id: string;
    text: string;
    createdAt: string;
}

export default function Explore() {
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [savedTexts, setSavedTexts] = useState<TextEntry[]>([]);
    const [loadingTexts, setLoadingTexts] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!text.trim()) {
            setMessage("Voer een tekst in");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const response = await fetch("/api/texts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text }),
            });

            const data = await response.json();

            if (data.ok) {
                setMessage("Tekst succesvol toegevoegd! ✅");
                setText("");
                // Refresh the list
                fetchTexts();
            } else {
                setMessage(`Fout: ${data.error}`);
            }
        } catch (error) {
            setMessage("Er is een fout opgetreden bij het toevoegen");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTexts = async () => {
        setLoadingTexts(true);
        try {
            const response = await fetch("/api/texts");
            const data = await response.json();
            if (data.ok) {
                setSavedTexts(data.data);
            }
        } catch (error) {
            console.error("Error fetching texts:", error);
        } finally {
            setLoadingTexts(false);
        }
    };

    // Load texts on component mount
    useEffect(() => {
        fetchTexts();
    }, []);

    const [dbInfo, setDbInfo] = useState<{
        database: string;
        collection: string;
        fullPath: string;
        documentCount: number;
    } | null>(null);

    const fetchDbInfo = async () => {
        try {
            const response = await fetch("/api/texts/info");
            const data = await response.json();
            if (data.ok) {
                setDbInfo(data.info);
            }
        } catch (error) {
            console.error("Error fetching db info:", error);
        }
    };

    useEffect(() => {
        fetchDbInfo();
    }, []);

    return (
        <div className="min-h-screen font-sans bg-background">
            <Navbar />

            <main className="pt-24 pb-16 px-6 max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-4 text-foreground">
                    Database Test - Voeg Tekst Toe
                </h1>

                {dbInfo && (
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-base">
                        <p className="text-sm text-blue-900">
                            <strong>Locatie in database:</strong> <code className="bg-white px-2 py-1 rounded">{dbInfo.fullPath}</code>
                        </p>
                        <p className="text-sm text-blue-900 mt-2">
                            <strong>Aantal documenten:</strong> {dbInfo.documentCount}
                        </p>
                        <p className="text-xs text-blue-700 mt-2">
                            Database: <code>{dbInfo.database}</code> → Collection: <code>{dbInfo.collection}</code>
                        </p>
                    </div>
                )}

                <div className="bg-white rounded-large p-6 shadow-elevated mb-8">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label
                                htmlFor="text"
                                className="block text-sm font-medium text-black mb-2"
                            >
                                Tekst invoeren:
                            </label>
                            <textarea
                                id="text"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Typ hier je tekst..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-base text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
                                rows={4}
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-accent text-white rounded-full px-6 py-3 hover:bg-primary-hover transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        >
                            {loading ? "Bezig..." : "Tekst toevoegen aan database"}
                        </button>

                        {message && (
                            <div
                                className={`p-4 rounded-base ${message.includes("✅")
                                    ? "bg-green-50 text-green-800"
                                    : "bg-red-50 text-red-800"
                                    }`}
                            >
                                {message}
                            </div>
                        )}
                    </form>
                </div>

                <div className="bg-white rounded-large p-6 shadow-elevated">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-black">
                            Opgeslagen Teksten
                        </h2>
                        <button
                            onClick={fetchTexts}
                            disabled={loadingTexts}
                            className="bg-primary text-white rounded-full px-4 py-2 hover:bg-secondary-hover transition disabled:opacity-50 text-sm"
                        >
                            {loadingTexts ? "Laden..." : "Vernieuwen"}
                        </button>
                    </div>

                    {savedTexts.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">
                            Nog geen teksten opgeslagen. Voeg er een toe hierboven!
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {savedTexts.map((entry) => (
                                <div
                                    key={entry._id}
                                    className="p-4 bg-gray-50 rounded-base border border-gray-200"
                                >
                                    <p className="text-black mb-2 whitespace-pre-wrap">
                                        {entry.text}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(entry.createdAt).toLocaleString("nl-NL")}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
