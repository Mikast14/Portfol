import Link from "next/link";
import { useState } from "react";


export default function CommentsSection() {
  const [comments, setComments] = useState<string[]>([
    "Placeholder for command",
    "This will change if it works later",
  ]);
  const [draft, setDraft] = useState("");

  const handleAdd = () => {
    if (!draft.trim()) return;
    setComments((prev) => [draft.trim(), ...prev]);
    setDraft("");
  };

  return (
    <section id="comments" className="bg-white rounded-large shadow-elevated p-6 mt-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-black">Comments</h2>
        <Link
          href="#comments"
          className="text-accent hover:text-primary-hover text-sm underline"
        >
          Jump to comments
        </Link>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Add a comment
        </label>
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
            disabled={!draft.trim()}
          >
            Post
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {comments.map((text, idx) => (
          <div key={idx} className="border-2 border-gray-100 rounded-base p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-gray-200" />
              <div>
                <p className="text-sm font-semibold text-black">User</p>
                <p className="text-xs text-gray-500">Just now</p>
              </div>
            </div>
            <p className="text-sm text-gray-700">{text}</p>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-sm text-gray-500">No comments yet.</p>
        )}
      </div>
    </section>
  );
}

