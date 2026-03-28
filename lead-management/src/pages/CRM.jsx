import { Kanban, TrendingUp, IndianRupee, Users } from 'lucide-react';
import KanbanColumn from '../components/KanbanColumn';
import { pipelineStages, formatCurrency } from '../data/crm';

export default function CRM() {
  const totalLeads = pipelineStages.reduce((sum, s) => sum + s.leads.length, 0);
  const totalValue = pipelineStages.reduce(
    (sum, s) => sum + s.leads.reduce((v, l) => v + l.value, 0),
    0
  );
  const conversionRate = pipelineStages.find((s) => s.id === 'converted')
    ? ((pipelineStages.find((s) => s.id === 'converted').leads.length / totalLeads) * 100).toFixed(0)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">CRM Pipeline</h1>
        <p className="mt-1 text-sm text-surface-muted">Visual overview of your sales pipeline</p>
      </div>

      {/* Pipeline Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-md">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-secondary-900">{totalLeads}</p>
            <p className="text-sm text-surface-muted">Leads in Pipeline</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-md">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100">
            <IndianRupee className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-secondary-900">{formatCurrency(totalValue)}</p>
            <p className="text-sm text-surface-muted">Pipeline Value</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-md">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100">
            <TrendingUp className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-secondary-900">{conversionRate}%</p>
            <p className="text-sm text-surface-muted">Conversion Rate</p>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="overflow-x-auto rounded-2xl bg-white p-6 shadow-md">
        <div className="flex gap-6" style={{ minWidth: '1100px' }}>
          {pipelineStages.map((stage) => (
            <KanbanColumn key={stage.id} stage={stage} />
          ))}
        </div>
      </div>

      {/* Tip */}
      <div className="rounded-2xl border border-primary-200 bg-primary-50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100">
            <Kanban className="h-4 w-4 text-primary-600" />
          </div>
          <p className="text-sm text-primary-800">
            <span className="font-semibold">Pro tip:</span> Drag and drop cards between columns to update lead stages in your pipeline.
          </p>
        </div>
      </div>
    </div>
  );
}
