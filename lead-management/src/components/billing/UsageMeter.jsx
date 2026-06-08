export default function UsageMeter({ label, used, total, unit = '' }) {
  const isUnlimited = total === 'Unlimited' || total === Infinity;
  const numericTotal = isUnlimited ? null : Number(total);
  const numericUsed = Number(used) || 0;

  const pct = isUnlimited
    ? Math.min(100, (numericUsed / Math.max(numericUsed * 2, 1)) * 100)
    : Math.min(100, (numericUsed / numericTotal) * 100);

  const barColor =
    !isUnlimited && pct >= 90
      ? 'bg-error-500'
      : !isUnlimited && pct >= 70
      ? 'bg-warning-500'
      : 'bg-primary-500';

  const labelColor =
    !isUnlimited && pct >= 90
      ? 'text-error-500'
      : !isUnlimited && pct >= 70
      ? 'text-warning-500'
      : 'text-primary-600';

  const format = (value) => {
    if (typeof value === 'string') return value;
    if (value >= 1000) return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`;
    return Number.isInteger(value) ? value.toString() : value.toFixed(1);
  };

  return (
    <div
      className="rounded-xl border border-surface-border bg-white p-4"
      role="group"
      aria-label={`${label} usage`}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-surface-muted">{label}</p>
        <p className={`text-xs font-semibold ${labelColor}`}>
          {isUnlimited ? '∞' : `${Math.round(pct)}%`}
        </p>
      </div>
      <div className="mt-3 h-2 w-full rounded-full bg-surface-bg overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${isUnlimited ? 40 : pct}%` }}
          role="progressbar"
          aria-valuenow={isUnlimited ? 0 : Math.round(pct)}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      <p className="mt-3 text-sm font-semibold text-secondary-900">
        {format(numericUsed)}
        <span className="ml-1 text-xs font-normal text-surface-muted">
          / {isUnlimited ? 'Unlimited' : format(numericTotal)} {unit}
        </span>
      </p>
    </div>
  );
}
