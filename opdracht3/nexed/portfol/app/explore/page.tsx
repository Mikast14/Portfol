"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import PinterestCard from "../components/PinterestCard";
import Navbar from "../components/Navbar";

type FilterType = "all" | "web" | "desktop" | "mobile" | "game" | "app";

const ProjectsPage = () => {
  const router = useRouter();
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState<FilterType[]>(["all"]);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      // Fetch all projects from all users for the explore page
      const res = await fetch("/api/projects?all=true");
      const data = await res.json();
      if (data.ok) setAllProjects(data.data);
      setLoading(false);
    };
    fetchProjects();
  }, []);

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

  // Filter projects based on selected filters
  const filteredProjects = useMemo(() => {
    if (selectedFilters.length === 0 || selectedFilters.includes("all")) {
      return allProjects;
    }

    return allProjects.filter((project: any) => {
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
  }, [allProjects, selectedFilters]);

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
                  No projects found{selectedFilters.length > 0 && !selectedFilters.includes("all") 
                    ? ` for ${selectedFilters.map(f => filters.find(filter => filter.id === f)?.label).join(", ")}` 
                    : ""}.
                </p>
              </div>
            </div>
          ) : (
            /* Pinterest-style Masonry Layout - Max 3 columns */
            <div 
              className="columns-1 sm:columns-2 lg:columns-3 space-y-0"
              style={{ columnGap: "1.5rem" }}
            >
              {filteredProjects.map((project: any) => (
                <PinterestCard
                  key={project._id}
                  project={project}
                  onOpen={() => router.push(`/project/${project._id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProjectsPage;