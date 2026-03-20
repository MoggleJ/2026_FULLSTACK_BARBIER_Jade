import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Hub } from "./pages/Hub";
import { MJDesktop } from "./pages/MJDesktop";
import { AllApps } from "./pages/AllApps";
import { SearchApps } from "./pages/SearchApps";
import { Settings } from "./pages/Settings";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Hub },
      { path: "mj-desktop", Component: MJDesktop },
      { path: "all-apps", Component: AllApps },
      { path: "search", Component: SearchApps },
      { path: "settings", Component: Settings },
    ],
  },
]);