import { useMemo, useState, useRef, useEffect } from 'react';
import {
  Search, Plus, MoreHorizontal, Users as UsersIcon, ShieldCheck, Save,
  LayoutDashboard, FileText, UserCircle, Package, Settings as SettingsIcon,
  Crown, ChevronRight, Check, Eye, Pencil, Trash2, ShieldAlert,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import Badge from '../components/Badge';
import UserPermissionsDrawer from '../components/UserPermissionsDrawer';
import UserPermissionsModal from '../components/UserPermissionsModal';
import { users, userStatusStyles, roleStyles } from '../data/users';
import { roles, modules, actions, rolePermissions } from '../data/permissions';

const TABS = [
  { key: 'members', label: 'Team Members',       icon: UsersIcon   },
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
  const [permUser, setPermUser] = useState(null);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const menuRef = useRef(null);

  // Close popup on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpenId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-600">
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
        <div className="relative" ref={menuOpenId === u.id ? menuRef : null}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpenId(menuOpenId === u.id ? null : u.id);
            }}
            className={`rounded-lg p-1.5 transition-colors ${
              menuOpenId === u.id
                ? 'bg-surface-bg text-secondary-900'
                : 'text-surface-muted hover:bg-surface-bg hover:text-secondary-900'
            }`}
            aria-label="Actions"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>

          {menuOpenId === u.id && (
            <div className="absolute right-0 top-full z-20 mt-1 w-48 overflow-hidden rounded-xl border border-surface-border bg-white py-1 shadow-lg">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpenId(null);
                  setActiveUser(u);
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-secondary-700 transition-colors hover:bg-surface-bg"
              >
                <Eye className="h-4 w-4 text-surface-muted" />
                View Profile
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpenId(null);
                  setPermUser(u);
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-secondary-700 transition-colors hover:bg-surface-bg"
              >
                <ShieldAlert className="h-4 w-4 text-surface-muted" />
                Manage Permissions
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpenId(null);
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-secondary-700 transition-colors hover:bg-surface-bg"
              >
                <Pencil className="h-4 w-4 text-surface-muted" />
                Edit Details
              </button>
              <div className="my-1 border-t border-surface-border" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpenId(null);
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-error-600 transition-colors hover:bg-error-50"
              >
                <Trash2 className="h-4 w-4" />
                Remove User
              </button>
            </div>
          )}
        </div>
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
      <UserPermissionsModal user={permUser} onClose={() => setPermUser(null)} />
    </div>
  );
}

/* =====================================================================
   ROLES & PERMISSIONS PANEL
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

const ACTION_LABELS = {
  view:   'View',
  create: 'Create',
  edit:   'Edit',
  delete: 'Delete',
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
      {/* Role selector cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {roles.map((r) => {
          const isSelected = selectedRole === r;
          const { granted, total, memberCount } = roleStats[r];
          const isAdmin = r === 'Admin';
          return (
            <button
              key={r}
              onClick={() => setSelectedRole(r)}
              className={`group relative rounded-2xl border p-4 text-left transition-all duration-200 ${
                isSelected
                  ? 'border-primary-200 bg-primary-50/60 ring-2 ring-primary-500/20'
                  : 'border-surface-border bg-surface-card hover:border-primary-100 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    isSelected
                      ? 'bg-primary-600 text-white'
                      : 'bg-primary-50 text-primary-600'
                  }`}
                >
                  {isAdmin ? <Crown className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-secondary-900">{r}</p>
                  <p className="text-xs text-surface-muted">
                    {memberCount} {memberCount === 1 ? 'member' : 'members'}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-surface-muted">
                <span>{granted}/{total} permissions</span>
                {isSelected && (
                  <ChevronRight className="h-3.5 w-3.5 text-primary-500" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Permissions table */}
      <div className="overflow-hidden rounded-2xl border border-surface-border bg-surface-card">
        {/* Table header bar */}
        <div className="flex flex-col gap-4 border-b border-surface-border p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-base font-semibold text-secondary-900">
              Permissions &mdash;{' '}
              <Badge className={roleStyles[selectedRole] || ''}>{selectedRole}</Badge>
            </h2>
            <p className="mt-1 text-xs text-surface-muted">
              Control what this role can do across each module.
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
              className="rounded-xl border border-surface-border bg-white px-3 py-1.5 text-xs font-semibold text-secondary-700 transition-colors hover:bg-surface-bg"
            >
              Revoke all
            </button>
          </div>
        </div>

        {/* Column headers */}
        <div className="hidden border-b border-surface-border bg-surface-bg/60 px-5 py-3 lg:block">
          <div className="grid grid-cols-[1.8fr_repeat(4,1fr)_80px] items-center gap-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-surface-muted">
              Module
            </span>
            {actions.map((a) => (
              <span key={a} className="text-center text-xs font-semibold uppercase tracking-wider text-surface-muted">
                {ACTION_LABELS[a]}
              </span>
            ))}
            <span className="text-center text-xs font-semibold uppercase tracking-wider text-surface-muted">
              All
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
                className="grid grid-cols-1 items-center gap-4 px-5 py-4 transition-colors hover:bg-surface-bg/30 lg:grid-cols-[1.8fr_repeat(4,1fr)_80px]"
              >
                {/* Module info */}
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface-bg">
                    <Icon className="h-4 w-4 text-secondary-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-secondary-900">{m.label}</p>
                    <p className="text-[11px] text-surface-muted">
                      {grantedCount} of {actions.length} enabled
                    </p>
                  </div>
                </div>

                {/* Checkbox toggles */}
                {actions.map((a) => {
                  const allowed = rowPerms[a];
                  return (
                    <div key={a} className="flex items-center justify-between lg:justify-center">
                      <span className="text-xs text-surface-muted lg:hidden">{ACTION_LABELS[a]}</span>
                      <button
                        onClick={() => togglePerm(m.key, a)}
                        className={`flex h-7 w-7 items-center justify-center rounded-lg border-2 transition-all duration-150 ${
                          allowed
                            ? 'border-primary-500 bg-primary-500 text-white'
                            : 'border-surface-border bg-white hover:border-primary-300'
                        }`}
                        aria-label={`${allowed ? 'Revoke' : 'Grant'} ${a} on ${m.label}`}
                      >
                        {allowed && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                      </button>
                    </div>
                  );
                })}

                {/* Row toggle */}
                <div className="flex items-center justify-end lg:justify-center">
                  <button
                    onClick={() => toggleRowAll(m.key, !allOn)}
                    className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
                      allOn ? 'bg-primary-500' : 'bg-surface-border'
                    }`}
                    aria-label={`Toggle all permissions for ${m.label}`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                        allOn ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-surface-border px-5 py-3">
          <p className="text-xs text-surface-muted">
            <span className="font-semibold text-secondary-900">{roleStats[selectedRole].granted}</span>{' '}
            of {roleStats[selectedRole].total} permissions granted
          </p>
          <div className="flex items-center gap-2">
            {dirty && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-warning-500">
                <span className="h-1.5 w-1.5 rounded-full bg-warning-500" />
                Unsaved
              </span>
            )}
            <button
              onClick={() => setDirty(false)}
              disabled={!dirty}
              className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-1.5 text-xs font-semibold text-white transition-all duration-200 hover:bg-primary-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save className="h-3.5 w-3.5" /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
