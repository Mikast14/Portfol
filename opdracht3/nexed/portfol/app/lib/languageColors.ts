export const languageColors: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Java: "#b07219",
  C: "#555555",
  "C#": "#178600",
  "C++": "#f34b7d",
  Go: "#00ADD8",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Rust: "#dea584",
  Kotlin: "#A97BFF",
  Swift: "#F05138",
  Dart: "#00B4AB",
  Shell: "#89e051",
  HTML: "#e34c26",
  CSS: "#563d7c",
  SCSS: "#c6538c",
  SASS: "#a53b70",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  Solidity: "#AA6746",
  Lua: "#000080",
};

const hash = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
  }
  return h;
};

export const getLanguageColor = (lang: string) =>
  languageColors[lang] || `hsl(${Math.abs(hash(lang)) % 360} 70% 50%)`;
