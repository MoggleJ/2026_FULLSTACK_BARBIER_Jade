import { AppTile } from "../components/AppTile";
import { Filter } from "lucide-react";
import { useState } from "react";
import { useWorkspace } from "../hooks/useWorkspace";
import { mjTvApps, mjTvCategories, mjDesktopApps, mjDesktopCategories } from "../data/apps";

export function AllApps() {
  const { workspace } = useWorkspace();
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Get apps and categories based on current workspace
  const allApps = workspace === "mj-tv" ? mjTvApps : mjDesktopApps;
  const categories = workspace === "mj-tv" ? mjTvCategories : mjDesktopCategories;

  const filteredApps = selectedCategory === "All" 
    ? allApps 
    : allApps.filter(app => app.category === selectedCategory);

  return (
    <div className="py-8 px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">All Apps</h1>
        <p className="text-zinc-400">Browse all available applications in {workspace === "mj-tv" ? "MJ TV" : "MJ Desktop"}</p>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-semibold">Filter by Category</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full transition-colors ${
                selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Apps Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {filteredApps.map((app) => (
          <AppTile key={app.id} {...app} size="medium" />
        ))}
      </div>

      {filteredApps.length === 0 && (
        <div className="text-center py-12">
          <p className="text-zinc-400 text-lg">No apps found in this category</p>
        </div>
      )}
    </div>
  );
}