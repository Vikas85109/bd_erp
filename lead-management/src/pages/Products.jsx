import { useMemo, useState } from 'react';
import { Search, Plus } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import Badge from '../components/Badge';
import { products, productStatusStyles } from '../data/products';

export default function Products() {
  const [query, setQuery] = useState('');

  const rows = useMemo(
    () =>
      products.filter(
        (p) =>
          !query ||
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.sku.toLowerCase().includes(query.toLowerCase()),
      ),
    [query],
  );

  const columns = [
    { key: 'sku',  header: 'SKU',  render: (p) => <span className="font-mono text-xs text-surface-muted">{p.sku}</span> },
    { key: 'name', header: 'Name', render: (p) => <span className="font-semibold text-secondary-900">{p.name}</span> },
    { key: 'category', header: 'Category' },
    { key: 'price',    header: 'Price', render: (p) => <span className="font-semibold">₹{p.price.toLocaleString('en-IN')}</span> },
    { key: 'stock',    header: 'Stock', render: (p) => <span className="text-surface-muted">{p.stock}</span> },
    {
      key: 'status',
      header: 'Status',
      render: (p) => <Badge className={productStatusStyles[p.status]}>{p.status}</Badge>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        subtitle="Manage your sellable products and services."
        action={
          <button className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-700 active:scale-[0.99]">
            <Plus className="h-4 w-4" /> New Product
          </button>
        }
      />

      <div className="rounded-2xl border border-surface-border bg-surface-card p-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or SKU..."
            className="w-full rounded-xl border border-surface-border bg-white py-2 pl-10 pr-4 text-sm outline-none transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
          />
        </div>
      </div>

      <DataTable columns={columns} rows={rows} emptyText="No products found" />
    </div>
  );
}
