import { Plus, FolderTree, Pencil, Trash2 } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { categories } from '../data/products';

export default function Categories() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Product Categories"
        subtitle="Organise your product catalogue."
        action={
          <button className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-700 active:scale-[0.99]">
            <Plus className="h-4 w-4" /> New Category
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <div
            key={c.id}
            className="group rounded-2xl border border-surface-border bg-surface-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary-100 bg-primary-50">
                <FolderTree className="h-5 w-5 text-primary-600" />
              </div>
              <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button className="rounded-lg p-1.5 text-surface-muted transition-colors hover:bg-surface-bg hover:text-secondary-900">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button className="rounded-lg p-1.5 text-surface-muted transition-colors hover:bg-error-50 hover:text-error-500">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <h3 className="mt-4 text-base font-semibold text-secondary-900">{c.name}</h3>
            <p className="mt-1 text-xs text-surface-muted">{c.description}</p>
            <div className="mt-4 flex items-center justify-between border-t border-surface-border pt-3">
              <span className="text-xs text-surface-muted">{c.productsCount} products</span>
              <span className="font-mono text-xs text-surface-muted">/{c.slug}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
