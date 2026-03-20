import { Outlet, NavLink, useLocation } from "react-router";
import { Grid3x3, Search, Settings, Clock, Tv, Monitor } from "lucide-react";
import { useWorkspace } from "../hooks/useWorkspace";

export function Layout() {
  const { workspace } = useWorkspace();
  const location = useLocation();

  // Navigation items that depend on workspace context
  const contextualNavItems = [
    { path: workspace === "mj-tv" ? "/" : "/mj-desktop", icon: workspace === "mj-tv" ? Tv : Monitor, label: workspace === "mj-tv" ? "MJ TV" : "MJ Desktop", exactMatch: true },
    { path: "/all-apps", icon: Grid3x3, label: "All Apps", exactMatch: false },
    { path: "/search", icon: Search, label: "Search", exactMatch: false },
    { path: "/settings", icon: Settings, label: "Settings", exactMatch: false },
    { path: workspace === "mj-tv" ? "/mj-desktop" : "/", icon: workspace === "mj-tv" ? Monitor : Tv, label: workspace === "mj-tv" ? "MJ Desktop" : "MJ TV", exactMatch: true },
  ];

  return (
    <div className="flex h-screen bg-zinc-950 text-white">
      {/* Sidebar Navigation */}
      <aside className="w-20 lg:w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col">
        <div className="p-6 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Tv className="w-6 h-6" />
            </div>
            <div className="hidden lg:block">
              <h1 className="text-xl font-bold">MJ TV</h1>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 py-6">
          {contextualNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exactMatch}
              className={({ isActive }) =>
                `flex items-center gap-4 px-6 py-4 hover:bg-zinc-800 transition-colors ${
                  isActive ? "bg-zinc-800 border-l-4 border-blue-500" : ""
                }`
              }
            >
              <item.icon className="w-6 h-6 shrink-0" />
              <span className="hidden lg:block">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        
        <div className="p-6 border-t border-zinc-800">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Clock className="w-4 h-4" />
            <span className="hidden lg:block">
              {new Date().toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}