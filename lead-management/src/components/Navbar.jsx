import { useState } from 'react';
import { Search, Bell, ChevronDown, Settings, LogOut, User } from 'lucide-react';

export default function Navbar() {
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, text: 'New lead: Sneha Iyer from CloudOps', time: '2m ago', unread: true },
    { id: 2, text: 'Quotation #Q-2847 sent to Meera Nair', time: '1h ago', unread: true },
    { id: 3, text: 'Follow-up due: Call Vikram Singh', time: '3h ago', unread: false },
  ];

  return (
    <header className="glass fixed right-0 top-0 z-20 flex h-16 items-center justify-between border-b border-surface-border/50 px-6 transition-all duration-300"
      style={{ left: 'var(--sidebar-width, 256px)' }}
    >
      {/* Search */}
      <div className="relative max-w-md flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-muted" />
        <input
          type="text"
          placeholder="Search leads, quotations, contacts..."
          className="w-full rounded-xl border border-surface-border bg-white/60 py-2 pl-10 pr-4 text-sm outline-none transition-all duration-200 focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/20"
        />
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
            className="relative rounded-xl p-2.5 text-surface-muted transition-all duration-200 hover:bg-surface-bg hover:text-secondary-900"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-error-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-error-400" />
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 rounded-2xl bg-white/95 shadow-xl backdrop-blur-xl border border-surface-border">
              <div className="border-b border-surface-border p-4">
                <h3 className="font-semibold text-secondary-900">Notifications</h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className={`flex items-start gap-3 px-4 py-3 transition-colors hover:bg-surface-bg ${n.unread ? 'bg-primary-50/50' : ''}`}>
                    <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${n.unread ? 'bg-primary-400' : 'bg-transparent'}`} />
                    <div>
                      <p className="text-sm text-secondary-900">{n.text}</p>
                      <p className="mt-0.5 text-xs text-surface-muted">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-surface-border p-3 text-center">
                <button className="text-sm font-medium text-primary-600 hover:text-primary-700">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
            className="flex items-center gap-2 rounded-xl p-1.5 transition-all duration-200 hover:bg-surface-bg"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 border border-primary-100 text-sm font-bold text-primary-600">
              PS
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold text-secondary-900">Priya Sharma</p>
              <p className="text-xs text-surface-muted">Sales Manager</p>
            </div>
            <ChevronDown className="h-4 w-4 text-surface-muted" />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-14 w-56 rounded-2xl bg-white/95 shadow-xl backdrop-blur-xl border border-surface-border overflow-hidden">
              <div className="p-3">
                <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-surface-muted transition-colors hover:bg-surface-bg hover:text-secondary-900">
                  <User className="h-4 w-4" />
                  My Profile
                </button>
                <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-surface-muted transition-colors hover:bg-surface-bg hover:text-secondary-900">
                  <Settings className="h-4 w-4" />
                  Settings
                </button>
                <div className="my-1 border-t border-surface-border" />
                <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-500 transition-colors hover:bg-red-50">
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
