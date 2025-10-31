import Navbar from "./Navbar";

export default function Home() {
  return (
    <div className="min-h-screen font-sans">
      <Navbar />

      <main>
        <img src="/landingpagebg.png" alt="Landing background" className="w-full h-screen object-cover object-bottom block" />
      </main>
    </div>
  );
}
