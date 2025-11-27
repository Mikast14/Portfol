"use client";

interface BasicInfoSectionProps {
  name: string;
  description: string;
  loading: boolean;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

export default function BasicInfoSection({
  name,
  description,
  loading,
  onNameChange,
  onDescriptionChange,
}: BasicInfoSectionProps) {
  return (
    <div className="bg-white rounded-large p-8 shadow-elevated">
      <div className="mb-6 pb-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <span className="w-2 h-2 bg-accent rounded-full"></span>
          Basic Information
        </h2>
        <p className="text-sm text-gray-600 mt-1">Tell us about your project</p>
      </div>

      <div className="space-y-6">
        <div className="group">
          <label
            htmlFor="name"
            className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2.5"
          >
            <span>Project Name</span>
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
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
            </div>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(event) => onNameChange(event.target.value)}
              className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all bg-white focus:bg-white"
              placeholder="e.g., My Awesome App"
              disabled={loading}
              required
            />
          </div>
        </div>

        <div className="group">
          <label
            htmlFor="description"
            className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2.5"
          >
            <span>Description</span>
            <span className="text-accent">*</span>
          </label>
          <div className="relative">
            <div className="absolute top-4 left-4 pointer-events-none">
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
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
            </div>
            <textarea
              id="description"
              value={description}
              onChange={(event) => onDescriptionChange(event.target.value)}
              rows={5}
              className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all resize-none bg-white focus:bg-white"
              placeholder="Describe your project, its features, and what makes it special..."
              disabled={loading}
              required
            />
            <div className="absolute bottom-3 right-3 text-xs text-gray-400">
              {description.length} characters
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


