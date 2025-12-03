import Navbar from "../../../components/Navbar";
import CommentsSection from "../../../components/CommentsSection";

export default function ProjectCommentsPage() {
  return (
    <div className="min-h-screen font-sans bg-white">
      <Navbar />
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-large p-6 shadow-elevated">
            <h1 className="text-2xl font-bold text-black mb-4">Project Comments</h1>
            <p className="text-sm text-gray-600 mb-6">
              Routed comments page. The same section also appears under the images on the project page.
            </p>
            <CommentsSection />
          </div>
        </div>
      </main>
    </div>
  );
}