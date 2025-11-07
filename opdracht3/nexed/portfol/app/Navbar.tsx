"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();

  const navLinks = [
    { label: "Explore", href: "/explore" },
    { label: "Your projects", href: "/account" },
  ];

  return (
    <div className="mt-[20px] mb-[20px] w-full flex justify-center z-50">
      <div className="w-[calc(100%-30%)] bg-white rounded-full px-6 py-3 shadow-elevated grid grid-cols-[1fr_auto_1fr] items-center">
        <div className="flex items-center gap-8 text-sm font-medium text-black justify-self-start">
          {navLinks.map(({ label, href }) => {
            const isActive = href !== "#" && pathname === href;

            return (
              <Link
                key={label}
                href={href}
                className={`transition ${
                  isActive ? "text-accent" : "hover:opacity-70"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
        <Link href="/" className="select-none justify-self-center">
          <Image
            src="/logo1portfol.png"
            alt="Portfol logo"
            width={140}
            height={40}
            className="h-10 w-auto shrink-0"
            priority
          />
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium justify-self-end shrink-0">
          <div className="relative group flex items-center">
            <button aria-label="Search" className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 30 30"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-7 w-7 text-black transition-transform duration-200 group-hover:scale-110 group-focus-within:scale-110"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
            <input
              type="text"
              placeholder="Search..."
              className="absolute right-0 top-1/2 -translate-y-1/2 w-0 opacity-0 pointer-events-none group-hover:w-48 group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:w-48 group-focus-within:opacity-100 group-focus-within:pointer-events-auto transition-all duration-300 ease-out bg-white border border-gray-300 text-black rounded-full pl-4 pr-10 py-1 text-sm shadow focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
          <a href="/login" className="bg-primary text-white rounded-full px-5 py-2 hover:bg-secondary-hover transition whitespace-nowrap">
            Login
          </a>
          <a href="/login/registration" className="bg-accent text-white rounded-full px-5 py-2 hover:bg-primary-hover transition whitespace-nowrap">
            Get started
          </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
