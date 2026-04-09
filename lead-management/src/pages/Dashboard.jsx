import { Users, IndianRupee, Trophy, FileCheck } from 'lucide-react';
import StatCard from '../components/StatCard';
import Badge from '../components/Badge';
import { getDashboardStats, recentActivity } from '../data/dashboard';
import { leads, statusStyles } from '../data/leads';

const ICONS = [Users, IndianRupee, Trophy, FileCheck];

export default function Dashboard() {
  const stats = getDashboardStats();
  const recentLeads = leads.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Dashboard</h1>
        <p className="mt-1 text-sm text-surface-muted">
          Welcome back, Priya — here&apos;s what&apos;s happening today.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <StatCard key={s.label} {...s} icon={ICONS[i]} />
        ))}
      </div>

      {/* Two-column section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent leads */}
        <div className="rounded-2xl border border-surface-border bg-surface-card lg:col-span-2">
          <div className="flex items-center justify-between border-b border-surface-border px-5 py-4">
            <h2 className="text-sm font-semibold text-secondary-900">Recent Leads</h2>
            <a href="/leads" className="text-xs font-medium text-primary-600 hover:text-primary-700">
              View all →
            </a>
          </div>
          <div className="divide-y divide-surface-border">
            {recentLeads.map((l) => (
              <div
                key={l.id}
                className="flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-surface-bg/60"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary-100 bg-primary-50 text-xs font-bold text-primary-600">
                    {l.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-secondary-900">{l.name}</p>
                    <p className="text-xs text-surface-muted">{l.company}</p>
                  </div>
                </div>
                <Badge className={statusStyles[l.status]}>{l.status}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Activity */}
        <div className="rounded-2xl border border-surface-border bg-surface-card">
          <div className="border-b border-surface-border px-5 py-4">
            <h2 className="text-sm font-semibold text-secondary-900">Recent Activity</h2>
          </div>
          <ul className="space-y-3 p-5">
            {recentActivity.map((a) => (
              <li key={a.id} className="flex gap-3">
                <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary-400" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-secondary-800">{a.text}</p>
                  <p className="mt-0.5 text-xs text-surface-muted">{a.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
