"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import Link from "next/link";
import Image from "next/image";

type ActiveStatusMode = "auto" | "active" | "inactive" | "hide";
type DisplayMode = "auto" | "hide";

interface GitHubDisplaySettings {
  activeStatus: ActiveStatusMode;
  contributors: DisplayMode;
  stars: DisplayMode;
  forks: DisplayMode;
  language: DisplayMode;
}

const DEFAULT_SETTINGS: GitHubDisplaySettings = {
  activeStatus: "auto",
  contributors: "auto",
  stars: "auto",
  forks: "auto",
  language: "auto",
};

interface Project {
  _id: string;
  name: string;
  description: string;
  githubRepo: string;
  platforms: string[];
  image?: string;
  images?: string[];
  githubDisplaySettings?: GitHubDisplaySettings;
  createdAt: string;
  updatedAt: string;
}

interface GitHubContributor {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
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

export default function ProjectDetail() {
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);
  
  // Get settings from project or use defaults
  const settings: GitHubDisplaySettings = project?.githubDisplaySettings 
    ? { ...DEFAULT_SETTINGS, ...project.githubDisplaySettings }
    : DEFAULT_SETTINGS;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("right");
  const [contributors, setContributors] = useState<{
    id: number;
    login: string;
    avatar_url: string;
    html_url: string;
    contributions: number;
  }[]>([]);
  const [contributorsLoading, setContributorsLoading] = useState(false);
  const [contributorsError, setContributorsError] = useState<string | null>(null);

  // NEW: single repo metadata (cached 20 min)
  const [repoInfo, setRepoInfo] = useState<null | {
    id: number;
    stargazers_count: number;
    forks_count: number;
    language: string | null;
    updated_at: string;
    homepage?: string | null;
    html_url: string;
  }>(null);
  const [repoLoading, setRepoLoading] = useState(false);
  const [repoError, setRepoError] = useState<string | null>(null);
  const thumbnailScrollRef = useRef<HTMLDivElement>(null);
  const carouselIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Logo is stored separately in image field, subimages are in images array
  const logo = project?.image || null;
  const images = project?.images && project.images.length > 0 ? project.images : [];

  const parseRepo = (input: string) => {
    const raw = input.trim();
    if (!raw) return null;
    if (raw.startsWith("http")) {
      try {
        const u = new URL(raw);
        const parts = u.pathname.split("/").filter(Boolean);
        if (parts.length >= 2) return { owner: parts[0], repo: parts[1] };
      } catch { }
    }
    const parts = raw.split("/").filter(Boolean);
    if (parts.length >= 2) return { owner: parts[0], repo: parts[1] };
    return null;
  };

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication required");
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/projects?id=${params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.ok) {
          setProject(data.data);
        } else {
          setError(data.error || "Project not found");
        }
      } catch (err) {
        console.error("Error fetching project:", err);
        setError("Failed to load project");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProject();
    }
  }, [params.id]);

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    if (images.length <= 1) return;

    // Clear any existing interval
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

  // Reset carousel timer when user manually selects an image
  const handleImageSelect = (index: number) => {
    // Determine slide direction
    if (index > selectedImageIndex) {
      setSlideDirection("right");
    } else if (index < selectedImageIndex) {
      setSlideDirection("left");
    }
    setSelectedImageIndex(index);
    // Reset the carousel timer
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

  const scrollThumbnails = (direction: "left" | "right") => {
    if (thumbnailScrollRef.current) {
      const scrollAmount = 200;
      thumbnailScrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
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

  useEffect(() => {
    // Only fetch contributors if settings allow it
    if (settings.contributors !== "auto") {
      setContributors([]);
      return;
    }

    if (!project?.githubRepo) return;
    const parsed = parseRepo(project.githubRepo);
    if (!parsed) return;

    const { owner, repo } = parsed;
    const storageKey = `contributors:${owner}/${repo}`;
    const ttlMs = 20 * 60 * 1000; // 20 minutes

    const now = Date.now();
    try {
      const cachedRaw = localStorage.getItem(storageKey);
      if (cachedRaw) {
        const cached = JSON.parse(cachedRaw);
        if (cached.timestamp && now - cached.timestamp < ttlMs && Array.isArray(cached.data)) {
          setContributors(cached.data);
          return;
        }
      }
    } catch { }

    const fetchContributors = async () => {
      setContributorsLoading(true);
      setContributorsError(null);
      try {
        const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contributors?per_page=10`);
        if (!res.ok) {
          throw new Error(`GitHub error ${res.status}`);
        }
        const data = await res.json();
        const simplified = (Array.isArray(data) ? data : []).map((c: GitHubContributor) => ({
          id: c.id,
          login: c.login,
          avatar_url: c.avatar_url,
          html_url: c.html_url,
          contributions: c.contributions,
        }));
        setContributors(simplified);
        try {
          localStorage.setItem(
            storageKey,
            JSON.stringify({ timestamp: now, data: simplified })
          );
        } catch { }
      } catch (e: unknown) {
        setContributorsError(e instanceof Error ? e.message : "Failed to load contributors");
      } finally {
        setContributorsLoading(false);
      }
    };

    fetchContributors();
  }, [project?.githubRepo, settings.contributors]);

  // NEW: fetch repo metadata (stars, forks, language, active status)
  // Only fetch if any of the settings require it
  useEffect(() => {
    const needsRepoInfo = 
      settings.activeStatus === "auto" ||
      settings.stars === "auto" ||
      settings.forks === "auto" ||
      settings.language === "auto";

    if (!needsRepoInfo) {
      setRepoInfo(null);
      return;
    }

    if (!project?.githubRepo) return;
    const parsed = parseRepo(project.githubRepo);
    if (!parsed) return;

    const { owner, repo } = parsed;
    const storageKey = `repoInfo:${owner}/${repo}`;
    const ttlMs = 20 * 60 * 1000; // 20 minutes
    const now = Date.now();

    try {
      const cachedRaw = localStorage.getItem(storageKey);
      if (cachedRaw) {
        const cached = JSON.parse(cachedRaw);
        if (cached.timestamp && now - cached.timestamp < ttlMs && cached.data) {
          setRepoInfo(cached.data);
          return;
        }
      }
    } catch { }

    (async () => {
      setRepoLoading(true);
      setRepoError(null);
      try {
        const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
        if (!res.ok) throw new Error(`GitHub error ${res.status}`);
        const data = await res.json();
        const simplified = {
          id: data.id,
          stargazers_count: data.stargazers_count,
          forks_count: data.forks_count,
          language: data.language,
          updated_at: data.updated_at,
          homepage: data.homepage,
          html_url: data.html_url,
        };
        setRepoInfo(simplified);
        try {
          localStorage.setItem(storageKey, JSON.stringify({ timestamp: now, data: simplified }));
        } catch { }
      } catch (e: unknown) {
        setRepoError(e instanceof Error ? e.message : "Failed to load repository info");
      } finally {
        setRepoLoading(false);
      }
    })();
  }, [project?.githubRepo, settings.activeStatus, settings.stars, settings.forks, settings.language]);

  if (loading) {
    return (
      <div className="min-h-screen font-sans bg-white">
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
      <div className="min-h-screen font-sans bg-white">
        <Navbar />
        <main className="pt-24 pb-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-large p-8 shadow-elevated">
              <p className="text-red-600 text-center">{error || "Project not found"}</p>
              <div className="mt-4 text-center">
                <Link
                  href="/profile"
                  className="text-accent hover:text-primary-hover font-medium"
                >
                  ← Back to Profile
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const githubUrl = project.githubRepo.startsWith("http")
    ? project.githubRepo
    : `https://github.com/${project.githubRepo}`;

  return (
    <div className="min-h-screen font-sans bg-white">
      <Navbar />
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Link href="/profile" className="hover:text-accent transition-colors text-gray-700">
                Profile
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-black font-medium">{project.name}</span>
            </div>
          </div>

          {/* Two Column Layout - Steam Style */}
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
            {/* Left Column - Media Player */}
            <div className="space-y-4">
              {/* Main Media Player */}
              <div className="bg-white rounded-large shadow-elevated overflow-hidden group">
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
                              alt={`${project.name} - Image ${index + 1}`}
                              fill
                              className={`object-cover transition-transform duration-500 ${index === selectedImageIndex ? "group-hover:scale-105" : ""
                                }`}
                              priority={index === 0}
                            />
                          </div>
                        ))}
                      </div>
                      {/* Navigation Arrows */}
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
                    </div>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-200">
                      <span className="text-gray-500">No image available</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Thumbnail Strip */}
              {images.length > 1 && (
                <div className="relative bg-white rounded-large p-4 shadow-elevated">
                  <div
                    ref={thumbnailScrollRef}
                    className="flex gap-2 overflow-x-auto scrollbar-hide"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  >
                    {images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => handleImageSelect(index)}
                        className={`relative shrink-0 w-32 h-20 rounded-base overflow-hidden border-2 transition-all group ${selectedImageIndex === index
                            ? "border-accent"
                            : "border-gray-300 hover:border-gray-400"
                          }`}
                      >
                        <Image
                          src={img}
                          alt={`Thumbnail ${index + 1}`}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </button>
                    ))}
                  </div>
                  {images.length > 4 && (
                    <>
                      <button
                        onClick={() => scrollThumbnails("left")}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg text-gray-700 p-2 rounded-full z-10"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => scrollThumbnails("right")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg text-gray-700 p-2 rounded-full z-10"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Right Column - Information Panel (Single Card) */}
            <div className="bg-white rounded-large shadow-elevated p-6">
              <div className="space-y-6">
                {/* Logo Above Title */}
                {logo && (
                  <div className="relative w-full max-w-32 mx-auto bg-gray-200 rounded-base overflow-hidden" style={{ aspectRatio: "1 / 1" }}>
                    <Image
                      src={logo}
                      alt={`${project.name} logo`}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}

                {/* Title */}
                <div>
                  <h1 className="text-3xl font-bold text-black mb-4">{project.name}</h1>
                </div>

                {/* Description */}
                <div>
                  <p className="text-gray-600 leading-relaxed text-sm">{project.description}</p>
                </div>

                {/* Metadata Section */}
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <div>
                    <div className="text-accent font-medium mb-2 text-xs uppercase tracking-wide">Release Date</div>
                    <div className="text-gray-700 text-sm">
                      {new Date(project.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                  <div>
                    <div className="text-accent font-medium mb-2 text-xs uppercase tracking-wide">Platforms</div>
                    <div className="flex flex-wrap gap-2">
                      {project.platforms.map((platform) => (
                        <div
                          key={platform}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-xs capitalize transition-colors"
                        >
                          {platformIcons[platform] || (
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                              <circle cx="12" cy="12" r="10" />
                            </svg>
                          )}
                          {platform}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* GitHub Stats */}
                  {(settings.activeStatus !== "hide" ||
                    settings.language === "auto" ||
                    settings.stars === "auto" ||
                    settings.forks === "auto") && (
                    <div>
                      <div className="text-accent font-medium mb-2 text-xs uppercase tracking-wide">GitHub Stats</div>
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        {(settings.activeStatus === "auto" ||
                          settings.stars === "auto" ||
                          settings.forks === "auto" ||
                          settings.language === "auto") && (
                          <>
                            {repoLoading && <span className="text-gray-500">Loading repository info...</span>}
                            {repoError && <span className="text-red-500">{repoError}</span>}
                          </>
                        )}
                        {/* Active/Inactive Status */}
                        {settings.activeStatus !== "hide" && (() => {
                          if (settings.activeStatus === "auto" && repoInfo) {
                            const active =
                              Date.now() - new Date(repoInfo.updated_at).getTime() <
                              14 * 24 * 60 * 60 * 1000;
                            return (
                              <span
                                className={`px-2 py-1 rounded-full ${active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                  }`}
                              >
                                {active ? "Active" : "Inactive"}
                              </span>
                            );
                          } else if (settings.activeStatus === "active") {
                            return (
                              <span className="px-2 py-1 rounded-full bg-green-100 text-green-800">
                                Active
                              </span>
                            );
                          } else if (settings.activeStatus === "inactive") {
                            return (
                              <span className="px-2 py-1 rounded-full bg-red-100 text-red-800">
                                Inactive
                              </span>
                            );
                          }
                          return null;
                        })()}
                        {/* Language */}
                        {settings.language === "auto" && repoInfo?.language && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full">
                            {repoInfo.language}
                          </span>
                        )}
                        {/* Stars */}
                        {settings.stars === "auto" && repoInfo && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full">
                            ⭐ {repoInfo.stargazers_count}
                          </span>
                        )}
                        {/* Forks */}
                        {settings.forks === "auto" && repoInfo && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full">
                            🔄 {repoInfo.forks_count}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Contributors */}
                  {settings.contributors === "auto" && (
                    <div>
                      <div className="text-accent font-medium mb-2 text-xs uppercase tracking-wide">Top Contributors</div>
                      {contributorsLoading && (
                        <p className="text-xs text-gray-500">Loading contributors...</p>
                      )}
                      {contributorsError && (
                        <p className="text-xs text-red-500">{contributorsError}</p>
                      )}
                      {!contributorsLoading && !contributorsError && contributors.length === 0 && (
                        <p className="text-xs text-gray-400">No contributors found.</p>
                      )}
                      {contributors.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {contributors.map(c => (
                            <a
                              key={c.id}
                              href={c.html_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-xs transition-colors"
                              title={`${c.login} (${c.contributions} contributions)`}
                            >
                              <img
                                src={c.avatar_url}
                                alt={c.login}
                                className="w-5 h-5 rounded-full object-cover"
                              />
                              <span className="text-black">{c.login}</span>
                              <span className="text-gray-500">({c.contributions})</span>
                            </a>
                          ))}
                        </div>
                      )}
                      <p className="mt-2 text-[10px] text-gray-400">
                        Updated every 20 minutes.
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 pt-4 border-t border-gray-200">
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-accent hover:bg-primary-hover text-white px-6 py-3 rounded-full text-center font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    View on GitHub
                  </a>
                  <Link
                    href="/profile"
                    className="w-full bg-gray-200 hover:bg-gray-300 text-black px-6 py-3 rounded-full text-center font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Profile
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
