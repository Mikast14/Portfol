"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// import PinterestCard from "../components/PinterestCard";
import ProjectCard from "../components/ProjectCard";
import Navbar from "../components/Navbar";
import { useAuth } from "@/hooks/useAuth";

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

const BookmarksPage = () => {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [bookmarkedProjects, setBookmarkedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!isAuthenticated) return;

    const fetchBookmarks = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication required");
          setLoading(false);
          return;
        }

        const res = await fetch("/api/bookmarks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (data.ok) {
          setBookmarkedProjects(data.data || []);
        } else {
          setError(data.error || "Failed to load bookmarks");
        }
      } catch (err) {
        console.error("Error fetching bookmarks:", err);
        setError("Failed to load bookmarks");
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [isAuthenticated, authLoading, router]);

  const handleProjectClick = (projectId: string) => {
    router.push(`/explore/project/${projectId}`);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen font-sans bg-white">
        <Navbar />
        <main className="pt-24 pb-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <p className="text-gray-500">Loading bookmarks...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen font-sans bg-white">
        <Navbar />
        <main className="pt-24 pb-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans bg-white">
      <Navbar />
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-black mb-2">Bookmarks</h1>
            <p className="text-gray-600">
              {bookmarkedProjects.length === 0
                ? "No bookmarked projects yet"
                : `${bookmarkedProjects.length} bookmarked project${bookmarkedProjects.length === 1 ? "" : "s"}`}
            </p>
          </div>

          {/* Projects Grid */}
          {bookmarkedProjects.length === 0 ? (
            <div className="text-center py-16">
              <svg
                className="w-24 h-24 mx-auto text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
              <p className="text-gray-500 text-lg mb-4">No bookmarks yet</p>
              <p className="text-gray-400 mb-6">
                Start bookmarking projects you like to find them easily later
              </p>
              <button
                onClick={() => router.push("/explore")}
                className="bg-accent hover:bg-primary-hover text-white px-6 py-3 rounded-full font-medium transition-colors"
              >
                Explore Projects
              </button>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 space-y-0" style={{ columnGap: "1.5rem" }}>
              {bookmarkedProjects.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  mode="explore"
                  onOpen={handleProjectClick}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BookmarksPage;

