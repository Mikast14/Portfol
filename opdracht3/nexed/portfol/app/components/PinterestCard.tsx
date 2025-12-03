"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

type PinterestProject = {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  images?: string[];
  platforms?: string[];
  userId?: {
    username?: string;
    profileImage?: string;
  };
};

interface PinterestCardProps {
  project: PinterestProject;
  onOpen?: (id: string) => void;
}

export default function PinterestCard({
  project,
  onOpen,
}: PinterestCardProps) {
  const [imageError, setImageError] = useState(false);
  
  // Use first image from images array, or fall back to main image
  const displayImage = project.images && project.images.length > 0 
    ? project.images[0] 
    : project.image;

  return (
    <div
      onClick={() => onOpen?.(project._id)}
      className="group cursor-pointer break-inside-avoid mb-6"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen?.(project._id);
        }
      }}
    >
      <div className="relative rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
        {/* Image Container */}
        <div className="relative w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          {displayImage && !imageError ? (
            <div className="relative w-full">
              {/* Use Next.js Image for optimization, but fallback to img for CORS issues */}
              <Image
                src={displayImage}
                alt={project.name}
                width={800}
                height={600}
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                onError={() => setImageError(true)}
                loading="lazy"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </div>
          ) : (
            <div className="flex h-64 w-full items-center justify-center bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100">
              <div className="text-center">
                <svg
                  className="w-16 h-16 mx-auto text-gray-300 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-sm text-gray-400">No image</span>
              </div>
            </div>
          )}
          
          {/* Title Overlay - Appears on Hover */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="space-y-3">
              {/* Title */}
              <h3 className="text-white font-semibold text-lg line-clamp-2 drop-shadow-lg">
                {project.name}
              </h3>
              
              {/* Platform Tags with Profile Image */}
              {project.platforms && project.platforms.length > 0 && (
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-2">
                    {project.platforms.slice(0, 3).map((platform) => (
                      <span
                        key={platform}
                        className="px-2.5 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full border border-white/30"
                      >
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </span>
                    ))}
                    {project.platforms.length > 3 && (
                      <span className="px-2.5 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full border border-white/30">
                        +{project.platforms.length - 3}
                      </span>
                    )}
                  </div>
                  {project.userId?.profileImage && project.userId?.username && (
                    <Link
                      href={`/user/${project.userId.username}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-shrink-0 hover:scale-110 transition-transform"
                    >
                      <Image
                        src={project.userId.profileImage}
                        alt={project.userId.username || "Owner"}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full object-cover border-2 border-white/50 shadow-lg"
                        loading="lazy"
                      />
                    </Link>
                  )}
                  {project.userId?.username && !project.userId.profileImage && (
                    <Link
                      href={`/user/${project.userId.username}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/90 flex items-center justify-center border-2 border-white/50 shadow-lg hover:scale-110 transition-transform"
                    >
                      <span className="text-xs font-semibold text-white">
                        {project.userId.username.charAt(0).toUpperCase()}
                      </span>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

