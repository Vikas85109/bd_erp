import { useMemo, useState } from 'react';
import { Search, Plus, Filter } from 'lucide-react';
import DataTable from '../components/DataTable';
import Badge from '../components/Badge';
import { quotations, quotationStatuses, quotationStatusStyles } from '../data/quotations';

export default function Quotations() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');

  const rows = useMemo(() => {
    return quotations.filter((q) => {
      const matchesQuery =
        !query ||
        q.id.toLowerCase().includes(query.toLowerCase()) ||
        q.client.toLowerCase().includes(query.toLowerCase()) ||
        q.contact.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = status === 'All' || q.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [query, status]);

  const columns = [
    { key: 'id',      header: 'Quote #', render: (q) => <span className="font-semibold text-secondary-900">{q.id}</span> },
    { key: 'client',  header: 'Client' },
    { key: 'contact', header: 'Contact', render: (q) => <span className="text-surface-muted">{q.contact}</span> },
    {
      key: 'amount',
      header: 'Amount',
      render: (q) => <span className="font-semibold">₹{(q.amount / 1000).toFixed(0)}K</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (q) => <Badge className={quotationStatusStyles[q.status]}>{q.status}</Badge>,
    },
    { key: 'issuedAt',  header: 'Issued',     render: (q) => <span className="text-surface-muted">{q.issuedAt}</span>  },
    { key: 'validTill', header: 'Valid Till', render: (q) => <span className="text-surface-muted">{q.validTill}</span> },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Quotations</h1>
          <p className="mt-1 text-sm text-surface-muted">Create and manage client quotations.</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-700 active:scale-[0.99]">
          <Plus className="h-4 w-4" /> New Quotation
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-surface-border bg-surface-card p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by quote #, client or contact..."
            className="w-full rounded-xl border border-surface-border bg-white py-2 pl-10 pr-4 text-sm outline-none transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto">
          <Filter className="h-4 w-4 shrink-0 text-surface-muted" />
          {['All', ...quotationStatuses].map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                status === s
                  ? 'border border-primary-100 bg-primary-50 text-primary-600'
                  : 'border border-transparent text-surface-muted hover:bg-surface-bg'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <DataTable columns={columns} rows={rows} emptyText="No quotations match your filters" />

      <p className="text-xs text-surface-muted">
        Showing {rows.length} of {quotations.length} quotations
      </p>
    </div>
  );
}
