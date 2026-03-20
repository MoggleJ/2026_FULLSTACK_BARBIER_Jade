import { Search as SearchIcon } from "lucide-react";
import { useState } from "react";
import { AppTile } from "../components/AppTile";
import { useWorkspace } from "../hooks/useWorkspace";
import { mjTvApps, mjDesktopApps } from "../data/apps";

export function SearchApps() {
  const { workspace } = useWorkspace();
  const [searchQuery, setSearchQuery] = useState("");

  // Get apps based on current workspace
  const allApps = workspace === "mj-tv" ? mjTvApps : mjDesktopApps;

  const filteredApps = searchQuery
    ? allApps.filter((app) =>
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const popularSearches = workspace === "mj-tv" 
    ? ["Netflix", "Disney+", "YouTube", "Spotify", "HBO Max", "Prime Video"]
    : ["VS Code", "Figma", "Chrome", "Notion", "Docker", "Slack"];
  const trendingApps = allApps.slice(0, 12);

  return (
    <div className="py-8 px-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-6">Search Apps</h1>
        
        {/* Search Input */}
        <div className="relative max-w-3xl">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-400" />
          <input
            type="text"
            placeholder={`Search in ${workspace === "mj-tv" ? "MJ TV" : "MJ Desktop"}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-4 py-5 bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-zinc-500 text-lg"
          />
        </div>
      </div>

      {/* Search Results */}
      {searchQuery && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">
            {filteredApps.length > 0
              ? `Found ${filteredApps.length} results for "${searchQuery}"`
              : `No results found for "${searchQuery}"`}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {filteredApps.map((app) => (
              <AppTile key={app.id} {...app} size="medium" />
            ))}
          </div>
        </div>
      )}

      {/* Popular Searches & Trending */}
      {!searchQuery && (
        <div>
          {/* Popular Searches */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Popular Searches</h2>
            <div className="flex flex-wrap gap-3">
              {popularSearches.map((search) => (
                <button
                  key={search}
                  onClick={() => setSearchQuery(search)}
                  className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 rounded-full transition-colors text-lg"
                >
                  {search}
                </button>
              ))}
            </div>
          </section>

          {/* Trending Apps */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">Trending Apps</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {trendingApps.map((app) => (
                <AppTile key={app.id} {...app} size="medium" />
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}