import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const sidebarWidth = collapsed ? '5rem' : '16rem';

  return (
    <div className="min-h-screen bg-surface-bg">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <Navbar sidebarWidth={sidebarWidth} />
      <main
        className="pt-16 transition-all duration-300"
        style={{ marginLeft: sidebarWidth }}
      >
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
