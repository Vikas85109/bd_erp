import { useEffect, useState } from 'react';
import {
  X, Mail, Calendar, ShieldCheck, Save, Crown, Check,
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

const ACTION_LABELS = { view: 'View', create: 'Create', edit: 'Edit', delete: 'Delete' };

export default function UserPermissionsDrawer({ user, onClose }) {
  const [role, setRole] = useState(user?.role || 'Viewer');
  const [perms, setPerms] = useState(() =>
    user ? JSON.parse(JSON.stringify(rolePermissions[user.role] || {})) : {},
  );
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!user) return;
    setRole(user.role);
    setPerms(JSON.parse(JSON.stringify(rolePermissions[user.role] || {})));
    setDirty(false);
  }, [user]);

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
  const pct = Math.round((grantedCount / totalCount) * 100);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-secondary-900/30 backdrop-blur-sm transition-opacity duration-200"
      />

      {/* Drawer */}
      <aside className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-lg flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-surface-border px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-600">
              {user.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <h2 className="text-base font-semibold text-secondary-900">{user.name}</h2>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-surface-muted">
                <Mail className="h-3 w-3" /> {user.email}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-surface-muted transition-colors hover:bg-surface-bg hover:text-secondary-900"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Info strip */}
        <div className="flex items-center gap-6 border-b border-surface-border px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-surface-muted">Status</span>
            <Badge className={userStatusStyles[user.status]}>{user.status}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-surface-muted">Role</span>
            <Badge className={roleStyles[role] || ''}>{role}</Badge>
          </div>
          <div className="flex items-center gap-2 text-xs text-surface-muted">
            <Calendar className="h-3 w-3" />
            {user.lastActive}
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          {/* Role selector */}
          <div className="border-b border-surface-border px-6 py-5">
            <h3 className="text-sm font-semibold text-secondary-900">Assign Role</h3>
            <p className="mt-1 text-xs text-surface-muted">
              Changing the role will reset permissions to that role&apos;s defaults.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {roles.map((r) => {
                const isSelected = role === r;
                return (
                  <button
                    key={r}
                    onClick={() => handleRoleChange(r)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-150 ${
                      isSelected
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-surface-border bg-white text-secondary-600 hover:border-primary-200 hover:bg-surface-bg'
                    }`}
                  >
                    {r === 'Admin' ? (
                      <Crown className={`h-3 w-3 ${isSelected ? 'text-primary-600' : 'text-surface-muted'}`} />
                    ) : (
                      <ShieldCheck className={`h-3 w-3 ${isSelected ? 'text-primary-600' : 'text-surface-muted'}`} />
                    )}
                    {r}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Permissions */}
          <div className="px-6 py-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-secondary-900">Module Permissions</h3>
              <span className="text-xs text-surface-muted">
                {grantedCount}/{totalCount} granted
              </span>
            </div>

            {/* Progress bar */}
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-border">
              <div
                className="h-full rounded-full bg-primary-500 transition-all duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>

            {/* Permission list */}
            <div className="mt-5 space-y-3">
              {modules.map((m) => {
                const Icon = MODULE_ICONS[m.key] || ShieldCheck;
                const rowPerms = perms[m.key] || {};
                const granted = actions.filter((a) => rowPerms[a]).length;

                return (
                  <div
                    key={m.key}
                    className="rounded-xl border border-surface-border p-4"
                  >
                    {/* Module header */}
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-bg">
                        <Icon className="h-4 w-4 text-secondary-700" />
                      </div>
                      <p className="flex-1 text-sm font-medium text-secondary-900">{m.label}</p>
                      <span className="text-[11px] text-surface-muted">{granted}/{actions.length}</span>
                    </div>

                    {/* Action toggles */}
                    <div className="mt-3 grid grid-cols-4 gap-2">
                      {actions.map((a) => {
                        const allowed = rowPerms[a];
                        return (
                          <button
                            key={a}
                            onClick={() => togglePerm(m.key, a)}
                            className={`flex items-center justify-center gap-1.5 rounded-lg border px-2 py-1.5 text-xs font-medium transition-all duration-150 ${
                              allowed
                                ? 'border-primary-200 bg-primary-50 text-primary-700'
                                : 'border-surface-border bg-white text-surface-muted hover:border-primary-200'
                            }`}
                          >
                            {allowed && <Check className="h-3 w-3" strokeWidth={3} />}
                            {ACTION_LABELS[a]}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-surface-border px-6 py-4">
          {dirty ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-warning-500">
              <span className="h-1.5 w-1.5 rounded-full bg-warning-500" />
              Unsaved changes
            </span>
          ) : (
            <span className="text-xs text-surface-muted">No changes</span>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="rounded-xl border border-surface-border px-4 py-2 text-xs font-semibold text-secondary-700 transition-colors hover:bg-surface-bg"
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
