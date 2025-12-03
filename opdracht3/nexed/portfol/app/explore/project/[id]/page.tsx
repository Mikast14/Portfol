"use client";

import { useParams, useSearchParams } from "next/navigation";
import Navbar from "../../../components/Navbar";
import ProjectDetail from "../../../components/ProjectDetail";

export default function ExploreProjectDetail() {
  const params = useParams();
  const searchParams = useSearchParams();
  
  const projectId = params.id as string;
  const from = searchParams?.get("from") || undefined;
  const username = searchParams?.get("username") || null;

  return (
    <div className="min-h-screen font-sans bg-white">
      <Navbar />
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <ProjectDetail projectId={projectId} from={from} username={username} />
        </div>
      </main>
    </div>
  );
}
