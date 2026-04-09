import { useState, useRef, useEffect } from 'react';
import { Search, Plus, MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react';
import { categories as initialCategories } from '../data/products';
import Modal from '../components/Modal';
import Toast from '../components/Toast';

export default function Categories() {
  const [query, setQuery] = useState('');
  const [catList, setCatList] = useState(initialCategories);
  const [openMenu, setOpenMenu] = useState(null);
  const [toast, setToast] = useState(null);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewCat, setViewCat] = useState(null);
  const [editCat, setEditCat] = useState(null);
  const [deleteCat, setDeleteCat] = useState(null);

  // Forms
  const [addForm, setAddForm] = useState({ name: '', description: '' });
  const [editForm, setEditForm] = useState({ name: '', description: '' });

  const menuRef = useRef(null);

  const filtered = catList.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpenMenu(null);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleAdd = () => {
    if (!addForm.name.trim()) return;
    const newCat = {
      id: Date.now(),
      name: addForm.name.trim(),
      description: addForm.description.trim() || `${addForm.name.trim()} category`,
      created: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    };
    setCatList((prev) => [...prev, newCat]);
    setShowAddModal(false);
    setAddForm({ name: '', description: '' });
    setToast({ message: 'Category added successfully', type: 'success' });
  };

  const handleEditOpen = (c) => {
    setEditForm({ name: c.name, description: c.description });
    setEditCat(c);
    setOpenMenu(null);
  };

  const handleEditSave = () => {
    if (!editForm.name.trim()) return;
    setCatList((prev) =>
      prev.map((c) => c.id === editCat.id ? { ...c, name: editForm.name.trim(), description: editForm.description.trim() } : c)
    );
    setEditCat(null);
    setToast({ message: 'Category updated successfully', type: 'success' });
  };

  const handleDeleteConfirm = () => {
    setCatList((prev) => prev.filter((c) => c.id !== deleteCat.id));
    setDeleteCat(null);
    setToast({ message: 'Category deleted successfully', type: 'success' });
  };

  const menuItems = (c) => [
    { icon: Eye, label: 'View Details', onClick: () => { setViewCat(c); setOpenMenu(null); } },
    { icon: Pencil, label: 'Edit Category', onClick: () => handleEditOpen(c) },
    { icon: Trash2, label: 'Delete', onClick: () => { setDeleteCat(c); setOpenMenu(null); }, danger: true },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Categories</h1>
          <p className="text-sm text-surface-muted mt-1">Manage product categories</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 transition-colors"
        >
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
      <div className="rounded-2xl border border-surface-border bg-white overflow-visible">
        <table className="w-full">
          <thead>
            <tr className="border-b border-surface-border bg-surface-bg/40">
              <th className="px-6 py-3 text-left text-xs font-semibold text-surface-muted uppercase tracking-wider rounded-tl-2xl">#</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-surface-muted uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-surface-muted uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-surface-muted uppercase tracking-wider">Created</th>
              <th className="px-6 py-3 rounded-tr-2xl"></th>
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
                  <div className="relative inline-block" ref={openMenu === c.id ? menuRef : null}>
                    <button
                      onClick={() => setOpenMenu(openMenu === c.id ? null : c.id)}
                      className="text-surface-muted hover:text-secondary-900 p-1 rounded-lg hover:bg-surface-bg"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                    {openMenu === c.id && <DropdownMenu items={menuItems(c)} />}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm text-surface-muted">No categories found.</p>
        </div>
      )}

      {/* ── Add Category Modal ── */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Category"
        footer={
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowAddModal(false)} className="rounded-xl border border-surface-border px-5 py-2.5 text-sm font-medium text-secondary-800 hover:bg-surface-bg">Cancel</button>
            <button onClick={handleAdd} className="rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-600">Create</button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary-800 mb-1.5">Category Name</label>
            <input
              type="text"
              value={addForm.name}
              onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Air Guns"
              className="w-full rounded-xl border border-surface-border bg-white px-4 py-2.5 text-sm placeholder:text-surface-muted focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-800 mb-1.5">Description (optional)</label>
            <input
              type="text"
              value={addForm.description}
              onChange={(e) => setAddForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Brief description"
              className="w-full rounded-xl border border-surface-border bg-white px-4 py-2.5 text-sm placeholder:text-surface-muted focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>
        </div>
      </Modal>

      {/* ── View Details Modal ── */}
      <Modal isOpen={!!viewCat} onClose={() => setViewCat(null)} title="Category Details">
        {viewCat && (
          <div className="space-y-3">
            <div className="rounded-xl bg-surface-bg/60 p-3">
              <p className="text-xs text-surface-muted mb-1">Name</p>
              <p className="text-sm font-semibold text-secondary-900">{viewCat.name}</p>
            </div>
            <div className="rounded-xl bg-surface-bg/60 p-3">
              <p className="text-xs text-surface-muted mb-1">Description</p>
              <p className="text-sm text-secondary-900">{viewCat.description}</p>
            </div>
            <div className="rounded-xl bg-surface-bg/60 p-3">
              <p className="text-xs text-surface-muted mb-1">Created</p>
              <p className="text-sm font-medium text-secondary-900">{viewCat.created}</p>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Edit Category Modal ── */}
      <Modal
        isOpen={!!editCat}
        onClose={() => setEditCat(null)}
        title="Edit Category"
        footer={
          <div className="flex justify-end gap-3">
            <button onClick={() => setEditCat(null)} className="rounded-xl border border-surface-border px-5 py-2.5 text-sm font-medium text-secondary-800 hover:bg-surface-bg">Cancel</button>
            <button onClick={handleEditSave} className="rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-600">Save Changes</button>
          </div>
        }
      >
        {editCat && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary-800 mb-1.5">Category Name</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full rounded-xl border border-surface-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-800 mb-1.5">Description</label>
              <input
                type="text"
                value={editForm.description}
                onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                className="w-full rounded-xl border border-surface-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </div>
          </div>
        )}
      </Modal>

      {/* ── Delete Confirmation Modal ── */}
      <Modal isOpen={!!deleteCat} onClose={() => setDeleteCat(null)} title="Delete Category">
        {deleteCat && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl bg-error-50 border border-error-100 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white border border-error-100">
                <Trash2 className="h-5 w-5 text-error-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-secondary-900">Are you sure?</p>
                <p className="text-xs text-surface-muted">This will permanently delete <span className="font-medium text-secondary-800">{deleteCat.name}</span>.</p>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setDeleteCat(null)} className="rounded-xl border border-surface-border px-4 py-2 text-sm font-medium text-secondary-800 hover:bg-surface-bg">Cancel</button>
              <button onClick={handleDeleteConfirm} className="rounded-xl bg-error-500 px-4 py-2 text-sm font-semibold text-white hover:bg-error-400">Delete</button>
            </div>
          </div>
        )}
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

function DropdownMenu({ items }) {
  return (
    <div className="absolute right-0 top-full mt-1 z-30 w-48 rounded-xl border border-surface-border bg-white py-1.5 shadow-lg">
      {items.map((item, i) => {
        const Icon = item.icon;
        return (
          <button key={i} onClick={item.onClick}
            className={`flex w-full items-center gap-2.5 px-4 py-2 text-sm transition-colors ${item.danger ? 'text-error-500 hover:bg-error-50' : 'text-secondary-800 hover:bg-surface-bg'}`}>
            <Icon className="h-4 w-4" />
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
