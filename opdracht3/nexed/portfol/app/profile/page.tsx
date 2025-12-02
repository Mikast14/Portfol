"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
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
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await fetch("/api/projects", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
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

  const handleDeleteClick = (projectId: string, projectName: string) => {
    setProjectToDelete({ id: projectId, name: projectName });
  };

  const handleDeleteCancel = () => {
    setProjectToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;

    setDeletingId(projectToDelete.id);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authentication token found");
        setDeletingId(null);
        return;
      }

      const response = await fetch(`/api/projects?id=${projectToDelete.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.ok) {
        setProjects((prevProjects) => prevProjects.filter((project) => project._id !== projectToDelete.id));
        setProjectToDelete(null);
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
                <div
                  key={project._id}
                  onClick={() => router.push(`/profile/projects/${project._id}`)}
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
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          router.push(`/profile/edit-project/${project._id}`);
                        }}
                        className="pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-sm transition-colors hover:bg-pink-50 group/edit"
                        aria-label="Edit project"
                      >
                        <svg className="h-4 w-4 transition-colors group-hover/edit:text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleDeleteClick(project._id, project.name);
                        }}
                        disabled={deletingId === project._id}
                        className="pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-sm transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-70 group/delete"
                        aria-label="Delete project"
                      >
                        {deletingId === project._id ? (
                          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4" />
                            <path className="opacity-75" d="M4 12a8 8 0 018-8" strokeWidth="4" strokeLinecap="round" />
                          </svg>
                        ) : (
                          <svg className="h-4 w-4 transition-colors group-hover/delete:text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-large shadow-elevated max-w-md w-full mx-4 animate-in slide-in-from-bottom-4 duration-300">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">Delete Project</h3>
                  <p className="text-sm text-gray-600 mt-1">This action cannot be undone</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete <span className="font-semibold text-gray-900">&ldquo;{projectToDelete.name}&rdquo;</span>? 
                This will permanently remove the project and all its data.
              </p>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleDeleteCancel}
                  disabled={deletingId === projectToDelete.id}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-900 rounded-full hover:bg-gray-200 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  disabled={deletingId === projectToDelete.id}
                  className="flex-1 px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {deletingId === projectToDelete.id ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Delete Project</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

