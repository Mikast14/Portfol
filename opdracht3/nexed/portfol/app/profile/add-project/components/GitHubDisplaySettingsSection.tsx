"use client";

export type ActiveStatusMode = "auto" | "active" | "inactive" | "hide";
export type DisplayMode = "auto" | "hide";

export interface GitHubDisplaySettings {
  activeStatus: ActiveStatusMode;
  contributors: DisplayMode;
  stars: DisplayMode;
  forks: DisplayMode;
  language: DisplayMode;
}

export const DEFAULT_GITHUB_SETTINGS: GitHubDisplaySettings = {
  activeStatus: "auto",
  contributors: "auto",
  stars: "auto",
  forks: "auto",
  language: "auto",
};

interface GitHubDisplaySettingsSectionProps {
  settings: GitHubDisplaySettings;
  onSettingsChange: (settings: Partial<GitHubDisplaySettings>) => void;
  loading?: boolean;
}

export default function GitHubDisplaySettingsSection({
  settings,
  onSettingsChange,
  loading = false,
}: GitHubDisplaySettingsSectionProps) {
  const handleActiveStatusChange = (value: ActiveStatusMode) => {
    onSettingsChange({ activeStatus: value });
  };

  const handleToggleChange = (key: "contributors" | "stars" | "forks" | "language", current: DisplayMode) => {
    onSettingsChange({ [key]: current === "auto" ? "hide" : "auto" });
  };

  return (
    <div className="bg-white rounded-large p-6 shadow-elevated">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">GitHub Display Settings</h2>
          <p className="text-sm text-gray-700">Configure what GitHub data is displayed on this project</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Active/Inactive Status */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Active/Inactive Status
          </label>
              <p className="text-xs text-gray-700 mb-3">
                Control how the repository activity status is displayed
              </p>
          <select
            value={settings.activeStatus}
            onChange={(e) => handleActiveStatusChange(e.target.value as ActiveStatusMode)}
            disabled={loading}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-base text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="auto">Auto (via GitHub API)</option>
            <option value="active">Always Show as Active</option>
            <option value="inactive">Always Show as Inactive</option>
            <option value="hide">Do Not Show</option>
          </select>
        </div>

        {/* Contributors */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">
                Contributors
              </label>
              <p className="text-xs text-gray-700">
                Show or hide the list of top contributors
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.contributors === "auto"}
                onChange={() => handleToggleChange("contributors", settings.contributors)}
                disabled={loading}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent peer-disabled:opacity-50"></div>
            </label>
          </div>
        </div>

        {/* Stars */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">
                Stars
              </label>
              <p className="text-xs text-gray-600">
                Show or hide the star count
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.stars === "auto"}
                onChange={() => handleToggleChange("stars", settings.stars)}
                disabled={loading}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent peer-disabled:opacity-50"></div>
            </label>
          </div>
        </div>

        {/* Forks */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">
                Forks
              </label>
              <p className="text-xs text-gray-600">
                Show or hide the fork count
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.forks === "auto"}
                onChange={() => handleToggleChange("forks", settings.forks)}
                disabled={loading}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent peer-disabled:opacity-50"></div>
            </label>
          </div>
        </div>

        {/* Language */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">
                Language
              </label>
              <p className="text-xs text-gray-600">
                Show or hide the primary programming language
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.language === "auto"}
                onChange={() => handleToggleChange("language", settings.language)}
                disabled={loading}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent peer-disabled:opacity-50"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

