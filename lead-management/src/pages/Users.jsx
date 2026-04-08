import { useState } from 'react';
import { Search, Plus, List, LayoutGrid, MoreHorizontal } from 'lucide-react';
import { users, getInitials } from '../data/users';

export default function Users() {
  const [view, setView] = useState('list');
  const [query, setQuery] = useState('');

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase())
  );

  const roleBadge = (role) =>
    role === 'SUPER_ADMIN'
      ? 'bg-primary-50 text-primary-600 border border-primary-100'
      : 'bg-surface-bg text-secondary-800 border border-surface-border';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Users</h1>
          <p className="text-sm text-surface-muted mt-1">Manage your team members</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 transition-colors">
          <Plus className="h-4 w-4" />
          Add User
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users..."
            className="w-full rounded-xl border border-surface-border bg-white py-2.5 pl-10 pr-4 text-sm placeholder:text-surface-muted focus:outline-none focus:ring-2 focus:ring-primary-100"
          />
        </div>
        <div className="flex items-center rounded-xl border border-surface-border bg-white p-1">
          <button
            onClick={() => setView('list')}
            className={`rounded-lg p-1.5 ${view === 'list' ? 'bg-surface-bg text-secondary-900' : 'text-surface-muted'}`}
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => setView('grid')}
            className={`rounded-lg p-1.5 ${view === 'grid' ? 'bg-surface-bg text-secondary-900' : 'text-surface-muted'}`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-surface-border bg-white overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-surface-border bg-surface-bg/40">
              <th className="px-6 py-3 text-left text-xs font-semibold text-surface-muted uppercase tracking-wider">#</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-surface-muted uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-surface-muted uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-surface-muted uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-surface-muted uppercase tracking-wider">Joined</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border">
            {filtered.map((u, idx) => (
              <tr key={u.id} className="hover:bg-surface-bg/40 transition-colors">
                <td className="px-6 py-4 text-sm text-surface-muted">{idx + 1}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-50 border border-primary-100 text-sm font-semibold text-primary-600">
                      {getInitials(u.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-secondary-900 truncate">{u.name}</p>
                      <p className="text-xs text-surface-muted truncate">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide ${roleBadge(u.role)}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-50 px-2.5 py-1 text-xs font-medium text-accent-600 border border-accent-100">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent-500"></span>
                    {u.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-surface-muted">{u.joined}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-surface-muted hover:text-secondary-900">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
