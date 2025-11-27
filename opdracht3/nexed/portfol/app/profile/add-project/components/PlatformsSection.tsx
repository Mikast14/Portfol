"use client";

import PlatformIcon from "./PlatformIcon";

interface PlatformsSectionProps {
  platforms: string[];
  loading: boolean;
  onTogglePlatform: (platform: string) => void;
}

const AVAILABLE_PLATFORMS = ["windows", "macos", "web", "linux"];

export default function PlatformsSection({
  platforms,
  loading,
  onTogglePlatform,
}: PlatformsSectionProps) {
  return (
    <div className="bg-white rounded-large p-8 shadow-elevated">
      <div className="mb-6 pb-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <span className="w-2 h-2 bg-accent rounded-full"></span>
          Platforms
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Select the platforms your project supports
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {AVAILABLE_PLATFORMS.map((platform) => {
          const isSelected = platforms.includes(platform);
          return (
            <button
              key={platform}
              type="button"
              onClick={() => onTogglePlatform(platform)}
              disabled={loading}
              className={`relative p-4 rounded-base border-2 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
                isSelected
                  ? "border-accent bg-accent/5 shadow-md"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="text-accent">
                  <PlatformIcon platform={platform} />
                </div>
                <span className="text-sm font-semibold text-gray-900 capitalize">
                  {platform === "macos" ? "macOS" : platform}
                </span>
              </div>
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <div className="w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {platforms.length === 0 && (
        <p className="mt-4 text-sm text-red-500">Please select at least one platform *</p>
      )}
    </div>
  );
}


