import { AppTile } from "../components/AppTile";
import { Clock, TrendingUp } from "lucide-react";
import { mjTvApps } from "../data/apps";

export function Hub() {
  // Get apps by category from the centralized data
  const streamingApps = mjTvApps.filter(app => app.category === "Streaming");
  const entertainmentApps = mjTvApps.filter(app => app.category === "Entertainment");
  const musicApps = mjTvApps.filter(app => app.category === "Music");
  const sportsApps = mjTvApps.filter(app => app.category === "Sports");
  const newsApps = mjTvApps.filter(app => app.category === "News");
  const gamesApps = mjTvApps.filter(app => app.category === "Games");
  
  // Recently used apps (first 4 streaming apps)
  const recentApps = streamingApps.slice(0, 4);

  return (
    <div className="py-8 px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Welcome to MJ TV</h1>
        <p className="text-zinc-400">Choose an app to start watching</p>
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

      {/* Streaming Services */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-6 h-6 text-blue-500" />
          <h2 className="text-2xl font-semibold">Streaming Services</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {streamingApps.map((app) => (
            <AppTile key={app.id} {...app} size="medium" />
          ))}
        </div>
      </section>

      {/* Entertainment */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Entertainment & Music</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {[...entertainmentApps, ...musicApps].map((app) => (
            <AppTile key={app.id} {...app} size="medium" />
          ))}
        </div>
      </section>

      {/* Sports */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Sports</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {sportsApps.map((app) => (
            <AppTile key={app.id} {...app} size="medium" />
          ))}
        </div>
      </section>

      {/* News */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">News & Information</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {newsApps.map((app) => (
            <AppTile key={app.id} {...app} size="medium" />
          ))}
        </div>
      </section>

      {/* Games */}
      {gamesApps.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Games</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {gamesApps.map((app) => (
              <AppTile key={app.id} {...app} size="medium" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}