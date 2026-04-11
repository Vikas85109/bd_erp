import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, User, Mail, Phone, Shield, ChevronDown, Save, KeyRound,
  ShieldCheck, CreditCard, Headphones, Users2, UserCog,
} from 'lucide-react';
import { users as allUsers, getInitials, ROLE_OPTIONS } from '../data/users';
import Toast from '../components/Toast';

const RESOURCES = [
  { key: 'dashboard', name: 'Dashboard', desc: 'View dashboard analytics' },
  { key: 'leads', name: 'Leads', desc: 'Manage sales leads' },
  { key: 'followups', name: 'Follow-ups', desc: 'Manage lead follow-ups' },
  { key: 'quotations', name: 'Quotations', desc: 'Manage quotations' },
  { key: 'clients', name: 'Clients', desc: 'Manage client organizations' },
  { key: 'products', name: 'Products', desc: 'Manage product catalog' },
  { key: 'users', name: 'Users', desc: 'Manage team members' },
  { key: 'settings', name: 'Settings', desc: 'Manage system settings' },
  { key: 'activity', name: 'Activity Logs', desc: 'View activity logs' },
];

const PERM_ACTIONS = ['read', 'create', 'update', 'delete'];
const STATUS_OPTIONS = ['Active', 'Suspended'];

const STATUS_DESC = {
  Active: 'User can log in and access the admin panel',
  Suspended: 'User is blocked from accessing the system',
};

const ROLE_CONFIG = {
  'Super Admin': { icon: ShieldCheck, color: 'text-purple-600', desc: 'Full system access across all organizations' },
  'Manager':     { icon: Users2,      color: 'text-blue-600',   desc: 'Manage teams and oversee operations' },
  'Billing':     { icon: CreditCard,  color: 'text-emerald-600', desc: 'Manage billing, invoices, and payments' },
  'Support':     { icon: Headphones,  color: 'text-amber-600',  desc: 'Handle customer support tickets' },
  'Employee':    { icon: UserCog,     color: 'text-secondary-600', desc: 'Standard employee access' },
};

function getRoleConfig(role) {
  return ROLE_CONFIG[role] || ROLE_CONFIG['Employee'];
}

const defaultPerms = () => {
  const map = {};
  RESOURCES.forEach((r) => {
    map[r.key] = { read: false, create: false, update: false, delete: false };
  });
  map.dashboard = { read: true, create: true, update: true, delete: true };
  map.leads = { read: true, create: true, update: false, delete: false };
  map.clients = { read: true, create: true, update: true, delete: false };
  map.users = { read: true, create: true, update: true, delete: false };
  map.followups = { read: true, create: true, update: false, delete: false };
  map.activity = { read: true, create: false, update: false, delete: false };
  return map;
};

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const userData = allUsers.find((u) => u.id === parseInt(id));

  const [name, setName] = useState(userData?.name || '');
  const [email] = useState(userData?.email || '');
  const [phone, setPhone] = useState(userData?.phone || '');
  const [role, setRole] = useState(userData?.role || 'Employee');
  const [status, setStatus] = useState(userData?.status || 'Active');
  const [perms, setPerms] = useState(defaultPerms());
  const [toast, setToast] = useState(null);

  const isCurrentSession = userData?.currentSession;
  const roleConfig = getRoleConfig(role);

  // Permission helpers
  const togglePerm = (resKey, action) => {
    setPerms((p) => ({ ...p, [resKey]: { ...p[resKey], [action]: !p[resKey][action] } }));
  };
  const toggleAll = (resKey) => {
    const allOn = PERM_ACTIONS.every((a) => perms[resKey][a]);
    setPerms((p) => ({ ...p, [resKey]: PERM_ACTIONS.reduce((acc, a) => ({ ...acc, [a]: !allOn }), {}) }));
  };
  const isAll = (resKey) => PERM_ACTIONS.every((a) => perms[resKey][a]);

  const totalPerms = useMemo(() => {
    let count = 0;
    let resources = 0;
    RESOURCES.forEach((r) => {
      let hasAny = false;
      PERM_ACTIONS.forEach((a) => { if (perms[r.key][a]) { count++; hasAny = true; } });
      if (hasAny) resources++;
    });
    return { count, resources };
  }, [perms]);

  const handleSave = () => {
    setToast({ message: 'User updated successfully', type: 'success' });
  };

  const handleResetPassword = () => {
    setToast({ message: 'Password reset link sent', type: 'success' });
  };

  if (!userData) {
    return (
      <div className="space-y-4">
        <button onClick={() => navigate('/users')} className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium">
          <ArrowLeft className="h-4 w-4" /> Back to Admin Users
        </button>
        <div className="text-center py-20">
          <p className="text-sm text-surface-muted">User not found.</p>
        </div>
      </div>
    );
  }

  const inputCls = 'w-full rounded-xl border border-surface-border bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 placeholder:text-surface-muted';

  return (
    <div className="space-y-6">
      {/* Back link */}
      <button onClick={() => navigate('/users')} className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Admin Users
      </button>

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Edit Admin User</h1>
        <p className="text-sm text-surface-muted mt-1">Editing {role}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Left Column ── */}
        <div className="space-y-6">
          {/* Admin Details Card */}
          <div className="rounded-2xl border border-surface-border bg-white p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 border border-primary-100">
                <User className="h-5 w-5 text-primary-500" />
              </div>
              <div>
                <h2 className="text-base font-bold text-secondary-900">Admin Details</h2>
                <p className="text-xs text-surface-muted">Update admin user information</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-secondary-800">
                  Full Name <span className="text-error-400">*</span>
                </label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-secondary-800">
                  Email Address
                </label>
                <input type="email" value={email} disabled
                  className={`${inputCls} bg-surface-bg/60 text-surface-muted cursor-not-allowed`} />
                <p className="text-[11px] text-surface-muted mt-1">Email cannot be changed</p>
              </div>
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-secondary-800">
                  Phone Number
                </label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. 9876543210" className={inputCls} />
              </div>
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-secondary-800">
                  Role <span className="text-error-400">*</span>
                </label>
                <div className="relative">
                  <select value={role} onChange={(e) => setRole(e.target.value)}
                    className={`${inputCls} appearance-none pr-10`}>
                    {ROLE_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-muted pointer-events-none" />
                </div>
                <p className="text-[11px] text-surface-muted mt-1">{roleConfig.desc}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Column ── */}
        <div className="space-y-6">
          {/* Account Status Card */}
          <div className="rounded-2xl border border-surface-border bg-white p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-50 border border-accent-100">
                <Shield className="h-5 w-5 text-accent-500" />
              </div>
              <div>
                <h2 className="text-base font-bold text-secondary-900">Account Status</h2>
                <p className="text-xs text-surface-muted">Manage the admin's account status</p>
              </div>
            </div>

            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={isCurrentSession}
                className={`${inputCls} appearance-none pr-10 ${isCurrentSession ? 'bg-surface-bg/60 cursor-not-allowed' : ''}`}
              >
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-muted pointer-events-none" />
            </div>
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${status === 'Active' ? 'bg-accent-500' : 'bg-error-400'}`}></span>
              <p className="text-xs text-surface-muted">{STATUS_DESC[status]}</p>
            </div>
            {isCurrentSession && (
              <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">You cannot change the status of your own session.</p>
            )}
          </div>

          {/* Password Card */}
          <div className="rounded-2xl border border-surface-border bg-white p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning-50 border border-warning-100">
                <KeyRound className="h-5 w-5 text-warning-500" />
              </div>
              <div>
                <h2 className="text-base font-bold text-secondary-900">Password</h2>
                <p className="text-xs text-surface-muted">Set a new password for this admin</p>
              </div>
            </div>
            <button onClick={handleResetPassword}
              className="flex items-center gap-2 rounded-xl border border-surface-border px-4 py-2.5 text-sm font-medium text-secondary-800 hover:bg-surface-bg transition-colors">
              <KeyRound className="h-4 w-4" /> Reset Password
            </button>
          </div>
        </div>
      </div>

      {/* ── Permissions Section (full width) ── */}
      <div className="rounded-2xl border border-surface-border bg-white">
        <div className="border-b border-surface-border p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 border border-primary-100">
                <Shield className="h-5 w-5 text-primary-500" />
              </div>
              <div>
                <h2 className="text-base font-bold text-secondary-900">Permissions</h2>
                <p className="text-xs text-surface-muted">Manage resource access for {name || 'this user'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-border bg-surface-bg/40">
                <th className="px-6 py-3 text-left text-xs font-semibold text-surface-muted uppercase tracking-wider">Resource</th>
                {PERM_ACTIONS.map((a) => (
                  <th key={a} className="px-4 py-3 text-center text-xs font-semibold text-surface-muted uppercase tracking-wider">{a}</th>
                ))}
                <th className="px-4 py-3 text-center text-xs font-semibold text-surface-muted uppercase tracking-wider">All</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {RESOURCES.map((r) => (
                <tr key={r.key} className="hover:bg-surface-bg/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-secondary-900">{r.name}</p>
                    <p className="text-xs text-surface-muted">{r.desc}</p>
                  </td>
                  {PERM_ACTIONS.map((a) => (
                    <td key={a} className="px-4 py-4 text-center">
                      <Checkbox checked={perms[r.key][a]} onChange={() => togglePerm(r.key, a)} />
                    </td>
                  ))}
                  <td className="px-4 py-4 text-center">
                    <Checkbox checked={isAll(r.key)} onChange={() => toggleAll(r.key)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-surface-border px-6 py-3">
          <p className="text-xs text-surface-muted">
            <span className="font-medium text-primary-600">{totalPerms.count} permissions</span> selected across <span className="font-medium text-primary-600">{totalPerms.resources} resources</span>
          </p>
        </div>
      </div>

      {/* ── Save Bar ── */}
      <div className="flex items-center justify-end gap-3 pb-4">
        <button onClick={() => navigate('/users')}
          className="rounded-xl border border-surface-border px-5 py-2.5 text-sm font-medium text-secondary-800 hover:bg-surface-bg transition-colors">
          Cancel
        </button>
        <button onClick={handleSave}
          className="flex items-center gap-2 rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 transition-colors">
          <Save className="h-4 w-4" /> Save Changes
        </button>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

function Checkbox({ checked, onChange }) {
  return (
    <button type="button" onClick={onChange}
      className={`inline-flex h-5 w-5 items-center justify-center rounded-md border transition-all ${checked ? 'bg-primary-500 border-primary-500 text-white' : 'bg-white border-surface-border hover:border-primary-300'}`}>
      {checked && (
        <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.42l-7.5 7.5a1 1 0 01-1.42 0l-3.5-3.5a1 1 0 011.42-1.42L8.5 12.08l6.79-6.79a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      )}
    </button>
  );
}
