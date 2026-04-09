import { useEffect, useState } from 'react';
import {
  X, Mail, Calendar, ShieldCheck, Save, Crown,
  Eye, PlusCircle, Pencil, Trash2,
  LayoutDashboard, Users as UsersIcon, FileText, UserCircle, Package, Settings as SettingsIcon,
} from 'lucide-react';
import Badge from './Badge';
import { roles, modules, actions, rolePermissions } from '../data/permissions';
import { roleStyles, userStatusStyles } from '../data/users';

const MODULE_ICONS = {
  dashboard: LayoutDashboard,
  leads: UsersIcon,
  quotations: FileText,
  clients: UserCircle,
  products: Package,
  users: UsersIcon,
  settings: SettingsIcon,
};

const ACTION_META = {
  view:   { icon: Eye,        color: 'text-primary-600', bg: 'bg-primary-50',  ring: 'ring-primary-200' },
  create: { icon: PlusCircle, color: 'text-accent-600',  bg: 'bg-accent-50',   ring: 'ring-accent-200'  },
  edit:   { icon: Pencil,     color: 'text-warning-500', bg: 'bg-warning-50',  ring: 'ring-warning-400' },
  delete: { icon: Trash2,     color: 'text-error-500',   bg: 'bg-error-50',    ring: 'ring-error-400'   },
};

export default function UserPermissionsDrawer({ user, onClose }) {
  const [role, setRole] = useState(user?.role || 'Viewer');
  const [perms, setPerms] = useState(() =>
    user ? JSON.parse(JSON.stringify(rolePermissions[user.role] || {})) : {},
  );
  const [dirty, setDirty] = useState(false);

  // Reset state when a different user is opened
  useEffect(() => {
    if (!user) return;
    setRole(user.role);
    setPerms(JSON.parse(JSON.stringify(rolePermissions[user.role] || {})));
    setDirty(false);
  }, [user]);

  // Lock body scroll while open
  useEffect(() => {
    if (!user) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [user]);

  if (!user) return null;

  const handleRoleChange = (next) => {
    setRole(next);
    setPerms(JSON.parse(JSON.stringify(rolePermissions[next] || {})));
    setDirty(true);
  };

  const togglePerm = (mod, action) => {
    setPerms((p) => ({
      ...p,
      [mod]: { ...p[mod], [action]: !p[mod]?.[action] },
    }));
    setDirty(true);
  };

  const grantedCount = modules.reduce(
    (sum, m) => sum + actions.filter((a) => perms[m.key]?.[a]).length,
    0,
  );
  const totalCount = modules.length * actions.length;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-secondary-900/30 backdrop-blur-sm transition-opacity duration-200"
      />

      {/* Drawer */}
      <aside className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-xl flex-col border-l border-surface-border bg-surface-card shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-surface-border p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary-100 bg-primary-50 text-sm font-bold text-primary-600">
              {user.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <h2 className="text-base font-bold text-secondary-900">{user.name}</h2>
              <p className="flex items-center gap-1.5 text-xs text-surface-muted">
                <Mail className="h-3 w-3" /> {user.email}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-surface-muted transition-colors hover:bg-surface-bg hover:text-secondary-900"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Meta */}
        <div className="grid grid-cols-3 gap-3 border-b border-surface-border p-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-surface-muted">
              Status
            </p>
            <Badge className={`mt-1.5 ${userStatusStyles[user.status]}`}>{user.status}</Badge>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-surface-muted">
              Role
            </p>
            <Badge className={`mt-1.5 ${roleStyles[role] || ''}`}>{role}</Badge>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-surface-muted">
              Last Active
            </p>
            <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-secondary-800">
              <Calendar className="h-3 w-3" /> {user.lastActive}
            </p>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          {/* Role selector */}
          <section className="border-b border-surface-border p-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-secondary-900">
              <ShieldCheck className="h-4 w-4 text-primary-500" /> Assign Role
            </h3>
            <p className="mt-1 text-xs text-surface-muted">
              Switching roles preloads that role&apos;s default permissions.
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {roles.map((r) => {
                const isSelected = role === r;
                return (
                  <button
                    key={r}
                    onClick={() => handleRoleChange(r)}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs font-semibold transition-all duration-200 ${
                      isSelected
                        ? 'border-primary-200 bg-primary-50 text-primary-700 ring-2 ring-primary-500/20'
                        : 'border-surface-border bg-white text-secondary-700 hover:border-primary-100 hover:bg-surface-bg'
                    }`}
                  >
                    {r === 'Admin' ? (
                      <Crown className={`h-3.5 w-3.5 ${isSelected ? 'text-primary-600' : 'text-surface-muted'}`} />
                    ) : (
                      <ShieldCheck className={`h-3.5 w-3.5 ${isSelected ? 'text-primary-600' : 'text-surface-muted'}`} />
                    )}
                    {r}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Permissions */}
          <section className="p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-secondary-900">Permissions</h3>
              <span className="text-xs text-surface-muted">
                <span className="font-semibold text-secondary-900">{grantedCount}</span> / {totalCount}
              </span>
            </div>

            <div className="mt-3 space-y-2">
              {modules.map((m) => {
                const Icon = MODULE_ICONS[m.key] || ShieldCheck;
                const rowPerms = perms[m.key] || {};
                const granted = actions.filter((a) => rowPerms[a]).length;

                return (
                  <div
                    key={m.key}
                    className="rounded-2xl border border-surface-border bg-surface-bg/40 p-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary-100 bg-primary-50">
                          <Icon className="h-4 w-4 text-primary-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-secondary-900">{m.label}</p>
                          <p className="text-[11px] text-surface-muted">
                            {granted} of {actions.length} granted
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {actions.map((a) => {
                          const meta = ACTION_META[a];
                          const Icon = meta.icon;
                          const allowed = rowPerms[a];
                          return (
                            <button
                              key={a}
                              onClick={() => togglePerm(m.key, a)}
                              title={`${allowed ? 'Revoke' : 'Grant'} ${a}`}
                              className={`group relative inline-flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-200 ${
                                allowed
                                  ? `${meta.bg} ${meta.color} border-transparent ring-1 ${meta.ring}`
                                  : 'border-surface-border bg-white text-surface-muted hover:border-surface-muted'
                              }`}
                              aria-label={`${allowed ? 'Revoke' : 'Grant'} ${a} on ${m.label}`}
                            >
                              <Icon className="h-3.5 w-3.5" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 border-t border-surface-border bg-surface-bg/40 p-4">
          {dirty ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-warning-50 bg-warning-50 px-2.5 py-0.5 text-[11px] font-semibold text-warning-500">
              <span className="h-1.5 w-1.5 rounded-full bg-warning-500" />
              Unsaved changes
            </span>
          ) : (
            <span className="text-xs text-surface-muted">No changes</span>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="rounded-xl border border-surface-border bg-white px-4 py-2 text-xs font-semibold text-secondary-700 transition-colors hover:bg-surface-bg"
            >
              Cancel
            </button>
            <button
              onClick={() => setDirty(false)}
              disabled={!dirty}
              className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-xs font-semibold text-white transition-all duration-200 hover:bg-primary-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save className="h-3.5 w-3.5" /> Save
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
