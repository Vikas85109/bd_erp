import { useState } from 'react';
import { Save, Bell, Globe, Lock, User } from 'lucide-react';
import PageHeader from '../components/PageHeader';

const TABS = [
  { key: 'profile',     label: 'Profile',       icon: User  },
  { key: 'notifications', label: 'Notifications', icon: Bell  },
  { key: 'security',    label: 'Security',      icon: Lock  },
  { key: 'general',     label: 'General',       icon: Globe },
];

export default function Settings() {
  const [active, setActive] = useState('profile');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        subtitle="Manage your account, notifications and workspace preferences."
        action={
          <button className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-700 active:scale-[0.99]">
            <Save className="h-4 w-4" /> Save
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Tabs */}
        <div className="rounded-2xl border border-surface-border bg-surface-card p-3 lg:col-span-1">
          {TABS.map((t) => {
            const isActive = active === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setActive(t.key)}
                className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
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

        {/* Panel */}
        <div className="rounded-2xl border border-surface-border bg-surface-card p-6 lg:col-span-3">
          {active === 'profile' && <ProfilePanel />}
          {active === 'notifications' && <NotificationsPanel />}
          {active === 'security' && <SecurityPanel />}
          {active === 'general' && <GeneralPanel />}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-surface-muted">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  'w-full rounded-xl border border-surface-border bg-white px-4 py-2 text-sm outline-none transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20';

function ProfilePanel() {
  return (
    <div>
      <h2 className="text-sm font-semibold text-secondary-900">Profile</h2>
      <p className="mt-1 text-xs text-surface-muted">Personal information visible to your team.</p>
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Full Name"><input defaultValue="Priya Sharma" className={inputCls} /></Field>
        <Field label="Email"><input defaultValue="priya@bddcrm.io" className={inputCls} /></Field>
        <Field label="Role"><input defaultValue="Sales Manager" disabled className={`${inputCls} opacity-60`} /></Field>
        <Field label="Phone"><input defaultValue="+91 98765 43210" className={inputCls} /></Field>
      </div>
    </div>
  );
}

function NotificationsPanel() {
  const [prefs, setPrefs] = useState({ leads: true, quotes: true, weekly: false });
  const Toggle = ({ label, hint, k }) => (
    <div className="flex items-start justify-between gap-4 border-b border-surface-border py-4 last:border-0">
      <div>
        <p className="text-sm font-semibold text-secondary-900">{label}</p>
        <p className="mt-0.5 text-xs text-surface-muted">{hint}</p>
      </div>
      <button
        onClick={() => setPrefs((p) => ({ ...p, [k]: !p[k] }))}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
          prefs[k] ? 'bg-primary-600' : 'bg-surface-border'
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
            prefs[k] ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div>
      <h2 className="text-sm font-semibold text-secondary-900">Notifications</h2>
      <p className="mt-1 text-xs text-surface-muted">Choose what you get notified about.</p>
      <div className="mt-3">
        <Toggle k="leads"  label="New leads"        hint="Email me when a new lead is created." />
        <Toggle k="quotes" label="Quotation status" hint="Notify on quotation accept / reject." />
        <Toggle k="weekly" label="Weekly digest"    hint="Send a sales summary every Monday."   />
      </div>
    </div>
  );
}

function SecurityPanel() {
  return (
    <div>
      <h2 className="text-sm font-semibold text-secondary-900">Security</h2>
      <p className="mt-1 text-xs text-surface-muted">Update your password and session preferences.</p>
      <div className="mt-5 grid max-w-md grid-cols-1 gap-4">
        <Field label="Current Password"><input type="password" className={inputCls} /></Field>
        <Field label="New Password"><input type="password" className={inputCls} /></Field>
        <Field label="Confirm Password"><input type="password" className={inputCls} /></Field>
      </div>
    </div>
  );
}

function GeneralPanel() {
  return (
    <div>
      <h2 className="text-sm font-semibold text-secondary-900">General</h2>
      <p className="mt-1 text-xs text-surface-muted">Workspace defaults and locale.</p>
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Workspace Name"><input defaultValue="BDD CRM" className={inputCls} /></Field>
        <Field label="Timezone">
          <select className={inputCls} defaultValue="Asia/Kolkata">
            <option>Asia/Kolkata</option>
            <option>UTC</option>
            <option>America/New_York</option>
          </select>
        </Field>
        <Field label="Currency">
          <select className={inputCls} defaultValue="INR">
            <option>INR</option>
            <option>USD</option>
            <option>EUR</option>
          </select>
        </Field>
        <Field label="Date Format">
          <select className={inputCls} defaultValue="YYYY-MM-DD">
            <option>YYYY-MM-DD</option>
            <option>DD/MM/YYYY</option>
            <option>MM/DD/YYYY</option>
          </select>
        </Field>
      </div>
    </div>
  );
}
