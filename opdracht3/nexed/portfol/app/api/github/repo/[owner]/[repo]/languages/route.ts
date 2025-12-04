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

    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, {
      headers,
      cache: "no-store", // Don't cache to avoid stale data
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => "");
      console.error(`GitHub API error ${res.status} for ${owner}/${repo}/languages:`, errorText);
      return NextResponse.json(
        { ok: false, error: `GitHub API error: ${res.status}${errorText ? ` - ${errorText}` : ""}` },
        { status: res.status }
      );
    }

    const langs: Record<string, number> = await res.json();
    const total = Object.values(langs).reduce((a, b) => a + b, 0);
    const items = Object.entries(langs)
      .map(([name, bytes]) => ({
        name,
        bytes,
        percent: total > 0 ? (bytes / total) * 100 : 0,
      }))
      .sort((a, b) => b.bytes - a.bytes);

    return NextResponse.json({ ok: true, data: items });
  } catch (error) {
    console.error("Error fetching GitHub languages:", error);
    return NextResponse.json(
      { ok: false, error: "Error fetching languages" },
      { status: 500 }
    );
  }
}

