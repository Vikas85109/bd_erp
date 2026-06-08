import { Check, X, Rocket, Zap, Building2, Crown } from 'lucide-react';

const iconByPlan = {
  starter: Rocket,
  pro: Zap,
  business: Building2,
  enterprise: Crown,
};

export default function PlanCard({ plan, currentPlanId, billing = 'monthly', onSelect }) {
  const Icon = iconByPlan[plan.id] || Rocket;
  const isCurrent = plan.id === currentPlanId;
  const isEnterprise = plan.id === 'enterprise';
  const isRecommended = plan.badge === 'Most Popular';

  const price = billing === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
  const period = billing === 'yearly' ? 'year' : 'month';

  const priceDisplay = () => {
    if (price === null || price === undefined) return 'Custom';
    if (price === 0) return 'Free';
    return `$${price}`;
  };

  const ctaLabel = isCurrent
    ? 'Current plan'
    : isEnterprise
    ? 'Contact sales'
    : plan.cta;

  const ctaClass = isCurrent
    ? 'bg-surface-bg text-surface-muted cursor-not-allowed border border-surface-border'
    : isRecommended
    ? 'bg-primary-600 text-white hover:bg-primary-700 border border-primary-600'
    : 'bg-white text-secondary-900 hover:bg-surface-bg border border-surface-border';

  return (
    <div
      className={`relative flex flex-col rounded-2xl border bg-white p-6 transition-all duration-200 ${
        isRecommended
          ? 'border-primary-500 shadow-sm ring-1 ring-primary-100'
          : 'border-surface-border hover:border-primary-200'
      }`}
    >
      {isRecommended && (
        <span className="absolute -top-3 left-6 rounded-full bg-primary-600 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
          Most Popular
        </span>
      )}

      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            isRecommended
              ? 'bg-primary-50 text-primary-600 border border-primary-100'
              : 'bg-surface-bg text-secondary-800 border border-surface-border'
          }`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-secondary-900">{plan.name}</h3>
        </div>
      </div>

      <p className="mt-3 min-h-[40px] text-sm text-surface-muted">{plan.description}</p>

      <div className="mt-5 flex items-baseline gap-1">
        <span className="text-4xl font-bold tracking-tight text-secondary-900">
          {priceDisplay()}
        </span>
        {price !== null && price > 0 && (
          <span className="text-sm text-surface-muted">/{period}</span>
        )}
      </div>
      {billing === 'yearly' && price > 0 && (
        <p className="mt-1 text-xs text-accent-600">
          Equivalent to ${Math.round((plan.yearlyPrice / 12) * 100) / 100}/mo
        </p>
      )}

      <button
        type="button"
        disabled={isCurrent}
        onClick={() => !isCurrent && onSelect?.(plan)}
        aria-label={`${ctaLabel} — ${plan.name}`}
        className={`mt-5 w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 ${ctaClass}`}
      >
        {ctaLabel}
      </button>

      <ul className="mt-6 space-y-2.5 border-t border-surface-border pt-5">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-secondary-800">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-600" />
            <span>{f}</span>
          </li>
        ))}
        {plan.excluded?.map((f) => (
          <li
            key={f}
            className="flex items-start gap-2 text-sm text-surface-muted line-through"
          >
            <X className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
