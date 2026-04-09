import { useMemo, useState } from 'react';
import {
  Search, Plus, MoreHorizontal, Users as UsersIcon, ShieldCheck, Save,
  LayoutDashboard, FileText, UserCircle, Package, Settings as SettingsIcon,
  Eye, PlusCircle, Pencil, Trash2, Crown, Sparkles,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import Badge from '../components/Badge';
import UserPermissionsDrawer from '../components/UserPermissionsDrawer';
import { users, userStatusStyles, roleStyles } from '../data/users';
import { roles, modules, actions, rolePermissions } from '../data/permissions';

const TABS = [
  { key: 'members', label: 'Team Members',        icon: UsersIcon   },
  { key: 'roles',   label: 'Roles & Permissions', icon: ShieldCheck },
];

export default function Users() {
  const [tab, setTab] = useState('members');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users & Access"
        subtitle="Manage team members and what each role can do."
      />

      {/* Tab switcher */}
      <div className="flex items-center gap-1 rounded-2xl border border-surface-border bg-surface-card p-1.5">
        {TABS.map((t) => {
          const isActive = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'border border-primary-100 bg-primary-50 text-primary-600'
                  : 'border border-transparent text-surface-muted hover:bg-surface-bg hover:text-secondary-800'
              }`}
            >
              <t.icon className={`h-4 w-4 ${isActive ? 'text-primary-500' : ''}`} />
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === 'members' ? <MembersPanel /> : <RolesPanel />}
    </div>
  );
}

/* =====================================================================
   MEMBERS PANEL
   ===================================================================== */
function MembersPanel() {
  const [query, setQuery] = useState('');
  const [activeUser, setActiveUser] = useState(null);

  const rows = useMemo(
    () =>
      users.filter(
        (u) =>
          !query ||
          u.name.toLowerCase().includes(query.toLowerCase()) ||
          u.email.toLowerCase().includes(query.toLowerCase()),
      ),
    [query],
  );

  const columns = [
    {
      key: 'name',
      header: 'User',
      render: (u) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary-100 bg-primary-50 text-xs font-bold text-primary-600">
            {u.name.split(' ').map((n) => n[0]).join('')}
          </div>
          <div>
            <p className="font-semibold text-secondary-900">{u.name}</p>
            <p className="text-xs text-surface-muted">{u.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'role',   header: 'Role',   render: (u) => <Badge className={roleStyles[u.role] || ''}>{u.role}</Badge> },
    { key: 'status', header: 'Status', render: (u) => <Badge className={userStatusStyles[u.status]}>{u.status}</Badge> },
    { key: 'lastActive', header: 'Last Active', render: (u) => <span className="text-surface-muted">{u.lastActive}</span> },
    {
      key: 'actions',
      header: '',
      render: (u) => (
        <button
          onClick={(e) => { e.stopPropagation(); setActiveUser(u); }}
          className="rounded-lg p-1.5 text-surface-muted transition-colors hover:bg-surface-bg hover:text-secondary-900"
          aria-label="Edit permissions"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-surface-border bg-surface-card p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users..."
            className="w-full rounded-xl border border-surface-border bg-white py-2 pl-10 pr-4 text-sm outline-none transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
          />
        </div>
        <button className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-700 active:scale-[0.99]">
          <Plus className="h-4 w-4" /> Invite User
        </button>
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        emptyText="No users found"
        onRowClick={(u) => setActiveUser(u)}
      />

      <UserPermissionsDrawer user={activeUser} onClose={() => setActiveUser(null)} />
    </div>
  );
}

/* =====================================================================
   ROLES & PERMISSIONS PANEL — upgraded UI
   ===================================================================== */

const MODULE_ICONS = {
  dashboard:  LayoutDashboard,
  leads:      UsersIcon,
  quotations: FileText,
  clients:    UserCircle,
  products:   Package,
  users:      UsersIcon,
  settings:   SettingsIcon,
};

const ACTION_META = {
  view:   { icon: Eye,        color: 'text-primary-600', bg: 'bg-primary-50',  ring: 'ring-primary-200'  },
  create: { icon: PlusCircle, color: 'text-accent-600',  bg: 'bg-accent-50',   ring: 'ring-accent-200'   },
  edit:   { icon: Pencil,     color: 'text-warning-500', bg: 'bg-warning-50',  ring: 'ring-warning-400'  },
  delete: { icon: Trash2,     color: 'text-error-500',   bg: 'bg-error-50',    ring: 'ring-error-400'    },
};

function RolesPanel() {
  const [selectedRole, setSelectedRole] = useState('Admin');
  const [matrix, setMatrix] = useState(() => JSON.parse(JSON.stringify(rolePermissions)));
  const [dirty, setDirty] = useState(false);
  const [moduleQuery, setModuleQuery] = useState('');

  const current = matrix[selectedRole];

  const togglePerm = (mod, action) => {
    setMatrix((p) => ({
      ...p,
      [selectedRole]: {
        ...p[selectedRole],
        [mod]: { ...p[selectedRole][mod], [action]: !p[selectedRole][mod][action] },
      },
    }));
    setDirty(true);
  };

  const toggleRowAll = (mod, value) => {
    setMatrix((p) => ({
      ...p,
      [selectedRole]: {
        ...p[selectedRole],
        [mod]: actions.reduce((acc, a) => ({ ...acc, [a]: value }), {}),
      },
    }));
    setDirty(true);
  };

  const setAllForRole = (value) => {
    setMatrix((p) => ({
      ...p,
      [selectedRole]: modules.reduce(
        (acc, m) => ({
          ...acc,
          [m.key]: actions.reduce((a2, a) => ({ ...a2, [a]: value }), {}),
        }),
        {},
      ),
    }));
    setDirty(true);
  };

  // Stats per role for cards
  const roleStats = useMemo(() => {
    const stats = {};
    roles.forEach((r) => {
      const perms = matrix[r];
      let granted = 0;
      let total = 0;
      modules.forEach((m) => {
        actions.forEach((a) => {
          total += 1;
          if (perms?.[m.key]?.[a]) granted += 1;
        });
      });
      const memberCount = users.filter((u) => u.role === r).length;
      stats[r] = { granted, total, memberCount };
    });
    return stats;
  }, [matrix]);

  const filteredModules = modules.filter((m) =>
    m.label.toLowerCase().includes(moduleQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Role cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {roles.map((r) => {
          const isSelected = selectedRole === r;
          const { granted, total, memberCount } = roleStats[r];
          const pct = Math.round((granted / total) * 100);
          const isAdmin = r === 'Admin';
          return (
            <button
              key={r}
              onClick={() => setSelectedRole(r)}
              className={`group relative overflow-hidden rounded-2xl border p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm ${
                isSelected
                  ? 'border-primary-200 bg-primary-50/40 ring-2 ring-primary-500/20'
                  : 'border-surface-border bg-surface-card hover:border-primary-100'
              }`}
            >
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl border ${
                    isSelected
                      ? 'border-primary-200 bg-primary-100 text-primary-700'
                      : 'border-primary-100 bg-primary-50 text-primary-600'
                  }`}
                >
                  {isAdmin ? <Crown className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                </div>
                {isSelected && (
                  <span className="rounded-full bg-primary-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                    Active
                  </span>
                )}
              </div>

              <p className="mt-3 text-sm font-semibold text-secondary-900">{r}</p>
              <p className="mt-0.5 text-xs text-surface-muted">
                {memberCount} {memberCount === 1 ? 'member' : 'members'}
              </p>

              {/* Progress bar */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-[10px] font-medium text-surface-muted">
                  <span>Permissions</span>
                  <span>{granted}/{total}</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-border">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-primary-400 to-primary-600 transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Matrix card */}
      <div className="overflow-hidden rounded-2xl border border-surface-border bg-surface-card">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-surface-border p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-base font-semibold text-secondary-900">
              <Sparkles className="h-4 w-4 text-primary-500" />
              Permissions for{' '}
              <Badge className={roleStyles[selectedRole] || ''}>{selectedRole}</Badge>
            </h2>
            <p className="mt-1 text-xs text-surface-muted">
              Toggle module-level access. Use bulk actions to grant or revoke everything at once.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-surface-muted" />
              <input
                value={moduleQuery}
                onChange={(e) => setModuleQuery(e.target.value)}
                placeholder="Filter modules..."
                className="w-44 rounded-xl border border-surface-border bg-white py-1.5 pl-8 pr-3 text-xs outline-none transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <button
              onClick={() => setAllForRole(true)}
              className="rounded-xl border border-accent-100 bg-accent-50 px-3 py-1.5 text-xs font-semibold text-accent-600 transition-colors hover:bg-accent-100"
            >
              Grant all
            </button>
            <button
              onClick={() => setAllForRole(false)}
              className="rounded-xl border border-surface-border bg-surface-bg px-3 py-1.5 text-xs font-semibold text-secondary-700 transition-colors hover:bg-surface-border/50"
            >
              Revoke all
            </button>
            <button
              onClick={() => setDirty(false)}
              disabled={!dirty}
              className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-1.5 text-xs font-semibold text-white transition-all duration-200 hover:bg-primary-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save className="h-3.5 w-3.5" /> {dirty ? 'Save Changes' : 'All Saved'}
            </button>
          </div>
        </div>

        {/* Action legend */}
        <div className="hidden border-b border-surface-border bg-surface-bg/40 px-5 py-2.5 lg:block">
          <div className="grid grid-cols-[1.6fr_repeat(4,1fr)_auto] items-center gap-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-surface-muted">
              Module
            </span>
            {actions.map((a) => {
              const meta = ACTION_META[a];
              const Icon = meta.icon;
              return (
                <div key={a} className="flex items-center justify-center gap-1.5">
                  <Icon className={`h-3.5 w-3.5 ${meta.color}`} />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-surface-muted">
                    {a}
                  </span>
                </div>
              );
            })}
            <span className="w-16 text-center text-[10px] font-bold uppercase tracking-wider text-surface-muted">
              Row
            </span>
          </div>
        </div>

        {/* Module rows */}
        <div className="divide-y divide-surface-border">
          {filteredModules.length === 0 && (
            <div className="px-5 py-10 text-center text-sm text-surface-muted">
              No modules match &quot;{moduleQuery}&quot;
            </div>
          )}

          {filteredModules.map((m) => {
            const Icon = MODULE_ICONS[m.key] || ShieldCheck;
            const rowPerms = current[m.key] || {};
            const grantedCount = actions.filter((a) => rowPerms[a]).length;
            const allOn = grantedCount === actions.length;

            return (
              <div
                key={m.key}
                className="grid grid-cols-1 items-center gap-4 px-5 py-4 transition-colors hover:bg-surface-bg/40 lg:grid-cols-[1.6fr_repeat(4,1fr)_auto]"
              >
                {/* Module label */}
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary-100 bg-primary-50">
                    <Icon className="h-4 w-4 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-secondary-900">{m.label}</p>
                    <p className="text-[11px] text-surface-muted">
                      {grantedCount} of {actions.length} permissions
                    </p>
                  </div>
                </div>

                {/* Action toggles */}
                {actions.map((a) => {
                  const meta = ACTION_META[a];
                  const Icon = meta.icon;
                  const allowed = rowPerms[a];
                  return (
                    <div key={a} className="flex items-center justify-between gap-2 lg:justify-center">
                      <span className="text-xs font-medium text-surface-muted lg:hidden">
                        {a}
                      </span>
                      <button
                        onClick={() => togglePerm(m.key, a)}
                        className={`group relative inline-flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-200 ${
                          allowed
                            ? `${meta.bg} ${meta.color} border-transparent shadow-sm ring-1 ${meta.ring}`
                            : 'border-surface-border bg-white text-surface-muted hover:border-surface-muted'
                        }`}
                        aria-label={`${allowed ? 'Revoke' : 'Grant'} ${a} on ${m.label}`}
                      >
                        <Icon className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}

                {/* Row toggle */}
                <div className="flex items-center justify-end lg:justify-center">
                  <button
                    onClick={() => toggleRowAll(m.key, !allOn)}
                    className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
                      allOn ? 'bg-primary-600' : 'bg-surface-border'
                    }`}
                    aria-label={`Toggle all permissions for ${m.label}`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
                        allOn ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer summary */}
        <div className="flex items-center justify-between border-t border-surface-border bg-surface-bg/40 px-5 py-3">
          <p className="text-xs text-surface-muted">
            <span className="font-semibold text-secondary-900">{roleStats[selectedRole].granted}</span>{' '}
            of {roleStats[selectedRole].total} permissions granted to{' '}
            <span className="font-semibold text-secondary-900">{selectedRole}</span>
          </p>
          {dirty && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-warning-50 bg-warning-50 px-2.5 py-0.5 text-[11px] font-semibold text-warning-500">
              <span className="h-1.5 w-1.5 rounded-full bg-warning-500" />
              Unsaved changes
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
