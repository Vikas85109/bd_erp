import { useEffect, useState } from 'react';
import {
  X, ShieldCheck, Save, Crown, Check,
  LayoutDashboard, Users as UsersIcon, FileText, UserCircle, Package, Settings as SettingsIcon,
} from 'lucide-react';
import Badge from './Badge';
import { roles, modules, actions, rolePermissions } from '../data/permissions';
import { roleStyles } from '../data/users';

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

export default function UserPermissionsModal({ user, onClose }) {
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

  // Lock body scroll
  useEffect(() => {
    if (!user) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
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

  const toggleModuleAll = (mod) => {
    const rowPerms = perms[mod] || {};
    const allOn = actions.every((a) => rowPerms[a]);
    setPerms((p) => ({
      ...p,
      [mod]: actions.reduce((acc, a) => ({ ...acc, [a]: !allOn }), {}),
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
        className="fixed inset-0 z-50 bg-secondary-900/40 backdrop-blur-sm"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-surface-border bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-surface-border px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-600">
                {user.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <h2 className="text-base font-semibold text-secondary-900">
                  Manage Permissions
                </h2>
                <p className="text-xs text-surface-muted">{user.name} &middot; {user.email}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-surface-muted transition-colors hover:bg-surface-bg hover:text-secondary-900"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Role selector */}
          <div className="border-b border-surface-border px-6 py-4">
            <p className="text-xs font-medium text-surface-muted">Role</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {roles.map((r) => {
                const isSelected = role === r;
                return (
                  <button
                    key={r}
                    onClick={() => handleRoleChange(r)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-150 ${
                      isSelected
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-surface-border bg-white text-secondary-600 hover:border-primary-200'
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

          {/* Permissions table */}
          <div className="flex-1 overflow-y-auto">
            {/* Table header */}
            <div className="sticky top-0 z-10 grid grid-cols-[1fr_repeat(4,56px)_56px] items-center gap-2 border-b border-surface-border bg-surface-bg/80 px-6 py-2.5 backdrop-blur-sm">
              <span className="text-xs font-semibold uppercase tracking-wider text-surface-muted">Module</span>
              {actions.map((a) => (
                <span key={a} className="text-center text-[10px] font-semibold uppercase tracking-wider text-surface-muted">
                  {ACTION_LABELS[a]}
                </span>
              ))}
              <span className="text-center text-[10px] font-semibold uppercase tracking-wider text-surface-muted">All</span>
            </div>

            {/* Rows */}
            <div className="divide-y divide-surface-border">
              {modules.map((m) => {
                const Icon = MODULE_ICONS[m.key] || ShieldCheck;
                const rowPerms = perms[m.key] || {};
                const allOn = actions.every((a) => rowPerms[a]);

                return (
                  <div
                    key={m.key}
                    className="grid grid-cols-[1fr_repeat(4,56px)_56px] items-center gap-2 px-6 py-3 transition-colors hover:bg-surface-bg/30"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-bg">
                        <Icon className="h-4 w-4 text-secondary-700" />
                      </div>
                      <span className="text-sm font-medium text-secondary-900">{m.label}</span>
                    </div>

                    {actions.map((a) => {
                      const allowed = rowPerms[a];
                      return (
                        <div key={a} className="flex justify-center">
                          <button
                            onClick={() => togglePerm(m.key, a)}
                            className={`flex h-7 w-7 items-center justify-center rounded-md border-2 transition-all duration-150 ${
                              allowed
                                ? 'border-primary-500 bg-primary-500 text-white'
                                : 'border-surface-border bg-white hover:border-primary-300'
                            }`}
                          >
                            {allowed && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                          </button>
                        </div>
                      );
                    })}

                    {/* Row toggle */}
                    <div className="flex justify-center">
                      <button
                        onClick={() => toggleModuleAll(m.key)}
                        className={`relative h-5 w-9 shrink-0 rounded-full transition-colors duration-200 ${
                          allOn ? 'bg-primary-500' : 'bg-surface-border'
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                            allOn ? 'translate-x-4' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-surface-border px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="text-xs text-surface-muted">
                <span className="font-semibold text-secondary-900">{grantedCount}</span>/{totalCount} permissions
              </span>
              {dirty && (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-warning-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-warning-500" />
                  Unsaved
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="rounded-xl border border-surface-border px-4 py-2 text-sm font-medium text-secondary-700 transition-colors hover:bg-surface-bg"
              >
                Cancel
              </button>
              <button
                onClick={() => { setDirty(false); onClose(); }}
                disabled={!dirty}
                className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-primary-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save className="h-4 w-4" /> Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
