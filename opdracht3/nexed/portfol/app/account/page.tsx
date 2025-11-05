import Navbar from "../Navbar";

export default async function Account() {
    const name = "Mikert1";

    const userRes = await fetch(`https://api.github.com/users/${name}`, { next: { revalidate: 60 } });
    const user = await userRes.json();
    console.log(user);


        const reposRes = await fetch(
            `https://api.github.com/users/${name}/repos?sort=updated&per_page=5`,
            { next: { revalidate: 60 } }
        );
        const repos = reposRes.ok ? await reposRes.json() : [];

    return (
        <div>
            <Navbar />
            <div className="ml-[10%] mr-[10%]">
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