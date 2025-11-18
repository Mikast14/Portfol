"use client";

import { useCallback, useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../Navbar";
import BasicInfoSection from "./components/BasicInfoSection";
import GitHubSection from "./components/GitHubSection";
import PlatformsSection from "./components/PlatformsSection";
import ProjectImageSection from "./components/ProjectImageSection";
import { GitHubRepo } from "./types";

export default function AddProject() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [githubRepo, setGithubRepo] = useState("");
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [githubUsername, setGithubUsername] = useState("mikast14");

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

  const handleMainImageChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setMainImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    setMainImage(file);
    input.value = "";
  }, []);

  const handleRemoveMainImage = useCallback(() => {
    setMainImage(null);
    setMainImagePreview(null);
  }, []);

  const handleAdditionalImagesChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const input = event.target;
      const files = input.files;
      if (!files || files.length === 0) {
        return;
      }

      const maxAdditionalImages = 4;
      const availableSlots = maxAdditionalImages - additionalImages.length;
      if (availableSlots <= 0) {
        input.value = "";
        return;
      }

      const filesToAdd = Array.from(files).slice(0, availableSlots);

      const previewPromises = filesToAdd.map(
        (file) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              resolve(reader.result as string);
            };
            reader.readAsDataURL(file);
          })
      );

      Promise.all(previewPromises).then((previews) => {
        setAdditionalImages((prev) => [...prev, ...filesToAdd]);
        setAdditionalImagePreviews((prev) => [...prev, ...previews]);
      });

      input.value = "";
    },
    [additionalImages.length]
  );

  const handleRemoveAdditionalImage = useCallback((index: number) => {
    setAdditionalImages((prev) => prev.filter((_, i) => i !== index));
    setAdditionalImagePreviews((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!name || !description || !githubRepo || platforms.length === 0 || !mainImage) {
      setMessage("Please fill in all required fields (main image is required)");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("githubRepo", githubRepo);
      formData.append("platforms", platforms.join(","));
      
      // Add main image
      formData.append("mainImage", mainImage);
      console.log(`Adding mainImage to FormData:`, mainImage.name, mainImage.size, 'bytes');
      
      // Add additional images
      additionalImages.forEach((image, index) => {
        formData.append(`additionalImage_${index}`, image);
        console.log(`Adding additionalImage_${index} to FormData:`, image.name, image.size, 'bytes');
      });
      formData.append("additionalImageCount", additionalImages.length.toString());
      
      console.log(`Sending FormData with 1 main image and ${additionalImages.length} additional images`);

      const response = await fetch("/api/projects", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.ok) {
        setMessage("Project created successfully! ✅");
        setTimeout(() => {
          router.push("/profile");
        }, 1500);
      } else {
        setMessage(`Error: ${data.error}`);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error creating project:", error);
      setMessage("An error occurred while creating the project");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-sans bg-background">
      <Navbar />
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground">Add New Project</h1>
                <p className="text-gray-600 mt-1">Showcase your work and share it with the world</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <BasicInfoSection
              name={name}
              description={description}
              loading={loading}
              onNameChange={handleNameChange}
              onDescriptionChange={handleDescriptionChange}
            />

            <GitHubSection
              githubUsername={githubUsername}
              githubRepo={githubRepo}
              repos={repos}
              loading={loading}
              loadingRepos={loadingRepos}
              onGithubUsernameChange={handleGithubUsernameChange}
              onGithubRepoChange={handleGithubRepoChange}
            />

            <PlatformsSection
              platforms={platforms}
              loading={loading}
              onTogglePlatform={handlePlatformToggle}
            />

            <ProjectImageSection
              mainImagePreview={mainImagePreview}
              additionalImagePreviews={additionalImagePreviews}
              loading={loading}
              onMainImageChange={handleMainImageChange}
              onAdditionalImagesChange={handleAdditionalImagesChange}
              onRemoveMainImage={handleRemoveMainImage}
              onRemoveAdditionalImage={handleRemoveAdditionalImage}
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
                disabled={loading || platforms.length === 0 || !mainImage}
                className="flex-1 bg-accent text-white rounded-full px-8 py-4 hover:bg-primary-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:hover:translate-y-0 disabled:hover:shadow-lg flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Project...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Create Project</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => router.push("/profile")}
                disabled={loading}
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

