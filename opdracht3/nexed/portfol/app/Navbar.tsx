"use client";

const Navbar = () => {
  return (
    <div className="fixed top-4 left-0 w-full flex justify-center z-50">
      <div className="w-[calc(100%-48px)] max-w-6xl bg-white rounded-full px-6 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.2)] flex items-center justify-between">
        <div className="flex items-center gap-8 text-sm font-medium text-black">
          <a href="#" className="hover:opacity-70">Explore</a>
          <a href="#" className="hover:opacity-70">Your projects</a>
        </div>
        <div className="text-2xl font-extrabold tracking-tight text-black select-none">
          current
        </div>
        <div className="flex items-center gap-6 text-sm font-medium">
          <a href="#" className="text-black hover:opacity-70">About</a>
          <a href="#" className="text-black hover:opacity-70">Help</a>
          <div className="flex items-center gap-2">
          <a href="#" className="bg-primary text-white rounded-full px-5 py-2 hover:bg-primary-hover transition">
            Login
          </a>
          <a href="#" className="bg-accent text-white rounded-full px-5 py-2 hover:bg-primary-hover transition">
            Get started
          </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
