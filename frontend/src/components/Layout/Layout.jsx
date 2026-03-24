import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar.jsx';
import { useSettings } from '../../hooks/useSettings.js';
import './Layout.css';

export default function Layout() {
  const { loadFromDB } = useSettings();

  useEffect(() => {
    loadFromDB();
  }, [loadFromDB]);

  return (
    <div className="layout">
      <Sidebar />
      <main className="layout-main">
        <Outlet />
      </main>
    </div>
  );
}
