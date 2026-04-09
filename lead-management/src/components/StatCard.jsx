import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ label, value, change, trend = 'up', icon: Icon }) {
  const isUp = trend === 'up';
  return (
    <div className="group rounded-2xl border border-surface-border bg-surface-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-surface-muted">{label}</p>
          <p className="mt-2 text-2xl font-bold text-secondary-900">{value}</p>
        </div>
        {Icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary-100 bg-primary-50">
            <Icon className="h-5 w-5 text-primary-600" />
          </div>
        )}
      </div>
      {change && (
        <div className="mt-4 flex items-center gap-1.5 text-xs font-medium">
          {isUp ? (
            <TrendingUp className="h-3.5 w-3.5 text-accent-600" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5 text-error-500" />
          )}
          <span className={isUp ? 'text-accent-600' : 'text-error-500'}>{change}</span>
          <span className="text-surface-muted">vs last month</span>
        </div>
      )}
    </div>
  );
}
