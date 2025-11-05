import Navbar from "../Navbar";

export default async function Account() {
    const userRes = await fetch("https://api.github.com/users/mikert1", { next: { revalidate: 60 } });
    if (!userRes.ok) {
        return (
            <div>
                <Navbar />
                <p>Failed to load GitHub user.</p>
            </div>
        );
    }
    const user = await userRes.json();

    const reposRes = await fetch(
        "https://api.github.com/users/mikert1/repos?sort=updated&per_page=5",
        { next: { revalidate: 60 } }
    );
    const repos = reposRes.ok ? await reposRes.json() : [];

    return (
        <div>
            <Navbar />
            <div>
                <h1>{user.name ?? user.login}</h1>
                <img src={user.avatar_url} alt={`${user.login} avatar`} width={96} height={96} />
                {user.bio && <p>{user.bio}</p>}
                <p>
                    <a href={user.html_url} target="_blank" rel="noreferrer">
                        View on GitHub
                    </a>
                </p>

                <h2>Recent repos</h2>
                <ul>
                    {repos.map((r: any) => (
                        <li key={r.id}>
                            <a href={r.html_url} target="_blank" rel="noreferrer">
                                {r.name}
                            </a>
                            {r.description && <p>{r.description}</p>}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}