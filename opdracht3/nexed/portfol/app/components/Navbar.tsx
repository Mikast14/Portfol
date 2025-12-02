"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect, useRef } from "react";

const Navbar = () => {
  const pathname = usePathname();
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { label: "Explore", href: "/explore" },
    { label: "Profile", href: "/profile" },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
  };

  return (
    <div className="mt-[20px] fixed mb-[20px] w-full flex justify-center z-50">
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

          {loading ? (
            <div className="text-sm text-gray-500">Laden...</div>
          ) : isAuthenticated && user ? (
            <div className="relative shrink-0" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded-full transition-all"
                aria-label="Profile menu"
                aria-expanded={isDropdownOpen}
              >
                {user.profileImage ? (
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 hover:border-accent transition-colors cursor-pointer">
                    <Image
                      src={user.profileImage}
                      alt={user.username}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center border-2 border-gray-200 hover:border-accent transition-colors cursor-pointer">
                    <span className="text-sm font-medium text-gray-600">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-elevated border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                  <div className="py-2">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{user.username}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>

                    {/* Settings Link */}
                    <Link
                      href="/profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span>Settings</span>
                    </Link>

                    {/* Logout Button */}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 shrink-0">
              <a href="/login" className="bg-primary text-white rounded-full px-5 py-2 hover:bg-secondary-hover transition whitespace-nowrap">
                Login
              </a>
              <a href="/login/registration" className="bg-accent text-white rounded-full px-5 py-2 hover:bg-primary-hover transition whitespace-nowrap">
                Get started
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
