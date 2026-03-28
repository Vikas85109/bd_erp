import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ title, value, change, changeType, gradient, icon: Icon }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-6 text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}>
      {/* Background decoration */}
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10" />
      <div className="absolute -right-2 -top-2 h-16 w-16 rounded-full bg-white/10" />

      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white/80">{title}</p>
            <p className="mt-2 text-3xl font-bold">{value}</p>
          </div>
          <div className="rounded-xl bg-white/20 p-3">
            <Icon className="h-6 w-6" />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-1.5">
          {changeType === 'positive' ? (
            <TrendingUp className="h-4 w-4 text-emerald-200" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-200" />
          )}
          <span className={`text-sm font-medium ${changeType === 'positive' ? 'text-emerald-200' : 'text-red-200'}`}>
            {change}
          </span>
          <span className="text-sm text-white/60">vs last month</span>
        </div>
      </div>
    </div>
  );
}
