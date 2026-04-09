import { useMemo, useState } from 'react';
import { Search, Plus, Filter } from 'lucide-react';
import DataTable from '../components/DataTable';
import Badge from '../components/Badge';
import { leads, leadStatuses, statusStyles } from '../data/leads';

export default function Leads() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');

  const rows = useMemo(() => {
    return leads.filter((l) => {
      const matchesQuery =
        !query ||
        l.name.toLowerCase().includes(query.toLowerCase()) ||
        l.company.toLowerCase().includes(query.toLowerCase()) ||
        l.email.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = status === 'All' || l.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [query, status]);

  const columns = [
    {
      key: 'name',
      header: 'Lead',
      render: (l) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary-100 bg-primary-50 text-xs font-bold text-primary-600">
            {l.name.split(' ').map((n) => n[0]).join('')}
          </div>
          <div>
            <p className="font-semibold text-secondary-900">{l.name}</p>
            <p className="text-xs text-surface-muted">{l.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'company', header: 'Company' },
    { key: 'source',  header: 'Source', render: (l) => <span className="text-secondary-700">{l.source}</span> },
    {
      key: 'status',
      header: 'Status',
      render: (l) => <Badge className={statusStyles[l.status]}>{l.status}</Badge>,
    },
    {
      key: 'value',
      header: 'Value',
      render: (l) => <span className="font-semibold">₹{(l.value / 1000).toFixed(0)}K</span>,
    },
    { key: 'owner', header: 'Owner' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Leads</h1>
          <p className="mt-1 text-sm text-surface-muted">Manage and track all your sales leads.</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-700 active:scale-[0.99]">
          <Plus className="h-4 w-4" /> New Lead
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-surface-border bg-surface-card p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, company or email..."
            className="w-full rounded-xl border border-surface-border bg-white py-2 pl-10 pr-4 text-sm outline-none transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto">
          <Filter className="h-4 w-4 shrink-0 text-surface-muted" />
          {['All', ...leadStatuses].map((s) => (
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

      <DataTable columns={columns} rows={rows} emptyText="No leads match your filters" />

      <p className="text-xs text-surface-muted">
        Showing {rows.length} of {leads.length} leads
      </p>
    </div>
  );
}
