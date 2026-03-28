import { formatCurrency } from '../data/crm';

export default function KanbanColumn({ stage }) {
  const totalValue = stage.leads.reduce((sum, l) => sum + l.value, 0);

  return (
    <div className="flex w-72 flex-shrink-0 flex-col rounded-2xl bg-surface-bg">
      {/* Column Header */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded-full bg-gradient-to-r ${stage.gradient}`} />
            <h3 className="font-semibold text-secondary-900">{stage.title}</h3>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-surface-muted">
              {stage.leads.length}
            </span>
          </div>
        </div>
        <p className="mt-1 text-sm text-surface-muted">{formatCurrency(totalValue)} total</p>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-3 p-2 pt-0">
        {stage.leads.map((lead) => (
          <div
            key={lead.id}
            className="cursor-grab rounded-xl bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md active:cursor-grabbing active:shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-secondary-900">{lead.name}</h4>
                <p className="text-sm text-surface-muted">{lead.company}</p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-xs font-bold text-white">
                {lead.name.split(' ').map((n) => n[0]).join('')}
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-primary-700">{formatCurrency(lead.value)}</span>
              <span className="text-xs text-surface-muted">{lead.daysInStage}d in stage</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
