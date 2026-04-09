import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);
  const [form, setForm] = useState({ email: 'priya@bddcrm.io', password: 'demo1234' });

  const handleSubmit = (e) => {
    e.preventDefault();
    // mock auth — just navigate
    navigate('/');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-bg px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary-100 bg-primary-50">
            <span className="text-lg font-bold text-primary-600">B&gt;</span>
          </div>
          <h1 className="mt-3 text-2xl font-bold text-secondary-900">Welcome back</h1>
          <p className="mt-1 text-sm text-surface-muted">Sign in to your BDD CRM account</p>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-surface-border bg-surface-card p-7 shadow-sm"
        >
          {/* Email */}
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-surface-muted">
            Email
          </label>
          <div className="relative mb-5">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-muted" />
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-xl border border-surface-border bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              placeholder="you@company.com"
            />
          </div>

          {/* Password */}
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-surface-muted">
            Password
          </label>
          <div className="relative mb-2">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-muted" />
            <input
              type={showPwd ? 'text' : 'password'}
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-xl border border-surface-border bg-white py-2.5 pl-10 pr-10 text-sm outline-none transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPwd((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-muted transition-colors hover:text-secondary-900"
            >
              {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <div className="mb-6 flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-surface-muted">
              <input type="checkbox" className="h-3.5 w-3.5 rounded border-surface-border" />
              Remember me
            </label>
            <a href="#" className="font-medium text-primary-600 hover:text-primary-700">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-primary-600 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-700 active:scale-[0.99]"
          >
            Sign In
          </button>

          <p className="mt-5 text-center text-xs text-surface-muted">
            Don&apos;t have an account?{' '}
            <a href="#" className="font-medium text-primary-600 hover:text-primary-700">
              Request access
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
