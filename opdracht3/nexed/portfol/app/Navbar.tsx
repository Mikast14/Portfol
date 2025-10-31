"use client";
import Image from "next/image";

const Navbar = () => {
  return (
    <div className="fixed top-4 left-0 w-full flex justify-center z-50">
      <div className="w-[calc(100%-48px)] max-w-6xl bg-white rounded-full px-6 py-3 shadow-elevated grid grid-cols-3 items-center">
        <div className="flex items-center gap-8 text-sm font-medium text-black justify-self-start">
          <a href="#" className="hover:opacity-70">Explore</a>
          <a href="#" className="hover:opacity-70">Your projects</a>
        </div>
        <div className="select-none justify-self-center">
          <Image
            src="/logo1portfol.png"
            alt="Portfol logo"
            width={140}
            height={40}
            className="h-10 w-auto shrink-0"
            priority
          />
        </div>
        <div className="flex items-center gap-6 text-sm font-medium justify-self-end">
          <div className="relative group flex items-center">
            <button aria-label="Search" className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-black transition-transform duration-200 group-hover:scale-110"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
            <input
              type="text"
              placeholder="Search..."
              className="absolute right-0 top-1/2 -translate-y-1/2 w-0 opacity-0 pointer-events-none group-hover:w-48 group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 ease-out bg-white border border-gray-300 text-black rounded-full pl-4 pr-10 py-1 text-sm shadow"
            />
          </div>

          <div className="flex items-center gap-2">
          <a href="#" className="bg-primary text-white rounded-full px-5 py-2 hover:bg-secondary-hover transition">
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
