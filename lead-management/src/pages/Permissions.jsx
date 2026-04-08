import { useState } from 'react';
import { Search, RotateCcw, Save } from 'lucide-react';
import { users, getInitials } from '../data/users';

const RESOURCES = [
  { key: 'dashboard', name: 'Dashboard', desc: 'View dashboard analytics' },
  { key: 'leads', name: 'Leads', desc: 'Manage sales leads' },
  { key: 'followups', name: 'Follow-ups', desc: 'Manage lead follow-ups' },
  { key: 'quotations', name: 'Quotations', desc: 'Manage quotations' },
  { key: 'clients', name: 'Clients', desc: 'Manage client organizations' },
  { key: 'products', name: 'Products', desc: 'Manage product catalog' },
  { key: 'users', name: 'Users', desc: 'Manage team members' },
];

const ACTIONS = ['read', 'create', 'update', 'delete'];

const defaultPerms = () => {
  const map = {};
  RESOURCES.forEach((r) => {
    map[r.key] = { read: true, create: false, update: false, delete: false };
  });
  map.dashboard = { read: true, create: true, update: true, delete: true };
  map.followups.create = true;
  return map;
};

export default function Permissions() {
  const [selectedId, setSelectedId] = useState(users[0].id);
  const [query, setQuery] = useState('');
  const [perms, setPerms] = useState(defaultPerms());

  const selected = users.find((u) => u.id === selectedId);
  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase())
  );

  const toggle = (resKey, action) => {
    setPerms((p) => ({
      ...p,
      [resKey]: { ...p[resKey], [action]: !p[resKey][action] },
    }));
  };

  const toggleAll = (resKey) => {
    const allOn = ACTIONS.every((a) => perms[resKey][a]);
    setPerms((p) => ({
      ...p,
      [resKey]: ACTIONS.reduce((acc, a) => ({ ...acc, [a]: !allOn }), {}),
    }));
  };

  const isAll = (resKey) => ACTIONS.every((a) => perms[resKey][a]);

  const roleBadge = (role) =>
    role === 'SUPER_ADMIN'
      ? 'bg-primary-50 text-primary-600 border border-primary-100'
      : 'bg-surface-bg text-secondary-800 border border-surface-border';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Permissions</h1>
        <p className="text-sm text-surface-muted mt-1">Manage user permissions and access control</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        {/* User list */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-muted" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search users..."
              className="w-full rounded-xl border border-surface-border bg-white py-2.5 pl-10 pr-4 text-sm placeholder:text-surface-muted focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div className="space-y-2">
            {filtered.map((u) => {
              const active = u.id === selectedId;
              return (
                <button
                  key={u.id}
                  onClick={() => setSelectedId(u.id)}
                  className={`w-full text-left rounded-xl border px-4 py-3 transition-all ${
                    active
                      ? 'border-primary-200 bg-primary-50/60 ring-1 ring-primary-100'
                      : 'border-surface-border bg-white hover:bg-surface-bg/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-secondary-900 truncate">{u.name}</p>
                      <p className="text-xs text-surface-muted truncate">{u.email}</p>
                    </div>
                    <span className={`shrink-0 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide ${roleBadge(u.role)}`}>
                      {u.role}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Permissions panel */}
        <div className="rounded-2xl border border-surface-border bg-white">
          {/* Panel header */}
          <div className="flex items-start justify-between gap-4 border-b border-surface-border p-5">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-50 border border-primary-100 text-sm font-semibold text-primary-600">
                {getInitials(selected.name)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-secondary-900 truncate">{selected.name}</h2>
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide ${roleBadge(selected.role)}`}>
                    {selected.role}
                  </span>
                </div>
                <p className="text-xs text-surface-muted truncate">{selected.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setPerms(defaultPerms())}
                className="flex items-center gap-2 rounded-xl border border-surface-border bg-white px-3 py-2 text-sm font-medium text-secondary-800 hover:bg-surface-bg"
              >
                <RotateCcw className="h-4 w-4" />
                Reset to Defaults
              </button>
              <button className="flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600">
                <Save className="h-4 w-4" />
                Save
              </button>
            </div>
          </div>

          {/* Resource table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-border bg-surface-bg/40">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-surface-muted uppercase tracking-wider">Resource</th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-surface-muted uppercase tracking-wider">Read</th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-surface-muted uppercase tracking-wider">Create</th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-surface-muted uppercase tracking-wider">Update</th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-surface-muted uppercase tracking-wider">Delete</th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-surface-muted uppercase tracking-wider">All</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {RESOURCES.map((r) => (
                  <tr key={r.key} className="hover:bg-surface-bg/30 transition-colors">
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-secondary-900">{r.name}</p>
                      <p className="text-xs text-surface-muted">{r.desc}</p>
                    </td>
                    {ACTIONS.map((a) => (
                      <td key={a} className="px-3 py-4 text-center">
                        <Checkbox
                          checked={perms[r.key][a]}
                          onChange={() => toggle(r.key, a)}
                        />
                      </td>
                    ))}
                    <td className="px-3 py-4 text-center">
                      <Checkbox
                        checked={isAll(r.key)}
                        onChange={() => toggleAll(r.key)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function Checkbox({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`inline-flex h-5 w-5 items-center justify-center rounded-md border transition-all ${
        checked
          ? 'bg-primary-500 border-primary-500 text-white'
          : 'bg-white border-surface-border hover:border-primary-300'
      }`}
    >
      {checked && (
        <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M16.704 5.29a1 1 0 010 1.42l-7.5 7.5a1 1 0 01-1.42 0l-3.5-3.5a1 1 0 011.42-1.42L8.5 12.08l6.79-6.79a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </button>
  );
}
