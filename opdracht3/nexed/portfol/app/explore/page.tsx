"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProjectCard from "../components/ProjectCard";
import Navbar from "../components/Navbar";
import Link from "next/link";
import Image from "next/image";

const ProjectsPage = () => {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      // Fetch all projects from all users for the explore page
      const res = await fetch("/api/projects?all=true");
      const data = await res.json();
      if (data.ok) setProjects(data.data);
      setLoading(false);
    };
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen font-sans bg-white">
      <Navbar />
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Explore</h1>
                <p className="text-gray-600 mt-2">
                  Discover projects from the community.
                </p>
              </div>
              <Link
                href="/profile"
                className="bg-accent text-white rounded-full px-6 py-3 hover:bg-primary-hover transition-colors font-medium whitespace-nowrap"
              >
                Go to Profile
              </Link>
            </div>
          </div>

          {/* Filters (placeholder) */}
          <div className="bg-white rounded-large p-6 shadow-elevated mb-6">
            <div className="flex flex-wrap gap-3 items-center">
              <span className="text-sm text-gray-600">Filters:</span>
              <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm">
                All
              </button>
              <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm">
                Web
              </button>
              <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm">
                Desktop
              </button>
              <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm">
                Mobile
              </button>
            </div>
          </div>

          {loading ? (
            <div className="bg-white rounded-large p-8 shadow-elevated">
              <p className="text-gray-500 text-center">Loading projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="bg-white rounded-large p-8 shadow-elevated">
              <p className="text-gray-500 text-center py-8">
                No projects found.{" "}
                <Link
                  href="/profile"
                  className="text-accent hover:text-primary-hover font-medium"
                >
                  Add your project
                </Link>
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project: any) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  mode="explore"
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