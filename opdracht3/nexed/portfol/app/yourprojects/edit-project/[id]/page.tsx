"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../../../components/Navbar";
import CommentsSection from "../../../components/CommentsSection";
import { GitHubRepo } from "../../add-project/types";
import { GitHubDisplaySettings, DEFAULT_GITHUB_SETTINGS } from "../../add-project/components/GitHubDisplaySettingsSection";
import PlatformsSection from "../../add-project/components/PlatformsSection";

type ActiveStatusMode = "auto" | "active" | "inactive" | "hide";
type DisplayMode = "auto" | "hide";

interface Project {
  _id: string;
  name: string;
  description: string;
  githubRepo: string;
  platforms: string[];
  image?: string;
  images?: string[];
  video?: string;
  videos?: string[];
  githubDisplaySettings?: GitHubDisplaySettings;
  userId?: {
    _id?: string;
    username?: string;
    email?: string;
    profileImage?: string;
  };
  likes?: string[];
  createdAt: string;
  updatedAt: string;
}


// Project types that can be extracted from platforms
const PROJECT_TYPES = ["game", "app", "website"];

export default function EditProject() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Editable fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [githubRepo, setGithubRepo] = useState("");
  const [projectType, setProjectType] = useState<string | null>(null);
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [mainImageUrl, setMainImageUrl] = useState("");
  const [additionalImageUrls, setAdditionalImageUrls] = useState<string[]>([]);
  const [mainVideoUrl, setMainVideoUrl] = useState("");
  const [additionalVideoUrls, setAdditionalVideoUrls] = useState<string[]>([]);
  const [githubDisplaySettings, setGithubDisplaySettings] = useState<GitHubDisplaySettings>(DEFAULT_GITHUB_SETTINGS);
  
  // UI state
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("right");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [githubUsername, setGithubUsername] = useState("");
  
  const thumbnailScrollRef = useRef<HTMLDivElement>(null);
  const carouselIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const logo = mainImageUrl || null;
  const mediaItems = (() => {
    const items: { type: "image" | "video" | "youtube"; url: string; embedUrl?: string; thumbUrl?: string; origin: "mainVideo" | "additionalVideo" | "image"; originIndex?: number }[] = [];
    const parseYouTube = (url: string) => {
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

    if (mainVideoUrl) {
      const yt = parseYouTube(mainVideoUrl);
      if (yt) {
        items.push({
          type: "youtube",
          url: mainVideoUrl,
          embedUrl: `https://www.youtube.com/embed/${yt}`,
          thumbUrl: `https://img.youtube.com/vi/${yt}/hqdefault.jpg`,
          origin: "mainVideo",
        });
      } else {
        items.push({ type: "video", url: mainVideoUrl, origin: "mainVideo" });
      }
    }

    if (additionalVideoUrls.length > 0) {
      additionalVideoUrls.forEach((url, idx) => {
        const yt = parseYouTube(url);
        if (yt) {
          items.push({
            type: "youtube",
            url,
            embedUrl: `https://www.youtube.com/embed/${yt}`,
            thumbUrl: `https://img.youtube.com/vi/${yt}/hqdefault.jpg`,
            origin: "additionalVideo",
            originIndex: idx,
          });
        } else {
          items.push({ type: "video", url, origin: "additionalVideo", originIndex: idx });
        }
      });
    }

    if (additionalImageUrls.length > 0) {
      items.push(...additionalImageUrls.map((url, idx) => ({ type: "image", url, origin: "image", originIndex: idx })));
    }

    return items;
  })();

  // Fetch project data
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication required");
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/projects?id=${projectId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.ok) {
          const projectData = data.data;
          setProject(projectData);
          
          setName(projectData.name || "");
          setDescription(projectData.description || "");
          setGithubRepo(projectData.githubRepo || "");
          
          // Extract project type from platforms and separate actual platforms
          const allPlatforms = projectData.platforms || [];
          const extractedType = allPlatforms.find((p: string) => PROJECT_TYPES.includes(p.toLowerCase())) || null;
          const actualPlatforms = allPlatforms.filter((p: string) => !PROJECT_TYPES.includes(p.toLowerCase()));
          
          setProjectType(extractedType);
          setPlatforms(actualPlatforms);
          
          if (projectData.image) {
            setMainImageUrl(projectData.image);
          }
          
          if (projectData.images && projectData.images.length > 0) {
            setAdditionalImageUrls(projectData.images);
          }

          if (projectData.video) {
            setMainVideoUrl(projectData.video);
          }

          if (projectData.videos && projectData.videos.length > 0) {
            setAdditionalVideoUrls(projectData.videos);
          }
          
          if (projectData.githubDisplaySettings) {
            setGithubDisplaySettings({ ...DEFAULT_GITHUB_SETTINGS, ...projectData.githubDisplaySettings });
          }
          
          if (projectData.githubRepo) {
            const repoMatch = projectData.githubRepo.match(/github\.com\/([^\/]+)/);
            if (repoMatch) {
              setGithubUsername(repoMatch[1]);
            } else {
              const parts = projectData.githubRepo.split("/");
              if (parts.length >= 2) {
                setGithubUsername(parts[0]);
              }
            }
          }
        } else {
          setError(data.error || "Failed to load project");
        }
      } catch (err) {
        console.error("Error fetching project:", err);
        setError("Failed to load project");
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  // Fetch GitHub repos
  useEffect(() => {
    if (!githubUsername) return;
    
    const fetchRepos = async () => {
      setLoadingRepos(true);
      try {
        const response = await fetch(`/api/github/repos?username=${githubUsername}`);
        const data = await response.json();
        if (data.ok) {
          setRepos(data.data);
        }
      } catch (error) {
        console.error("Error fetching repos:", error);
      } finally {
        setLoadingRepos(false);
      }
    };

    fetchRepos();
  }, [githubUsername]);

  // Auto-advance carousel
  useEffect(() => {
    if (mediaItems.length <= 1) return;
    if (carouselIntervalRef.current) {
      clearInterval(carouselIntervalRef.current);
    }
    const interval = setInterval(() => {
      setSelectedMediaIndex((prevIndex) => {
        setSlideDirection("right");
        return (prevIndex + 1) % mediaItems.length;
      });
    }, 5000);
    carouselIntervalRef.current = interval;
    return () => {
      if (carouselIntervalRef.current) {
        clearInterval(carouselIntervalRef.current);
      }
    };
  }, [mediaItems.length]);

  const handleMediaSelect = (index: number) => {
    if (index > selectedMediaIndex) {
      setSlideDirection("right");
    } else if (index < selectedMediaIndex) {
      setSlideDirection("left");
    }
    setSelectedMediaIndex(index);
    if (carouselIntervalRef.current) {
      clearInterval(carouselIntervalRef.current);
    }
    if (mediaItems.length > 1) {
      const interval = setInterval(() => {
        setSelectedMediaIndex((prevIndex) => {
          setSlideDirection("right");
          return (prevIndex + 1) % mediaItems.length;
        });
      }, 5000);
      carouselIntervalRef.current = interval;
    }
  };

  const handleProjectTypeChange = useCallback((type: string | null) => {
    setProjectType(type);
    // Clear platforms when changing type
    setPlatforms([]);
  }, []);

  const handlePlatformToggle = useCallback((platform: string) => {
    setPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((item) => item !== platform) : [...prev, platform]
    );
  }, []);

  const handleAddImage = () => {
    const url = prompt("Enter image URL:");
    if (url && url.trim() && additionalImageUrls.length < 10) {
      setAdditionalImageUrls((prev) => [...prev, url.trim()]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setAdditionalImageUrls((prev) => prev.filter((_, i) => i !== index));
    if (selectedMediaIndex >= mediaItems.length - 1) {
      setSelectedMediaIndex(Math.max(0, selectedMediaIndex - 1));
    }
  };

  const handleAddVideo = () => {
    const url = prompt("Enter video URL (MP4/WebM or YouTube):");
    if (url && url.trim() && additionalVideoUrls.length < 5) {
      setAdditionalVideoUrls((prev) => [...prev, url.trim()]);
    }
  };

  const handleRemoveVideo = (index: number) => {
    setAdditionalVideoUrls((prev) => prev.filter((_, i) => i !== index));
    if (selectedMediaIndex >= mediaItems.length - 1) {
      setSelectedMediaIndex(Math.max(0, selectedMediaIndex - 1));
    }
  };

  const handleSave = async () => {
    if (!name || !description || !githubRepo || !projectType || platforms.length === 0) {
      setMessage("Please fill in all required fields, including project type and at least one platform");
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("Error: You must be logged in");
        setSubmitting(false);
        return;
      }

      const response = await fetch("/api/projects", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: projectId,
          name,
          description,
          githubRepo,
          platforms: projectType ? [projectType, ...platforms].join(",") : platforms.join(","),
          mainImageUrl: mainImageUrl.trim() || undefined,
          additionalImageUrls: additionalImageUrls.map(url => url.trim()).filter(url => url),
          mainVideoUrl: mainVideoUrl.trim() || undefined,
          additionalVideoUrls: additionalVideoUrls.map(url => url.trim()).filter(url => url),
          githubDisplaySettings,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        let errorMessage = "Failed to update project";
        try {
          const errorData = JSON.parse(text);
          errorMessage = errorData.error || errorMessage;
        } catch {
          errorMessage = text || `Server error: ${response.status}`;
        }
        setMessage(`Error: ${errorMessage}`);
        setSubmitting(false);
        return;
      }

      const data = await response.json();

      if (data.ok) {
        setMessage("Project updated successfully! ✅");
        setTimeout(() => {
          router.push(`/explore/project/${projectId}?from=yourprojects`);
        }, 1500);
      } else {
        setMessage(`Error: ${data.error || "Unknown error"}`);
        setSubmitting(false);
      }
    } catch (error) {
      console.error("Error updating project:", error);
      setMessage(`Error: ${error instanceof Error ? error.message : "An error occurred"}`);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen font-sans bg-background">
        <Navbar />
        <main className="pt-24 pb-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-large p-8 shadow-elevated">
              <p className="text-gray-500 text-center">Loading project...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen font-sans bg-background">
        <Navbar />
        <main className="pt-24 pb-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-large p-8 shadow-elevated">
              <p className="text-red-500 text-center mb-4">{error || "Project not found"}</p>
              <div className="text-center">
                <button
                  onClick={() => router.push("/yourprojects")}
                  className="text-accent hover:text-primary-hover font-medium"
                >
                  ← Back to Your Projects
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const githubUrl = githubRepo.startsWith("http")
    ? githubRepo
    : `https://github.com/${githubRepo}`;

  return (
    <div className="min-h-screen font-sans bg-background">
      <Navbar />
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Link href="/yourprojects" className="hover:text-accent transition-colors text-gray-700">
                Your Projects
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-black font-medium">Edit: {name || project.name}</span>
            </div>
          </div>

          {message && (
            <div
              className={`mb-6 p-4 rounded-base border-2 flex items-center gap-3 ${
                message.includes("✅") || message.includes("success")
                  ? "bg-green-50 text-green-800 border-green-200"
                  : "bg-red-50 text-red-800 border-red-200"
              }`}
            >
              <div
                className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                  message.includes("✅") || message.includes("success") ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {message.includes("✅") || message.includes("success") ? (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <p className="text-sm font-medium">{message}</p>
            </div>
          )}

          {/* Two Column Layout - Same as Detail Page */}
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
            {/* Left column with media */}
            <div className="space-y-4">
              {/* Main media player */}
              <div className="bg-white rounded-large shadow-elevated overflow-hidden group relative">
                <div className="relative w-full bg-gray-200 rounded-large overflow-hidden" style={{ aspectRatio: "16 / 9" }}>
                  {mediaItems.length > 0 ? (
                    <div className="relative w-full h-full overflow-hidden">
                      <div
                        className="flex transition-transform duration-500 ease-in-out h-full"
                        style={{
                          transform: `translateX(-${selectedMediaIndex * 100}%)`,
                        }}
                      >
                        {mediaItems.map((item, index) => (
                          <div
                            key={`${item.url}-${index}`}
                            className="relative shrink-0 w-full h-full"
                          >
                            {item.type === "image" ? (
                              <Image
                                src={item.url}
                                alt={`${name || project.name} - Image ${index + 1}`}
                                fill
                                className={`object-cover transition-transform duration-500 ${index === selectedMediaIndex ? "group-hover:scale-105" : ""}`}
                                priority={index === 0}
                              />
                            ) : item.type === "youtube" && item.embedUrl ? (
                              <iframe
                                src={item.embedUrl}
                                title={`${name || project.name} - Video ${index + 1}`}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                              />
                            ) : (
                              <video
                                src={item.url}
                                controls
                                className="w-full h-full object-cover bg-black"
                              />
                            )}
                            <button
                              onClick={() => {
                                if (item.origin === "image" && item.originIndex !== undefined) {
                                  handleRemoveImage(item.originIndex);
                                } else if (item.origin === "mainVideo") {
                                  setMainVideoUrl("");
                                  setSelectedMediaIndex(0);
                                } else if (item.origin === "additionalVideo" && item.originIndex !== undefined) {
                                  handleRemoveVideo(item.originIndex);
                                }
                              }}
                              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg z-10"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                      {mediaItems.length > 1 && (
                        <>
                          <button
                            onClick={() => handleMediaSelect(selectedMediaIndex === 0 ? mediaItems.length - 1 : selectedMediaIndex - 1)}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg text-gray-700 p-3 rounded-full z-10 transition-all hover:scale-110"
                            aria-label="Previous media"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleMediaSelect((selectedMediaIndex + 1) % mediaItems.length)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg text-gray-700 p-3 rounded-full z-10 transition-all hover:scale-110"
                            aria-label="Next media"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </>
                      )}
                      {/* Media editing buttons at bottom right */}
                      <div className="absolute bottom-4 right-4 z-20 flex gap-2">
                        <button
                          onClick={handleAddImage}
                          className="bg-accent text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-primary-hover transition-colors shadow-lg"
                        >
                          + Add Image
                        </button>
                        <button
                          onClick={handleAddVideo}
                          className="bg-gray-800 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-700 transition-colors shadow-lg"
                        >
                          + Add Video
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-200 relative">
                      <span className="text-gray-500">No media available</span>
                      <div className="absolute bottom-4 right-4 z-20 flex gap-2">
                        <button
                          onClick={handleAddImage}
                          className="bg-accent text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-primary-hover transition-colors shadow-lg"
                        >
                          + Add Image
                        </button>
                        <button
                          onClick={handleAddVideo}
                          className="bg-gray-800 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-700 transition-colors shadow-lg"
                        >
                          + Add Video
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Thumbnail strip */}
              {mediaItems.length > 0 && (
                <div className="relative bg-white rounded-large p-4 shadow-elevated">
                  <div
                    ref={thumbnailScrollRef}
                    className="flex gap-2 overflow-x-auto scrollbar-hide"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  >
                    {mediaItems.map((item, index) => (
                      <div
                        key={index}
                        className={`relative shrink-0 w-32 h-20 rounded-base overflow-hidden border-2 transition-all group ${
                          selectedMediaIndex === index
                            ? "border-accent"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <button
                          onClick={() => handleMediaSelect(index)}
                          className="relative w-full h-full"
                        >
                          {item.type === "image" ? (
                            <Image
                              src={item.url}
                              alt={`Thumbnail ${index + 1}`}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                          ) : item.type === "youtube" && item.thumbUrl ? (
                            <div className="w-full h-full relative">
                              <Image
                                src={item.thumbUrl}
                                alt={`Thumbnail ${index + 1}`}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="bg-black/60 text-white rounded-full p-2">
                                  ▶
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="w-full h-full bg-black flex items-center justify-center text-white text-sm">
                              Video {index + 1}
                            </div>
                          )}
                        </button>
                        <button
                          onClick={() => {
                            if (item.origin === "image" && item.originIndex !== undefined) {
                              handleRemoveImage(item.originIndex);
                            } else if (item.origin === "mainVideo") {
                              setMainVideoUrl("");
                              setSelectedMediaIndex(0);
                            } else if (item.origin === "additionalVideo" && item.originIndex !== undefined) {
                              handleRemoveVideo(item.originIndex);
                            }
                          }}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors shadow-lg z-10 opacity-0 group-hover:opacity-100"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Comments */}
              {project?._id && <CommentsSection projectId={project._id} />}
            </div>

            {/* Right column info */}
            <div className="bg-white rounded-large shadow-elevated p-6">
              <div className="space-y-6">
                {/* Logo Above Title */}
                <div className="relative w-full">
                  {logo ? (
                    <div className="relative w-full bg-gray-200 rounded-base overflow-hidden group mb-2" style={{ aspectRatio: "16 / 9" }}>
                      <Image
                        src={logo}
                        alt={`${name || project.name} logo`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : null}
                  <input
                    type="url"
                    value={mainImageUrl}
                    onChange={(e) => setMainImageUrl(e.target.value)}
                    placeholder="Logo URL (optional)"
                    className="w-full px-3 py-2 border-2 border-accent rounded-base text-sm text-black focus:outline-none focus:ring-2 focus:ring-accent/20"
                  />
                </div>

                {/* Main Video & Additional Videos */}
                <div className="space-y-3">
                  <div>
                    <label className="text-xs uppercase text-gray-600 font-semibold">Main Video URL (optional)</label>
                    <input
                      type="url"
                      value={mainVideoUrl}
                      onChange={(e) => setMainVideoUrl(e.target.value)}
                      placeholder="https://youtu.be/... or https://example.com/video.mp4"
                      className="mt-1 w-full px-3 py-2 border-2 border-gray-200 rounded-base text-sm text-black focus:outline-none focus:ring-2 focus:ring-accent/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs uppercase text-gray-600 font-semibold">Additional Videos</label>
                      <button
                        type="button"
                        onClick={handleAddVideo}
                        className="px-3 py-1 bg-gray-900 text-white rounded-full text-xs font-semibold hover:bg-gray-700 transition-colors"
                      >
                        + Add Video
                      </button>
                    </div>
                    {additionalVideoUrls.length === 0 ? (
                      <p className="text-xs text-gray-500">No videos added yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {additionalVideoUrls.map((url, idx) => (
                          <div key={url + idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded-base border">
                            <span className="text-xs text-gray-700 truncate flex-1">{url}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveVideo(idx)}
                              className="px-2 py-1 text-xs bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Title - Always Editable */}
                <div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-3xl font-bold text-black border-2 border-accent rounded-base px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/20"
                  />
                </div>

                {/* Description - Always Editable */}
                <div>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full text-black leading-relaxed text-sm border-2 border-accent rounded-base px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/20 resize-none"
                    rows={4}
                  />
                </div>

                {/* Metadata Section */}
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  {/* User Info - Not editable */}
                  {project.userId?.username && (
                    <div>
                      <div className="text-accent font-medium mb-2 text-xs uppercase tracking-wide">Created by</div>
                      <Link
                        href={`/user/${project.userId.username}`}
                        className="flex items-center gap-3 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors group"
                      >
                        {project.userId.profileImage ? (
                          <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                            <Image
                              src={project.userId.profileImage}
                              alt={project.userId.username}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-primary-hover flex items-center justify-center shrink-0">
                            <span className="text-sm font-bold text-white">
                              {project.userId.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <span className="text-sm font-medium text-gray-900 group-hover:text-accent transition-colors">
                          {project.userId.username}
                        </span>
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-accent transition-colors ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  )}

                  {/* Release Date - Not editable */}
                  <div>
                    <div className="text-accent font-medium mb-2 text-xs uppercase tracking-wide">Release Date</div>
                    <div className="text-gray-700 text-sm">
                      {(() => {
                        const date = new Date(project.createdAt);
                        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                        return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
                      })()}
                    </div>
                  </div>

                  {/* Platforms - Always Editable */}
                  <div className="border-t border-gray-200 pt-4 -mx-6 px-6">
                    <PlatformsSection
                      platforms={platforms}
                      loading={submitting}
                      onTogglePlatform={handlePlatformToggle}
                      projectType={projectType}
                      onProjectTypeChange={handleProjectTypeChange}
                    />
                  </div>

                  {/* GitHub Repo - Always Editable */}
                  <div>
                    <div className="text-accent font-medium mb-2 text-xs uppercase tracking-wide">GitHub Repository</div>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={githubUsername}
                        onChange={(e) => setGithubUsername(e.target.value)}
                        placeholder="GitHub username"
                        className="w-full px-3 py-2 border-2 border-accent rounded-base text-sm text-black focus:outline-none focus:ring-2 focus:ring-accent/20"
                      />
                      <select
                        value={githubRepo}
                        onChange={(e) => setGithubRepo(e.target.value)}
                        className="w-full px-3 py-2 border-2 border-accent rounded-base text-sm text-black focus:outline-none focus:ring-2 focus:ring-accent/20"
                        disabled={loadingRepos}
                      >
                        <option value="">Select repository</option>
                        {repos.map((repo) => (
                          <option key={repo.id} value={repo.htmlUrl}>
                            {repo.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* GitHub Display Settings - Always Editable */}
                  <div>
                    <div className="text-accent font-medium mb-2 text-xs uppercase tracking-wide">GitHub Display Settings</div>
                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-gray-700 mb-1">Active Status</label>
                        <select
                          value={githubDisplaySettings.activeStatus}
                          onChange={(e) => setGithubDisplaySettings({ ...githubDisplaySettings, activeStatus: e.target.value as ActiveStatusMode })}
                          className="w-full px-2 py-1 border-2 border-accent rounded-base text-xs text-black focus:outline-none focus:ring-2 focus:ring-accent/20"
                        >
                          <option value="auto">Auto</option>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="hide">Hide</option>
                        </select>
                      </div>
                      {(["contributors", "stars", "forks", "language"] as const).map((key) => (
                        <div key={key} className="flex items-center justify-between">
                          <label className="text-gray-700 capitalize">{key}</label>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={githubDisplaySettings[key] === "auto"}
                              onChange={() => setGithubDisplaySettings({ ...githubDisplaySettings, [key]: githubDisplaySettings[key] === "auto" ? "hide" : "auto" })}
                              className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 pt-4 border-t border-gray-200">
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-gray-200 hover:bg-gray-300 text-black px-6 py-3 rounded-full text-center font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    View on GitHub
                  </a>
                  <div className="flex gap-3">
                    <button
                      onClick={handleSave}
                      disabled={submitting || !projectType || platforms.length === 0}
                      className="flex-1 bg-accent hover:bg-primary-hover text-white px-6 py-3 rounded-full text-center font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4" />
                            <path className="opacity-75" d="M4 12a8 8 0 018-8" strokeWidth="4" strokeLinecap="round" />
                          </svg>
                          Saving...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Save Changes
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => router.push("/yourprojects")}
                      disabled={submitting}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-black px-6 py-3 rounded-full text-center font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
