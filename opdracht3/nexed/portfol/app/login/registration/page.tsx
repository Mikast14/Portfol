import Navbar from "../../Navbar";

export default function RegistrationPage() {
    return (
        <div className="min-h-screen font-sans bg-background">
            <Navbar />

            <main className="pt-24 pb-16 px-6 flex items-center justify-center min-h-[calc(100vh-96px)]">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-large p-8 shadow-elevated">
                        <h1 className="text-3xl font-bold mb-2 text-foreground text-center">Registreren</h1>
                        <p className="text-gray-600 text-center mb-8">Maak een nieuw account aan om verder te gaan.</p>

                        <form action="#" method="post" noValidate className="space-y-6">
                            <div>
                                <label htmlFor="fullName" className="block text-sm font-medium text-black mb-2">Volledige naam</label>
                                <input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    autoComplete="name"
                                    placeholder="Voor- en achternaam"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-base text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                    required
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
                                />
                            </div>

                            <div className="flex items-center">
                                <input id="terms" name="terms" type="checkbox" className="h-4 w-4 text-accent border-gray-300 rounded mr-2" />
                                <label htmlFor="terms" className="text-sm text-black">Ik ga akkoord met de voorwaarden</label>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-accent text-white rounded-full px-6 py-3 hover:bg-primary-hover transition font-medium"
                            >
                                Account aanmaken
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


