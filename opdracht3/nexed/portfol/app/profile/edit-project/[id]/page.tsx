"use client";

import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "../../../components/Navbar";
import BasicInfoSection from "../../add-project/components/BasicInfoSection";
import GitHubSection from "../../add-project/components/GitHubSection";
import PlatformsSection from "../../add-project/components/PlatformsSection";
import ProjectImageSection from "../../add-project/components/ProjectImageSection";
import GitHubDisplaySettingsSection, {
  GitHubDisplaySettings,
  DEFAULT_GITHUB_SETTINGS,
} from "../../add-project/components/GitHubDisplaySettingsSection";
import { GitHubRepo } from "../../add-project/types";

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

export default function EditProject() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [githubRepo, setGithubRepo] = useState("");
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [mainImageUrl, setMainImageUrl] = useState("");
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [additionalImageUrls, setAdditionalImageUrls] = useState<string[]>([]);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>([]);
  const [githubDisplaySettings, setGithubDisplaySettings] = useState<GitHubDisplaySettings>(DEFAULT_GITHUB_SETTINGS);
  
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [githubUsername, setGithubUsername] = useState("mikast14");

  // Fetch project data
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects?id=${projectId}`);
        const data = await response.json();
        if (data.ok) {
          const projectData = data.data;
          setProject(projectData);
          
          // Pre-fill form with existing data
          setName(projectData.name || "");
          setDescription(projectData.description || "");
          setGithubRepo(projectData.githubRepo || "");
          setPlatforms(projectData.platforms || []);
          
          // Handle images - logo is separate from subimages
          if (projectData.image) {
            setMainImageUrl(projectData.image);
            setMainImagePreview(projectData.image);
          }
          
          if (projectData.images && projectData.images.length > 0) {
            setAdditionalImageUrls(projectData.images);
            setAdditionalImagePreviews(projectData.images);
          }
          
          // Pre-fill GitHub display settings
          if (projectData.githubDisplaySettings) {
            setGithubDisplaySettings({ ...DEFAULT_GITHUB_SETTINGS, ...projectData.githubDisplaySettings });
          }
          
          // Extract GitHub username from repo URL
          if (projectData.githubRepo) {
            const repoMatch = projectData.githubRepo.match(/github\.com\/([^\/]+)/);
            if (repoMatch) {
              setGithubUsername(repoMatch[1]);
            }
          }
        } else {
          setFetchError(data.error || "Failed to load project");
        }
      } catch (error) {
        console.error("Error fetching project:", error);
        setFetchError("Failed to load project");
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
    const fetchRepos = async () => {
      setLoadingRepos(true);
      try {
        const response = await fetch(`/api/github/repos?username=${githubUsername}`);
        const data = await response.json();
        if (data.ok) {
          setRepos(data.data);
        } else {
          setMessage(`Error fetching repos: ${data.error}`);
        }
      } catch (error) {
        console.error("Error fetching repos:", error);
        setMessage("Error fetching repositories");
      } finally {
        setLoadingRepos(false);
      }
    };

    fetchRepos();
  }, [githubUsername]);

  const handleNameChange = useCallback((value: string) => {
    setName(value);
  }, []);

  const handleDescriptionChange = useCallback((value: string) => {
    setDescription(value);
  }, []);

  const handleGithubUsernameChange = useCallback((value: string) => {
    setGithubUsername(value);
  }, []);

  const handleGithubRepoChange = useCallback((value: string) => {
    setGithubRepo(value);
  }, []);

  const handlePlatformToggle = useCallback(
    (platform: string) => {
      setPlatforms((prev) =>
        prev.includes(platform) ? prev.filter((item) => item !== platform) : [...prev, platform]
      );
    },
    [setPlatforms]
  );

  // Update preview when main image URL changes
  useEffect(() => {
    if (mainImageUrl.trim()) {
      setMainImagePreview(mainImageUrl);
    } else {
      setMainImagePreview(null);
    }
  }, [mainImageUrl]);

  // Update previews when additional image URLs change
  useEffect(() => {
    setAdditionalImagePreviews(additionalImageUrls);
  }, [additionalImageUrls]);

  const handleMainImageUrlChange = useCallback((url: string) => {
    setMainImageUrl(url);
  }, []);

  const handleRemoveMainImage = useCallback(() => {
    setMainImageUrl("");
    setMainImagePreview(null);
  }, []);

  const handleAdditionalImageUrlAdd = useCallback((url: string) => {
    const maxAdditionalImages = 4;
    if (additionalImageUrls.length < maxAdditionalImages) {
      setAdditionalImageUrls((prev) => [...prev, url]);
    }
  }, [additionalImageUrls.length]);

  const handleRemoveAdditionalImage = useCallback((index: number) => {
    setAdditionalImageUrls((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!name || !description || !githubRepo || platforms.length === 0) {
      setMessage("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/projects", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
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

      // Check if response is ok
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
          router.push("/profile");
        }, 1500);
      } else {
        setMessage(`Error: ${data.error || "Unknown error"}`);
        setSubmitting(false);
      }
    } catch (error) {
      console.error("Error updating project:", error);
      setMessage(`Error: ${error instanceof Error ? error.message : "An error occurred while updating the project"}`);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen font-sans bg-background">
        <Navbar />
        <main className="pt-24 pb-16 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-large p-8 shadow-elevated">
              <p className="text-gray-500 text-center">Loading project...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (fetchError || !project) {
    return (
      <div className="min-h-screen font-sans bg-background">
        <Navbar />
        <main className="pt-24 pb-16 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-large p-8 shadow-elevated">
              <p className="text-red-500 text-center mb-4">{fetchError || "Project not found"}</p>
              <div className="text-center">
                <button
                  onClick={() => router.push("/profile")}
                  className="text-accent hover:text-primary-hover font-medium"
                >
                  ← Back to Profile
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans bg-background">
      <Navbar />
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Edit Project</h1>
                <p className="text-gray-700 mt-1">Update your project information</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <BasicInfoSection
              name={name}
              description={description}
              loading={submitting}
              onNameChange={handleNameChange}
              onDescriptionChange={handleDescriptionChange}
            />

            <GitHubSection
              githubUsername={githubUsername}
              githubRepo={githubRepo}
              repos={repos}
              loading={submitting}
              loadingRepos={loadingRepos}
              onGithubUsernameChange={handleGithubUsernameChange}
              onGithubRepoChange={handleGithubRepoChange}
            />

            <PlatformsSection
              platforms={platforms}
              loading={submitting}
              onTogglePlatform={handlePlatformToggle}
            />

            <ProjectImageSection
              mainImageUrl={mainImageUrl}
              mainImagePreview={mainImagePreview}
              additionalImageUrls={additionalImageUrls}
              additionalImagePreviews={additionalImagePreviews}
              loading={submitting}
              onMainImageUrlChange={handleMainImageUrlChange}
              onAdditionalImageUrlAdd={handleAdditionalImageUrlAdd}
              onRemoveMainImage={handleRemoveMainImage}
              onRemoveAdditionalImage={handleRemoveAdditionalImage}
            />

            <GitHubDisplaySettingsSection
              settings={githubDisplaySettings}
              onSettingsChange={(newSettings) =>
                setGithubDisplaySettings((prev) => ({ ...prev, ...newSettings }))
              }
              loading={submitting}
            />

            {message && (
              <div
                className={`p-4 rounded-base border-2 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
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

            <div className="flex gap-4 pt-2">
              <button
                type="submit"
                disabled={submitting || platforms.length === 0}
                className="flex-1 bg-accent text-white rounded-full px-8 py-4 hover:bg-primary-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:hover:translate-y-0 disabled:hover:shadow-lg flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Updating Project...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Update Project</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => router.push("/profile")}
                disabled={submitting}
                className="px-8 py-4 bg-gray-100 text-black rounded-full hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

