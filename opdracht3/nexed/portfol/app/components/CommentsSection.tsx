"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

type CommentItem = {
  _id: string;
  username: string;
  content: string;
  createdAt: string;
  profileImage?: string | null;
  userId?: string;
};

export default function CommentsSection({ projectId }: { projectId: string }) {
  const { isAuthenticated, user } = useAuth();
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isProjectOwner, setIsProjectOwner] = useState(false);
  const [deletingAll, setDeletingAll] = useState(false);

  useEffect(() => {
    if (!projectId) return;
    const load = async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}/comments`);
        const data = await res.json();
        if (data.ok) setComments(data.data);
      } catch {}
    };
    load();
  }, [projectId]);

  // Check if user owns the project
  useEffect(() => {
    if (!projectId || !isAuthenticated || !user) {
      setIsProjectOwner(false);
      return;
    }
    
    const checkOwnership = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        
        const res = await fetch(`/api/projects?id=${projectId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (data.ok && data.data?.userId?._id) {
          setIsProjectOwner(String(data.data.userId._id) === String(user.id));
        }
      } catch (error) {
        console.error("Error checking project ownership:", error);
      }
    };
    
    checkOwnership();
  }, [projectId, isAuthenticated, user]);

  const handleAdd = async () => {
    if (!draft.trim() || !isAuthenticated) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/projects/${projectId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ content: draft.trim() }),
      });
      const data = await res.json();
      if (data.ok) {
        setComments((prev) => [data.data, ...prev]);
        setDraft("");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!isAuthenticated || !commentId) return;
    
    setDeletingId(commentId);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`/api/projects/${projectId}/comments?commentId=${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.ok) {
        setComments((prev) => prev.filter((c) => c._id !== commentId));
      } else {
        console.error("Error deleting comment:", data.error);
        alert(data.error || "Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Failed to delete comment");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteAll = async () => {
    if (!isAuthenticated || !isProjectOwner) return;
    
    if (!confirm("Are you sure you want to delete all comments on this project? This action cannot be undone.")) {
      return;
    }
    
    setDeletingAll(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`/api/projects/${projectId}/comments?deleteAll=true`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.ok) {
        setComments([]);
      } else {
        console.error("Error deleting all comments:", data.error);
        alert(data.error || "Failed to delete all comments");
      }
    } catch (error) {
      console.error("Error deleting all comments:", error);
      alert("Failed to delete all comments");
    } finally {
      setDeletingAll(false);
    }
  };

  return (
    <section id="comments" className="bg-white rounded-large shadow-elevated p-6 mt-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-black">Comments</h2>
        <div className="flex items-center gap-3">
          {isProjectOwner && comments.length > 0 && (
            <button
              onClick={handleDeleteAll}
              disabled={deletingAll}
              className="text-sm text-red-600 hover:text-red-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deletingAll ? "Deleting..." : "Delete All Comments"}
            </button>
          )}
          <a href="#comments" className="text-accent hover:text-primary-hover text-sm underline">
            Jump to comments
          </a>
        </div>
      </div>

      {isAuthenticated && !isProjectOwner ? (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Add a comment</label>
          <textarea
            className="w-full rounded-base border-2 border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent bg-white"
            rows={3}
            placeholder="Share your thoughts..."
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <div className="mt-2 flex justify-end">
            <button
              type="button"
              onClick={handleAdd}
              className="px-5 py-2 rounded-full bg-accent text-white font-medium hover:bg-primary-hover transition-colors disabled:opacity-50"
              disabled={!draft.trim() || loading}
            >
              {loading ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      ) : isProjectOwner ? (
        <p className="mb-6 text-sm text-gray-600">You cannot comment on your own project.</p>
      ) : (
        <p className="mb-6 text-sm text-gray-600">Log in to post a comment.</p>
      )}

      <div className="space-y-4">
        {comments.map((c) => {
          const isOwner = isAuthenticated && user && c.userId && String(c.userId) === String(user.id);
          return (
            <div key={c._id} className="border-2 border-gray-100 rounded-base p-4 relative group">
              <div className="flex items-center gap-3 mb-2">
                {c.profileImage && c.profileImage.trim() !== "" ? (
                  <Link href={`/user/${c.username}`} className="shrink-0">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden">
                      <Image
                        src={c.profileImage}
                        alt={c.username || "User"}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          // Fallback to initial if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `<div class="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-primary-hover flex items-center justify-center"><span class="text-xs font-bold text-white">${c.username?.charAt(0).toUpperCase() || "U"}</span></div>`;
                          }
                        }}
                      />
                    </div>
                  </Link>
                ) : (
                  <Link href={`/user/${c.username}`} className="shrink-0">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-primary-hover flex items-center justify-center">
                      <span className="text-xs font-bold text-white">
                        {c.username?.charAt(0).toUpperCase() || "U"}
                      </span>
                    </div>
                  </Link>
                )}
                <div className="flex-1">
                  <Link href={`/user/${c.username}`} className="hover:text-accent transition-colors">
                    <p className="text-sm font-semibold text-black">{c.username || "User"}</p>
                  </Link>
                  <p className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleString()}</p>
                </div>
                {isOwner && (
                  <button
                    onClick={() => handleDelete(c._id)}
                    disabled={deletingId === c._id}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Delete comment"
                    title="Delete comment"
                  >
                    {deletingId === c._id ? (
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4" />
                        <path className="opacity-75" d="M4 12a8 8 0 018-8" strokeWidth="4" strokeLinecap="round" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{c.content}</p>
            </div>
          );
        })}
        {comments.length === 0 && <p className="text-sm text-gray-500">No comments yet.</p>}
      </div>
    </section>
  );
}

