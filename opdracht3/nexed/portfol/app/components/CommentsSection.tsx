"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

type CommentItem = {
  _id: string;
  username: string;
  content: string;
  createdAt: string;
};

export default function CommentsSection({ projectId }: { projectId: string }) {
  const { isAuthenticated } = useAuth();
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);

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

  return (
    <section id="comments" className="bg-white rounded-large shadow-elevated p-6 mt-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-black">Comments</h2>
        <a href="#comments" className="text-accent hover:text-primary-hover text-sm underline">
          Jump to comments
        </a>
      </div>

      {isAuthenticated ? (
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
      ) : (
        <p className="mb-6 text-sm text-gray-600">Log in to post a comment.</p>
      )}

      <div className="space-y-4">
        {comments.map((c) => (
          <div key={c._id} className="border-2 border-gray-100 rounded-base p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-gray-200" />
              <div>
                <p className="text-sm font-semibold text-black">{c.username || "User"}</p>
                <p className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleString()}</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{c.content}</p>
          </div>
        ))}
        {comments.length === 0 && <p className="text-sm text-gray-500">No comments yet.</p>}
      </div>
    </section>
  );
}

