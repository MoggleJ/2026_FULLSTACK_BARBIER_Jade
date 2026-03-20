import { useLocation, useNavigate } from "react-router";
import { useEffect } from "react";

export type Workspace = "mj-tv" | "mj-desktop";

export function useWorkspace(): { workspace: Workspace; setWorkspace: (workspace: Workspace) => void } {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine current workspace based on path
  const workspace: Workspace = location.pathname.startsWith("/mj-desktop") ? "mj-desktop" : "mj-tv";

  const setWorkspace = (newWorkspace: Workspace) => {
    if (newWorkspace === "mj-desktop") {
      navigate("/mj-desktop");
    } else {
      navigate("/");
    }
  };

  // Store last workspace in localStorage
  useEffect(() => {
    localStorage.setItem("lastWorkspace", workspace);
  }, [workspace]);

  return { workspace, setWorkspace };
}

export function getLastWorkspace(): Workspace {
  const lastWorkspace = localStorage.getItem("lastWorkspace");
  return (lastWorkspace === "mj-desktop" ? "mj-desktop" : "mj-tv") as Workspace;
}
