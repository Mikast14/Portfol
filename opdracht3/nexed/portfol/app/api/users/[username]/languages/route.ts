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

    // langMap.bytes will now represent *per‑contributor* bytes aggregated over repos
    const langMap: LangMap = {};

    for (const p of projects) {
      const pr = parseRepo(p.githubRepo);
      if (!pr) continue;

      try {
        const [langsRes, contribRes] = await Promise.all([
          fetch(
            `https://api.github.com/repos/${pr.owner}/${pr.repo}/languages`,
            { headers, cache: "no-store" }
          ),
          fetch(
            `https://api.github.com/repos/${pr.owner}/${pr.repo}/contributors?per_page=100&anon=1`,
            { headers, cache: "no-store" }
          ),
        ]);

        if (!langsRes.ok) continue;

        let contributorCount = 1;
        if (contribRes.ok) {
          const contribData = await contribRes.json();
          if (Array.isArray(contribData) && contribData.length > 0) {
            contributorCount = contribData.length;
          }
        }
        if (contributorCount <= 0) contributorCount = 1;

        const langs: Record<string, number> = await langsRes.json();

        // For each repo, count every language once for "projects",
        // and add bytes divided by contributors to approximate per‑person work.
        for (const [lang, bytes] of Object.entries(langs)) {
          if (!langMap[lang]) {
            langMap[lang] = { projects: 0, bytes: 0 };
          }
          langMap[lang].projects += 1;
          const perContributorBytes = bytes / contributorCount;
          langMap[lang].bytes += perContributorBytes;
        }
      } catch {
        // ignore per‑repo errors
      }
    }

    // Compute total "per‑contributor bytes" across all languages for global percentage
    const totalBytes = Object.values(langMap).reduce(
      (acc, stat) => acc + stat.bytes,
      0
    );

    // Build response array using *average per‑contributor bytes per project* for percentages
    const rawItems = Object.entries(langMap).map(([language, stat]) => {
      const avgBytes = stat.projects > 0 ? stat.bytes / stat.projects : 0;
      return {
        language,
        projects: stat.projects,
        bytes: stat.bytes, // now interpreted as aggregated per‑contributor bytes
        avgBytes,
      };
    });

    const totalAvgBytes = rawItems.reduce(
      (acc, it) => acc + it.avgBytes,
      0
    );

    const items = rawItems
      .map((it) => ({
        ...it,
        percentage:
          totalAvgBytes > 0
            ? Math.round((it.avgBytes / totalAvgBytes) * 100)
            : 0,
      }))
      .sort((a, b) => b.avgBytes - a.avgBytes || b.projects - a.projects);

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