"use client";

import PlatformIcon from "./PlatformIcon";

interface PlatformsSectionProps {
  platforms: string[];
  loading: boolean;
  onTogglePlatform: (platform: string) => void;
  projectType: string | null;
  onProjectTypeChange: (type: string | null) => void;
}

const PROJECT_TYPES = [
  { value: "game", label: "Game" },
  { value: "app", label: "App" },
  { value: "website", label: "Website" },
];

const PLATFORMS_BY_TYPE: Record<string, string[]> = {
  game: ["windows", "macos", "linux", "web", "ios", "android", "playstation", "xbox", "nintendo"],
  app: ["windows", "macos", "linux", "web", "ios", "android"],
  website: ["web"],
};

export default function PlatformsSection({
  platforms,
  loading,
  onTogglePlatform,
  projectType,
  onProjectTypeChange,
}: PlatformsSectionProps) {
  const renderTypeButton = (type: { value: string; label: string }) => {
    const isSelected = projectType === type.value;
    return (
      <button
        key={type.value}
        type="button"
        onClick={() => onProjectTypeChange(type.value)}
        disabled={loading}
        className={`relative p-6 rounded-base border-2 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
          isSelected
            ? "border-accent bg-accent/5 shadow-md"
            : "border-gray-200 bg-white hover:border-gray-300"
        }`}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="text-accent">
            <PlatformIcon platform={type.value} />
          </div>
          <span className="text-base font-semibold text-gray-900">
            {type.label}
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
  };

  const renderPlatformButton = (platform: string) => {
    const isSelected = platforms.includes(platform);
    const platformName = platform === "macos" ? "macOS" : platform === "ios" ? "iOS" : platform === "playstation" ? "PlayStation" : platform === "xbox" ? "Xbox" : platform === "nintendo" ? "Nintendo" : platform;
    
    return (
      <button
        key={platform}
        type="button"
        onClick={() => onTogglePlatform(platform)}
        disabled={loading}
        className={`relative px-10 py-5 rounded-base border-2 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex flex-col items-center justify-center ${
          isSelected
            ? "border-accent bg-accent/5 shadow-md"
            : "border-gray-200 bg-white hover:border-gray-300"
        }`}
      >
        <div className="flex flex-col items-center justify-center gap-2.5 w-full">
          <div className="text-accent shrink-0">
            <PlatformIcon platform={platform} className="w-10 h-10" />
          </div>
          <span className="text-sm font-semibold text-gray-900 text-center leading-tight px-2 flex items-center justify-center">
            {platformName}
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
  };

  const availablePlatforms = projectType ? PLATFORMS_BY_TYPE[projectType] || [] : [];

  return (
    <div className="bg-white rounded-large p-8 shadow-elevated">
      <div className="mb-6 pb-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <span className="w-2 h-2 bg-accent rounded-full"></span>
          Project Type & Platforms
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          First choose your project type, then select the platforms
        </p>
      </div>

      {/* Step 1: Project Type Selection */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
          Step 1: Choose Project Type
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PROJECT_TYPES.map(renderTypeButton)}
        </div>
        {!projectType && (
          <p className="mt-4 text-sm text-red-500">Please select a project type *</p>
        )}
      </div>

      {/* Step 2: Platform Selection */}
      {projectType && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
            Step 2: Choose Platforms
          </h3>
          <div className="grid grid-cols-3" style={{ gap: '2rem' }}>
            {availablePlatforms.map(renderPlatformButton)}
          </div>
          {platforms.length === 0 && (
            <p className="mt-4 text-sm text-red-500">Please select at least one platform *</p>
          )}
        </div>
      )}
    </div>
  );
}


