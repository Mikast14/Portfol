"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "../components/Navbar";

export default function SettingsPage() {
  const router = useRouter();
  const { user, loading: authLoading, isAuthenticated, refreshAuth } = useAuth();
  const [profileImage, setProfileImage] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [previewImageError, setPreviewImageError] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setProfileImage(user.profileImage || "");
      setUsername(user.username || "");
      setPreviewImageError(false);
    }
  }, [user]);

  useEffect(() => {
    // Reset preview error when profileImage changes
    setPreviewImageError(false);
  }, [profileImage]);

  const handleUpdateProfileImage = async () => {
    const trimmedImage = profileImage.trim();
    
    // If not empty, validate URL format
    if (trimmedImage) {
      try {
        new URL(trimmedImage);
      } catch {
        setMessage({ type: "error", text: "Please enter a valid URL" });
        return;
      }
    }

    setLoading(true);
    setMessage(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage({ type: "error", text: "You must be logged in" });
        setLoading(false);
        return;
      }

      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
                body: JSON.stringify({ profileImage: trimmedImage || null }),
      });

      const data = await response.json();

      if (data.ok) {
        setMessage({ type: "success", text: "Profile image updated successfully! ✅" });
        refreshAuth();
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: "error", text: data.error || "Failed to update profile image" });
      }
    } catch (error) {
      console.error("Error updating profile image:", error);
      setMessage({ type: "error", text: "An error occurred while updating profile image" });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUsername = async () => {
    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      setMessage({ type: "error", text: "Username cannot be empty" });
      return;
    }

    if (trimmedUsername.length < 3) {
      setMessage({ type: "error", text: "Username must be at least 3 characters long" });
      return;
    }

    if (trimmedUsername === user?.username) {
      setMessage({ type: "error", text: "Username is the same as current username" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage({ type: "error", text: "You must be logged in" });
        setLoading(false);
        return;
      }

      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username: trimmedUsername }),
      });

      const data = await response.json();

      if (data.ok) {
        setMessage({ type: "success", text: "Username updated successfully! ✅" });
        // Wait for auth to refresh before redirecting
        await refreshAuth();
        setTimeout(() => {
          setMessage(null);
          router.push(`/user/${encodeURIComponent(trimmedUsername)}`);
        }, 1500);
      } else {
        setMessage({ type: "error", text: data.error || "Failed to update username" });
      }
    } catch (error) {
      console.error("Error updating username:", error);
      setMessage({ type: "error", text: "An error occurred while updating username" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      setMessage({ type: "error", text: "Please type DELETE to confirm" });
      return;
    }

    setDeleting(true);
    setMessage(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage({ type: "error", text: "You must be logged in" });
        setDeleting(false);
        return;
      }

      const response = await fetch("/api/users/profile", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.ok) {
        localStorage.removeItem("token");
        router.push("/");
        window.location.reload();
      } else {
        setMessage({ type: "error", text: data.error || "Failed to delete account" });
        setDeleting(false);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      setMessage({ type: "error", text: "An error occurred while deleting account" });
      setDeleting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen font-sans bg-gray-50">
      <Navbar />
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-accent hover:text-primary-hover text-sm font-medium inline-flex items-center gap-2 mb-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Go back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account settings</p>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Profile Image Section */}
        <div className="bg-white rounded-large shadow-elevated p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Image</h2>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="shrink-0">
              {profileImage.trim() && !previewImageError ? (
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
                  <Image
                    src={profileImage.trim()}
                    alt={user.username}
                    fill
                    className="object-cover"
                    onError={() => {
                      setPreviewImageError(true);
                    }}
                  />
                </div>
              ) : profileImage.trim() && previewImageError ? (
                <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center border-2 border-red-300">
                  <span className="text-xs font-semibold text-red-600 text-center px-2">
                    Invalid URL
                  </span>
                </div>
              ) : user.profileImage ? (
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
                  <Image
                    src={user.profileImage}
                    alt={user.username}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center border-2 border-gray-200">
                  <span className="text-3xl font-semibold text-accent">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Image URL
              </label>
              <input
                type="url"
                value={profileImage}
                onChange={(e) => setProfileImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full rounded-base border-2 border-gray-200 px-4 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent bg-white"
              />
              <p className="text-xs text-gray-500 mt-2">
                Enter a URL to your profile image. Leave empty to remove your current image.
              </p>
              <div className="mt-4 flex gap-3">
                <button
                  onClick={handleUpdateProfileImage}
                  disabled={loading || profileImage.trim() === (user.profileImage || "")}
                  className="px-5 py-2 rounded-full bg-accent text-white font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Updating..." : profileImage.trim() ? "Update Profile Image" : "Remove Profile Image"}
                </button>
                {user.profileImage && profileImage.trim() && (
                  <button
                    onClick={() => setProfileImage("")}
                    disabled={loading}
                    className="px-5 py-2 rounded-full bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-colors disabled:opacity-50"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Username Section */}
        <div className="bg-white rounded-large shadow-elevated p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Username</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full rounded-base border-2 border-gray-200 px-4 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent bg-white"
            />
            <p className="text-xs text-gray-500 mt-2">
              Your username must be at least 3 characters long and unique.
            </p>
            <button
              onClick={handleUpdateUsername}
              disabled={loading || username.trim() === user.username || username.trim().length < 3}
              className="mt-4 px-5 py-2 rounded-full bg-accent text-white font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Updating..." : "Update Username"}
            </button>
          </div>
        </div>

        {/* Account Deletion Section */}
        <div className="bg-white rounded-large shadow-elevated p-6 border-2 border-red-100">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Delete Account</h2>
          <p className="text-sm text-gray-600 mb-4">
            Once you delete your account, there is no going back. This will permanently delete your
            account, projects, comments, and bookmarks.
          </p>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-5 py-2 rounded-full bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
          >
            Delete Account
          </button>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-large shadow-elevated p-6 max-w-md w-full">
              <h3 className="text-2xl font-bold text-red-600 mb-2">Are you sure?</h3>
              <p className="text-gray-700 mb-4">
                This action cannot be undone. This will permanently delete your account and all
                associated data including:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-6 space-y-1">
                <li>Your profile</li>
                <li>All your projects</li>
                <li>All your comments</li>
                <li>All your bookmarks</li>
              </ul>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type <span className="font-bold text-red-600">DELETE</span> to confirm:
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="DELETE"
                  className="w-full rounded-base border-2 border-gray-200 px-4 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-white"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteConfirmText("");
                    setMessage(null);
                  }}
                  disabled={deleting}
                  className="flex-1 px-5 py-2 rounded-full bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleting || deleteConfirmText !== "DELETE"}
                  className="flex-1 px-5 py-2 rounded-full bg-red-600 text-white font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleting ? "Deleting..." : "Delete Account"}
                </button>
              </div>
              {message && message.type === "error" && (
                <p className="text-red-600 text-sm mt-3">{message.text}</p>
              )}
            </div>
          </div>
        )}
        </div>
      </main>
    </div>
  );
}

