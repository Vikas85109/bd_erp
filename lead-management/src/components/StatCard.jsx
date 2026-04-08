import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ title, value, change, changeType, gradient, icon: Icon, iconColor, iconBg }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-surface-border/60 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
      {/* Subtle top accent line */}
      <div className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r ${gradient} opacity-80`} />

      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-surface-muted">{title}</p>
            <p className="mt-2 text-3xl font-bold text-secondary-900">{value}</p>
          </div>
          <div className={`rounded-xl ${iconBg || 'bg-primary-50'} p-3`}>
            <Icon className={`h-5 w-5 ${iconColor || 'text-primary-500'}`} />
          </div>
        </div>
      
        <div className="mt-4 flex items-center gap-1.5">
          {changeType === 'positive' ? (
            <TrendingUp className="h-4 w-4 text-accent-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-error-500" />
          )}
          <span className={`text-sm font-medium ${changeType === 'positive' ? 'text-accent-500' : 'text-error-500'}`}>
            {change}
          </span>
          <span className="text-sm text-surface-muted">vs last month</span>
        </div>
      </div>
    </div>
  );
}
