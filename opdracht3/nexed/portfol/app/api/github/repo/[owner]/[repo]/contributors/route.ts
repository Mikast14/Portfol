import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ owner: string; repo: string }> | { owner: string; repo: string } }
) {
  try {
    const resolved = params instanceof Promise ? await params : params;
    const { owner, repo } = resolved;
    const { searchParams } = new URL(request.url);
    const perPage = searchParams.get("per_page") || "10";

    const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.NEXT_PUBLIC_GITHUB_TOKEN;
    const headers: HeadersInit = {
      "User-Agent": "PortfolApp",
      Accept: "application/vnd.github.v3+json",
    };

    if (GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
    }

    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contributors?per_page=${perPage}`,
      {
        headers,
        next: { revalidate: 1200 }, // Cache for 20 minutes
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: `GitHub API error: ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    const simplified = (Array.isArray(data) ? data : []).map((c: any) => ({
      id: c.id,
      login: c.login,
      avatar_url: c.avatar_url,
      html_url: c.html_url,
      contributions: c.contributions,
    }));

    return NextResponse.json({ ok: true, data: simplified });
  } catch (error) {
    console.error("Error fetching GitHub contributors:", error);
    return NextResponse.json(
      { ok: false, error: "Error fetching contributors" },
      { status: 500 }
    );
  }
}

