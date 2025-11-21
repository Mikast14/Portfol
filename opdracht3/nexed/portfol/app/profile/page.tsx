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
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  const handleDelete = async (projectId: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this project? This action cannot be undone.");
    if (!confirmed) {
      return;
    }

    setDeletingId(projectId);
    try {
      const response = await fetch(`/api/projects?id=${projectId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.ok) {
        setProjects((prevProjects) => prevProjects.filter((project) => project._id !== projectId));
      } else {
        console.error("Failed to delete project:", data.error);
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen font-sans bg-white">
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
                <Link
                  key={project._id}
                  href={`/profile/projects/${project._id}`}
                  className="group relative overflow-hidden rounded-large shadow-elevated transition-all hover:shadow-2xl cursor-pointer block"
                >
                  <div className="relative w-full" style={{ aspectRatio: "4 / 3" }}>
                    {project.image ? (
                      <Image
                        src={project.image}
                        alt={project.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-200">
                        <span className="text-sm text-gray-500">No image available</span>
                      </div>
                    )}
                  </div>

                  <div className="pointer-events-none absolute inset-0 flex flex-col justify-between bg-linear-to-t from-black/80 via-black/40 to-transparent translate-y-full opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="flex justify-end gap-2 p-4">
                      <Link
                        href={`/profile/edit-project/${project._id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-sm transition-colors hover:bg-white"
                        aria-label="Edit project"
                      >
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Link>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleDelete(project._id);
                        }}
                        disabled={deletingId === project._id}
                        className="pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-sm transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
                        aria-label="Delete project"
                      >
                        {deletingId === project._id ? (
                          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4" />
                            <path className="opacity-75" d="M4 12a8 8 0 018-8" strokeWidth="4" strokeLinecap="round" />
                          </svg>
                        ) : (
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 6h18" strokeLinecap="round" />
                            <path d="M8 6v-1a2 2 0 012-2h4a2 2 0 012 2v1" strokeLinecap="round" />
                            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M10 11v6" strokeLinecap="round" />
                            <path d="M14 11v6" strokeLinecap="round" />
                          </svg>
                        )}
                      </button>
                    </div>
                    <div className="p-4">
                      <h2 className="text-lg font-semibold text-white">{project.name}</h2>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

