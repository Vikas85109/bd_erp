import { useMemo, useState } from 'react';
import { Search, Plus } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import Badge from '../components/Badge';
import { clients, clientStatusStyles } from '../data/clients';

export default function Clients() {
  const [query, setQuery] = useState('');

  const rows = useMemo(
    () =>
      clients.filter(
        (c) =>
          !query ||
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.contact.toLowerCase().includes(query.toLowerCase()) ||
          c.email.toLowerCase().includes(query.toLowerCase()),
      ),
    [query],
  );

  const columns = [
    {
      key: 'name',
      header: 'Client',
      render: (c) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary-100 bg-primary-50 text-xs font-bold text-primary-600">
            {c.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
          </div>
          <div>
            <p className="font-semibold text-secondary-900">{c.name}</p>
            <p className="text-xs text-surface-muted">{c.industry} · {c.city}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'contact',
      header: 'Primary Contact',
      render: (c) => (
        <div>
          <p className="text-secondary-800">{c.contact}</p>
          <p className="text-xs text-surface-muted">{c.email}</p>
        </div>
      ),
    },
    { key: 'plan',  header: 'Plan' },
    {
      key: 'status',
      header: 'Status',
      render: (c) => <Badge className={clientStatusStyles[c.status]}>{c.status}</Badge>,
    },
    { key: 'since', header: 'Customer Since', render: (c) => <span className="text-surface-muted">{c.since}</span> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clients"
        subtitle="All active and past customers."
        action={
          <button className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-700 active:scale-[0.99]">
            <Plus className="h-4 w-4" /> New Client
          </button>
        }
      />

      <div className="rounded-2xl border border-surface-border bg-surface-card p-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search clients..."
            className="w-full rounded-xl border border-surface-border bg-white py-2 pl-10 pr-4 text-sm outline-none transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
          />
        </div>
      </div>

      <DataTable columns={columns} rows={rows} emptyText="No clients found" />
    </div>
  );
}
