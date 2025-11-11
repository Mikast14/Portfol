import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username") || "mikast14";

    const reposRes = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`,
      { next: { revalidate: 60 } }
    );

    if (!reposRes.ok) {
      return NextResponse.json(
        { ok: false, error: "Failed to fetch repositories" },
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

