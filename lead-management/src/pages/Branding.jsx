import { useState, useCallback } from 'react';
import {
  Sparkles,
  Building2,
  Palette,
  Phone,
  Share2,
  Save,
  RotateCcw,
  Mail,
  Globe,
  MapPin,
  FileText,
  Eye,
  Check,
} from 'lucide-react';
import {
  defaultBranding,
  socialPlatforms,
  colorPresets,
  logoShapes,
  getShapeRadius,
} from '../data/branding';
import Toast from '../components/Toast';

export default function Branding() {
  const [brand, setBrand] = useState(defaultBranding);
  const [toast, setToast] = useState(null);

  const update = useCallback((field, value) => {
    setBrand((prev) => ({ ...prev, [field]: value }));
  }, []);

  const updateSocial = useCallback((key, value) => {
    setBrand((prev) => ({ ...prev, social: { ...prev.social, [key]: value } }));
  }, []);

  const applyPreset = useCallback((preset) => {
    setBrand((prev) => ({ ...prev, brandColor: preset.brand, accentColor: preset.accent }));
  }, []);

  const handleSave = useCallback(() => {
    setToast({ message: 'Brand identity saved successfully', type: 'success' });
  }, []);

  const handleReset = useCallback(() => {
    setBrand(defaultBranding);
    setToast({ message: 'Reset to default branding', type: 'info' });
  }, []);

  const monogram = (brand.monogram || brand.companyName || 'B').slice(0, 3).toUpperCase();
  const logoRadius = getShapeRadius(brand.logoShape);
  const heroGradient = `linear-gradient(135deg, ${brand.brandColor} 0%, ${brand.accentColor} 100%)`;
  const dotPattern = `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.18) 1px, transparent 0)`;

  return (
    <div className="space-y-6">
      {/* HERO — live brand showcase */}
      <div className="relative overflow-hidden rounded-3xl shadow-lg">
        {/* Gradient base */}
        <div className="absolute inset-0" style={{ background: heroGradient }} />
        {/* Dot pattern overlay */}
        <div
          className="absolute inset-0"
          style={{ backgroundImage: dotPattern, backgroundSize: '24px 24px' }}
        />
        {/* Soft white wash from top to give text contrast */}
        <div className="absolute inset-0 bg-linear-to-b from-black/0 via-black/0 to-black/10" />

        {/* Content */}
        <div className="relative flex flex-col gap-6 p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
          <div className="flex items-center gap-5 sm:gap-6">
            {/* Big monogram tile */}
            <div
              className="flex h-20 w-20 shrink-0 items-center justify-center bg-white text-2xl font-bold shadow-xl ring-1 ring-white/40 sm:h-24 sm:w-24 sm:text-3xl"
              style={{ borderRadius: logoRadius, color: brand.brandColor }}
            >
              {monogram}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
                Brand Identity
              </p>
              <h1 className="mt-1.5 truncate text-2xl font-bold text-white sm:text-4xl">
                {brand.companyName || 'Your Company'}
              </h1>
              <p className="mt-1 max-w-md truncate text-sm text-white/85 sm:text-base">
                {brand.tagline || 'Add a tagline that captures your story'}
              </p>
              {brand.legalName && (
                <p className="mt-2 text-[11px] uppercase tracking-wider text-white/60">
                  {brand.legalName}
                </p>
              )}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/20"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold shadow-md transition-all hover:shadow-lg"
              style={{ color: brand.brandColor }}
            >
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* BODY — form + sticky preview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* LEFT — form */}
        <div className="space-y-6 lg:col-span-3">
          {/* Identity */}
          <Section
            icon={Building2}
            title="Brand Identity"
            subtitle="The name and short story your customers will see"
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field
                label="Display Name"
                value={brand.companyName}
                onChange={(v) => update('companyName', v)}
                placeholder="Bindass Deal"
              />
              <Field
                label="Legal Name"
                value={brand.legalName}
                onChange={(v) => update('legalName', v)}
                placeholder="Bindass Deal Pvt. Ltd."
              />
              <div className="sm:col-span-2">
                <Field
                  label="Tagline"
                  value={brand.tagline}
                  onChange={(v) => update('tagline', v)}
                  placeholder="Smart deals. Faster closes."
                />
              </div>

              {/* Logo monogram */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-secondary-800">
                  Logo Monogram
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    maxLength={3}
                    value={brand.monogram}
                    onChange={(e) => update('monogram', e.target.value)}
                    className="w-20 rounded-xl border border-surface-border bg-white px-3 py-2.5 text-center text-sm font-bold uppercase text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                  <div
                    className="flex h-11 w-11 items-center justify-center text-sm font-bold text-white shadow-sm"
                    style={{ backgroundColor: brand.brandColor, borderRadius: logoRadius }}
                  >
                    {monogram}
                  </div>
                  <p className="text-xs text-surface-muted">1-3 characters</p>
                </div>
              </div>

              {/* Logo shape picker */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-secondary-800">
                  Logo Shape
                </label>
                <div className="flex gap-2">
                  {logoShapes.map((shape) => (
                    <ShapeButton
                      key={shape.key}
                      shape={shape}
                      monogram={monogram[0]}
                      brandColor={brand.brandColor}
                      active={brand.logoShape === shape.key}
                      onClick={() => update('logoShape', shape.key)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </Section>

          {/* Brand Colors */}
          <Section
            icon={Palette}
            title="Brand Colors"
            subtitle="Pick a curated palette or fine-tune your own"
          >
            {/* Curated presets */}
            <div className="mb-6">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-surface-muted">
                Quick Palettes
              </p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {colorPresets.map((preset) => (
                  <ColorPresetButton
                    key={preset.name}
                    preset={preset}
                    active={
                      brand.brandColor === preset.brand && brand.accentColor === preset.accent
                    }
                    onClick={() => applyPreset(preset)}
                  />
                ))}
              </div>
            </div>

            <div className="border-t border-surface-border pt-5">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-surface-muted">
                Custom Colors
              </p>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <ColorField
                  label="Primary Color"
                  value={brand.brandColor}
                  onChange={(v) => update('brandColor', v)}
                />
                <ColorField
                  label="Accent Color"
                  value={brand.accentColor}
                  onChange={(v) => update('accentColor', v)}
                />
              </div>
            </div>
          </Section>

          {/* Contact */}
          <Section
            icon={Phone}
            title="Contact Information"
            subtitle="Appears in the footer of quotations and email signatures"
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field
                label="Email"
                type="email"
                value={brand.email}
                onChange={(v) => update('email', v)}
                placeholder="hello@example.com"
              />
              <Field
                label="Phone"
                value={brand.phone}
                onChange={(v) => update('phone', v)}
                placeholder="+91 98765 43210"
              />
              <Field
                label="Website"
                value={brand.website}
                onChange={(v) => update('website', v)}
                placeholder="www.example.com"
              />
              <Field
                label="GSTIN"
                value={brand.gstin}
                onChange={(v) => update('gstin', v)}
                placeholder="29ABCDE1234F1Z5"
              />
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold text-secondary-800">
                  Address
                </label>
                <textarea
                  rows={2}
                  value={brand.address}
                  onChange={(e) => update('address', e.target.value)}
                  className="w-full resize-none rounded-xl border border-surface-border bg-white px-3 py-2.5 text-sm text-secondary-900 placeholder-surface-muted focus:outline-none focus:ring-2 focus:ring-primary-100"
                  placeholder="Street, City, Postal Code"
                />
              </div>
            </div>
          </Section>

          {/* Social */}
          <Section
            icon={Share2}
            title="Social Handles"
            subtitle="Linked from email footers and the public quotation view"
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {socialPlatforms.map((p) => (
                <Field
                  key={p.key}
                  label={p.label}
                  value={brand.social[p.key] || ''}
                  onChange={(v) => updateSocial(p.key, v)}
                  placeholder={p.placeholder}
                />
              ))}
            </div>
          </Section>
        </div>

        {/* RIGHT — sticky preview stack */}
        <div className="lg:col-span-2">
          <div className="sticky top-6 max-h-[calc(100vh-3rem)] space-y-4 overflow-y-auto pr-1">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-surface-muted">
              <Eye className="h-3.5 w-3.5" />
              Live Preview
            </div>

            <QuotationPreview brand={brand} monogram={monogram} logoRadius={logoRadius} />
            <EmailSignaturePreview brand={brand} monogram={monogram} logoRadius={logoRadius} />

            {/* Color swatches */}
            <div className="rounded-2xl border border-surface-border bg-white p-4">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-surface-muted">
                Brand Palette
              </p>
              <div className="flex gap-3">
                <Swatch label="Primary" color={brand.brandColor} />
                <Swatch label="Accent" color={brand.accentColor} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

/* ---------- Preview cards ---------- */

function QuotationPreview({ brand, monogram, logoRadius }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-surface-border bg-white shadow-md">
      {/* Brand bar */}
      <div
        className="h-2 w-full"
        style={{
          background: `linear-gradient(90deg, ${brand.brandColor}, ${brand.accentColor})`,
        }}
      />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="flex h-12 w-12 items-center justify-center text-base font-bold text-white shadow-sm"
              style={{ backgroundColor: brand.brandColor, borderRadius: logoRadius }}
            >
              {monogram}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-secondary-900">
                {brand.companyName || 'Your Company'}
              </p>
              <p className="truncate text-xs text-surface-muted">
                {brand.tagline || 'Your tagline here'}
              </p>
            </div>
          </div>
          <span
            className="shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wider"
            style={{
              backgroundColor: `${brand.accentColor}1A`,
              color: brand.accentColor,
            }}
          >
            QUOTATION
          </span>
        </div>

        <div className="mt-5 rounded-xl bg-surface-bg p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-surface-muted">
            Quotation No.
          </p>
          <p className="mt-0.5 text-sm font-semibold text-secondary-900">
            Q-2847 · Apr 11, 2026
          </p>
        </div>

        <div className="mt-4 space-y-2 border-t border-surface-border pt-4 text-xs text-secondary-700">
          {brand.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-surface-muted" />
              <span className="truncate">{brand.email}</span>
            </div>
          )}
          {brand.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-surface-muted" />
              <span>{brand.phone}</span>
            </div>
          )}
          {brand.website && (
            <div className="flex items-center gap-2">
              <Globe className="h-3.5 w-3.5 text-surface-muted" />
              <span className="truncate">{brand.website}</span>
            </div>
          )}
          {brand.address && (
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-surface-muted" />
              <span className="leading-relaxed">{brand.address}</span>
            </div>
          )}
          {brand.gstin && (
            <div className="flex items-center gap-2">
              <FileText className="h-3.5 w-3.5 text-surface-muted" />
              <span>GSTIN: {brand.gstin}</span>
            </div>
          )}
        </div>

        {(brand.legalName || Object.values(brand.social).some(Boolean)) && (
          <div className="mt-4 border-t border-surface-border pt-3">
            {brand.legalName && (
              <p className="text-[10px] text-surface-muted">
                © {new Date().getFullYear()} {brand.legalName}
              </p>
            )}
            {Object.values(brand.social).some(Boolean) && (
              <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-surface-muted">
                {socialPlatforms.map((p) =>
                  brand.social[p.key] ? (
                    <span key={p.key}>
                      {p.label}: {brand.social[p.key]}
                    </span>
                  ) : null
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function EmailSignaturePreview({ brand, monogram, logoRadius }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-surface-border bg-white shadow-md">
      <div className="border-b border-surface-border bg-surface-bg px-4 py-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-surface-muted">
          Email Signature
        </p>
      </div>
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center text-base font-bold text-white shadow-sm"
            style={{ backgroundColor: brand.brandColor, borderRadius: logoRadius }}
          >
            {monogram}
          </div>
          <div
            className="min-w-0 flex-1 border-l-2 pl-4"
            style={{ borderColor: brand.brandColor }}
          >
            <p className="text-sm font-bold text-secondary-900">
              {brand.companyName || 'Your Company'}
            </p>
            {brand.tagline && (
              <p className="text-[11px] italic text-surface-muted">"{brand.tagline}"</p>
            )}
            <div className="mt-2 space-y-0.5 text-[11px] text-secondary-700">
              {brand.email && <p className="truncate">{brand.email}</p>}
              {brand.phone && <p>{brand.phone}</p>}
              {brand.website && (
                <p
                  className="truncate font-semibold"
                  style={{ color: brand.brandColor }}
                >
                  {brand.website}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Form helpers ---------- */

function Section({ icon: Icon, title, subtitle, children }) {
  return (
    <div className="rounded-2xl border border-surface-border bg-white p-6">
      <div className="mb-1 flex items-center gap-2">
        <Icon className="h-5 w-5 text-primary-500" />
        <h2 className="text-base font-bold text-secondary-900">{title}</h2>
      </div>
      <p className="mb-5 text-xs text-surface-muted">{subtitle}</p>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', placeholder }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-secondary-800">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-surface-border bg-white px-3 py-2.5 text-sm text-secondary-900 placeholder-surface-muted focus:outline-none focus:ring-2 focus:ring-primary-100"
      />
    </div>
  );
}

function ColorField({ label, value, onChange }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-secondary-800">
        {label}
      </label>
      <div className="flex items-center gap-3 rounded-xl border border-surface-border bg-white p-2 pr-3">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-12 shrink-0 cursor-pointer rounded-lg border border-surface-border bg-white"
          aria-label={`${label} picker`}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent font-mono text-sm uppercase text-secondary-900 focus:outline-none"
        />
      </div>
    </div>
  );
}

function ColorPresetButton({ preset, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative overflow-hidden rounded-xl border-2 p-2.5 text-left transition-all ${
        active
          ? 'border-primary-500 ring-2 ring-primary-100'
          : 'border-surface-border hover:border-primary-200 hover:shadow-sm'
      }`}
    >
      <div className="flex h-12 w-full overflow-hidden rounded-lg shadow-sm">
        <div className="flex-1" style={{ backgroundColor: preset.brand }} />
        <div className="flex-1" style={{ backgroundColor: preset.accent }} />
      </div>
      <div className="mt-2 flex items-center justify-between gap-1">
        <p className="truncate text-[11px] font-semibold text-secondary-900">
          {preset.name}
        </p>
        {active && (
          <Check className="h-3.5 w-3.5 shrink-0 text-primary-500" />
        )}
      </div>
    </button>
  );
}

function ShapeButton({ shape, monogram, brandColor, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-1 flex-col items-center gap-1.5 rounded-xl border-2 p-3 transition-all ${
        active
          ? 'border-primary-500 bg-primary-50'
          : 'border-surface-border hover:border-primary-200'
      }`}
    >
      <div
        className="flex h-9 w-9 items-center justify-center text-xs font-bold text-white shadow-sm"
        style={{ backgroundColor: brandColor, borderRadius: shape.radius }}
      >
        {monogram}
      </div>
      <span className="text-[10px] font-semibold text-secondary-700">{shape.label}</span>
    </button>
  );
}

function Swatch({ label, color }) {
  return (
    <div className="flex-1">
      <div
        className="h-14 w-full rounded-xl border border-surface-border shadow-sm"
        style={{ backgroundColor: color }}
      />
      <p className="mt-2 text-[11px] font-semibold text-secondary-900">{label}</p>
      <p className="font-mono text-[10px] uppercase text-surface-muted">{color}</p>
    </div>
  );
}
