"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../../../components/Navbar";
import CommentsSection from "../../../components/CommentsSection";
import { GitHubRepo } from "../../add-project/types";
import { GitHubDisplaySettings, DEFAULT_GITHUB_SETTINGS } from "../../add-project/components/GitHubDisplaySettingsSection";

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

const platformIcons: Record<string, React.ReactElement> = {
  windows: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 12V6.75l6-1.32v6.48L3 12zm17-9v8.75l-10 .15V5.21L20 3zM3 13l6 .09v6.81l-6-1.15V13zm17 .25V22l-10-1.8v-7.45l10 .15z" />
    </svg>
  ),
  macos: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  ),
  web: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  linux: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.424.424 0 0 0-.11.135c-.26.204-.45.462-.663.773-.722 1.077-1.262 2.137-1.262 3.647 0 3.343 3.392 5.76 8.527 5.76 5.036 0 8.614-2.358 8.614-5.726 0-1.41-.45-2.468-1.192-3.533a3.76 3.76 0 0 0-.663-.792.416.416 0 0 0-.134-.09c.152-.741.06-1.539-.189-2.306-.603-1.678-1.876-3.296-2.732-4.431-.765-1.002-1.083-1.822-1.175-2.863-.065-1.415.505-5.001-3.357-6.298A3.022 3.022 0 0 0 12.504 0zm-.002 1.111c.104 0 .21.003.318.008 2.617.206 2.193 2.96 2.259 3.999.061.968.303 1.58.774 2.216.69.94 1.586 2.1 2.127 3.636.256.736.36 1.509.28 2.25-.04.37-.12.72-.22 1.04-.08.25-.17.48-.27.7-.1.22-.2.43-.31.63-.11.2-.22.38-.33.56-.11.18-.22.35-.33.51-.11.16-.21.31-.31.45-.1.14-.19.27-.27.39-.08.12-.15.23-.21.33-.06.1-.11.18-.15.25-.04.07-.07.12-.09.16-.02.04-.03.06-.03.07 0 .01.01.03.03.07.02.04.05.09.09.16.04.07.09.15.15.25.06.1.13.21.21.33.08.12.17.25.27.39.1.14.2.29.31.45.11.16.22.33.33.51.11.18.22.36.33.56.11.2.21.41.31.63.1.22.19.45.27.7.1.32.18.67.22 1.04.08.74-.02 1.51-.28 2.25-.54 1.54-1.437 2.7-2.127 3.636-.471.636-.713 1.248-.774 2.216-.066 1.039-.358 3.793-2.26 3.999a3.02 3.02 0 0 1-.316.008c-.104 0-.21-.003-.318-.008-2.617-.206-2.193-2.96-2.259-3.999-.061-.968-.303-1.58-.774-2.216-.69-.94-1.586-2.1-2.127-3.636-.256-.736-.36-1.509-.28-2.25.04-.37.12-.72.22-1.04.08-.25.17-.48.27-.7.1-.22.2-.43.31-.63.11-.2.22-.38.33-.56.11.18.22.35.33.51.11.16.21.31.31.45.1.14.19.27.27.39.08.12.15.23.21.33.06.1.11.18.15.25.04.07.07.12.09.16.02.04.03.06.03.07 0 .01-.01.03-.03.07-.02.04-.05.09-.09.16-.04.07-.09.15-.15.25-.06.1-.13.21-.21.33-.08.12-.17.25-.27.39-.1.14-.2.29-.31.45-.11.16-.22.33-.33.51-.11.18-.22.36-.33.56-.11.2-.21.41-.31.63-.1.22-.19.45-.27.7-.1.32-.18.67-.22 1.04-.08.74.02-1.51.28-2.25.54-1.54 1.437-2.7 2.127-3.636.471-.636.713-1.248.774-2.216.066-1.039.358-3.793 2.26-3.999a3.02 3.02 0 0 1 .316-.008z" />
    </svg>
  ),
};

const DESKTOP_PLATFORMS = ["windows", "macos", "linux"];
const TYPE_PLATFORMS = ["web", "game", "app"];

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
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [mainImageUrl, setMainImageUrl] = useState("");
  const [additionalImageUrls, setAdditionalImageUrls] = useState<string[]>([]);
  const [githubDisplaySettings, setGithubDisplaySettings] = useState<GitHubDisplaySettings>(DEFAULT_GITHUB_SETTINGS);
  
  // UI state
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("right");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [githubUsername, setGithubUsername] = useState("");
  
  const thumbnailScrollRef = useRef<HTMLDivElement>(null);
  const carouselIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const logo = mainImageUrl || null;
  const images = additionalImageUrls.length > 0 ? additionalImageUrls : [];

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
          setPlatforms(projectData.platforms || []);
          
          if (projectData.image) {
            setMainImageUrl(projectData.image);
          }
          
          if (projectData.images && projectData.images.length > 0) {
            setAdditionalImageUrls(projectData.images);
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
    if (images.length <= 1) return;
    if (carouselIntervalRef.current) {
      clearInterval(carouselIntervalRef.current);
    }
    const interval = setInterval(() => {
      setSelectedImageIndex((prevIndex) => {
        setSlideDirection("right");
        return (prevIndex + 1) % images.length;
      });
    }, 5000);
    carouselIntervalRef.current = interval;
    return () => {
      if (carouselIntervalRef.current) {
        clearInterval(carouselIntervalRef.current);
      }
    };
  }, [images.length]);

  const handleImageSelect = (index: number) => {
    if (index > selectedImageIndex) {
      setSlideDirection("right");
    } else if (index < selectedImageIndex) {
      setSlideDirection("left");
    }
    setSelectedImageIndex(index);
    if (carouselIntervalRef.current) {
      clearInterval(carouselIntervalRef.current);
    }
    if (images.length > 1) {
      const interval = setInterval(() => {
        setSelectedImageIndex((prevIndex) => {
          setSlideDirection("right");
          return (prevIndex + 1) % images.length;
        });
      }, 5000);
      carouselIntervalRef.current = interval;
    }
  };

  const handlePreviousImage = () => {
    if (images.length <= 1) return;
    const newIndex = selectedImageIndex === 0 ? images.length - 1 : selectedImageIndex - 1;
    setSlideDirection("left");
    handleImageSelect(newIndex);
  };

  const handleNextImage = () => {
    if (images.length <= 1) return;
    const newIndex = (selectedImageIndex + 1) % images.length;
    setSlideDirection("right");
    handleImageSelect(newIndex);
  };

  const handlePlatformToggle = (platform: string) => {
    setPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((item) => item !== platform) : [...prev, platform]
    );
  };

  const handleAddImage = () => {
    const url = prompt("Enter image URL:");
    if (url && url.trim() && additionalImageUrls.length < 10) {
      setAdditionalImageUrls((prev) => [...prev, url.trim()]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setAdditionalImageUrls((prev) => prev.filter((_, i) => i !== index));
    if (selectedImageIndex >= additionalImageUrls.length - 1) {
      setSelectedImageIndex(Math.max(0, selectedImageIndex - 1));
    }
  };

  const handleSave = async () => {
    if (!name || !description || !githubRepo || platforms.length === 0) {
      setMessage("Please fill in all required fields");
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
          platforms: platforms.join(","),
          mainImageUrl: mainImageUrl.trim() || undefined,
          additionalImageUrls: additionalImageUrls.map(url => url.trim()).filter(url => url),
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
                  {images.length > 0 ? (
                    <div className="relative w-full h-full overflow-hidden">
                      <div
                        className="flex transition-transform duration-500 ease-in-out h-full"
                        style={{
                          transform: `translateX(-${selectedImageIndex * 100}%)`,
                        }}
                      >
                        {images.map((img, index) => (
                          <div
                            key={`${img}-${index}`}
                            className="relative shrink-0 w-full h-full"
                          >
                            <Image
                              src={img}
                              alt={`${name || project.name} - Image ${index + 1}`}
                              fill
                              className={`object-cover transition-transform duration-500 ${index === selectedImageIndex ? "group-hover:scale-105" : ""}`}
                              priority={index === 0}
                            />
                            <button
                              onClick={() => handleRemoveImage(index)}
                              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg z-10"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                      {images.length > 1 && (
                        <>
                          <button
                            onClick={handlePreviousImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg text-gray-700 p-3 rounded-full z-10 transition-all hover:scale-110"
                            aria-label="Previous image"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          <button
                            onClick={handleNextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg text-gray-700 p-3 rounded-full z-10 transition-all hover:scale-110"
                            aria-label="Next image"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </>
                      )}
                      {/* Image editing buttons at bottom right */}
                      <div className="absolute bottom-4 right-4 z-20 flex gap-2">
                        <button
                          onClick={handleAddImage}
                          className="bg-accent text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-primary-hover transition-colors shadow-lg"
                        >
                          + Add Image
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-200 relative">
                      <span className="text-gray-500">No image available</span>
                      {/* Image editing buttons at bottom right */}
                      <div className="absolute bottom-4 right-4 z-20">
                        <button
                          onClick={handleAddImage}
                          className="bg-accent text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-primary-hover transition-colors shadow-lg"
                        >
                          + Add Image
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Thumbnail strip */}
              {images.length > 0 && (
                <div className="relative bg-white rounded-large p-4 shadow-elevated">
                  <div
                    ref={thumbnailScrollRef}
                    className="flex gap-2 overflow-x-auto scrollbar-hide"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  >
                    {images.map((img, index) => (
                      <div
                        key={index}
                        className={`relative shrink-0 w-32 h-20 rounded-base overflow-hidden border-2 transition-all group ${
                          selectedImageIndex === index
                            ? "border-accent"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <button
                          onClick={() => handleImageSelect(index)}
                          className="relative w-full h-full"
                        >
                          <Image
                            src={img}
                            alt={`Thumbnail ${index + 1}`}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        </button>
                        <button
                          onClick={() => handleRemoveImage(index)}
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
                <div className="relative w-full max-w-32 mx-auto">
                  {logo ? (
                    <div className="relative w-full bg-gray-200 rounded-base overflow-hidden group" style={{ aspectRatio: "1 / 1" }}>
                      <Image
                        src={logo}
                        alt={`${name || project.name} logo`}
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : null}
                  <input
                    type="url"
                    value={mainImageUrl}
                    onChange={(e) => setMainImageUrl(e.target.value)}
                    placeholder="Logo URL (optional)"
                    className="w-full mt-2 px-3 py-2 border-2 border-accent rounded-base text-sm text-black focus:outline-none focus:ring-2 focus:ring-accent/20"
                  />
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
                  <div>
                    <div className="text-accent font-medium mb-2 text-xs uppercase tracking-wide">Platforms</div>
                    <div className="space-y-4">
                      <div>
                        <div className="text-xs text-gray-600 mb-2">Desktop Platforms</div>
                        <div className="flex flex-wrap gap-2">
                          {DESKTOP_PLATFORMS.map((platform) => (
                            <button
                              key={platform}
                              onClick={() => handlePlatformToggle(platform)}
                              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs capitalize transition-colors ${
                                platforms.includes(platform)
                                  ? "bg-accent text-white"
                                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                              }`}
                            >
                              {platformIcons[platform]}
                              {platform === "macos" ? "macOS" : platform}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600 mb-2">Type</div>
                        <div className="flex flex-wrap gap-2">
                          {TYPE_PLATFORMS.map((platform) => (
                            <button
                              key={platform}
                              onClick={() => handlePlatformToggle(platform)}
                              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs capitalize transition-colors ${
                                platforms.includes(platform)
                                  ? "bg-accent text-white"
                                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                              }`}
                            >
                              {platformIcons[platform] || (
                                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                                  <circle cx="12" cy="12" r="10" />
                                </svg>
                              )}
                              {platform}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
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
                      disabled={submitting || platforms.length === 0}
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
