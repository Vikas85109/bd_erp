import { useState } from 'react';
import { Save, Upload, Palette } from 'lucide-react';
import PageHeader from '../components/PageHeader';

const PRESET_COLORS = ['#6366F1', '#0D9488', '#F59E0B', '#F43F5E', '#3B82F6', '#8B5CF6'];

export default function Branding() {
  const [brand, setBrand] = useState({
    name: 'BDD CRM',
    tagline: 'Sales, simplified.',
    primary: '#6366F1',
    accent: '#0D9488',
  });

  const update = (key, value) => setBrand((b) => ({ ...b, [key]: value }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Branding"
        subtitle="Customise how your CRM looks for your team."
        action={
          <button className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-700 active:scale-[0.99]">
            <Save className="h-4 w-4" /> Save Changes
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Form */}
        <div className="space-y-6 lg:col-span-2">
          {/* Identity */}
          <section className="rounded-2xl border border-surface-border bg-surface-card p-6">
            <h2 className="text-sm font-semibold text-secondary-900">Identity</h2>
            <p className="mt-1 text-xs text-surface-muted">Public-facing brand details.</p>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-surface-muted">
                  Brand Name
                </label>
                <input
                  value={brand.name}
                  onChange={(e) => update('name', e.target.value)}
                  className="w-full rounded-xl border border-surface-border bg-white px-4 py-2 text-sm outline-none transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-surface-muted">
                  Tagline
                </label>
                <input
                  value={brand.tagline}
                  onChange={(e) => update('tagline', e.target.value)}
                  className="w-full rounded-xl border border-surface-border bg-white px-4 py-2 text-sm outline-none transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
            </div>
          </section>

          {/* Logo */}
          <section className="rounded-2xl border border-surface-border bg-surface-card p-6">
            <h2 className="text-sm font-semibold text-secondary-900">Logo</h2>
            <p className="mt-1 text-xs text-surface-muted">PNG or SVG, recommended 256×256.</p>

            <div className="mt-5 flex items-center gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-primary-100 bg-primary-50">
                <span className="text-xl font-bold text-primary-600">B&gt;</span>
              </div>
              <button className="inline-flex items-center gap-2 rounded-xl border border-surface-border bg-white px-4 py-2 text-sm font-medium text-secondary-800 transition-all duration-200 hover:bg-surface-bg">
                <Upload className="h-4 w-4" /> Upload Logo
              </button>
            </div>
          </section>

          {/* Colors */}
          <section className="rounded-2xl border border-surface-border bg-surface-card p-6">
            <h2 className="text-sm font-semibold text-secondary-900">Theme Colors</h2>
            <p className="mt-1 text-xs text-surface-muted">Choose your primary and accent colors.</p>

            {['primary', 'accent'].map((field) => (
              <div key={field} className="mt-5">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-surface-muted">
                  {field}
                </label>
                <div className="flex items-center gap-2">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => update(field, c)}
                      className={`h-9 w-9 rounded-xl border-2 transition-all duration-200 ${
                        brand[field] === c
                          ? 'border-secondary-900 scale-110'
                          : 'border-surface-border hover:scale-105'
                      }`}
                      style={{ background: c }}
                      aria-label={`Pick ${c}`}
                    />
                  ))}
                  <div className="ml-2 flex items-center gap-2 rounded-xl border border-surface-border bg-white px-3 py-1.5">
                    <Palette className="h-3.5 w-3.5 text-surface-muted" />
                    <span className="font-mono text-xs text-secondary-700">{brand[field]}</span>
                  </div>
                </div>
              </div>
            ))}
          </section>
        </div>

        {/* Preview */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 rounded-2xl border border-surface-border bg-surface-card p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-surface-muted">
              Live Preview
            </p>

            <div className="mt-4 overflow-hidden rounded-xl border border-surface-border">
              {/* Mock navbar */}
              <div
                className="flex items-center gap-2 px-4 py-3"
                style={{ background: brand.primary }}
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20 text-xs font-bold text-white">
                  B&gt;
                </div>
                <span className="text-sm font-semibold text-white">{brand.name}</span>
              </div>

              {/* Mock card */}
              <div className="space-y-3 bg-white p-4">
                <p className="text-xs text-surface-muted">{brand.tagline}</p>
                <button
                  className="w-full rounded-lg py-2 text-xs font-semibold text-white"
                  style={{ background: brand.primary }}
                >
                  Primary Action
                </button>
                <button
                  className="w-full rounded-lg py-2 text-xs font-semibold text-white"
                  style={{ background: brand.accent }}
                >
                  Accent Action
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
