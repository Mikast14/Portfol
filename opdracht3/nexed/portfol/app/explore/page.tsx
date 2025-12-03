"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import PinterestCard from "../components/PinterestCard";
import Navbar from "../components/Navbar";

type FilterType = "all" | "web" | "desktop" | "mobile" | "game" | "app";

interface Project {
  _id: string;
  name: string;
  description?: string;
  githubRepo?: string;
  platforms?: string[];
  image?: string;
  images?: string[];
  userId?: {
    username?: string;
    email?: string;
    profileImage?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

interface UserProfile {
  id: string;
  username: string;
  profileImage: string | null;
  email: string;
}

const ProjectsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<FilterType[]>(["all"]);
  const isMountedRef = useRef(false);
  const searchQuery = searchParams.get("search") || "";

  // Shuffle array function (Fisher-Yates algorithm)
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    // Mark component as mounted
    isMountedRef.current = true;
    
    const fetchProjects = async () => {
      setLoading(true);
      // Fetch all projects from all users for the explore page
      const res = await fetch("/api/projects?all=true");
      const data = await res.json();
      if (data.ok) {
        // Shuffle projects to display in random order
        // Only shuffle after component is mounted to avoid hydration mismatch
        const shuffledProjects = shuffleArray(data.data as Project[]);
        setAllProjects(shuffledProjects);
      }
      setLoading(false);
    };
    fetchProjects();
  }, []);

  // Fetch user profiles when searching
  useEffect(() => {
    if (!searchQuery.trim()) {
      setUserProfiles([]);
      return;
    }

    const fetchUserProfiles = async () => {
      setLoadingProfiles(true);
      try {
        const res = await fetch(`/api/users/search?q=${encodeURIComponent(searchQuery.trim())}`);
        const data = await res.json();
        if (data.ok) {
          setUserProfiles(data.data || []);
        } else {
          setUserProfiles([]);
        }
      } catch (error) {
        console.error("Error fetching user profiles:", error);
        setUserProfiles([]);
      } finally {
        setLoadingProfiles(false);
      }
    };

    fetchUserProfiles();
  }, [searchQuery]);

  // Toggle filter selection
  const toggleFilter = (filterId: FilterType) => {
    setSelectedFilters((prev) => {
      if (filterId === "all") {
        // If "all" is clicked, always select it (can't deselect "all")
        return ["all"];
      } else {
        // If "all" is currently selected, replace it with the clicked filter
        if (prev.includes("all")) {
          return [filterId];
        }
        // Otherwise, toggle the filter
        let newFilters;
        if (prev.includes(filterId)) {
          newFilters = prev.filter((f) => f !== filterId);
        } else {
          newFilters = [...prev, filterId];
        }
        // If no filters are selected after toggling, automatically select "all"
        return newFilters.length === 0 ? ["all"] : newFilters;
      }
    });
  };

  // Filter projects based on selected filters and search query
  const filteredProjects = useMemo(() => {
    let projects = allProjects;

    // Apply search filter first
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      projects = projects.filter((project: Project) => {
        // Search by project name
        const nameMatch = project.name?.toLowerCase().includes(query);
        
        // Search by GitHub username (stored in userId.username)
        const usernameMatch = project.userId?.username?.toLowerCase().includes(query);
        
        return nameMatch || usernameMatch;
      });
    }

    // Then apply platform filters
    if (selectedFilters.length === 0 || selectedFilters.includes("all")) {
      return projects;
    }

    return projects.filter((project: Project) => {
      const platforms = project.platforms || [];
      
      // Check if project matches any of the selected filters (OR logic)
      return selectedFilters.some((filter) => {
        if (filter === "web") {
          return platforms.includes("web");
        }
        
        if (filter === "desktop") {
          return platforms.some((p: string) => 
            ["windows", "macos", "linux"].includes(p.toLowerCase())
          );
        }
        
        if (filter === "mobile") {
          return platforms.some((p: string) => 
            ["ios", "android", "mobile"].includes(p.toLowerCase())
          );
        }
        
        if (filter === "game") {
          return platforms.includes("game");
        }
        
        if (filter === "app") {
          return platforms.includes("app");
        }
        
        return false;
      });
    });
  }, [allProjects, selectedFilters, searchQuery]);

  const filters: { id: FilterType; label: string }[] = [
    { id: "all", label: "All" },
    { id: "web", label: "Web" },
    { id: "desktop", label: "Desktop" },
    { id: "mobile", label: "Mobile" },
    { id: "game", label: "Game" },
    { id: "app", label: "App" },
  ];

  return (
    <div className="min-h-screen font-sans bg-white">
      <Navbar />
      <main className="pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 px-2">
            <h1 className="text-4xl font-bold text-black mb-6">Explore</h1>
            {searchQuery && (
              <div className="mb-4 flex items-center gap-2">
                <span className="text-gray-600">Search results for:</span>
                <span className="font-semibold text-accent">&ldquo;{searchQuery}&rdquo;</span>
                <button
                  onClick={() => router.push("/explore")}
                  className="ml-2 text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>

          {/* Filters */}
          <div className="mb-6 px-2">
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => toggleFilter(filter.id)}
                  className={`px-4 py-2.5 rounded-full text-sm font-medium transition-colors ${
                    selectedFilters.includes(filter.id)
                      ? "bg-accent text-white shadow-sm hover:bg-primary-hover"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Projects Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent mb-4"></div>
                <p className="text-gray-500">Loading projects...</p>
              </div>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <p className="text-gray-500 text-lg mb-4">
                  No projects found
                  {searchQuery 
                    ? ` matching &ldquo;${searchQuery}&rdquo;`
                    : selectedFilters.length > 0 && !selectedFilters.includes("all") 
                    ? ` for ${selectedFilters.map(f => filters.find(filter => filter.id === f)?.label).join(", ")}`
                    : ""}.
                </p>
                {searchQuery && (
                  <button
                    onClick={() => router.push("/explore")}
                    className="mt-4 text-accent hover:text-primary-hover underline"
                  >
                    Clear search and show all projects
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Pinterest-style Masonry Layout - Max 3 columns */}
              <div 
                className="columns-1 sm:columns-2 lg:columns-3 space-y-0"
                style={{ columnGap: "1.5rem" }}
              >
                {filteredProjects.map((project: Project) => (
                  <PinterestCard
                    key={project._id}
                    project={project}
                    onOpen={() => router.push(`/explore/project/${project._id}`)}
                  />
                ))}
              </div>

              {/* User Profiles Section - Only show when searching */}
              {searchQuery.trim() && (
                <div className="mt-12">
                  <div className="mb-6 px-2">
                    <h2 className="text-2xl font-bold text-black">
                      Profiles
                      {loadingProfiles && (
                        <span className="ml-2 text-sm font-normal text-gray-500">(Searching...)</span>
                      )}
                    </h2>
                  </div>

                  {loadingProfiles ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-accent border-t-transparent mb-2"></div>
                        <p className="text-gray-500 text-sm">Loading profiles...</p>
                      </div>
                    </div>
                  ) : userProfiles.length === 0 ? (
                    <div className="flex justify-center items-center py-12">
                      <p className="text-gray-500">No profiles found matching &ldquo;{searchQuery}&rdquo;</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {userProfiles.map((profile) => (
                        <Link
                          key={profile.id}
                          href={`/user/${profile.username}`}
                          className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                        >
                          <div className="flex flex-col items-center text-center">
                            {/* Profile Image */}
                            {profile.profileImage ? (
                              <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-gray-100 group-hover:border-accent transition-colors mb-4">
                                <Image
                                  src={profile.profileImage}
                                  alt={profile.username}
                                  width={96}
                                  height={96}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent to-primary-hover flex items-center justify-center border-4 border-gray-100 group-hover:border-accent transition-colors mb-4">
                                <span className="text-3xl font-bold text-white">
                                  {profile.username.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}

                            {/* Username */}
                            <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-accent transition-colors">
                              {profile.username}
                            </h3>

                            {/* Email */}
                            <p className="text-sm text-gray-500 truncate w-full">
                              {profile.email}
                            </p>

                            {/* View Profile Indicator */}
                            <div className="mt-4 flex items-center gap-2 text-sm text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                              <span>View Profile</span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4"
                              >
                                <path d="M5 12h14M12 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProjectsPage;