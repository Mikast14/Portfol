import Navbar from "../Navbar";
// import Projects from "./projects";

export default async function Account() {
    const name = "Danielo923";

    const userRes = await fetch(`https://api.github.com/users/${name}`, { next: { revalidate: 60 } });
    const user = await userRes.json();
    console.log(user);


    const reposRes = await fetch(
        `https://api.github.com/users/${name}/repos?sort=updated&per_page=8`,
        { next: { revalidate: 60 } }
    );
    const repos = reposRes.ok ? await reposRes.json() : [];

    return (
        <div>
            <Navbar />
            <div className="ml-[15%] mr-[15%]">
                {userRes.ok ? (
                    <div>
                        <h1>{user.name ?? user.login}</h1>
                        <img src={user.avatar_url} alt={`${user.login} avatar`} width={96} height={96} />
                        <p>
                            <a href={user.html_url} target="_blank" rel="noreferrer">
                                View on GitHub
                            </a>
                        </p>
                        <div className="flex gap-[6px] items-center border rounded-full p-[3px_6px] border-green-500 max-w-max">
                            <div className="bg-green-500 rounded-full w-[20px] h-[20px]"></div>
                            <p className="text-green-500">Connected</p>
                        </div>
                        {Array.isArray(repos) && repos.length > 0 ? (
                            <div>
                                <h2>Recent repos</h2>
                                <ul>
                                    {repos.map((repo: any) => (
                                        <li key={repo.id} className="p-4 border rounded-lg mb-4 hover:shadow-lg transition-shadow">
                                            <div className="flex justify-between items-start">
                                                <a href={repo.html_url} target="_blank" rel="noreferrer" className="text-xl font-medium hover:text-blue-600">
                                                    {repo.name}
                                                </a>
                                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                                    <span>⭐ {repo.stargazers_count}</span>
                                                    <span>🔄 {repo.forks_count}</span>
                                                </div>
                                            </div>
                                            {repo.description && <p className="text-gray-600 mt-2">{repo.description}</p>}
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {repo.language && (
                                                    <span className="px-2 py-1 bg-gray-100 text-black rounded-full text-sm">
                                                        {repo.language}
                                                    </span>
                                                )}
                                                <span className={`text-sm rounded-full px-2 py-1 ${
                                                    new Date().getTime() - new Date(repo.updated_at).getTime() < 14 * 24 * 60 * 60 * 1000
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {new Date().getTime() - new Date(repo.updated_at).getTime() < 14 * 24 * 60 * 60 * 1000
                                                        ? 'Active'
                                                        : 'Inactive'}
                                                </span>
                                                {repo.homepage && (
                                                    <a href={repo.homepage} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline text-sm">
                                                        Demo/Website
                                                    </a>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <p>No repositories found.</p>
                        )}
                    </div>
                ) : (
                    <div className="relative group inline-block">
                        <div className="flex gap-[6px] items-center border rounded-full p-[3px_6px] border-red-500 max-w-max">
                            <div className="bg-red-500 rounded-full w-[20px] h-[20px]"></div>
                            <p className="text-red-500">Not Connected</p>
                        </div>

                        <div id="tooltip-default" role="tooltip" className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700">
                            Tooltip content
                            <div className="tooltip-arrow" data-popper-arrow></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}