"use client";

import { useState, useEffect } from "react";
import Navbar from "../Navbar";
import Link from "next/link";
import Image from "next/image";

interface Project {
  _id: string;
  name: string;
  description: string;
  githubRepo: string;
  platforms: string[];
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export default function Profile() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects");
        const data = await response.json();
        if (data.ok) {
          setProjects(data.data);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "windows":
        return "🪟";
      case "macos":
        return "🍎";
      case "web":
        return "🌐";
      case "linux":
        return "🐧";
      default:
        return "💻";
    }
  };

  return (
    <div className="min-h-screen font-sans bg-background">
      <Navbar />
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-large p-8 shadow-elevated mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Profile</h1>
                <p className="text-gray-600 mt-2">Welcome to your profile page.</p>
              </div>
              <Link
                href="/profile/add-project"
                className="bg-accent text-white rounded-full px-6 py-3 hover:bg-primary-hover transition-colors font-medium whitespace-nowrap"
              >
                + Add Project
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="bg-white rounded-large p-8 shadow-elevated">
              <p className="text-gray-500 text-center">Loading projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="bg-white rounded-large p-8 shadow-elevated">
              <p className="text-gray-500 text-center py-8">
                No projects yet.{" "}
                <Link href="/profile/add-project" className="text-accent hover:text-primary-hover font-medium">
                  Add your first project
                </Link>
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project._id}
                  className="bg-white rounded-large p-6 shadow-elevated hover:shadow-lg transition-shadow flex flex-col"
                >
                  {/* Project Image */}
                  {project.image && (
                    <div className="relative w-full h-48 mb-4 rounded-base overflow-hidden">
                      <Image
                        src={project.image}
                        alt={project.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  {/* Project Name */}
                  <h2 className="text-xl font-bold text-foreground mb-2">{project.name}</h2>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 grow line-clamp-3">
                    {project.description}
                  </p>

                  {/* Platforms */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.platforms.map((platform) => (
                      <span
                        key={platform}
                        className="px-3 py-1 bg-gray-100 text-black rounded-full text-xs font-medium flex items-center gap-1"
                      >
                        <span>{getPlatformIcon(platform)}</span>
                        <span className="capitalize">{platform === "macos" ? "macOS" : platform}</span>
                      </span>
                    ))}
                  </div>

                  {/* GitHub Link */}
                  <a
                    href={project.githubRepo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:text-primary-hover text-sm font-medium flex items-center gap-2 transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    View on GitHub
                  </a>

                  {/* Created Date */}
                  <p className="text-xs text-gray-400 mt-4 pt-4 border-t border-gray-200">
                    Created {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

