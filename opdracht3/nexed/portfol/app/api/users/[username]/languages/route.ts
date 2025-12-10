import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Project from "@/models/Project";

type LangMap = Record<string, { projects: number; bytes: number }>;

function parseRepo(input: string) {
  const raw = input?.trim() || "";
  if (!raw) return null;
  try {
    if (raw.startsWith("http")) {
      const u = new URL(raw);
      const parts = u.pathname.split("/").filter(Boolean);
      if (parts.length >= 2) return { owner: parts[0], repo: parts[1] };
    }
  } catch {}
  const parts = raw.split("/").filter(Boolean);
  if (parts.length >= 2) return { owner: parts[0], repo: parts[1] };
  return null;
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ username: string }> | { username: string } }
) {
  try {
    await connectDB();

    // Handle params being a Promise (Next.js 14 typing nuance)
    const resolved = "then" in params ? await params : params;
    const username = resolved.username;

    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json({ ok: false, error: "User not found" }, { status: 404 });
    }

    const projects = await Project.find({ userId: user._id }).select("githubRepo");
    const totalProjects = projects.length;

    const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.NEXT_PUBLIC_GITHUB_TOKEN;
    const headers: HeadersInit = GITHUB_TOKEN
      ? { Authorization: `Bearer ${GITHUB_TOKEN}`, "User-Agent": "PortfolApp" }
      : { "User-Agent": "PortfolApp" };

    // Aggregate languages
    const langMap: LangMap = {};

    for (const p of projects) {
      const pr = parseRepo(p.githubRepo);
      if (!pr) continue;

      try {
        const res = await fetch(
          `https://api.github.com/repos/${pr.owner}/${pr.repo}/languages`,
          { headers, cache: "no-store" }
        );
        if (!res.ok) continue;

        const langs: Record<string, number> = await res.json();

        // For each repo, count every language it uses once for "projects",
        // and sum bytes globally.
        for (const [lang, bytes] of Object.entries(langs)) {
          if (!langMap[lang]) {
            langMap[lang] = { projects: 0, bytes: 0 };
          }
          langMap[lang].projects += 1; // this repo uses this language
          langMap[lang].bytes += bytes;
        }
      } catch {
        // ignore per‑repo errors
      }
    }

    // Build response array from all languages used in all repos
    const items = Object.entries(langMap)
      .map(([language, stat]) => ({
        language,
        projects: stat.projects,
        bytes: stat.bytes,
        percentage:
          totalProjects > 0
            ? Math.round((stat.projects / totalProjects) * 100)
            : 0,
      }))
      // Sort by number of repos using the language, then by bytes
      .sort((a, b) => b.projects - a.projects || b.bytes - a.bytes);

    return NextResponse.json({
      ok: true,
      data: {
        totalProjects,
        languages: items,
      },
    });
  } catch (err) {
    console.error("Error building languages:", err);
    return NextResponse.json({ ok: false, error: "Error building languages" }, { status: 500 });
  }
}