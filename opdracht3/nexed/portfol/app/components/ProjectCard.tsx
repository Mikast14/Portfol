"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

type ProjectItem = {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  images?: string[];
  video?: string;
  videos?: string[];
  platforms?: string[];
  userId?: {
    username?: string;
    profileImage?: string;
    _id?: string;
  };
  likes?: string[];
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
  const [imageError, setImageError] = useState(false);
  const [isTallImage, setIsTallImage] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(project.likes?.length || 0);
  const [likeLoading, setLikeLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const canEdit = showEditButton ?? mode === "profile";
  const canDelete = showDeleteButton ?? mode === "profile";
  const showBookmark = mode === "explore" && isAuthenticated;
  const showLike = mode === "explore" && isAuthenticated && project.userId?._id !== user?.id;

  const parseYouTube = (url?: string) => {
    if (!url) return null;
    try {
      const u = new URL(url);
      if (u.hostname.includes("youtube.com")) {
        const v = u.searchParams.get("v");
        if (v) return v;
        const parts = u.pathname.split("/");
        const idx = parts.findIndex((p) => p === "shorts");
        if (idx >= 0 && parts[idx + 1]) return parts[idx + 1];
      }
      if (u.hostname === "youtu.be") {
        const id = u.pathname.replace("/", "");
        if (id) return id;
      }
      return null;
    } catch {
      return null;
    }
  };

  const firstImage = project.images && project.images.length > 0 ? project.images[0] : project.image;
  const firstVideo = project.videos && project.videos.length > 0 ? project.videos[0] : project.video;
  const ytId = parseYouTube(firstVideo || undefined);
  const youtubeThumb = ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : null;
  const displayMedia = firstImage || youtubeThumb || firstVideo;
  const displayIsVideo = !!firstVideo && !firstImage;
  const displayIsYouTube = !!youtubeThumb && !firstImage;

  // Check if project is bookmarked
  useEffect(() => {
    if (!isAuthenticated || !showBookmark) return;

    const checkBookmark = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(`/api/bookmarks?check=${project._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (data.ok) {
          setIsBookmarked(data.data.isBookmarked);
        }
      } catch (error) {
        console.error("Error checking bookmark:", error);
      }
    };

    checkBookmark();
  }, [isAuthenticated, showBookmark, project._id]);

  // Check if project is liked and get likes count
  useEffect(() => {
    if (!isAuthenticated || !showLike) {
      setLikesCount(project.likes?.length || 0);
      return;
    }

    const checkLike = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(`/api/projects/${project._id}/like`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (data.ok) {
          setIsLiked(data.data.isLiked);
          setLikesCount(data.data.likesCount);
        }
      } catch (error) {
        console.error("Error checking like:", error);
        setLikesCount(project.likes?.length || 0);
      }
    };

    checkLike();
  }, [isAuthenticated, showLike, project._id, project.likes]);

  // Handle bookmark toggle
  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) return;

    setBookmarkLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      if (isBookmarked) {
        // Unbookmark
        const res = await fetch(`/api/bookmarks?projectId=${project._id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (data.ok) {
          setIsBookmarked(false);
        }
      } else {
        // Bookmark
        const res = await fetch("/api/bookmarks", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ projectId: project._id }),
        });

        const data = await res.json();
        if (data.ok) {
          setIsBookmarked(true);
        }
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    } finally {
      setBookmarkLoading(false);
    }
  };

  // Handle like toggle
  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated || !showLike) return;

    setLikeLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      if (isLiked) {
        // Unlike
        const res = await fetch(`/api/projects/${project._id}/like`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (data.ok) {
          setIsLiked(false);
          setLikesCount(data.data.likesCount);
        } else {
          console.error("Error unliking project:", data.error);
        }
      } else {
        // Like
        const res = await fetch(`/api/projects/${project._id}/like`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (data.ok) {
          setIsLiked(true);
          setLikesCount(data.data.likesCount);
        } else {
          console.error("Error liking project:", data.error);
        }
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setLikeLoading(false);
    }
  };

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
        <div
          className="relative w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100"
          style={isTallImage ? { aspectRatio: "16 / 9" } : undefined}
        >
          {displayImage && !imageError ? (
            <div className="relative w-full h-full">
              <Image
                src={displayImage}
                alt={project.name}
                width={800}
                height={600}
                onError={() => setImageError(true)}
                onLoadingComplete={(img) => {
                  const aspect = img.naturalWidth / img.naturalHeight;
                  // mark as "tall" when image is taller than 16:9
                  setIsTallImage(aspect < 16 / 9);
                }}
                className={
                  isTallImage
                    ? "w-full h-full object-cover object-top transition-all duration-1700 ease-in-out group-hover:object-bottom"
                    : "w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                }
                style={isTallImage ? undefined : { maxWidth: "100%", height: "auto" }}
                loading="lazy"
              />
            </div>
          ) : (
            <div
              className="flex w-full items-center justify-center bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100"
              style={{ aspectRatio: "16 / 9" }}
            >
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
        </div>

        {/* Action Buttons (Like/Bookmark/Edit/Delete) - Top Right */}
        {(showLike || showBookmark || canEdit || canDelete) && (
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            {showLike && (
              <button
                type="button"
                onClick={handleLike}
                disabled={likeLoading}
                className="pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-gray-700 shadow-lg transition-all hover:bg-white hover:scale-110 disabled:cursor-not-allowed disabled:opacity-70 group/like"
                aria-label={isLiked ? "Unlike project" : "Like project"}
              >
                {likeLoading ? (
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4" />
                    <path className="opacity-75" d="M4 12a8 8 0 018-8" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg
                    className={`h-4 w-4 transition-colors group-hover/like:text-accent ${isLiked ? "fill-accent text-accent" : ""}`}
                    viewBox="0 0 24 24"
                    fill={isLiked ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                    />
                  </svg>
                )}
              </button>
            )}
            {showBookmark && (
              <button
                type="button"
                onClick={handleBookmark}
                disabled={bookmarkLoading}
                className="pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-gray-700 shadow-lg transition-all hover:bg-white hover:scale-110 disabled:cursor-not-allowed disabled:opacity-70 group/bookmark"
                aria-label={isBookmarked ? "Remove bookmark" : "Bookmark project"}
              >
                {bookmarkLoading ? (
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4" />
                    <path className="opacity-75" d="M4 12a8 8 0 018-8" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg
                    className={`h-4 w-4 transition-colors group-hover/bookmark:text-accent ${isBookmarked ? "fill-accent text-accent" : ""}`}
                    viewBox="0 0 24 24"
                    fill={isBookmarked ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                  </svg>
                )}
              </button>
            )}
            {canEdit && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEdit?.(project._id);
                }}
                className="pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-gray-700 shadow-lg transition-all hover:bg-white hover:scale-110 group/edit"
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
                className="pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-gray-700 shadow-lg transition-all hover:bg-white hover:scale-110 disabled:cursor-not-allowed disabled:opacity-70 group/delete"
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
        )}
        
        {/* Title Overlay - Appears on Hover */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="space-y-3">
            {/* Title */}
            <h3 className="text-white font-semibold text-lg line-clamp-2 drop-shadow-lg">
              {project.name}
            </h3>
            
            {/* Platform Tags with Profile Image and Like Count */}
            {project.platforms && project.platforms.length > 0 && (
              <div className="flex items-center justify-between gap-2">
                <div className="flex flex-wrap gap-2 items-center">
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
                  {showLike && likesCount > 0 && (
                    <span className="px-2.5 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full border border-white/30 flex items-center gap-1">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                      </svg>
                      {likesCount}
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
  );
}