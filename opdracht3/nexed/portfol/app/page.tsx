import Navbar from "./Navbar";

export default function Home() {
  return (
    <div className="h-screen overflow-hidden font-sans">
      <Navbar />

      <main className="h-full">
        <img
          src="/landingpagebg.png"
          alt="Landing background"
          className="w-full h-full object-cover object-bottom block"
        />
      </main>
    </div>
  );
}
