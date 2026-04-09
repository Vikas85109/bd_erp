import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, ChevronDown, LogOut, User } from 'lucide-react';

export default function Navbar({ sidebarWidth }) {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  return (
    <header
      className="glass fixed right-0 top-0 z-20 flex h-16 items-center justify-between border-b border-surface-border/60 px-6 transition-all duration-300"
      style={{ left: sidebarWidth }}
    >
      {/* Search */}
      <div className="relative max-w-md flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-muted" />
        <input
          type="text"
          placeholder="Search leads, quotations..."
          className="w-full rounded-xl border border-surface-border bg-white/60 py-2 pl-10 pr-4 text-sm outline-none transition-all duration-200 focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/20"
        />
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <button className="rounded-xl p-2.5 text-surface-muted transition-colors hover:bg-surface-bg hover:text-secondary-900">
          <Bell className="h-5 w-5" />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowProfile((s) => !s)}
            className="flex items-center gap-2 rounded-xl p-1.5 transition-colors hover:bg-surface-bg"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary-100 bg-primary-50 text-sm font-bold text-primary-600">
              PS
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold text-secondary-900">Priya Sharma</p>
              <p className="text-xs text-surface-muted">Sales Manager</p>
            </div>
            <ChevronDown className="h-4 w-4 text-surface-muted" />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-14 w-56 overflow-hidden rounded-2xl border border-surface-border bg-white/95 shadow-xl backdrop-blur-xl">
              <div className="p-3">
                <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-surface-muted transition-colors hover:bg-surface-bg hover:text-secondary-900">
                  <User className="h-4 w-4" /> My Profile
                </button>
                <div className="my-1 border-t border-surface-border" />
                <button
                  onClick={() => navigate('/login')}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-error-500 transition-colors hover:bg-error-50"
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
