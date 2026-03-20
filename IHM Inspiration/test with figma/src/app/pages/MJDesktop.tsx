import { AppTile } from "../components/AppTile";
import { Clock, TrendingUp } from "lucide-react";
import { mjDesktopApps } from "../data/apps";

export function MJDesktop() {
  // Get apps by category from the centralized data
  const developmentApps = mjDesktopApps.filter(app => app.category === "Development");
  const designApps = mjDesktopApps.filter(app => app.category === "Design");
  const productivityApps = mjDesktopApps.filter(app => app.category === "Productivity");
  const browsersApps = mjDesktopApps.filter(app => app.category === "Browsers");
  const myApps = mjDesktopApps.filter(app => app.category === "MyApps");
  
  // Recently used apps (first 4 development apps)
  const recentApps = developmentApps.slice(0, 4);

  return (
    <div className="py-8 px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Welcome to MJ Desktop</h1>
        <p className="text-zinc-400">Access your productivity and development tools</p>
      </div>

      {/* Recently Used */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <Clock className="w-6 h-6 text-blue-500" />
          <h2 className="text-2xl font-semibold">Recently Used</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {recentApps.map((app) => (
            <AppTile key={app.id} {...app} size="medium" />
          ))}
        </div>
      </section>

      {/* Performance & Development */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-6 h-6 text-blue-500" />
          <h2 className="text-2xl font-semibold">Development Tools</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {developmentApps.map((app) => (
            <AppTile key={app.id} {...app} size="medium" />
          ))}
        </div>
      </section>

      {/* Design */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Design & Creative</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {designApps.map((app) => (
            <AppTile key={app.id} {...app} size="medium" />
          ))}
        </div>
      </section>

      {/* Productivity */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Productivity</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {productivityApps.map((app) => (
            <AppTile key={app.id} {...app} size="medium" />
          ))}
        </div>
      </section>

      {/* Browsers */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Browsers</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {browsersApps.map((app) => (
            <AppTile key={app.id} {...app} size="medium" />
          ))}
        </div>
      </section>

      {/* My Apps */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">My Apps</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {myApps.map((app) => (
            <AppTile key={app.id} {...app} size="medium" />
          ))}
        </div>
      </section>
    </div>
  );
}