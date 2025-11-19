"use client";

import { useEffect, useState, useMemo } from "react";
import Navbar from "../Navbar";

type Repo = {
  id: number;
  name: string;
  html_url: string;
  description?: string;
  stargazers_count: number;
  forks_count: number;
  language?: string;
  updated_at: string;
  homepage?: string;
  [k: string]: any;
};

type Contributor = {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
};

export default function Account() {
  const name = "Danielo923";
  const [user, setUser] = useState<any | null>(null);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contributors, setContributors] = useState<Record<number, Contributor[]>>({});

  // Filters
  const [activityFilter, setActivityFilter] = useState<"all" | "active" | "inactive">("all");
  const [languageFilter, setLanguageFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  // Fetch GitHub data
  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [userRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${name}`),
          fetch(`https://api.github.com/users/${name}/repos?sort=updated&per_page=100`)
        ]);

        if (!userRes.ok) throw new Error("Failed to fetch user");
        if (!reposRes.ok) throw new Error("Failed to fetch repos");

        const userData = await userRes.json();
        const reposData: Repo[] = await reposRes.json();

        if (!mounted) return;
        setUser(userData);
        setRepos(Array.isArray(reposData) ? reposData : []);
      } catch (e: any) {
        if (mounted) setError(e.message || "Error fetching data");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [name]);

  // Contributors fetch
  useEffect(() => {
    if (!user || repos.length === 0) return;
    const owner = user.login;
    (async () => {
      const map: Record<number, Contributor[]> = {};
      await Promise.all(
        repos.map(async (r) => {
          try {
            const res = await fetch(`https://api.github.com/repos/${owner}/${r.name}/contributors?per_page=10`);
            if (res.ok) map[r.id] = await res.json();
          } catch {}
        })
      );
      setContributors(map);
    })();
  }, [user, repos]);

  // Unique languages
  const languages = useMemo(
    () =>
      ["all", ...Array.from(new Set(repos.map(r => r.language).filter(Boolean)))],
    [repos]
  );

  // Filtered repos
  const filtered = useMemo(() => {
    const now = Date.now();
    return repos
      .filter(r => {
        const active = now - new Date(r.updated_at).getTime() < 14 * 24 * 60 * 60 * 1000;
        if (activityFilter === "active" && !active) return false;
        if (activityFilter === "inactive" && active) return false;
        return true;
      })
      .filter(r => {
        if (languageFilter === "all") return true;
        return r.language === languageFilter;
      })
      .filter(r => {
        if (!search.trim()) return true;
        return (
          r.name.toLowerCase().includes(search.toLowerCase()) ||
          (r.description || "").toLowerCase().includes(search.toLowerCase())
        );
      });
  }, [repos, activityFilter, languageFilter, search]);

  return (
    <div>
      <Navbar />
      <div
        className="bg-white pt-[150px]"
        style={{ backgroundImage: "url('/background.png')" }}
      >
        <div className="ml-[15%] mr-[15%] bg-white text-black rounded-[24px] p-6 shadow-elevated">
          {loading && <p>Loading...</p>}
          {error && (
            <div className="mb-4">
              <div className="flex gap-2 items-center border rounded-full px-3 py-1 border-red-500 max-w-max">
                <div className="bg-red-500 rounded-full w-4 h-4" />
                <p className="text-red-500">Not Connected</p>
              </div>
              <p className="text-red-600 mt-2 text-sm">{error}</p>
            </div>
          )}
          {!loading && !error && user && (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold">{user.name ?? user.login}</h1>
                <img
                  src={user.avatar_url}
                  alt={`${user.login} avatar`}
                  width={96}
                  height={96}
                  className="rounded-full mt-2"
                />
                <p className="mt-2">
                  <a
                    href={user.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View on GitHub
                  </a>
                </p>
                <div className="flex gap-2 items-center border rounded-full px-3 py-1 border-green-500 mt-3 max-w-max">
                  <div className="bg-green-500 rounded-full w-4 h-4" />
                  <p className="text-green-600 text-sm">Connected</p>
                </div>
              </div>

              {/* Filters */}
              <div className="mb-6 space-y-4">
                <div className="flex flex-wrap gap-2">
                  {["all", "active", "inactive"].map(v => (
                    <button
                      key={v}
                      onClick={() => setActivityFilter(v as any)}
                      className={`px-4 py-2 rounded-full text-sm border ${activityFilter === v
                          ? "bg-black text-white border-black"
                          : "bg-gray-100 text-black border-gray-300 hover:bg-gray-200"
                        } transition`}
                    >
                      {v.charAt(0).toUpperCase() + v.slice(1)}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3 items-center">
                  <select
                    value={languageFilter}
                    onChange={e => setLanguageFilter(e.target.value)}
                    className="px-4 py-2 rounded-full text-sm border border-gray-300 bg-white"
                  >
                    {languages.map(l => (
                      <option key={l} value={l}>
                        {l === "all" ? "All languages" : l}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Search name or description..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="px-4 py-2 rounded-full text-sm border border-gray-300 flex-1 min-w-[240px]"
                  />
                  <button
                    onClick={() => {
                      setActivityFilter("all");
                      setLanguageFilter("all");
                      setSearch("");
                    }}
                    className="px-4 py-2 rounded-full text-sm bg-accent text-white hover:bg-primary-hover transition"
                  >
                    Reset
                  </button>
                  <p className="text-xs text-gray-500">
                    Showing {filtered.length} / {repos.length}
                  </p>
                </div>
              </div>

              {/* Repo list */}
              {filtered.length === 0 ? (
                <p className="text-gray-600">No repositories match filters.</p>
              ) : (
                <ul>
                  {filtered.map(repo => {
                    const active =
                      Date.now() - new Date(repo.updated_at).getTime() <
                        14 * 24 * 60 * 60 * 1000;
                    return (
                      <li
                        key={repo.id}
                        className="relative p-4 border rounded-lg mb-4 hover:shadow-lg transition-shadow"
                      >
                        <div className="flex justify-between items-start">
                          <a
                            href={repo.html_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xl font-medium hover:text-blue-600"
                          >
                            {repo.name}
                          </a>
                          <div className="flex items-center gap-4 text-sm text-black">
                            <span>⭐ {repo.stargazers_count}</span>
                            <span>🔄 {repo.forks_count}</span>
                          </div>
                        </div>
                        {repo.description && (
                          <p className="text-black mt-2">{repo.description}</p>
                        )}
                        <div className="mt-3 flex flex-wrap gap-2">
                          {repo.language && (
                            <span className="px-2 py-1 bg-gray-100 text-black rounded-full text-xs">
                              {repo.language}
                            </span>
                          )}
                          <span
                            className={`text-xs rounded-full px-2 py-1 ${
                              active
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {active ? "Active" : "Inactive"}
                          </span>
                          {repo.homepage && (
                            <a
                              href={repo.homepage}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-500 hover:underline text-xs"
                            >
                              Demo
                            </a>
                          )}
                        </div>

                        {/* bottom-right contributors */}
                        {contributors[repo.id] && contributors[repo.id].length > 0 && (
                          <div className="absolute bottom-3 right-3 flex -space-x-2">
                            {contributors[repo.id].slice(0, 8).map((c) => (
                              <a
                                key={c.id}
                                href={c.html_url}
                                target="_blank"
                                rel="noreferrer"
                                title={c.login}
                                className="block w-7 h-7 rounded-full overflow-hidden border border-white"
                              >
                                <img
                                  src={c.avatar_url}
                                  alt={c.login}
                                  className="w-full h-full object-cover"
                                />
                              </a>
                            ))}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}