import { useState } from 'react';
import { UserCircle, Palette, Bell, Save } from 'lucide-react';

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [notif, setNotif] = useState({ email: true, push: false, weekly: true });

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Settings</h1>
        <p className="text-sm text-surface-muted mt-1">Manage your account and application preferences</p>
      </div>

      {/* Profile */}
      <Section icon={UserCircle} title="Profile Settings" subtitle="Manage your personal account details">
        <div className="flex items-center gap-4 pb-5 border-b border-surface-border">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 border border-primary-100 text-base font-semibold text-primary-600">
            AU
          </div>
          <div>
            <p className="text-sm font-semibold text-secondary-900">Admin User</p>
            <p className="text-xs text-surface-muted">Super_admin</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-5">
          <Field label="Full Name" defaultValue="Admin User" />
          <Field label="Email" defaultValue="admin@bindassdeal.com" type="email" />
          <Field label="Role" defaultValue="SUPER_ADMIN" disabled />
          <Field label="Member Since" defaultValue="April 2, 2026" disabled />
        </div>

        <div className="flex justify-end pt-5">
          <button className="flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600">
            <Save className="h-4 w-4" />
            Save Profile
          </button>
        </div>
      </Section>

      {/* Appearance */}
      <Section icon={Palette} title="Appearance" subtitle="Customize the look and feel">
        <Toggle
          label="Dark Mode"
          desc="Toggle between light and dark theme"
          checked={darkMode}
          onChange={() => setDarkMode(!darkMode)}
        />
      </Section>

      {/* Notifications */}
      <Section icon={Bell} title="Notifications" subtitle="Configure notification preferences">
        <div className="space-y-4">
          <Toggle
            label="Email Notifications"
            desc="Receive updates via email"
            checked={notif.email}
            onChange={() => setNotif({ ...notif, email: !notif.email })}
          />
          <div className="border-t border-surface-border" />
          <Toggle
            label="Push Notifications"
            desc="Get real-time alerts in your browser"
            checked={notif.push}
            onChange={() => setNotif({ ...notif, push: !notif.push })}
          />
          <div className="border-t border-surface-border" />
          <Toggle
            label="Weekly Digest"
            desc="Summary of your activity every Monday"
            checked={notif.weekly}
            onChange={() => setNotif({ ...notif, weekly: !notif.weekly })}
          />
        </div>
      </Section>
    </div>
  );
}

function Section({ icon: Icon, title, subtitle, children }) {
  return (
    <div className="rounded-2xl border border-surface-border bg-white p-6">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="h-5 w-5 text-primary-500" />
        <h2 className="text-base font-bold text-secondary-900">{title}</h2>
      </div>
      <p className="text-xs text-surface-muted mb-5">{subtitle}</p>
      {children}
    </div>
  );
}

function Field({ label, defaultValue, type = 'text', disabled = false }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-secondary-800 mb-1.5">{label}</label>
      <input
        type={type}
        defaultValue={defaultValue}
        disabled={disabled}
        className={`w-full rounded-xl border border-surface-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 ${
          disabled ? 'bg-surface-bg text-surface-muted cursor-not-allowed' : 'bg-white text-secondary-900'
        }`}
      />
    </div>
  );
}

function Toggle({ label, desc, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-secondary-900">{label}</p>
        <p className="text-xs text-surface-muted">{desc}</p>
      </div>
      <button
        onClick={onChange}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? 'bg-primary-500' : 'bg-surface-border'
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
            checked ? 'left-[22px]' : 'left-0.5'
          }`}
        />
      </button>
    </div>
  );
}
