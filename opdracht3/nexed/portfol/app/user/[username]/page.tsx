"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import ProjectCard from "../../components/ProjectCard";
import Image from "next/image";
import SkillTree, { SkillItem } from "../../components/SkillTree";
import { getLanguageColor } from "@/app/lib/languageColors";
import { useAuth } from "@/hooks/useAuth";

interface Project {
  _id: string;
  name: string;
  description: string;
  githubRepo: string;
  platforms: string[];
  image?: string;
  images?: string[];
  createdAt: string;
  updatedAt: string;
}

interface UserProfile {
  id: string;
  username: string;
  email: string;
  profileImage?: string | null;
  createdAt: string;
}

interface ProfileData {
  user: UserProfile;
  projects: Project[];
}

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser, isAuthenticated } = useAuth();
  const usernameParam = params?.username;
  // Next.js automatically decodes URL params, so we get the decoded username
  let username = typeof usernameParam === 'string' ? usernameParam : Array.isArray(usernameParam) ? usernameParam[0] : null;
  // Ensure we handle any edge cases with decoding
  if (username) {
    try {
      // If it still contains encoded characters, decode again (shouldn't happen, but safe)
      if (username.includes('%')) {
        username = decodeURIComponent(username);
      }
    } catch (e) {
      // If decoding fails, use as-is
      console.warn("Failed to decode username param:", username);
    }
  }
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name">("newest");
  const [skillItems, setSkillItems] = useState<SkillItem[] | null>(null);
  const [skillsLoading, setSkillsLoading] = useState(false);
  const [skillsError, setSkillsError] = useState<string | null>(null);
  const [hoveredLanguage, setHoveredLanguage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      // Wait for params to be available
      if (!username) {
        // Only set error if we have params but no username (invalid route)
        if (params && Object.keys(params).length > 0) {
          console.error("Username parameter missing from URL:", params);
          setError("Username is required");
          setLoading(false);
        }
        // Otherwise, params are still loading, keep loading state
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const apiUrl = `/api/users/${encodeURIComponent(username)}`;
        console.log("Fetching profile for username:", username, "URL:", apiUrl);
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.ok) {
          setProfileData(data.data);
        } else {
          console.error("API error:", data.error);
          setError(data.error || "Failed to load profile");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username, params]);

  useEffect(() => {
    if (!username) return;

    const storageKey = `userLangs:${username}`;
    const ttlMs = 20 * 60 * 1000; // 20 minutes

    const loadFromCache = () => {
      if (typeof window === "undefined") return false;

      try {
        const cachedRaw = localStorage.getItem(storageKey);
        if (!cachedRaw) return false;

        const cached = JSON.parse(cachedRaw);
        const now = Date.now();

        if (!cached.timestamp || now - cached.timestamp > ttlMs || !cached.data) {
          return false;
        }

        const items: SkillItem[] = (cached.data.languages || []).map((l: any) => ({
          language: l.language,
          projects: l.projects,
          percentage: l.percentage,
        }));

        setSkillItems(items);
        return true;
      } catch {
        return false;
      }
    };

    const fetchSkills = async () => {
      setSkillsLoading(true);
      setSkillsError(null);

      // Try cache first
      const hasCache = loadFromCache();
      if (hasCache) {
        setSkillsLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `/api/users/${encodeURIComponent(username)}/languages`,
          { cache: "no-store" }
        );
        const data = await res.json();

        if (data.ok) {
          const items: SkillItem[] = (data.data.languages || []).map((l: any) => ({
            language: l.language,
            projects: l.projects,
            percentage: l.percentage,
          }));
          setSkillItems(items);

          if (typeof window !== "undefined") {
            try {
              localStorage.setItem(
                storageKey,
                JSON.stringify({
                  timestamp: Date.now(),
                  data: data.data,
                })
              );
            } catch {
              // ignore storage failures
            }
          }
        } else {
          setSkillsError(data.error || "Failed to load skills");
          setSkillItems([]);
        }
      } catch (e) {
        setSkillsError("Failed to load skills");
        setSkillItems([]);
      } finally {
        setSkillsLoading(false);
      }
    };

    fetchSkills();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen font-sans bg-white">
        <Navbar />
        <main className="pt-24 pb-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-large p-8 shadow-elevated">
              <div className="flex justify-center items-center py-20">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent mb-4"></div>
                  <p className="text-gray-700 text-base font-medium">Loading profile...</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen font-sans bg-white">
        <Navbar />
        <main className="pt-24 pb-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-large p-8 shadow-elevated">
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Profile Not Found</h2>
                <p className="text-gray-700 mb-6 text-base leading-relaxed">{error || "The user profile you're looking for doesn't exist."}</p>
                <button
                  onClick={() => router.push("/explore")}
                  className="bg-accent text-white rounded-full px-6 py-3 hover:bg-primary-hover transition-colors font-medium"
                >
                  Back to Explore
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const { user, projects } = profileData;

  const sortedProjects = [...projects].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const totalPlatforms = new Set(projects.flatMap((p) => p.platforms)).size;
  const memberSince = user.createdAt ? new Date(user.createdAt) : null;

  return (
    <div className="min-h-screen font-sans bg-white">
      <Navbar />
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Enhanced Profile Header */}
          <div className="bg-gradient-to-br from-accent/10 via-white to-primary-hover/10 rounded-large p-8 shadow-elevated mb-6 border border-accent/20">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Profile Avatar */}
              <div className="flex-shrink-0">
                {user.profileImage ? (
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg ring-4 ring-accent/20">
                    <Image
                      src={user.profileImage}
                      alt={user.username}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent to-primary-hover flex items-center justify-center border-4 border-white shadow-lg ring-4 ring-accent/20">
                    <span className="text-4xl font-bold text-white">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-4xl font-bold text-black mb-3">
                      {user.username}
                    </h1>
                    
                    {/* Stats */}
                    <div className="flex flex-wrap gap-6 mt-4">
                      <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow-sm border border-gray-100">
                        <div className="text-2xl font-bold text-accent">{projects.length}</div>
                        <div className="text-xs text-gray-700 uppercase tracking-wide font-semibold">
                          {projects.length === 1 ? "Project" : "Projects"}
                        </div>
                      </div>
                      <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow-sm border border-gray-100">
                        <div className="text-2xl font-bold text-accent">{totalPlatforms}</div>
                        <div className="text-xs text-gray-700 uppercase tracking-wide font-semibold">
                          {totalPlatforms === 1 ? "Platform" : "Platforms"}
                        </div>
                      </div>
                      {memberSince && (
                        <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow-sm border border-gray-100">
                          <div className="text-2xl font-bold text-accent">
                            {memberSince.getFullYear()}
                          </div>
                          <div className="text-xs text-gray-700 uppercase tracking-wide font-semibold">Member Since</div>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Message Button - Only show if authenticated and not viewing own profile */}
                  {isAuthenticated && currentUser && currentUser.id !== user.id && (
                    <button
                      onClick={() => router.push(`/chat?userId=${user.id}`)}
                      className="bg-accent text-white rounded-full px-6 py-3 hover:bg-primary-hover transition-colors font-medium flex items-center gap-2 shrink-0"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      Message
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Skills section – direct onder de header */}
          {skillsLoading ? (
            <div className="bg-white rounded-large p-8 shadow-elevated mb-6">
              <p className="text-gray-700 text-base text-center">Loading skills...</p>
            </div>
          ) : skillsError ? (
            <div className="bg-white rounded-large p-6 shadow-elevated mb-6">
              <p className="text-red-600 text-sm text-center">{skillsError}</p>
            </div>
          ) : skillItems && skillItems.length > 0 ? (
            <div className="mb-6">
              <SkillTree
                items={skillItems}
                onHoverLanguage={setHoveredLanguage}
                activeLanguage={hoveredLanguage}
              />

              {/* Per‑language cards (act as legend) */}
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {skillItems.map((skill) => {
                  const isActive = hoveredLanguage === skill.language;
                  const color = getLanguageColor(skill.language); // from lib/languageColors

                  return (
                    <div
                      key={skill.language}
                      onMouseEnter={() => setHoveredLanguage(skill.language)}
                      onMouseLeave={() => setHoveredLanguage(null)}
                      className={`rounded-large p-4 border transition-all duration-200 ${
                        isActive ? "-translate-y-0.5 shadow-lg" : "shadow-elevated"
                      }`}
                      style={{
                        // border like profile header, but tinted by language
                        borderColor: isActive ? `${color}66` : `${color}33`,
                        // gradient similar to bg-gradient-to-br from-accent/10 via-white to-primary-hover/10
                        backgroundImage: isActive
                          ? `linear-gradient(to bottom right, ${color}1a, #ffffff, ${color}33)`
                          : `linear-gradient(to bottom right, ${color}0d, #ffffff, ${color}1a)`,
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span
                            className="inline-block w-3 h-3 rounded-full"
                            style={{ backgroundColor: color }}
                          />
                          <h4 className="font-semibold text-gray-900">
                            {skill.language}
                          </h4>
                        </div>
                        <span className="text-xs text-gray-500">
                          {skill.percentage}%
                        </span>
                      </div>

                      <p className="text-sm text-gray-700">
                        Projects:{" "}
                        <span className="font-semibold">
                          {skill.projects}
                        </span>
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Certificates:{" "}
                        <span className="font-semibold">0</span>
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}

          {/* Projects Section */}
          {projects.length === 0 ? (
            <div className="bg-white rounded-large p-12 shadow-elevated">
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-gradient-to-br from-accent/20 to-primary-hover/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-10 h-10 text-accent"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-black mb-3">No projects yet</h2>
                <p className="text-gray-700 mb-6 max-w-md mx-auto text-base leading-relaxed">
                  {user.username} hasn't shared any projects yet.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Projects Header with Sort */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-black mb-2">
                    Projects
                  </h2>
                  <p className="text-gray-700 mt-1 text-base leading-relaxed">
                    {projects.length} {projects.length === 1 ? "project" : "projects"} in {user.username}'s portfolio
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-sm text-black font-semibold">Sort by:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as "newest" | "oldest" | "name")}
                    className="bg-white border-2 border-gray-200 rounded-full px-4 py-2 text-sm font-medium text-accent focus:outline-none focus:border-accent transition-colors cursor-pointer"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="name">Name (A-Z)</option>
                  </select>
                </div>
              </div>

              {/* Projects Grid - Masonry Layout */}
              <div 
                className="columns-1 sm:columns-2 lg:columns-3 space-y-0"
                style={{ columnGap: "1.5rem" }}
              >
                {sortedProjects.map((project) => (
                  <ProjectCard
                    key={project._id}
                    project={project}
                    mode="explore"
                    onOpen={() => router.push(`/explore/project/${project._id}?from=profile&username=${encodeURIComponent(user.username)}`)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
