"use client";

import Image from "next/image";
import React from "react";

type ProjectItem = {
  _id: string;
  name: string;
  image?: string;
};

interface ProjectCardProps {
  project: ProjectItem;
  onOpen?: (id: string) => void;
  mode?: "profile" | "explore";
  showEditButton?: boolean;
  showDeleteButton?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  deleting?: boolean;
}

export default function ProjectCard({
  project,
  onOpen,
  mode = "explore",
  showEditButton,
  showDeleteButton,
  onEdit,
  onDelete,
  deleting = false,
}: ProjectCardProps) {
  const canEdit = showEditButton ?? mode === "profile";
  const canDelete = showDeleteButton ?? mode === "profile";

  return (
    <div
      onClick={() => onOpen?.(project._id)}
      className="group relative overflow-hidden rounded-large shadow-elevated transition-all hover:shadow-2xl cursor-pointer block"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen?.(project._id);
        }
      }}
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

      {/* Hover overlay + actions */}
      {(canEdit || canDelete) && (
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between bg-linear-to-t from-black/80 via-black/40 to-transparent translate-y-full opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <div className="flex justify-end gap-2 p-4">
            {canEdit && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEdit?.(project._id);
                }}
                className="pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-sm transition-colors hover:bg-pink-50 group/edit"
                aria-label="Edit project"
              >
                <svg className="h-4 w-4 transition-colors group-hover/edit:text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
            {canDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete?.(project._id);
                }}
                disabled={deleting}
                className="pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-sm transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-70 group/delete"
                aria-label="Delete project"
              >
                {deleting ? (
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
            )}
          </div>
        </div>
      )}

      <div className="p-4">
        <h2 className="text-lg font-semibold text-white">{project.name}</h2>
      </div>
    </div>
  );
}