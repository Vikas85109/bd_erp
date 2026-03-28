import { Users, CheckCircle2, Clock, IndianRupee, UserPlus, FileText, TrendingUp, Phone, Bot, ArrowRight } from 'lucide-react';
import StatCard from '../components/StatCard';
import { stats, recentActivity, chartData } from '../data/dashboard';

const iconMap = {
  Users,
  CheckCircle: CheckCircle2,
  Clock,
  IndianRupee,
};

const activityIcons = {
  lead: { icon: UserPlus, color: 'text-blue-500', bg: 'bg-blue-100' },
  quotation: { icon: FileText, color: 'text-purple-500', bg: 'bg-purple-100' },
  conversion: { icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-100' },
  followup: { icon: Phone, color: 'text-amber-500', bg: 'bg-amber-100' },
  ai: { icon: Bot, color: 'text-indigo-500', bg: 'bg-indigo-100' },
  pipeline: { icon: ArrowRight, color: 'text-cyan-500', bg: 'bg-cyan-100' },
};

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Dashboard</h1>
        <p className="mt-1 text-sm text-surface-muted">Welcome back, Priya. Here's your sales overview.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const iconKey = stat.icon === 'CheckCircle' ? 'CheckCircle' : stat.icon;
          return (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              changeType={stat.changeType}
              gradient={stat.gradient}
              icon={iconMap[iconKey]}
            />
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Chart Placeholder - Leads Trend */}
        <div className="col-span-2 rounded-2xl bg-white p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-secondary-900">Leads Overview</h2>
              <p className="text-sm text-surface-muted">Monthly lead generation & conversion</p>
            </div>
            <select className="rounded-lg border border-surface-border bg-surface-bg px-3 py-1.5 text-sm text-surface-muted outline-none focus:border-primary-500">
              <option>Last 6 months</option>
              <option>Last 12 months</option>
              <option>This year</option>
            </select>
          </div>

          {/* Bar Chart Visualization */}
          <div className="mt-6">
            <div className="flex items-end justify-between gap-4" style={{ height: '240px' }}>
              {chartData.monthly.map((item) => {
                const maxLeads = Math.max(...chartData.monthly.map(d => d.leads));
                const leadHeight = (item.leads / maxLeads) * 100;
                const convertedHeight = (item.converted / maxLeads) * 100;
                return (
                  <div key={item.month} className="flex flex-1 flex-col items-center gap-2">
                    <div className="flex w-full items-end justify-center gap-1" style={{ height: '200px' }}>
                      <div
                        className="w-5 rounded-t-md bg-gradient-to-t from-primary-600 to-primary-400 transition-all duration-500"
                        style={{ height: `${leadHeight}%` }}
                        title={`Leads: ${item.leads}`}
                      />
                      <div
                        className="w-5 rounded-t-md bg-gradient-to-t from-emerald-600 to-emerald-400 transition-all duration-500"
                        style={{ height: `${convertedHeight}%` }}
                        title={`Converted: ${item.converted}`}
                      />
                    </div>
                    <span className="text-xs font-medium text-surface-muted">{item.month}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-sm bg-primary-500" />
                <span className="text-xs text-surface-muted">Total Leads</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-sm bg-emerald-500" />
                <span className="text-xs text-surface-muted">Converted</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lead Sources */}
        <div className="rounded-2xl bg-white p-6 shadow-md">
          <h2 className="text-lg font-bold text-secondary-900">Lead Sources</h2>
          <p className="text-sm text-surface-muted">Distribution by channel</p>

          <div className="mt-6 space-y-4">
            {chartData.sources.map((source) => (
              <div key={source.name}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-secondary-800">{source.name}</span>
                  <span className="text-sm font-semibold text-secondary-900">{source.value}%</span>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${source.value}%`, backgroundColor: source.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-2xl bg-white p-6 shadow-md">
        <h2 className="text-lg font-bold text-secondary-900">Recent Activity</h2>
        <p className="mb-4 text-sm text-surface-muted">Latest actions across your pipeline</p>

        <div className="space-y-1">
          {recentActivity.map((activity, index) => {
            const { icon: ActivityIcon, color, bg } = activityIcons[activity.type] || activityIcons.lead;
            return (
              <div
                key={activity.id}
                className="group flex items-start gap-4 rounded-xl p-3 transition-colors duration-200 hover:bg-surface-bg"
              >
                <div className={`mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${bg}`}>
                  <ActivityIcon className={`h-4 w-4 ${color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-secondary-900">{activity.action}</p>
                  <p className="text-sm text-surface-muted">{activity.description}</p>
                </div>
                <span className="flex-shrink-0 text-xs text-surface-muted">{activity.time}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
