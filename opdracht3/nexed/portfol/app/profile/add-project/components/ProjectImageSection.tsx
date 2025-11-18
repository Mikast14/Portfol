"use client";

import { useRef } from "react";
import type { ChangeEvent, MouseEvent } from "react";

interface ProjectImageSectionProps {
  mainImagePreview: string | null;
  additionalImagePreviews: string[];
  loading: boolean;
  onMainImageChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onAdditionalImagesChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemoveMainImage: () => void;
  onRemoveAdditionalImage: (index: number) => void;
}

export default function ProjectImageSection({
  mainImagePreview,
  additionalImagePreviews,
  loading,
  onMainImageChange,
  onAdditionalImagesChange,
  onRemoveMainImage,
  onRemoveAdditionalImage,
}: ProjectImageSectionProps) {
  const mainImageInputRef = useRef<HTMLInputElement | null>(null);
  const additionalImagesInputRef = useRef<HTMLInputElement | null>(null);
  const maxAdditionalImages = 4;
  const canAddMore = additionalImagePreviews.length < maxAdditionalImages;

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

  return (
    <div className="bg-white rounded-large p-8 shadow-elevated">
      <div className="mb-6 pb-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <span className="w-2 h-2 bg-accent rounded-full"></span>
          Project Images
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Upload a main image (required) and up to {maxAdditionalImages} additional images
        </p>
      </div>

      <div className="space-y-8">
        {/* Main Image Section */}
        <div>
          <h3 className="text-lg font-medium text-foreground mb-4">Main Image *</h3>
          {mainImagePreview ? (
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
                  Main Image
                </div>
              </div>
            </div>
          ) : (
            <label
              htmlFor="mainImage"
              className="block w-full max-w-md border-2 border-dashed border-gray-300 rounded-base p-8 text-center cursor-pointer transition-all hover:border-accent hover:bg-accent/5 bg-gray-50/50"
            >
              <input
                ref={mainImageInputRef}
                type="file"
                id="mainImage"
                accept="image/*"
                onChange={onMainImageChange}
                disabled={loading}
                className="hidden"
              />
              <div className="space-y-3">
                <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-black">Click to upload main image</p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </label>
          )}
          {!mainImagePreview && (
            <p className="text-sm text-red-600 mt-2">* Main image is required</p>
          )}
        </div>

        {/* Additional Images Section */}
        <div>
          <h3 className="text-lg font-medium text-foreground mb-4">
            Additional Images ({additionalImagePreviews.length}/{maxAdditionalImages})
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
            <label
              htmlFor="additionalImages"
              className={`block w-full border-2 border-dashed rounded-base p-6 text-center cursor-pointer transition-all hover:border-accent hover:bg-accent/5 ${
                additionalImagePreviews.length > 0 ? "border-accent bg-accent/5" : "border-gray-300 bg-gray-50/50"
              }`}
            >
              <input
                ref={additionalImagesInputRef}
                type="file"
                id="additionalImages"
                accept="image/*"
                multiple
                onChange={onAdditionalImagesChange}
                disabled={loading}
                className="hidden"
              />
              <div className="space-y-2">
                <div className="mx-auto w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-black">
                    {additionalImagePreviews.length > 0
                      ? `Add more images (${maxAdditionalImages - additionalImagePreviews.length} remaining)`
                      : "Click to upload additional images (optional)"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </label>
          )}
        </div>
      </div>
    </div>
  );
}

