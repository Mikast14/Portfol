"use client";

import { GitHubRepo } from "../types";

interface GitHubSectionProps {
  githubUsername: string;
  githubRepo: string;
  repos: GitHubRepo[];
  loading: boolean;
  loadingRepos: boolean;
  onGithubUsernameChange: (value: string) => void;
  onGithubRepoChange: (value: string) => void;
}

export default function GitHubSection({
  githubUsername,
  githubRepo,
  repos,
  loading,
  loadingRepos,
  onGithubUsernameChange,
  onGithubRepoChange,
}: GitHubSectionProps) {
  return (
    <div className="bg-white rounded-large p-8 shadow-elevated">
      <div className="mb-6 pb-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-accent"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          GitHub Repository
        </h2>
        <p className="text-sm text-gray-600 mt-1">Connect your project to GitHub</p>
      </div>

      <div className="space-y-6">
        <div className="group">
          <label
            htmlFor="githubUsername"
            className="block text-sm font-semibold text-gray-900 mb-2.5"
          >
            GitHub Username
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400 group-focus-within:text-accent transition-colors"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </div>
            <input
              type="text"
              id="githubUsername"
              value={githubUsername}
              onChange={(event) => onGithubUsernameChange(event.target.value)}
              className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all bg-white focus:bg-white"
              placeholder="username"
              disabled={loading}
            />
          </div>
          {loadingRepos && (
            <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
              <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
              <span>Loading repositories...</span>
            </div>
          )}
        </div>

        <div className="group">
          <label
            htmlFor="githubRepo"
            className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2.5"
          >
            <span>Repository</span>
            <span className="text-accent">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400 group-focus-within:text-accent transition-colors"
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
            <select
              id="githubRepo"
              value={githubRepo}
              onChange={(event) => onGithubRepoChange(event.target.value)}
              className="w-full pl-12 pr-10 py-3.5 border-2 border-gray-200 rounded-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all bg-white focus:bg-white appearance-none cursor-pointer"
              disabled={loading || loadingRepos}
              required
            >
              <option value="">Select a repository</option>
              {repos.map((repo) => (
                <option key={repo.id} value={repo.htmlUrl}>
                  {repo.name}{" "}
                  {repo.description &&
                    `- ${repo.description.substring(0, 40)}${
                      repo.description.length > 40 ? "..." : ""
                    }`}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
          {repos.length > 0 && !loadingRepos && (
            <p className="mt-2 text-xs text-gray-500">
              {repos.length} {repos.length === 1 ? "repository" : "repositories"} found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}


