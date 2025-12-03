"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect, useRef } from "react";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [userSearchResults, setUserSearchResults] = useState<Array<{
    id: string;
    username: string;
    profileImage: string | null;
    email: string;
  }>>([]);
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);
  // Load recent searches from localStorage using lazy initializer to avoid hydration mismatch
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem("recentSearches");
      if (stored) {
        const searches = JSON.parse(stored);
        return Array.isArray(searches) ? searches : [];
      }
    } catch (error) {
      console.error("Error parsing recent searches:", error);
    }
    return [];
  });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchDropdownRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const navLinks = [
    { label: "Explore", href: "/explore" },
    { label: "Your Projects", href: "/yourprojects" },
  ];

  // Prevent autofill on search input - aggressive prevention for all password managers
  useEffect(() => {
    if (searchInputRef.current) {
      const input = searchInputRef.current;
      // Set autofill prevention attributes programmatically for all major password managers
      input.setAttribute('autocomplete', 'off');
      input.setAttribute('data-lpignore', 'true');
      input.setAttribute('data-1p-ignore', 'true');
      input.setAttribute('data-bwignore', 'true');
      input.setAttribute('data-dashlane-ignore', 'true');
      input.setAttribute('data-lastpass-ignore', 'true');
      input.setAttribute('data-bitwarden-watching', 'false');
      input.setAttribute('data-autocomplete', 'off');
      input.setAttribute('data-chrome-autocomplete', 'off');
      input.setAttribute('data-safari-autocomplete', 'off');
      input.setAttribute('data-edge-autocomplete', 'off');
      // Explicitly tell password managers this is NOT a username or password field
      input.setAttribute('data-not-username', 'true');
      input.setAttribute('data-not-password', 'true');
      // Prevent password managers from detecting this as a login field
      input.setAttribute('data-form-type', 'other');
      
      // Also prevent autofill on the form element
      const form = input.closest('form');
      if (form) {
        form.setAttribute('autocomplete', 'off');
        form.setAttribute('data-lpignore', 'true');
        form.setAttribute('data-1p-ignore', 'true');
        form.setAttribute('data-bwignore', 'true');
      }
    }
  }, []);

  // Search for users as user types
  useEffect(() => {
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // If search query is empty, clear results
    if (!searchQuery.trim()) {
      setUserSearchResults([]);
      setIsSearchingUsers(false);
      return;
    }

    // Debounce search requests
    setIsSearchingUsers(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/users/search?q=${encodeURIComponent(searchQuery.trim())}`);
        const data = await res.json();
        if (data.ok) {
          setUserSearchResults(data.data || []);
        } else {
          setUserSearchResults([]);
        }
      } catch (error) {
        console.error("Error searching users:", error);
        setUserSearchResults([]);
      } finally {
        setIsSearchingUsers(false);
      }
    }, 300); // 300ms debounce

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };

    if (isDropdownOpen || isSearchFocused) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen, isSearchFocused]);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
  };

  const saveSearchToHistory = (query: string) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    setRecentSearches((prev) => {
      // Remove duplicates and add to beginning
      const updated = [trimmedQuery, ...prev.filter((s) => s !== trimmedQuery)];
      // Keep only last 4 searches
      const limited = updated.slice(0, 4);
      // Save to localStorage
      localStorage.setItem("recentSearches", JSON.stringify(limited));
      return limited;
    });
  };

  const handleSearch = (e: React.FormEvent, query?: string) => {
    e.preventDefault();
    const searchTerm = query || searchQuery.trim();
    if (searchTerm) {
      saveSearchToHistory(searchTerm);
      router.push(`/explore?search=${encodeURIComponent(searchTerm)}`);
      setSearchQuery("");
      setIsSearchFocused(false);
    }
  };

  const handleRecentSearchClick = (query: string) => {
    setSearchQuery(query);
    const syntheticEvent = {
      preventDefault: () => {},
    } as React.FormEvent;
    handleSearch(syntheticEvent, query);
  };

  const handleUserProfileClick = (username: string) => {
    router.push(`/user/${username}`);
    setSearchQuery("");
    setIsSearchFocused(false);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
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
          <form onSubmit={handleSearch} autoComplete="off" role="search" className="relative flex items-center group" data-lpignore="true" data-1p-ignore="true" data-bwignore="true">
            {/* Hidden fake fields to prevent browser autofill - placed BEFORE search input */}
            <input 
              type="text" 
              name="username" 
              autoComplete="username" 
              tabIndex={-1} 
              aria-hidden="true"
              readOnly
              data-lpignore="true"
              data-1p-ignore="true"
              data-bwignore="true"
              style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none', width: 0, height: 0 }} 
            />
            <input 
              type="email" 
              name="email" 
              autoComplete="email" 
              tabIndex={-1} 
              aria-hidden="true"
              readOnly
              data-lpignore="true"
              data-1p-ignore="true"
              data-bwignore="true"
              style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none', width: 0, height: 0 }} 
            />
            <input 
              type="password" 
              name="password" 
              autoComplete="new-password" 
              tabIndex={-1} 
              aria-hidden="true"
              readOnly
              data-lpignore="true"
              data-1p-ignore="true"
              data-bwignore="true"
              style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none', width: 0, height: 0 }} 
            />
            {/* Additional fake field to confuse password managers */}
            <input 
              type="text" 
              name="not-a-password-field" 
              autoComplete="off" 
              tabIndex={-1} 
              aria-hidden="true"
              readOnly
              data-lpignore="true"
              data-1p-ignore="true"
              data-bwignore="true"
              style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none', width: 0, height: 0 }} 
            />
            <div ref={searchDropdownRef} className="relative">
              <div className={`relative flex items-center h-10 transition-all duration-300 ease-out overflow-hidden ${
                isSearchFocused || searchQuery 
                  ? "w-72" 
                  : "w-10 group-hover:w-72"
              }`}>
                <div className={`absolute inset-0 rounded-full bg-gray-50/80 backdrop-blur-sm border-2 transition-all duration-300 ${
                  isSearchFocused 
                    ? "border-accent shadow-lg shadow-accent/20 bg-white" 
                    : "border-transparent group-hover:border-gray-200 group-hover:bg-white"
                }`} />
                <div className="relative flex items-center w-full h-full pl-1">
                  <button 
                    type="submit"
                    aria-label="Search" 
                    className={`relative z-10 p-2 rounded-full transition-all duration-200 shrink-0 ${
                      isSearchFocused || searchQuery
                        ? "text-accent"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.35-4.35" />
                    </svg>
                  </button>
                  <input
                    ref={searchInputRef}
                    type="search"
                    name="q"
                    id="search-input"
                    role="searchbox"
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck="false"
                    data-form-type="other"
                    data-lpignore="true"
                    data-1p-ignore="true"
                    data-bwignore="true"
                    data-dashlane-ignore="true"
                    data-lastpass-ignore="true"
                    data-bitwarden-watching="false"
                    data-autocomplete="off"
                    data-chrome-autocomplete="off"
                    data-safari-autocomplete="off"
                    data-edge-autocomplete="off"
                    data-not-username="true"
                    data-not-password="true"
                    inputMode="search"
                    placeholder="Search projects or profiles..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                    }}
                    onKeyDown={handleSearchKeyDown}
                    onFocus={(e) => {
                      setIsSearchFocused(true);
                      // Aggressively prevent autofill
                      const input = e.currentTarget;
                      input.setAttribute('autocomplete', 'off');
                      input.setAttribute('data-lpignore', 'true');
                      input.setAttribute('data-1p-ignore', 'true');
                      input.setAttribute('data-bwignore', 'true');
                      input.setAttribute('data-dashlane-ignore', 'true');
                      input.setAttribute('data-lastpass-ignore', 'true');
                      input.setAttribute('data-bitwarden-watching', 'false');
                      input.setAttribute('data-not-username', 'true');
                      input.setAttribute('data-not-password', 'true');
                    }}
                    onBlur={() => {
                      // Delay to allow click events to fire
                      setTimeout(() => setIsSearchFocused(false), 200);
                    }}
                    onMouseDown={(e) => {
                      // Prevent autofill on click
                      const input = e.currentTarget;
                      input.setAttribute('autocomplete', 'off');
                    }}
                    className={`relative z-10 flex-1 bg-transparent border-none outline-none text-sm text-gray-900 placeholder-gray-400 transition-all duration-300 h-full ${
                      isSearchFocused || searchQuery 
                        ? "opacity-100 pointer-events-auto pr-4" 
                        : "opacity-0 pointer-events-none pr-0 w-0 group-hover:opacity-100 group-hover:pointer-events-auto group-hover:pr-4 group-hover:w-auto"
                    }`}
                  />
                </div>
              </div>
              
              {/* Search Results Dropdown */}
              {isSearchFocused && (userSearchResults.length > 0 || recentSearches.length > 0 || searchQuery.trim()) && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* User Profile Results */}
                  {userSearchResults.length > 0 && (
                    <>
                      <div className="px-3 py-2 border-b border-gray-100">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Profiles</p>
                      </div>
                      <div className="py-1 max-h-64 overflow-y-auto">
                        {userSearchResults.map((user) => (
                          <button
                            key={user.id}
                            type="button"
                            onClick={() => handleUserProfileClick(user.username)}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 group/item"
                          >
                            {user.profileImage ? (
                              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 group-hover/item:border-accent transition-colors shrink-0">
                                <Image
                                  src={user.profileImage}
                                  alt={user.username}
                                  width={48}
                                  height={48}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center border-2 border-gray-200 group-hover/item:border-accent transition-colors shrink-0">
                                <span className="text-lg font-semibold text-accent">
                                  {user.username.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate">{user.username}</p>
                              <p className="text-xs text-gray-500 truncate">{user.email}</p>
                            </div>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4 text-gray-400 group-hover/item:text-accent transition-colors shrink-0"
                            >
                              <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                  
                  {/* Recent Searches - Only show if no user results or search query is empty */}
                  {recentSearches.length > 0 && userSearchResults.length === 0 && !searchQuery.trim() && (
                    <>
                      <div className="px-3 py-2 border-b border-gray-100">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Recent Searches</p>
                      </div>
                      <div className="py-1 max-h-64 overflow-y-auto">
                        {recentSearches.map((search, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleRecentSearchClick(search)}
                            className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3 group/item"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4 text-gray-400 group-hover/item:text-accent transition-colors shrink-0"
                            >
                              <circle cx="12" cy="12" r="10" />
                              <polyline points="12 6 12 12 16 14" />
                            </svg>
                            <span className="truncate flex-1">{search}</span>
                          </button>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Loading State */}
                  {isSearchingUsers && userSearchResults.length === 0 && searchQuery.trim() && (
                    <div className="px-4 py-3 text-center">
                      <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-accent border-t-transparent"></div>
                      <p className="text-xs text-gray-500 mt-2">Searching...</p>
                    </div>
                  )}

                  {/* No Results */}
                  {!isSearchingUsers && userSearchResults.length === 0 && searchQuery.trim() && (
                    <div className="px-4 py-3 text-center">
                      <p className="text-sm text-gray-500">No profiles found</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </form>

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
                      href="/yourprojects"
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
