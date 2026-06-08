import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  ShieldCheck,
  RefreshCw,
  Banknote,
  Check,
  Minus,
  ArrowLeft,
} from 'lucide-react';
import { plans, currentPlan, faqs } from '../data/billing';
import PlanCard from '../components/billing/PlanCard';
import Modal from '../components/Modal';

const COMPARISON_ROWS = [
  { key: 'users', label: 'Team members' },
  { key: 'storage', label: 'Storage (GB)' },
  { key: 'apiCalls', label: 'API calls / mo' },
  { key: 'emails', label: 'Emails / mo' },
  { key: 'contacts', label: 'Contacts' },
];

const FEATURE_MATRIX = [
  { label: 'Lead pipelines', available: ['starter', 'pro', 'business', 'enterprise'] },
  { label: 'Advanced reporting', available: ['pro', 'business', 'enterprise'] },
  { label: 'Custom roles & permissions', available: ['pro', 'business', 'enterprise'] },
  { label: 'Webhooks & Zapier', available: ['pro', 'business', 'enterprise'] },
  { label: 'Audit logs', available: ['business', 'enterprise'] },
  { label: 'SSO / SAML', available: ['business', 'enterprise'] },
  { label: 'Dedicated success manager', available: ['enterprise'] },
  { label: '99.99% SLA', available: ['enterprise'] },
];

const formatLimit = (v) => {
  if (v === 'Unlimited') return 'Unlimited';
  if (typeof v === 'number' && v >= 1000) return v.toLocaleString();
  return String(v);
};

export default function BillingUpgrade() {
  const navigate = useNavigate();
  const [billing, setBilling] = useState('monthly');
  const [openFaq, setOpenFaq] = useState(null);
  const [confirmPlan, setConfirmPlan] = useState(null);

  const handleSelect = (plan) => {
    if (plan.id === 'enterprise') {
      window.location.href = 'mailto:sales@bindassdealdigital.com?subject=Enterprise%20plan%20inquiry';
      return;
    }
    setConfirmPlan(plan);
  };

  const handleConfirm = () => {
    const plan = confirmPlan;
    setConfirmPlan(null);
    navigate(`/billing/checkout?plan=${plan.id}&period=${billing}`);
  };

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <button
            type="button"
            onClick={() => navigate('/billing')}
            className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-surface-muted hover:text-primary-600"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to billing
          </button>
          <h1 className="text-2xl font-bold text-secondary-900">Choose your plan</h1>
          <p className="mt-1 text-sm text-surface-muted">
            Switch plans anytime. Upgrades are prorated, downgrades apply at period end.
          </p>
        </div>

        {/* Billing toggle */}
        <div
          className="inline-flex items-center gap-1 rounded-xl border border-surface-border bg-white p-1"
          role="tablist"
          aria-label="Billing period"
        >
          <button
            role="tab"
            aria-selected={billing === 'monthly'}
            onClick={() => setBilling('monthly')}
            className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 ${
              billing === 'monthly'
                ? 'bg-primary-600 text-white'
                : 'text-secondary-700 hover:bg-surface-bg'
            }`}
          >
            Monthly
          </button>
          <button
            role="tab"
            aria-selected={billing === 'yearly'}
            onClick={() => setBilling('yearly')}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-1.5 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 ${
              billing === 'yearly'
                ? 'bg-primary-600 text-white'
                : 'text-secondary-700 hover:bg-surface-bg'
            }`}
          >
            Yearly
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                billing === 'yearly'
                  ? 'bg-white text-primary-600'
                  : 'bg-accent-50 text-accent-600'
              }`}
            >
              Save 17%
            </span>
          </button>
        </div>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {plans.map((p) => (
          <PlanCard
            key={p.id}
            plan={p}
            currentPlanId={currentPlan.id}
            billing={billing}
            onSelect={handleSelect}
          />
        ))}
      </div>

      {/* Trust strip */}
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 rounded-2xl border border-surface-border bg-white px-5 py-4 text-xs font-medium text-surface-muted">
        <span className="inline-flex items-center gap-2">
          <RefreshCw className="h-3.5 w-3.5" /> Cancel anytime
        </span>
        <span className="inline-flex items-center gap-2">
          <Banknote className="h-3.5 w-3.5" /> Prorated billing
        </span>
        <span className="inline-flex items-center gap-2">
          <ShieldCheck className="h-3.5 w-3.5" /> 30-day money back
        </span>
      </div>

      {/* Comparison table */}
      <section
        aria-label="Plan comparison"
        className="overflow-hidden rounded-2xl border border-surface-border bg-white"
      >
        <div className="border-b border-surface-border p-5">
          <h2 className="text-sm font-semibold text-secondary-900">Compare plans</h2>
          <p className="mt-1 text-xs text-surface-muted">
            Every feature across every plan, side by side.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm">
            <thead className="sticky top-0 bg-surface-bg">
              <tr className="border-b border-surface-border text-xs uppercase tracking-wide text-surface-muted">
                <th className="p-4 text-left font-semibold">Feature</th>
                {plans.map((p) => (
                  <th key={p.id} className="p-4 text-left font-semibold">
                    <span className="text-sm font-bold text-secondary-900">{p.name}</span>
                    {p.id === currentPlan.id && (
                      <span className="ml-2 rounded-full bg-primary-50 px-2 py-0.5 text-[10px] font-semibold text-primary-600">
                        Current
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row) => (
                <tr key={row.key} className="border-b border-surface-border last:border-0">
                  <td className="p-4 font-medium text-secondary-900">{row.label}</td>
                  {plans.map((p) => (
                    <td key={p.id} className="p-4 text-secondary-800">
                      {formatLimit(p.limits[row.key])}
                    </td>
                  ))}
                </tr>
              ))}
              {FEATURE_MATRIX.map((row) => (
                <tr key={row.label} className="border-b border-surface-border last:border-0">
                  <td className="p-4 font-medium text-secondary-900">{row.label}</td>
                  {plans.map((p) => (
                    <td key={p.id} className="p-4">
                      {row.available.includes(p.id) ? (
                        <Check className="h-4 w-4 text-accent-600" />
                      ) : (
                        <Minus className="h-4 w-4 text-surface-muted/60" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section aria-label="Frequently asked questions" className="max-w-3xl">
        <h2 className="text-lg font-bold text-secondary-900">Frequently asked questions</h2>
        <div className="mt-5 overflow-hidden rounded-2xl border border-surface-border bg-white">
          {faqs.map((item, idx) => {
            const open = openFaq === idx;
            return (
              <div key={item.q} className="border-b border-surface-border last:border-0">
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setOpenFaq(open ? null : idx)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left transition-colors hover:bg-surface-bg/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300"
                >
                  <span className="text-sm font-semibold text-secondary-900">{item.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-surface-muted transition-transform ${
                      open ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {open && (
                  <div className="px-5 pb-5 text-sm text-secondary-700">{item.a}</div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Confirm modal */}
      <Modal
        isOpen={!!confirmPlan}
        onClose={() => setConfirmPlan(null)}
        title="Confirm plan change"
        footer={
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setConfirmPlan(null)}
              className="rounded-xl border border-surface-border bg-white px-4 py-2 text-sm font-semibold text-secondary-900 hover:bg-surface-bg"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
            >
              Continue to checkout
            </button>
          </div>
        }
      >
        {confirmPlan && (
          <div className="space-y-3 text-sm text-secondary-800">
            <p>
              You are about to switch from{' '}
              <strong>{currentPlan.name}</strong> to{' '}
              <strong>{confirmPlan.name}</strong> (
              {billing === 'yearly' ? 'yearly' : 'monthly'} billing).
            </p>
            <p className="text-surface-muted">
              You will be taken to the checkout page to review charges and confirm.
              Upgrades take effect immediately with prorated billing; downgrades apply
              at the end of your current cycle.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
