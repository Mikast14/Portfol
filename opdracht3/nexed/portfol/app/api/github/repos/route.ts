import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username") || "mikast14";

    const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.NEXT_PUBLIC_GITHUB_TOKEN;
    const headers: HeadersInit = {
      "User-Agent": "PortfolApp",
      Accept: "application/vnd.github.v3+json",
    };

    if (GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
    }

    const reposRes = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`,
      {
        headers,
        next: { revalidate: 60 },
      }
    );

    if (!reposRes.ok) {
      return NextResponse.json(
        { ok: false, error: `GitHub API error: ${reposRes.status}` },
        { status: reposRes.status }
      );
    }

    const repos = await reposRes.json();

    // Format repos for dropdown (id, name, full_name, html_url)
    const formattedRepos = repos.map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      htmlUrl: repo.html_url,
      description: repo.description || "",
    }));

    return NextResponse.json({ ok: true, data: formattedRepos });
  } catch (error) {
    console.error("Error fetching GitHub repos:", error);
    return NextResponse.json(
      { ok: false, error: "Error fetching repositories" },
      { status: 500 }
    );
  }
}

