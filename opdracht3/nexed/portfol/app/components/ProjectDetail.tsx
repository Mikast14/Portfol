"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import CommentsSection from "./CommentsSection";
import { Lumanosimo } from "next/font/google";

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

interface GitHubContributor {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

const PROJECT_TYPES = ["game", "app", "website"];

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
  ios: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
    </svg>
  ),
  android: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4486.9993.9993.0001.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9993.4486.9993.9993 0 .5511-.4483.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1522l-2.0223 3.503C15.5902 8.2439 13.8533 7.8508 12 7.8508s-3.5902.3931-5.1349 1.2297L4.8429 5.5773a.4161.4161 0 00-.5676-.1522.4157.4157 0 00-.1521.5676l1.9973 3.4592C2.6889 11.186.8532 13.9527.8532 17.2679h22.2934c0-3.3152-1.8356-6.0819-4.7787-7.9465m-7.6807 2.5548c-2.9145 0-5.3275 2.3689-5.3275 5.2834s2.413 5.2834 5.3275 5.2834 5.3276-2.3689 5.3276-5.2834-2.4131-5.2834-5.3276-5.2834z"/>
    </svg>
  ),
  game: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <line x1="6" x2="10" y1="11" y2="11"/>
      <line x1="8" x2="8" y1="9" y2="13"/>
      <line x1="15" x2="15.01" y1="12" y2="12"/>
      <line x1="18" x2="18.01" y1="10" y2="10"/>
      <path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"/>
    </svg>
  ),
  app: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  ),
  website: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
  ),
  playstation: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.584 17.011c-.43.543-1.482.93-1.482.93l-7.833 2.817V18.68l5.764-2.057c.655-.234.755-.566.223-.74-.53-.175-1.491-.125-2.146.111l-3.84 1.354v-2.155l.22-.075s1.11-.394 2.671-.567c1.56-.172 3.472.024 4.972.593 1.69.535 1.88 1.323 1.451 1.866zm-8.57-3.537V8.162c0-.624-.114-1.198-.699-1.36-.447-.144-.725.272-.725.895V21l-3.584-1.139V4c1.524.283 3.744.953 4.937 1.355 3.035 1.043 4.064 2.342 4.064 5.267 0 2.851-1.758 3.932-3.992 2.852zm-11.583 4.99c-1.735-.49-2.024-1.51-1.233-2.097.731-.542 1.974-.95 1.974-.95l5.138-1.83v2.086l-3.697 1.325c-.653.234-.754.566-.223.74.531.175 1.493.125 2.147-.11l1.773-.644v1.865l-.353.06c-1.774.29-3.664.169-5.526-.445z"/>
    </svg>
  ),
  xbox: (
    <svg className="w-5 h-5" viewBox="0 0 32 32" fill="currentColor">
      <path d="M16 5.425c-1.888-1.125-4.106-1.922-6.473-2.249l-0.092-0.010c-0.070-0.005-0.152-0.008-0.234-0.008-0.613 0-1.188 0.16-1.687 0.441l0.017-0.009c2.357-1.634 5.277-2.61 8.426-2.61 0.008 0 0.016 0 0.024 0h0.019c0.005 0 0.011 0 0.018 0 3.157 0 6.086 0.976 8.501 2.642l-0.050-0.033c-0.478-0.272-1.051-0.433-1.662-0.433-0.085 0-0.169 0.003-0.252 0.009l0.011-0.001c-2.459 0.336-4.677 1.13-6.648 2.297l0.082-0.045zM5.554 5.268c-0.041 0.014-0.077 0.032-0.11 0.054l0.002-0.001c-2.758 2.723-4.466 6.504-4.466 10.684 0 3.584 1.256 6.875 3.353 9.457l-0.022-0.028c-1.754-3.261 4.48-12.455 7.61-16.159-3.53-3.521-5.277-4.062-6.015-4.062-0.010-0-0.021-0.001-0.032-0.001-0.115 0-0.225 0.021-0.326 0.060l0.006-0.002zM20.083 9.275c3.129 3.706 9.367 12.908 7.605 16.161 2.075-2.554 3.332-5.845 3.332-9.43 0-4.181-1.709-7.962-4.467-10.684l-0.002-0.002c-0.029-0.021-0.063-0.039-0.1-0.052l-0.003-0.001c-0.1-0.036-0.216-0.056-0.336-0.056-0.005 0-0.011 0-0.016 0h0.001c-0.741-0-2.485 0.543-6.014 4.063zM6.114 27.306c2.627 2.306 6.093 3.714 9.888 3.714s7.261-1.407 9.905-3.728l-0.017 0.015c2.349-2.393-5.402-10.901-9.89-14.29-4.483 3.39-12.24 11.897-9.886 14.29z"/>
    </svg>
  ),
  nintendo: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M8 4H5C2.79086 4 1 5.79086 1 8V16C1 18.2091 2.79086 20 5 20H8V4ZM4.5 10C5.32843 10 6 9.32843 6 8.5C6 7.67157 5.32843 7 4.5 7C3.67157 7 3 7.67157 3 8.5C3 9.32843 3.67157 10 4.5 10Z"/>
      <path d="M10 20H14V4H10V20Z"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M16 4V20H19C21.2091 20 23 18.2091 23 16V8C23 5.79086 21.2091 4 19 4H16ZM19.5 17C20.3284 17 21 16.3284 21 15.5C21 14.6716 20.3284 14 19.5 14C18.6716 14 18 14.6716 18 15.5C18 16.3284 18.6716 17 19.5 17Z"/>
    </svg>
  ),
};

interface ProjectDetailProps {
  projectId: string;
  from?: string;
  username?: string | null;
}

export default function ProjectDetail({ projectId, from, username }: ProjectDetailProps) {
  const { isAuthenticated, user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  
  const fromProfile = from === "profile";
  const fromYourProjects = from === "yourprojects";
  
  // Get settings from project or use defaults
  const settings: GitHubDisplaySettings = project?.githubDisplaySettings 
    ? { ...DEFAULT_SETTINGS, ...project.githubDisplaySettings }
    : DEFAULT_SETTINGS;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("right");
  const thumbnailScrollRef = useRef<HTMLDivElement>(null);
  const carouselIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [contributors, setContributors] = useState<{
    id: number;
    login: string;
    avatar_url: string;
    html_url: string;
    contributions: number;
  }[]>([]);
  const [contributorsLoading, setContributorsLoading] = useState(false);
  const [contributorsError, setContributorsError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);

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

  // NEW: languages state (cached 20 min)
  const [languages, setLanguages] = useState<{ name: string; bytes: number; percent: number }[]>([]);
  const [languagesLoading, setLanguagesLoading] = useState(false);
  const [languagesError, setLanguagesError] = useState<string | null>(null);

  // Language color map (fallback to deterministic HSL for unknown languages)
  const languageColors: Record<string, string> = {
    TypeScript: "#3178c6",
    JavaScript: "#f1e05a",
    Python: "#3572A5",
    Java: "#b07219",
    C: "#555555",
    "C#": "#178600",
    "C++": "#f34b7d",
    Go: "#00ADD8",
    Ruby: "#701516",
    PHP: "#4F5D95",
    Rust: "#dea584",
    Kotlin: "#A97BFF",
    Swift: "#F05138",
    Dart: "#00B4AB",
    Shell: "#89e051",
    HTML: "#e34c26",
    CSS: "#563d7c",
    SCSS: "#c6538c",
    SASS: "#a53b70",
    Vue: "#41b883",
    Svelte: "#ff3e00",
    Solidity: "#AA6746",
    Lua: "#000080",
  };
  const hash = (s: string) => {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
    return h;
  };
  const langColor = (lang: string) =>
    languageColors[lang] || `hsl(${Math.abs(hash(lang)) % 360} 70% 50%)`;

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
        const response = await fetch(`/api/projects?id=${projectId}`);
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

    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  // Check if project is bookmarked
  useEffect(() => {
    if (!isAuthenticated || !project?._id) return;

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
  }, [isAuthenticated, project?._id]);

  // Check if project is liked and get likes count
  useEffect(() => {
    if (!project?._id) {
      setLikesCount(project?.likes?.length || 0);
      return;
    }

    const checkLike = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLikesCount(project.likes?.length || 0);
          return;
        }

        const res = await fetch(`/api/projects/${project._id}/like`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (data.ok) {
          setIsLiked(data.data.isLiked);
          setLikesCount(data.data.likesCount);
        } else {
          setLikesCount(project.likes?.length || 0);
        }
      } catch (error) {
        console.error("Error checking like:", error);
        setLikesCount(project.likes?.length || 0);
      }
    };

    checkLike();
  }, [project?._id, project?.likes]);

  // Handle bookmark toggle
  const handleBookmark = async () => {
    if (!isAuthenticated || !project?._id) return;

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
  const handleLike = async () => {
    if (!isAuthenticated || !project?._id) return;

    // Don't allow users to like their own projects
    if (project.userId?._id && user?.id && project.userId._id.toString() === user.id) {
      return;
    }

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
        // Try API route first
        let res = await fetch(`/api/github/repo/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contributors?per_page=10`);     
        if (!res.ok) {
          // Fallback to direct GitHub API call
          const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
          const headers: HeadersInit = {
            "User-Agent": "PortfolApp",
            Accept: "application/vnd.github.v3+json",
          };
          if (GITHUB_TOKEN) {
            headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
          }
          
          res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contributors?per_page=10`, { headers });
          if (!res.ok) {
            throw new Error(`GitHub error ${res.status}`);
          }
          const githubData = await res.json();
          const simplified = (Array.isArray(githubData) ? githubData : []).map((c: GitHubContributor) => ({
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
          return;
        }
        
        const data = await res.json();
        if (!data.ok) {
          throw new Error(data.error || "Failed to load contributors");
        }
        const simplified = data.data;
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
        // Try API route first
        let res = await fetch(`/api/github/repo/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`);
        if (!res.ok) {
          // Fallback to direct GitHub API call
          const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
          const headers: HeadersInit = {
            "User-Agent": "PortfolApp",
            Accept: "application/vnd.github.v3+json",
          };
          if (GITHUB_TOKEN) {
            headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
          }
          
          res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
          if (!res.ok) {
            throw new Error(`GitHub error ${res.status}`);
          }
          const githubData = await res.json();
          const simplified = {
            id: githubData.id,
            stargazers_count: githubData.stargazers_count,
            forks_count: githubData.forks_count,
            language: githubData.language,
            updated_at: githubData.updated_at,
            homepage: githubData.homepage,
            html_url: githubData.html_url,
          };
          setRepoInfo(simplified);
          try {
            localStorage.setItem(storageKey, JSON.stringify({ timestamp: now, data: simplified }));
          } catch { }
          return;
        }
        
        const data = await res.json();
        if (!data.ok) {
          throw new Error(data.error || "Failed to load repository info");
        }
        const simplified = data.data;
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

  // NEW: fetch all repo languages and cache for 20 minutes
  useEffect(() => {
    if (settings.language !== "auto") {
      setLanguages([]);
      return;
    }
    if (!project?.githubRepo) return;

    const parsed = parseRepo(project.githubRepo);
    if (!parsed) return;

    const { owner, repo } = parsed;
    const storageKey = `repoLangs:${owner}/${repo}`;
    const ttlMs = 20 * 60 * 1000;
    const now = Date.now();

    try {
      const cachedRaw = localStorage.getItem(storageKey);
      if (cachedRaw) {
        const cached = JSON.parse(cachedRaw);
        if (cached.timestamp && now - cached.timestamp < ttlMs && cached.data) {
          setLanguages(cached.data);
          return;
        }
      }
    } catch {}

    (async () => {
      setLanguagesLoading(true);
      setLanguagesError(null);
      try {
        // Try API route first
        let res = await fetch(`/api/github/repo/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/languages`); 
        if (!res.ok) {
          // Fallback to direct GitHub API call
          const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
          const headers: HeadersInit = {
            "User-Agent": "PortfolApp",
            Accept: "application/vnd.github.v3+json",
          };
          if (GITHUB_TOKEN) {
            headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
          }
          
          res = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, { headers });
          if (!res.ok) {
            throw new Error(`GitHub error ${res.status}`);
          }
          const langs: Record<string, number> = await res.json();
          const total = Object.values(langs).reduce((a, b) => a + b, 0);
          const items = Object.entries(langs)
            .map(([name, bytes]) => ({
              name,
              bytes,
              percent: total > 0 ? (bytes / total) * 100 : 0,
            }))
            .sort((a, b) => b.bytes - a.bytes);
          setLanguages(items);
          try {
            localStorage.setItem(storageKey, JSON.stringify({ timestamp: now, data: items }));
          } catch {}
          return;
        }
        
        const data = await res.json();
        if (!data.ok) {
          throw new Error(data.error || "Failed to load languages");
        }
        const items = data.data;
        setLanguages(items);
        try {
          localStorage.setItem(storageKey, JSON.stringify({ timestamp: now, data: items }));
        } catch {}
      } catch (e: unknown) {
        setLanguagesError(e instanceof Error ? e.message : "Failed to load languages");
      } finally {
        setLanguagesLoading(false);
      }
    })();
  }, [project?.githubRepo, settings.language]);

  if (loading) {
    return (
      <div className="bg-white rounded-large p-8 shadow-elevated">
        <p className="text-gray-500 text-center">Loading project...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="bg-white rounded-large p-8 shadow-elevated">
        <p className="text-red-600 text-center">{error || "Project not found"}</p>
        <div className="mt-4 text-center">
          <Link
            href={
              fromYourProjects 
                ? "/yourprojects" 
                : fromProfile && username 
                ? `/user/${encodeURIComponent(username)}` 
                : "/explore"
            }
            className="text-accent hover:text-primary-hover font-medium"
          >
            ← {fromYourProjects 
              ? "Back to Your Projects" 
              : fromProfile && username 
              ? "Back to Profile" 
              : "Back to Explore"}
          </Link>
        </div>
      </div>
    );
  }

  const githubUrl = project.githubRepo.startsWith("http")
    ? project.githubRepo
    : `https://github.com/${project.githubRepo}`;

  return (
    <>
      {/* Breadcrumbs */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          {fromYourProjects ? (
            <Link href="/yourprojects" className="hover:text-accent transition-colors text-gray-700">
              Your Projects
            </Link>
          ) : fromProfile && username ? (
            <Link href={`/user/${encodeURIComponent(username)}`} className="hover:text-accent transition-colors text-gray-700">
              Profile
            </Link>
          ) : (
            <Link href="/explore" className="hover:text-accent transition-colors text-gray-700">
              Explore
            </Link>
          )}
          <span className="text-gray-400">/</span>
          <span className="text-black font-medium">{project.name}</span>
        </div>
      </div>

      {/* Two Column Layout - Steam Style */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        {/* Left column with media */}
        <div className="space-y-4">
          {/* Main media player */}
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

          {/* Thumbnail strip */}
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

          {/* Comments directly under images */}
          {project?._id && <CommentsSection projectId={project._id} />}
        </div>

        {/* Right column info */}
        <div className="bg-white rounded-large shadow-elevated p-6">
          <div className="space-y-6">
            {/* Logo Above Title */}
            {logo && (
              <div className="relative w-full bg-gray-200 rounded-base overflow-hidden" style={{ aspectRatio: "16 / 9" }}>
                <Image
                  src={logo}
                  alt={`${project.name} logo`}
                  fill
                  className="object-cover"
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

            {/* Platforms */}
            {project.platforms && project.platforms.length > 0 && (() => {
              // Filter out project types and get actual platforms
              const actualPlatforms = project.platforms.filter((p: string) => !PROJECT_TYPES.includes(p.toLowerCase()));
              const projectType = project.platforms.find((p: string) => PROJECT_TYPES.includes(p.toLowerCase()));
              
              if (actualPlatforms.length === 0 && !projectType) return null;
              
              return (
                <div>
                  <div className="text-accent font-medium mb-2 text-xs uppercase tracking-wide">Platforms</div>
                  <div className="flex flex-wrap gap-2">
                    {projectType && (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-accent/10 text-accent rounded-full text-xs font-medium capitalize">
                        {platformIcons[projectType] || (
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="12" cy="12" r="10" />
                          </svg>
                        )}
                        {projectType === "macos" ? "macOS" : projectType === "ios" ? "iOS" : projectType}
                      </span>
                    )}
                    {actualPlatforms.map((platform: string) => (
                      <span
                        key={platform}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-800 rounded-full text-xs font-medium capitalize"
                      >
                        {platformIcons[platform] || (
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="12" cy="12" r="10" />
                          </svg>
                        )}
                        {platform === "macos" ? "macOS" : platform === "ios" ? "iOS" : platform === "playstation" ? "PlayStation" : platform === "xbox" ? "Xbox" : platform === "nintendo" ? "Nintendo" : platform}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })()}

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
                      const repoUpdatedTime = new Date(repoInfo.updated_at).getTime();
                      const fourteenDaysAgo = Date.now() - (14 * 24 * 60 * 60 * 1000);
                      const active = repoUpdatedTime > fourteenDaysAgo;
                      return (
                        <span className={`px-2 py-1 rounded-full ${active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                          {active ? "Active" : "Inactive"}
                        </span>
                      );
                    } else if (settings.activeStatus === "active") {
                      return <span className="px-2 py-1 rounded-full bg-green-100 text-green-800">Active</span>;
                    } else if (settings.activeStatus === "inactive") {
                      return <span className="px-2 py-1 rounded-full bg-red-100 text-red-800">Inactive</span>;
                    }
                    return null;
                  })()}

                  {/* Stars */}
                  {settings.stars === "auto" && repoInfo && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full">⭐ {repoInfo.stargazers_count}</span>
                  )}

                  {/* Forks */}
                  {settings.forks === "auto" && repoInfo && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full">🔄 {repoInfo.forks_count}</span>
                  )}
                </div>

                {/* NEW: Language bar (all languages) */}
                {settings.language === "auto" && (
                  <div className="mt-3">
                    {languagesLoading && <p className="text-xs text-gray-500">Loading languages...</p>}
                    {languagesError && <p className="text-xs text-red-500">{languagesError}</p>}
                    {languages.length > 0 ? (
                      <>
                        <div className="w-full h-3 rounded-full overflow-hidden border border-gray-200">
                          <div className="flex w-full h-full">
                            {languages.map((l) => (
                              <div
                                key={l.name}
                                className="h-full"
                                style={{ width: `${l.percent}%`, backgroundColor: langColor(l.name) }}
                                title={`${l.name} ${Math.round(l.percent)}%`}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {languages.map((l) => (
                            <span key={l.name} className="inline-flex items-center gap-2 px-2 py-1 bg-gray-100 rounded-full text-xs">
                              <span
                                className="inline-block w-2 h-2 rounded-full"
                                style={{ backgroundColor: langColor(l.name) }}
                              />
                              <span className="text-gray-800">{l.name}</span>
                              <span className="text-gray-500">{Math.round(l.percent)}%</span>
                            </span>
                          ))}
                        </div>
                      </>
                    ) : (
                      // Fallback to primary language tag if languages API returns nothing
                      repoInfo?.language && (
                        <div className="mt-2">
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full">
                            {repoInfo.language}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                )}
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

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-4 border-t border-gray-200">
              {/* Like, Bookmark, and Edit buttons */}
              {isAuthenticated && (
                <div className="flex gap-3">
                  {project.userId?._id && user?.id && project.userId._id.toString() !== user.id && (
                    <button
                      onClick={handleLike}
                      disabled={likeLoading}
                      className={`flex-1 px-6 py-3 rounded-full text-center font-medium transition-colors flex items-center justify-center gap-2 ${
                        isLiked
                          ? "bg-accent hover:bg-primary-hover text-white"
                          : "bg-gray-200 hover:bg-gray-300 text-black"
                      } disabled:cursor-not-allowed disabled:opacity-70`}
                    >
                      {likeLoading ? (
                        <>
                          <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4" />
                            <path className="opacity-75" d="M4 12a8 8 0 018-8" strokeWidth="4" strokeLinecap="round" />
                          </svg>
                          {isLiked ? "Unliking..." : "Liking..."}
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-5 h-5"
                            fill={isLiked ? "currentColor" : "none"}
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                            />
                          </svg>
                          {isLiked ? `Liked (${likesCount})` : `Like (${likesCount})`}
                        </>
                      )}
                    </button>
                  )}
                  <button
                    onClick={handleBookmark}
                    disabled={bookmarkLoading}
                    className={`flex-1 px-6 py-3 rounded-full text-center font-medium transition-colors flex items-center justify-center gap-2 ${
                      isBookmarked
                        ? "bg-accent hover:bg-primary-hover text-white"
                        : "bg-gray-200 hover:bg-gray-300 text-black"
                    } disabled:cursor-not-allowed disabled:opacity-70`}
                  >
                    {bookmarkLoading ? (
                      <>
                        <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4" />
                          <path className="opacity-75" d="M4 12a8 8 0 018-8" strokeWidth="4" strokeLinecap="round" />
                        </svg>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5"
                          fill={isBookmarked ? "currentColor" : "none"}
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                          />
                        </svg>
                        {isBookmarked ? "Bookmarked" : "Bookmark"}
                      </>
                    )}
                  </button>
                  {/* Edit button - only show if user owns the project */}
                  {project.userId?._id && user?.id && project.userId._id.toString() === user.id && (
                    <Link
                      href={`/yourprojects/edit-project/${projectId}`}
                      className="flex-1 bg-accent hover:bg-primary-hover text-white px-6 py-3 rounded-full text-center font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </Link>
                  )}
                </div>
              )}
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
              <Link
                href={
                  fromYourProjects 
                    ? "/yourprojects" 
                    : fromProfile && username 
                    ? `/user/${encodeURIComponent(username)}` 
                    : "/explore"
                }
                className="w-full bg-gray-200 hover:bg-gray-300 text-black px-6 py-3 rounded-full text-center font-medium transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {fromYourProjects 
                  ? "Back to Your Projects" 
                  : fromProfile && username 
                  ? "Back to Profile" 
                  : "Back to Explore"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

