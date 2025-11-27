"use client";

import { useState } from "react";
import type { ChangeEvent, MouseEvent } from "react";

interface ProjectImageSectionProps {
  mainImageUrl: string;
  mainImagePreview: string | null;
  additionalImageUrls: string[];
  additionalImagePreviews: string[];
  loading: boolean;
  onMainImageUrlChange: (url: string) => void;
  onAdditionalImageUrlAdd: (url: string) => void;
  onRemoveMainImage: () => void;
  onRemoveAdditionalImage: (index: number) => void;
}

export default function ProjectImageSection({
  mainImageUrl,
  mainImagePreview,
  additionalImageUrls,
  additionalImagePreviews,
  loading,
  onMainImageUrlChange,
  onAdditionalImageUrlAdd,
  onRemoveMainImage,
  onRemoveAdditionalImage,
}: ProjectImageSectionProps) {
  const maxAdditionalImages = 10;
  const canAddMore = additionalImagePreviews.length < maxAdditionalImages;
  const [newAdditionalImageUrl, setNewAdditionalImageUrl] = useState("");

  const handleRemoveMainImage = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onRemoveMainImage();
  };

  const handleRemoveAdditionalImage = (index: number) => (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onRemoveAdditionalImage(index);
  };

  const handleMainImageUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value;
    onMainImageUrlChange(url);
  };

  const handleAddAdditionalImage = () => {
    if (newAdditionalImageUrl.trim() && canAddMore) {
      onAdditionalImageUrlAdd(newAdditionalImageUrl.trim());
      setNewAdditionalImageUrl("");
    }
  };

  return (
    <div className="bg-white rounded-large p-8 shadow-elevated">
      <div className="mb-6 pb-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <span className="w-2 h-2 bg-accent rounded-full"></span>
          Project Images
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Add a logo (optional) and up to {maxAdditionalImages} project images for the carousel
        </p>
      </div>

      <div className="space-y-8">
        {/* Logo Section */}
        <div>
          <h3 className="text-lg font-medium text-foreground mb-4">Logo URL (Optional)</h3>
          <div className="space-y-4">
            <input
              type="url"
              value={mainImageUrl}
              onChange={handleMainImageUrlChange}
              placeholder="https://example.com/image.jpg"
              disabled={loading}
              className="w-full max-w-md px-4 py-3 border-2 border-gray-300 rounded-base focus:border-accent focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {mainImagePreview && (
              <div className="relative group">
                <div className="relative w-full max-w-md h-64 rounded-base overflow-hidden bg-gray-100 border-2 border-accent">
                  <img src={mainImagePreview} alt="Main preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={handleRemoveMainImage}
                    disabled={loading}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg z-10 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Remove main image"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                  <div className="absolute top-2 left-2 bg-accent text-white text-xs px-3 py-1 rounded font-semibold">
                    Logo
                  </div>
                </div>
              </div>
            )}
          </div>
          {!mainImagePreview && (
            <p className="text-sm text-gray-500 mt-2">Logo is optional and will be displayed above the project title</p>
          )}
        </div>

        {/* Project Images Section (for carousel) */}
        <div>
          <h3 className="text-lg font-medium text-foreground mb-4">
            Project Images ({additionalImagePreviews.length}/{maxAdditionalImages})
          </h3>
          
          {additionalImagePreviews.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {additionalImagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <div className="relative w-full h-48 rounded-base overflow-hidden bg-gray-100 border-2 border-gray-200">
                    <img src={preview} alt={`Additional preview ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={handleRemoveAdditionalImage(index)}
                      disabled={loading}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg z-10 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Remove image"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                    <div className="absolute top-2 left-2 bg-gray-700/70 text-white text-xs px-2 py-1 rounded">
                      {index + 1}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {canAddMore && (
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="url"
                  value={newAdditionalImageUrl}
                  onChange={(e) => setNewAdditionalImageUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddAdditionalImage();
                    }
                  }}
                  placeholder="https://example.com/image.jpg"
                  disabled={loading}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-base focus:border-accent focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={handleAddAdditionalImage}
                  disabled={loading || !newAdditionalImageUrl.trim()}
                  className="px-6 py-3 bg-accent text-white rounded-base hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  Add
                </button>
              </div>
              <p className="text-xs text-gray-500">
                {additionalImagePreviews.length > 0
                  ? `${maxAdditionalImages - additionalImagePreviews.length} more image${maxAdditionalImages - additionalImagePreviews.length > 1 ? 's' : ''} can be added`
                  : "Add project images for the carousel (optional)"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

