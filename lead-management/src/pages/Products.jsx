import { useState, useRef, useEffect } from 'react';
import { Search, Filter, Plus, LayoutGrid, List, Package, MoreHorizontal, Eye, Pencil, Trash2, ChevronDown } from 'lucide-react';
import { products as initialProducts, categories } from '../data/products';
import Modal from '../components/Modal';
import Toast from '../components/Toast';

const emptyForm = { name: '', sku: '', category: '', price: 0, stock: 0, description: '' };

export default function Products() {
  const [view, setView] = useState('grid');
  const [query, setQuery] = useState('');
  const [productList, setProductList] = useState(initialProducts);
  const [openMenu, setOpenMenu] = useState(null);
  const [toast, setToast] = useState(null);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewProduct, setViewProduct] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);

  // Forms
  const [addForm, setAddForm] = useState(emptyForm);
  const [editForm, setEditForm] = useState(emptyForm);

  const menuRef = useRef(null);

  const filtered = productList.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.sku.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpenMenu(null);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Handlers
  const handleAddProduct = () => {
    if (!addForm.name.trim()) return;
    const newProduct = {
      id: Date.now(),
      name: addForm.name.trim(),
      sku: addForm.sku.trim() || `BDD-${Date.now().toString().slice(-4)}`,
      category: addForm.category || categories[0].name,
      price: Number(addForm.price) || 0,
      stock: Number(addForm.stock) || 0,
      status: Number(addForm.stock) > 10 ? 'Active' : 'Low Stock',
      description: addForm.description,
    };
    setProductList((prev) => [newProduct, ...prev]);
    setShowAddModal(false);
    setAddForm(emptyForm);
    setToast({ message: 'Product added successfully', type: 'success' });
  };

  const handleEditOpen = (p) => {
    setEditForm({ name: p.name, sku: p.sku, category: p.category, price: p.price, stock: p.stock, description: p.description || '' });
    setEditProduct(p);
    setOpenMenu(null);
  };

  const handleEditSave = () => {
    if (!editForm.name.trim()) return;
    setProductList((prev) =>
      prev.map((p) => p.id === editProduct.id ? {
        ...p,
        name: editForm.name.trim(),
        sku: editForm.sku.trim(),
        category: editForm.category,
        price: Number(editForm.price) || 0,
        stock: Number(editForm.stock) || 0,
        status: Number(editForm.stock) > 10 ? 'Active' : 'Low Stock',
        description: editForm.description,
      } : p)
    );
    setEditProduct(null);
    setToast({ message: 'Product updated successfully', type: 'success' });
  };

  const handleDeleteConfirm = () => {
    setProductList((prev) => prev.filter((p) => p.id !== deleteProduct.id));
    setDeleteProduct(null);
    setToast({ message: 'Product deleted successfully', type: 'success' });
  };

  const menuItems = (p) => [
    { icon: Eye, label: 'View Details', onClick: () => { setViewProduct(p); setOpenMenu(null); } },
    { icon: Pencil, label: 'Edit Product', onClick: () => handleEditOpen(p) },
    { icon: Trash2, label: 'Delete', onClick: () => { setDeleteProduct(p); setOpenMenu(null); }, danger: true },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Products</h1>
          <p className="text-sm text-surface-muted mt-1">Manage your product catalog</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 transition-colors"
        >
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

      {/* Grid View */}
      {view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((p) => (
            <div key={p.id} className="rounded-2xl border border-surface-border bg-white overflow-visible hover:shadow-sm transition-shadow">
              <div className="flex h-40 items-center justify-center bg-surface-bg rounded-t-2xl">
                <Package className="h-14 w-14 text-secondary-300" strokeWidth={1.25} />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-secondary-900 truncate">{p.name}</h3>
                    <p className="text-xs text-surface-muted mt-0.5">{p.sku}</p>
                  </div>
                  <div className="relative" ref={openMenu === p.id ? menuRef : null}>
                    <button
                      onClick={() => setOpenMenu(openMenu === p.id ? null : p.id)}
                      className="text-surface-muted hover:text-secondary-900 p-1 rounded-lg hover:bg-surface-bg"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                    {openMenu === p.id && <DropdownMenu items={menuItems(p)} />}
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-base font-bold text-secondary-900">${p.price}</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                    p.status === 'Active'
                      ? 'bg-primary-50 text-primary-600 border-primary-100'
                      : 'bg-warning-50 text-warning-600 border-warning-100'
                  }`}>{p.status}</span>
                </div>
                <p className="mt-2 text-xs text-surface-muted">
                  {p.category} <span className="ml-1">Stock: {p.stock}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="rounded-2xl border border-surface-border bg-white overflow-visible">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-border bg-surface-bg/40">
                <th className="px-6 py-3 text-left text-xs font-semibold text-surface-muted uppercase tracking-wider rounded-tl-2xl">Product</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-surface-muted uppercase tracking-wider">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-surface-muted uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-surface-muted uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-surface-muted uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-surface-muted uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 rounded-tr-2xl"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-surface-bg/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-bg">
                        <Package className="h-5 w-5 text-secondary-400" strokeWidth={1.5} />
                      </div>
                      <span className="text-sm font-semibold text-secondary-900">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-surface-muted">{p.sku}</td>
                  <td className="px-6 py-4 text-sm text-surface-muted">{p.category}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-secondary-900">${p.price}</td>
                  <td className="px-6 py-4 text-sm text-surface-muted">{p.stock}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                      p.status === 'Active'
                        ? 'bg-primary-50 text-primary-600 border-primary-100'
                        : 'bg-warning-50 text-warning-600 border-warning-100'
                    }`}>{p.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="relative inline-block" ref={openMenu === p.id ? menuRef : null}>
                      <button
                        onClick={() => setOpenMenu(openMenu === p.id ? null : p.id)}
                        className="text-surface-muted hover:text-secondary-900 p-1 rounded-lg hover:bg-surface-bg"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                      {openMenu === p.id && <DropdownMenu items={menuItems(p)} />}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm text-surface-muted">No products found.</p>
        </div>
      )}

      {/* ── Add Product Modal ── */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Product"
        footer={
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowAddModal(false)} className="rounded-xl border border-surface-border px-5 py-2.5 text-sm font-medium text-secondary-800 hover:bg-surface-bg">Cancel</button>
            <button onClick={handleAddProduct} className="rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-600">Create</button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary-800 mb-1.5">Product Name</label>
            <input
              type="text"
              value={addForm.name}
              onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Industrial Air Gun"
              className="w-full rounded-xl border border-surface-border bg-white px-4 py-2.5 text-sm placeholder:text-surface-muted focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-800 mb-1.5">SKU</label>
              <input
                type="text"
                value={addForm.sku}
                onChange={(e) => setAddForm((f) => ({ ...f, sku: e.target.value }))}
                placeholder="e.g. BDD-AG-001"
                className="w-full rounded-xl border border-surface-border bg-white px-4 py-2.5 text-sm placeholder:text-surface-muted focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-800 mb-1.5">Category</label>
              <div className="relative">
                <select
                  value={addForm.category}
                  onChange={(e) => setAddForm((f) => ({ ...f, category: e.target.value }))}
                  className="w-full appearance-none rounded-xl border border-surface-border bg-white px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
                >
                  <option value="">Select category</option>
                  {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-muted pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-800 mb-1.5">Price</label>
              <input
                type="number"
                value={addForm.price}
                onChange={(e) => setAddForm((f) => ({ ...f, price: e.target.value }))}
                className="w-full rounded-xl border border-surface-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-800 mb-1.5">Stock</label>
              <input
                type="number"
                value={addForm.stock}
                onChange={(e) => setAddForm((f) => ({ ...f, stock: e.target.value }))}
                className="w-full rounded-xl border border-surface-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-800 mb-1.5">Description (optional)</label>
            <textarea
              rows={2}
              value={addForm.description}
              onChange={(e) => setAddForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Brief product description"
              className="w-full rounded-xl border border-surface-border bg-white px-4 py-2.5 text-sm placeholder:text-surface-muted focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>
        </div>
      </Modal>

      {/* ── View Product Modal ── */}
      <Modal isOpen={!!viewProduct} onClose={() => setViewProduct(null)} title="Product Details">
        {viewProduct && (
          <div className="space-y-4">
            <div className="flex items-center justify-center h-32 rounded-xl bg-surface-bg">
              <Package className="h-16 w-16 text-secondary-300" strokeWidth={1} />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-secondary-900">{viewProduct.name}</h3>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                  viewProduct.status === 'Active'
                    ? 'bg-primary-50 text-primary-600 border-primary-100'
                    : 'bg-warning-50 text-warning-600 border-warning-100'
                }`}>{viewProduct.status}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-surface-bg/60 p-3">
                  <p className="text-xs text-surface-muted mb-1">SKU</p>
                  <p className="text-sm font-medium text-secondary-900">{viewProduct.sku}</p>
                </div>
                <div className="rounded-xl bg-surface-bg/60 p-3">
                  <p className="text-xs text-surface-muted mb-1">Category</p>
                  <p className="text-sm font-medium text-secondary-900">{viewProduct.category}</p>
                </div>
                <div className="rounded-xl bg-surface-bg/60 p-3">
                  <p className="text-xs text-surface-muted mb-1">Price</p>
                  <p className="text-sm font-bold text-secondary-900">${viewProduct.price}</p>
                </div>
                <div className="rounded-xl bg-surface-bg/60 p-3">
                  <p className="text-xs text-surface-muted mb-1">Stock</p>
                  <p className="text-sm font-medium text-secondary-900">{viewProduct.stock} units</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Edit Product Modal ── */}
      <Modal
        isOpen={!!editProduct}
        onClose={() => setEditProduct(null)}
        title="Edit Product"
        footer={
          <div className="flex justify-end gap-3">
            <button onClick={() => setEditProduct(null)} className="rounded-xl border border-surface-border px-5 py-2.5 text-sm font-medium text-secondary-800 hover:bg-surface-bg">Cancel</button>
            <button onClick={handleEditSave} className="rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-600">Save Changes</button>
          </div>
        }
      >
        {editProduct && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary-800 mb-1.5">Product Name</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full rounded-xl border border-surface-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-800 mb-1.5">SKU</label>
                <input
                  type="text"
                  value={editForm.sku}
                  onChange={(e) => setEditForm((f) => ({ ...f, sku: e.target.value }))}
                  className="w-full rounded-xl border border-surface-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-800 mb-1.5">Category</label>
                <div className="relative">
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full appearance-none rounded-xl border border-surface-border bg-white px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
                  >
                    {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-muted pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-800 mb-1.5">Price</label>
                <input
                  type="number"
                  value={editForm.price}
                  onChange={(e) => setEditForm((f) => ({ ...f, price: e.target.value }))}
                  className="w-full rounded-xl border border-surface-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-800 mb-1.5">Stock</label>
                <input
                  type="number"
                  value={editForm.stock}
                  onChange={(e) => setEditForm((f) => ({ ...f, stock: e.target.value }))}
                  className="w-full rounded-xl border border-surface-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-800 mb-1.5">Description (optional)</label>
              <textarea
                rows={2}
                value={editForm.description}
                onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Brief product description"
                className="w-full rounded-xl border border-surface-border bg-white px-4 py-2.5 text-sm placeholder:text-surface-muted focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </div>
          </div>
        )}
      </Modal>

      {/* ── Delete Confirmation Modal ── */}
      <Modal isOpen={!!deleteProduct} onClose={() => setDeleteProduct(null)} title="Delete Product">
        {deleteProduct && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl bg-error-50 border border-error-100 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white border border-error-100">
                <Trash2 className="h-5 w-5 text-error-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-secondary-900">Are you sure?</p>
                <p className="text-xs text-surface-muted">This will permanently delete <span className="font-medium text-secondary-800">{deleteProduct.name}</span>.</p>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setDeleteProduct(null)} className="rounded-xl border border-surface-border px-4 py-2 text-sm font-medium text-secondary-800 hover:bg-surface-bg">Cancel</button>
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
