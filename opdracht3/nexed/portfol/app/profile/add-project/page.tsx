"use client";

import { useState, useEffect } from "react";
import Navbar from "../../Navbar";
import { useRouter } from "next/navigation";

interface GitHubRepo {
  id: number;
  name: string;
  fullName: string;
  htmlUrl: string;
  description: string;
}

export default function AddProject() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [githubRepo, setGithubRepo] = useState("");
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [githubUsername, setGithubUsername] = useState("mikast14");

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

  // Handle platform checkbox changes
  const handlePlatformChange = (platform: string) => {
    if (platforms.includes(platform)) {
      setPlatforms(platforms.filter((p) => p !== platform));
    } else {
      setPlatforms([...platforms, platform]);
    }
  };

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !description || !githubRepo || platforms.length === 0) {
      setMessage("Please fill in all required fields");
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
      if (image) {
        formData.append("image", image);
      }

      const response = await fetch("/api/projects", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.ok) {
        setMessage("Project created successfully! ✅");
        // Redirect to profile page after 1.5 seconds
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
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-large p-8 shadow-elevated">
            <h1 className="text-3xl font-bold mb-2 text-foreground">
              Add New Project
            </h1>
            <p className="text-gray-600 mb-8">
              Create a new project to showcase your work.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Project Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-black mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-base text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="Enter project name"
                  disabled={loading}
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-black mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-base text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
                  placeholder="Enter project description"
                  disabled={loading}
                  required
                />
              </div>

              {/* GitHub Username (for fetching repos) */}
              <div>
                <label htmlFor="githubUsername" className="block text-sm font-medium text-black mb-2">
                  GitHub Username
                </label>
                <input
                  type="text"
                  id="githubUsername"
                  value={githubUsername}
                  onChange={(e) => setGithubUsername(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-base text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="Enter GitHub username"
                  disabled={loading}
                />
                {loadingRepos && (
                  <p className="text-sm text-gray-500 mt-2">Loading repositories...</p>
                )}
              </div>

              {/* GitHub Repo Dropdown */}
              <div>
                <label htmlFor="githubRepo" className="block text-sm font-medium text-black mb-2">
                  GitHub Repository *
                </label>
                <select
                  id="githubRepo"
                  value={githubRepo}
                  onChange={(e) => setGithubRepo(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-base text-black focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-white"
                  disabled={loading || loadingRepos}
                  required
                >
                  <option value="">Select a repository</option>
                  {repos.map((repo) => (
                    <option key={repo.id} value={repo.htmlUrl}>
                      {repo.name} {repo.description && `- ${repo.description.substring(0, 50)}${repo.description.length > 50 ? '...' : ''}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Platforms */}
              <div>
                <label className="block text-sm font-medium text-black mb-3">
                  Platforms * (select at least one)
                </label>
                <div className="flex flex-wrap gap-4">
                  {["windows", "macos", "web", "linux"].map((platform) => (
                    <label key={platform} className="flex items-center space-x-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={platforms.includes(platform)}
                        onChange={() => handlePlatformChange(platform)}
                        disabled={loading}
                        className="w-4 h-4 text-accent border-gray-300 rounded-base focus:ring-2 focus:ring-accent cursor-pointer disabled:cursor-not-allowed"
                      />
                      <span className="text-sm text-black capitalize group-hover:text-accent transition-colors">
                        {platform === "macos" ? "macOS" : platform}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-black mb-2">
                  Project Image
                </label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-base text-black focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-base file:border-0 file:text-sm file:font-medium file:bg-accent file:text-white hover:file:bg-primary-hover file:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {imagePreview && (
                  <div className="mt-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-w-xs h-48 object-cover rounded-base border border-gray-300"
                    />
                  </div>
                )}
              </div>

              {/* Message Display */}
              {message && (
                <div
                  className={`p-4 rounded-base ${
                    message.includes("✅") || message.includes("success")
                      ? "bg-green-50 text-green-800"
                      : "bg-red-50 text-red-800"
                  }`}
                >
                  {message}
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-accent text-white rounded-full px-6 py-3 hover:bg-primary-hover transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {loading ? "Creating..." : "Create Project"}
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/profile")}
                  disabled={loading}
                  className="bg-gray-200 text-black rounded-full px-6 py-3 hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

