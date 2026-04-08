import { useState } from 'react';
import { Search, Plus, MoreHorizontal } from 'lucide-react';
import { categories } from '../data/products';

export default function Categories() {
  const [query, setQuery] = useState('');
  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Categories</h1>
          <p className="text-sm text-surface-muted mt-1">Manage product categories</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 transition-colors">
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-muted" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search categories..."
          className="w-full rounded-xl border border-surface-border bg-white py-2.5 pl-10 pr-4 text-sm placeholder:text-surface-muted focus:outline-none focus:ring-2 focus:ring-primary-100"
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-surface-border bg-white overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-surface-border bg-surface-bg/40">
              <th className="px-6 py-3 text-left text-xs font-semibold text-surface-muted uppercase tracking-wider">#</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-surface-muted uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-surface-muted uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-surface-muted uppercase tracking-wider">Created</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border">
            {filtered.map((c, idx) => (
              <tr key={c.id} className="hover:bg-surface-bg/40 transition-colors">
                <td className="px-6 py-4 text-sm text-surface-muted">{idx + 1}</td>
                <td className="px-6 py-4 text-sm font-semibold text-secondary-900">{c.name}</td>
                <td className="px-6 py-4 text-sm text-surface-muted">{c.description}</td>
                <td className="px-6 py-4 text-sm text-surface-muted">{c.created}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-surface-muted hover:text-secondary-900">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
