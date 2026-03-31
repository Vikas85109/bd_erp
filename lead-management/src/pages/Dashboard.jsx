import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, CheckCircle2, Clock, IndianRupee, UserPlus, FileText,
  TrendingUp, Phone, Bot, ArrowRight, Mail, MessageSquare,
  Globe, Zap, CalendarCheck, BarChart3, ArrowUpRight, ArrowDownRight,
} from 'lucide-react';
import StatCard from '../components/StatCard';
import { leads, getStatusColor } from '../data/leads';
import { followups } from '../data/followups';
import { pipelineStages, formatCurrency } from '../data/crm';
import { quotations } from '../data/quotations';
import { chartData } from '../data/dashboard';

export default function Dashboard() {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [liveLeadCount, setLiveLeadCount] = useState(leads.length);

  // Live counter simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveLeadCount((prev) => prev + Math.floor(Math.random() * 2));
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Computed stats from real data
  const totalLeads = liveLeadCount;
  const convertedLeads = leads.filter((l) => l.status === 'Converted').length;
  const pendingLeads = leads.filter((l) => ['New', 'Contacted', 'Qualified'].includes(l.status)).length;
  const totalRevenue = leads.filter((l) => l.status === 'Converted').reduce((sum, l) => sum + l.value, 0);
  const pipelineValue = leads.reduce((sum, l) => sum + l.value, 0);
  const pendingFollowups = followups.filter((f) => !f.completed).length;
  const overdueFollowups = followups.filter((f) => !f.completed && new Date(f.dueDate) < new Date()).length;
  const totalQuotations = quotations.length;

  // Source breakdown from real data
  const sourceBreakdown = ['Website', 'Email', 'WhatsApp'].map((source) => {
    const count = leads.filter((l) => l.source === source).length;
    return { name: source, count, percent: Math.round((count / leads.length) * 100) };
  });

  // Status breakdown
  const statusBreakdown = ['New', 'Contacted', 'Qualified', 'Proposal', 'Converted', 'Lost'].map((status) => ({
    status,
    count: leads.filter((l) => l.status === status).length,
    colors: getStatusColor(status),
  }));

  // Pipeline stage values
  const stageData = pipelineStages.map((stage) => ({
    ...stage,
    totalValue: stage.leads.reduce((s, l) => s + l.value, 0),
  }));

  // Recent leads (last 5)
  const recentLeads = [...leads].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  // Upcoming follow-ups (next 5 pending)
  const upcomingFollowups = followups
    .filter((f) => !f.completed)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  const sourceIcons = { Website: Globe, Email: Mail, WhatsApp: MessageSquare };
  const sourceColors = { Website: 'text-primary-400', Email: 'text-violet-400', WhatsApp: 'text-accent-400' };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Dashboard</h1>
          <p className="mt-1 text-sm text-surface-muted">Welcome back, Priya. Here's your sales overview.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-accent-50 border border-accent-100 px-3 py-1.5 text-xs font-medium text-accent-500">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-400" />
            </span>
            System Active
          </span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Leads" value={totalLeads.toLocaleString()} change="+12.5%" changeType="positive" gradient="from-primary-400 to-primary-600" icon={Users} iconColor="text-primary-500" iconBg="bg-primary-50" />
        <StatCard title="Converted" value={convertedLeads.toString()} change="+8.2%" changeType="positive" gradient="from-accent-400 to-accent-500" icon={CheckCircle2} iconColor="text-accent-500" iconBg="bg-accent-50" />
        <StatCard title="Pending" value={pendingLeads.toString()} change="-3.1%" changeType="negative" gradient="from-warning-400 to-warning-500" icon={Clock} iconColor="text-warning-500" iconBg="bg-warning-50" />
        <StatCard title="Pipeline Value" value={formatCurrency(pipelineValue)} change="+18.7%" changeType="positive" gradient="from-violet-400 to-violet-600" icon={IndianRupee} iconColor="text-violet-500" iconBg="bg-violet-50" />
      </div>

      {/* Second Row - Automation Status + Quick Actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm border border-surface-border/60">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100">
            <Zap className="h-5 w-5 text-secondary-800" />
          </div>
          <div>
            <p className="text-sm text-surface-muted">Lead Automation</p>
            <div className="flex items-center gap-2">
              <p className="text-lg font-bold text-secondary-900">{sourceBreakdown.reduce((s, b) => s + b.count, 0)} captured</p>
              <span className="rounded-full bg-accent-50 px-2 py-0.5 text-xs font-medium text-accent-500">Active</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm border border-surface-border/60">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100">
            <CalendarCheck className="h-5 w-5 text-secondary-800" />
          </div>
          <div>
            <p className="text-sm text-surface-muted">Follow-ups</p>
            <div className="flex items-center gap-2">
              <p className="text-lg font-bold text-secondary-900">{pendingFollowups} pending</p>
              {overdueFollowups > 0 && (
                <span className="rounded-full bg-error-50 px-2 py-0.5 text-xs font-medium text-error-400">{overdueFollowups} overdue</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm border border-surface-border/60">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100">
            <FileText className="h-5 w-5 text-secondary-800" />
          </div>
          <div>
            <p className="text-sm text-surface-muted">Quotations</p>
            <p className="text-lg font-bold text-secondary-900">{totalQuotations} generated</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Bar Chart */}
        <div className="col-span-2 rounded-2xl bg-white p-6 shadow-sm border border-surface-border/60">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-secondary-900">Leads Overview</h2>
              <p className="text-sm text-surface-muted">Monthly lead generation & conversion</p>
            </div>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="rounded-lg border border-surface-border bg-surface-bg px-3 py-1.5 text-sm text-surface-muted outline-none focus:border-primary-500"
            >
              <option value="6months">Last 6 months</option>
              <option value="12months">Last 12 months</option>
            </select>
          </div>
          <div className="mt-6">
            <div className="flex items-end justify-between gap-4" style={{ height: '240px' }}>
              {chartData.monthly.map((item) => {
                const maxLeads = Math.max(...chartData.monthly.map((d) => d.leads));
                const leadHeight = (item.leads / maxLeads) * 100;
                const convertedHeight = (item.converted / maxLeads) * 100;
                return (
                  <div key={item.month} className="flex flex-1 flex-col items-center gap-2">
                    <div className="flex w-full items-end justify-center gap-1" style={{ height: '200px' }}>
                      <div className="group relative w-5 rounded-t-md bg-linear-to-t from-primary-400 to-primary-200 transition-all duration-500 hover:from-primary-500 hover:to-primary-300 cursor-pointer" style={{ height: `${leadHeight}%` }}>
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block rounded bg-secondary-800 px-2 py-1 text-xs text-white whitespace-nowrap">{item.leads}</div>
                      </div>
                      <div className="group relative w-5 rounded-t-md bg-linear-to-t from-accent-400 to-accent-100 transition-all duration-500 hover:from-accent-500 hover:to-accent-200 cursor-pointer" style={{ height: `${convertedHeight}%` }}>
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block rounded bg-secondary-800 px-2 py-1 text-xs text-white whitespace-nowrap">{item.converted}</div>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-surface-muted">{item.month}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-sm bg-primary-300" />
                <span className="text-xs text-surface-muted">Total Leads</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-sm bg-accent-400" />
                <span className="text-xs text-surface-muted">Converted</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lead Sources - Live */}
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-surface-border/60">
          <h2 className="text-lg font-bold text-secondary-900">Lead Sources</h2>
          <p className="text-sm text-surface-muted">Auto-captured by channel</p>
          <div className="mt-6 space-y-5">
            {sourceBreakdown.map((source) => {
              const Icon = sourceIcons[source.name] || Globe;
              return (
                <div key={source.name}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 ${sourceColors[source.name]}`} />
                      <span className="text-sm font-medium text-secondary-800">{source.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-secondary-900">{source.count} leads ({source.percent}%)</span>
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div className="h-full rounded-full transition-all duration-700 bg-primary-300" style={{ width: `${source.percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Status Breakdown */}
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-secondary-900">Lead Status</h3>
            <div className="mt-3 space-y-2">
              {statusBreakdown.filter((s) => s.count > 0).map((s) => (
                <div key={s.status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${s.colors.dot}`} />
                    <span className="text-xs text-surface-muted">{s.status}</span>
                  </div>
                  <span className="text-xs font-semibold text-secondary-800">{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline Flow */}
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-surface-border/60">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-secondary-900">Pipeline Flow</h2>
            <p className="text-sm text-surface-muted">Lead progression through stages</p>
          </div>
          <button onClick={() => navigate('/crm')} className="text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors">
            View CRM →
          </button>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {stageData.map((stage, idx) => (
            <div key={stage.id} className="relative text-center">
              <div className="rounded-xl bg-surface-bg p-4">
                <p className="text-2xl font-bold text-secondary-900">{stage.leads.length}</p>
                <p className="text-sm font-medium text-secondary-700 mt-1">{stage.title}</p>
                <p className="text-xs text-surface-muted mt-1">{formatCurrency(stage.totalValue)}</p>
              </div>
              {idx < stageData.length - 1 && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10">
                  <ArrowRight className="h-4 w-4 text-surface-muted" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Leads */}
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-surface-border/60">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-secondary-900">Recent Leads</h2>
            <button onClick={() => navigate('/leads')} className="text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors">
              View all →
            </button>
          </div>
          <div className="space-y-3">
            {recentLeads.map((lead) => {
              const SourceIcon = sourceIcons[lead.source] || Globe;
              return (
                <div
                  key={lead.id}
                  onClick={() => navigate(`/leads/${lead.id}`)}
                  className="flex items-center gap-3 rounded-xl p-3 cursor-pointer transition-colors duration-200 hover:bg-surface-bg"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-secondary-800">
                    {lead.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-secondary-900">{lead.name}</p>
                    <p className="text-xs text-surface-muted">{lead.company}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <SourceIcon className={`h-3.5 w-3.5 ${sourceColors[lead.source]}`} />
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(lead.status).bg} ${getStatusColor(lead.status).text}`}>
                      {lead.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Follow-ups */}
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-surface-border/60">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-secondary-900">Upcoming Follow-ups</h2>
            <button onClick={() => navigate('/follow-ups')} className="text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors">
              View all →
            </button>
          </div>
          <div className="space-y-3">
            {upcomingFollowups.map((task) => {
              const isOverdue = new Date(task.dueDate) < new Date();
              return (
                <div key={task.id} className="flex items-center gap-3 rounded-xl p-3 transition-colors duration-200 hover:bg-surface-bg">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isOverdue ? 'bg-error-50' : 'bg-gray-100'}`}>
                    {task.type === 'email' ? <Mail className={`h-4 w-4 ${isOverdue ? 'text-error-400' : 'text-secondary-800'}`} /> :
                     task.type === 'call' ? <Phone className={`h-4 w-4 ${isOverdue ? 'text-error-400' : 'text-secondary-800'}`} /> :
                     <Users className={`h-4 w-4 ${isOverdue ? 'text-error-400' : 'text-secondary-800'}`} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-secondary-900 text-sm">{task.title}</p>
                    <p className="text-xs text-surface-muted">{task.leadName} — {task.company}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs font-medium ${isOverdue ? 'text-error-400' : 'text-surface-muted'}`}>
                      {isOverdue ? 'Overdue' : task.dueDate}
                    </p>
                    <span className={`text-xs capitalize ${
                      task.priority === 'high' ? 'text-error-400' :
                      task.priority === 'medium' ? 'text-warning-500' : 'text-primary-400'
                    }`}>{task.priority}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
