import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  Bot,
  CalendarCheck,
  Kanban,
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/leads', icon: Users, label: 'Leads' },
  { to: '/quotations', icon: FileText, label: 'Quotations' },
  { to: '/ai-assistant', icon: Bot, label: 'AI Assistant' },
  { to: '/follow-ups', icon: CalendarCheck, label: 'Follow-ups' },
  { to: '/crm', icon: Kanban, label: 'CRM Pipeline' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`fixed left-0 top-0 z-30 flex h-screen flex-col border-r border-surface-border bg-white transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-surface-border px-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 border border-primary-100">
          <Zap className="h-5 w-5 text-primary-500" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-lg font-bold text-secondary-900">LeadFlow</h1>
            <p className="text-xs text-surface-muted">Sales CRM</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3">
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3 py-2.5 font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-50 text-primary-600 border border-primary-100'
                    : 'text-surface-muted hover:bg-surface-bg hover:text-secondary-800'
                } ${collapsed ? 'justify-center' : ''}`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={`h-5 w-5 shrink-0 ${
                      isActive ? 'text-primary-500' : 'text-surface-muted group-hover:text-primary-400'
                    }`}
                  />
                  {!collapsed && <span className="text-sm">{item.label}</span>}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Collapse Toggle */}
      <div className="border-t border-surface-border p-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium text-surface-muted transition-all duration-200 hover:bg-surface-bg hover:text-secondary-900"
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
