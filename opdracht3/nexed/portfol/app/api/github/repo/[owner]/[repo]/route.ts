import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ owner: string; repo: string }> | { owner: string; repo: string } }
) {
  try {
    const resolved = params instanceof Promise ? await params : params;
    const { owner, repo } = resolved;

    const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.NEXT_PUBLIC_GITHUB_TOKEN;
    const headers: HeadersInit = {
      "User-Agent": "PortfolApp",
      Accept: "application/vnd.github.v3+json",
    };

    if (GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
    }

    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers,
      next: { revalidate: 1200 }, // Cache for 20 minutes
    });

    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: `GitHub API error: ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    const simplified = {
      id: data.id,
      stargazers_count: data.stargazers_count,
      forks_count: data.forks_count,
      language: data.language,
      updated_at: data.updated_at,
      homepage: data.homepage,
      html_url: data.html_url,
    };

    return NextResponse.json({ ok: true, data: simplified });
  } catch (error) {
    console.error("Error fetching GitHub repo:", error);
    return NextResponse.json(
      { ok: false, error: "Error fetching repository info" },
      { status: 500 }
    );
  }
}

