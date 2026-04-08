import { useState } from 'react';
import { Search, Filter, Plus, LayoutGrid, List, Package, MoreHorizontal } from 'lucide-react';
import { products } from '../data/products';

export default function Products() {
  const [view, setView] = useState('grid');
  const [query, setQuery] = useState('');

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.sku.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Products</h1>
          <p className="text-sm text-surface-muted mt-1">Manage your product catalog</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 transition-colors">
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-xl border border-surface-border bg-white py-2.5 pl-10 pr-4 text-sm placeholder:text-surface-muted focus:outline-none focus:ring-2 focus:ring-primary-100"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 rounded-xl border border-surface-border bg-white px-4 py-2.5 text-sm font-medium text-secondary-800 hover:bg-surface-bg">
            <Filter className="h-4 w-4" />
            Filters
          </button>
          <div className="flex items-center rounded-xl border border-surface-border bg-white p-1">
            <button
              onClick={() => setView('grid')}
              className={`rounded-lg p-1.5 ${view === 'grid' ? 'bg-surface-bg text-secondary-900' : 'text-surface-muted'}`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView('list')}
              className={`rounded-lg p-1.5 ${view === 'list' ? 'bg-surface-bg text-secondary-900' : 'text-surface-muted'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map((p) => (
          <div
            key={p.id}
            className="rounded-2xl border border-surface-border bg-white overflow-hidden hover:shadow-sm transition-shadow"
          >
            <div className="flex h-40 items-center justify-center bg-surface-bg">
              <Package className="h-14 w-14 text-secondary-300" strokeWidth={1.25} />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-secondary-900 truncate">{p.name}</h3>
                  <p className="text-xs text-surface-muted mt-0.5">{p.sku}</p>
                </div>
                <button className="text-surface-muted hover:text-secondary-900">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-base font-bold text-secondary-900">${p.price}</span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                    p.status === 'Active'
                      ? 'bg-primary-50 text-primary-600 border-primary-100'
                      : 'bg-warning-50 text-warning-600 border-warning-100'
                  }`}
                >
                  {p.status}
                </span>
              </div>
              <p className="mt-2 text-xs text-surface-muted">
                {p.category} <span className="ml-1">Stock: {p.stock}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
