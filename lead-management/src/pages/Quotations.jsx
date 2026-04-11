import { useState, useMemo, useRef, useEffect } from 'react';
import {
  Plus, FileText, Send, Download, Trash2, ChevronDown, LayoutTemplate, Building2, User, Mail,
  Phone, MessageCircle, Eye, Calendar, ClipboardList, Search, X, MoreHorizontal, Pencil, Copy,
} from 'lucide-react';
import { quotations as seedQuotations, quotationStatuses } from '../data/quotations';
import Modal from '../components/Modal';
import Toast from '../components/Toast';

// --------------- Templates ---------------
const TEMPLATES = [
  {
    name: 'Standard', icon: FileText, description: 'Basic plan with essential features',
    items: [
      { description: 'Standard Plan - Annual', quantity: 1, rate: 120000 },
      { description: 'Additional Users (10)', quantity: 10, rate: 1500 },
      { description: 'Email Support', quantity: 1, rate: 12000 },
    ],
    terms: 'Payment due within 30 days of invoice date.\nAll prices are exclusive of applicable taxes.\nSupport is available Mon-Fri, 9AM-6PM IST.',
    validity: '30',
  },
  {
    name: 'Enterprise', icon: Building2, description: 'Full-featured plan for large teams',
    items: [
      { description: 'Enterprise Plan - Annual', quantity: 1, rate: 240000 },
      { description: 'Additional Users (50)', quantity: 50, rate: 1800 },
      { description: 'Priority Support', quantity: 1, rate: 30000 },
      { description: 'Custom Integration', quantity: 1, rate: 80000 },
      { description: 'Training & Onboarding', quantity: 1, rate: 40000 },
    ],
    terms: 'Payment due within 15 days of invoice date.\nAll prices are exclusive of applicable taxes.\n24/7 dedicated support included.\nQuarterly business reviews included.',
    validity: '15',
  },
  {
    name: 'Custom', icon: LayoutTemplate, description: 'Tailored solution - start from scratch',
    items: [{ description: '', quantity: 1, rate: 0 }],
    terms: 'Payment terms as mutually agreed.\nAll prices are exclusive of applicable taxes.',
    validity: '30',
  },
];

const VALIDITY_OPTIONS = [
  { label: '7 days', value: '7' }, { label: '15 days', value: '15' }, { label: '30 days', value: '30' },
  { label: '45 days', value: '45' }, { label: '60 days', value: '60' }, { label: '90 days', value: '90' },
];

// --------------- Helpers ---------------
function generateId() { return 'Q-' + (Math.floor(Math.random() * 9000) + 1000); }
function formatCurrency(n) { return '₹' + Number(n || 0).toLocaleString('en-IN'); }
function addDays(dateStr, days) { const d = new Date(dateStr); d.setDate(d.getDate() + Number(days)); return d.toISOString().slice(0, 10); }
function todayStr() { return new Date().toISOString().slice(0, 10); }
const emptyItem = () => ({ description: '', quantity: 1, rate: 0 });

// --------------- Component ---------------
export default function Quotations() {
  const [quotationList, setQuotationList] = useState(seedQuotations);
  const [searchQuery, setSearchQuery] = useState('');
  const [openMenu, setOpenMenu] = useState(null);
  const [toast, setToast] = useState(null);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewQuotation, setViewQuotation] = useState(null);
  const [editQuotation, setEditQuotation] = useState(null);
  const [deleteQuotation, setDeleteQuotation] = useState(null);

  // Form state
  const [clientName, setClientName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [items, setItems] = useState([emptyItem()]);
  const [terms, setTerms] = useState(TEMPLATES[0].terms);
  const [validity, setValidity] = useState('30');
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const menuRef = useRef(null);

  const subtotal = useMemo(() => items.reduce((s, i) => s + (i.quantity || 0) * (i.rate || 0), 0), [items]);
  const tax = useMemo(() => Math.round(subtotal * 0.18), [subtotal]);
  const total = subtotal + tax;

  const filteredQuotations = quotationList.filter(
    (q) =>
      q.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.leadName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpenMenu(null);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Form helpers
  function applyTemplate(tpl) {
    setSelectedTemplate(tpl.name);
    setItems(tpl.items.map((i) => ({ ...i })));
    setTerms(tpl.terms);
    setValidity(tpl.validity);
  }
  function updateItem(index, field, value) {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, [field]: field === 'description' ? value : Number(value) || 0 } : it)));
  }
  function addItem() { setItems((prev) => [...prev, emptyItem()]); }
  function removeItem(index) { setItems((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== index))); }

  function resetForm() {
    setClientName(''); setCompany(''); setEmail(''); setPhone('');
    setItems([emptyItem()]); setTerms(TEMPLATES[0].terms); setValidity('30'); setSelectedTemplate(null);
  }

  function loadFormFromQuotation(q) {
    setClientName(q.leadName || '');
    setCompany(q.company || '');
    setEmail(q.email || '');
    setPhone(q.phone || '');
    setItems(q.items.map((i) => ({ description: i.description, quantity: i.quantity, rate: i.rate })));
    setTerms(q.terms || TEMPLATES[0].terms);
    setValidity('30');
    setSelectedTemplate(null);
  }

  // Actions
  function handleGenerate() {
    if (items.every((i) => !i.description && !i.rate)) {
      setToast({ message: 'Add at least one line item', type: 'error' }); return;
    }
    const date = todayStr();
    const q = {
      id: generateId(), leadName: clientName || 'Unnamed Client', company: company || '-',
      email, phone, date, validUntil: addDays(date, validity), status: 'Draft',
      items: items.map((i) => ({ ...i, amount: (i.quantity || 0) * (i.rate || 0) })),
      subtotal, tax, total, terms,
    };
    setQuotationList((prev) => [q, ...prev]);
    setShowAddModal(false);
    resetForm();
    setToast({ message: `Quotation ${q.id} generated!`, type: 'success' });
  }

  function handleEditSave() {
    if (items.every((i) => !i.description && !i.rate)) {
      setToast({ message: 'Add at least one line item', type: 'error' }); return;
    }
    setQuotationList((prev) => prev.map((q) => q.id === editQuotation.id ? {
      ...q, leadName: clientName || 'Unnamed Client', company: company || '-',
      email, phone,
      items: items.map((i) => ({ ...i, amount: (i.quantity || 0) * (i.rate || 0) })),
      subtotal, tax, total, terms,
    } : q));
    setEditQuotation(null);
    resetForm();
    setToast({ message: 'Quotation updated successfully', type: 'success' });
  }

  function handleDuplicate(q) {
    const dup = { ...q, id: generateId(), status: 'Draft', date: todayStr(), validUntil: addDays(todayStr(), 30) };
    setQuotationList((prev) => [dup, ...prev]);
    setOpenMenu(null);
    setToast({ message: `Duplicated as ${dup.id}`, type: 'success' });
  }

  function handleDeleteConfirm() {
    setQuotationList((prev) => prev.filter((q) => q.id !== deleteQuotation.id));
    setDeleteQuotation(null);
    setToast({ message: 'Quotation deleted', type: 'success' });
  }

  function handleSend(q) {
    setQuotationList((prev) => prev.map((qt) => qt.id === q.id ? { ...qt, status: 'Sent' } : qt));
    setOpenMenu(null);
    setToast({ message: 'Quotation sent via email', type: 'success' });
  }

  function handleDownload(q) {
    const lines = [
      '='.repeat(50), '                   QUOTATION', '='.repeat(50), '',
      `Quotation #: ${q.id}`, `Date: ${q.date}`, `Valid Until: ${q.validUntil}`, `Status: ${q.status}`, '',
      '--- Client ---', `Name: ${q.leadName}`, `Company: ${q.company}`, '',
      '--- Items ---', '-'.repeat(50),
      'Description'.padEnd(28) + 'Qty'.padStart(5) + 'Rate'.padStart(10) + 'Amount'.padStart(10),
      '-'.repeat(50),
      ...q.items.map((i) => (i.description || '-').padEnd(28) + String(i.quantity).padStart(5) + String(i.rate).padStart(10) + String(i.amount).padStart(10)),
      '-'.repeat(50), '',
      `${'Subtotal:'.padStart(40)} ${formatCurrency(q.subtotal)}`,
      `${'GST (18%):'.padStart(40)} ${formatCurrency(q.tax)}`,
      `${'TOTAL:'.padStart(40)} ${formatCurrency(q.total)}`,
      '', '='.repeat(50), '          Generated by BindassDeal ERP', '='.repeat(50),
    ].join('\n');
    const blob = new Blob([lines], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `${q.id}_Quotation.txt`; a.click();
    URL.revokeObjectURL(url);
    setOpenMenu(null);
    setToast({ message: 'Quotation downloaded', type: 'success' });
  }

  function changeStatus(qId, newStatus) {
    setQuotationList((prev) => prev.map((q) => (q.id === qId ? { ...q, status: newStatus } : q)));
  }

  const statusBadge = (status) =>
    status === 'Sent' ? 'bg-blue-100 text-blue-700 border-blue-200'
    : status === 'Draft' ? 'bg-gray-100 text-gray-600 border-gray-200'
    : status === 'Approved' ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
    : status === 'Rejected' ? 'bg-red-100 text-red-700 border-red-200'
    : 'bg-amber-100 text-amber-700 border-amber-200';

  const menuItems = (q) => [
    { icon: Eye, label: 'View Details', onClick: () => { setViewQuotation(q); setOpenMenu(null); } },
    { icon: Pencil, label: 'Edit', onClick: () => { loadFormFromQuotation(q); setEditQuotation(q); setOpenMenu(null); } },
    { icon: Send, label: 'Send to Client', onClick: () => handleSend(q) },
    { icon: Download, label: 'Download', onClick: () => handleDownload(q) },
    { icon: Copy, label: 'Duplicate', onClick: () => handleDuplicate(q) },
    { icon: Trash2, label: 'Delete', onClick: () => { setDeleteQuotation(q); setOpenMenu(null); }, danger: true },
  ];

  const inputCls = 'w-full rounded-xl border border-surface-border bg-white px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 placeholder:text-gray-400';

  // ===================== RENDER =====================
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Quotations</h1>
          <p className="text-sm text-surface-muted mt-1">Create and manage sales quotations</p>
        </div>
        <button onClick={() => { resetForm(); setShowAddModal(true); }}
          className="flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 transition-colors">
          <Plus className="h-4 w-4" /> New Quotation
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-muted" />
        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search quotations..."
          className="w-full rounded-xl border border-surface-border bg-white py-2.5 pl-10 pr-4 text-sm placeholder:text-surface-muted focus:outline-none focus:ring-2 focus:ring-primary-100" />
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-surface-border bg-white overflow-visible">
        <table className="w-full">
          <thead>
            <tr className="border-b border-surface-border bg-surface-bg/40">
              <th className="px-6 py-3 text-left text-xs font-semibold text-surface-muted uppercase tracking-wider rounded-tl-2xl">Quotation</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-surface-muted uppercase tracking-wider">Client</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-surface-muted uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-surface-muted uppercase tracking-wider">Valid Until</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-surface-muted uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-surface-muted uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 rounded-tr-2xl"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border">
            {filteredQuotations.map((q) => (
              <tr key={q.id} className="hover:bg-surface-bg/40 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 border border-primary-100">
                      <FileText className="h-5 w-5 text-primary-500" />
                    </div>
                    <span className="text-sm font-bold text-secondary-900">{q.id}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-semibold text-secondary-900">{q.leadName}</p>
                  <p className="text-xs text-surface-muted">{q.company}</p>
                </td>
                <td className="px-6 py-4 text-sm text-surface-muted">{q.date}</td>
                <td className="px-6 py-4 text-sm text-surface-muted">{q.validUntil}</td>
                <td className="px-6 py-4 text-sm font-bold text-secondary-900">{formatCurrency(q.total)}</td>
                <td className="px-6 py-4">
                  <div className="relative inline-block">
                    <select value={q.status} onChange={(e) => changeStatus(q.id, e.target.value)}
                      className={`appearance-none rounded-full border px-3 py-1 pr-7 text-xs font-medium outline-none cursor-pointer ${statusBadge(q.status)}`}>
                      {quotationStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 opacity-50" />
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="relative inline-block" ref={openMenu === q.id ? menuRef : null}>
                    <button onClick={() => setOpenMenu(openMenu === q.id ? null : q.id)}
                      className="text-surface-muted hover:text-secondary-900 p-1 rounded-lg hover:bg-surface-bg">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                    {openMenu === q.id && <DropdownMenu items={menuItems(q)} />}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredQuotations.length === 0 && (
          <div className="p-12 text-center text-sm text-surface-muted">No quotations found.</div>
        )}
      </div>

      {/* ── View Details Modal ── */}
      <Modal isOpen={!!viewQuotation} onClose={() => setViewQuotation(null)} title={`Quotation ${viewQuotation?.id || ''}`}>
        {viewQuotation && (
          <div className="space-y-5">
            {/* Client Info */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-surface-bg/60 p-3">
                <p className="text-xs text-surface-muted mb-1">Client</p>
                <p className="text-sm font-semibold text-secondary-900">{viewQuotation.leadName}</p>
                <p className="text-xs text-surface-muted">{viewQuotation.company}</p>
              </div>
              <div className="rounded-xl bg-surface-bg/60 p-3">
                <p className="text-xs text-surface-muted mb-1">Status</p>
                <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusBadge(viewQuotation.status)}`}>{viewQuotation.status}</span>
              </div>
              <div className="rounded-xl bg-surface-bg/60 p-3">
                <p className="text-xs text-surface-muted mb-1">Date</p>
                <p className="text-sm font-medium text-secondary-900">{viewQuotation.date}</p>
              </div>
              <div className="rounded-xl bg-surface-bg/60 p-3">
                <p className="text-xs text-surface-muted mb-1">Valid Until</p>
                <p className="text-sm font-medium text-secondary-900">{viewQuotation.validUntil}</p>
              </div>
            </div>

            {/* Items */}
            <div className="rounded-xl border border-surface-border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-surface-bg/40">
                    <th className="px-3 py-2 text-left text-xs font-semibold text-surface-muted">Item</th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-surface-muted">Qty</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-surface-muted">Rate</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-surface-muted">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {viewQuotation.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-secondary-900">{item.description}</td>
                      <td className="px-3 py-2 text-center text-sm text-surface-muted">{item.quantity}</td>
                      <td className="px-3 py-2 text-right text-sm text-surface-muted">{formatCurrency(item.rate)}</td>
                      <td className="px-3 py-2 text-right text-sm font-semibold text-secondary-900">{formatCurrency(item.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="rounded-xl bg-surface-bg/60 p-4 space-y-1.5">
              <div className="flex justify-between text-sm"><span className="text-surface-muted">Subtotal</span><span className="font-medium">{formatCurrency(viewQuotation.subtotal)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-surface-muted">GST (18%)</span><span className="font-medium">{formatCurrency(viewQuotation.tax)}</span></div>
              <div className="flex justify-between border-t border-gray-200 pt-1.5 text-base font-bold">
                <span className="text-secondary-900">Total</span><span className="text-primary-600">{formatCurrency(viewQuotation.total)}</span>
              </div>
            </div>

            {viewQuotation.terms && (
              <div className="rounded-xl bg-surface-bg/60 p-3">
                <p className="text-xs text-surface-muted mb-1">Terms & Conditions</p>
                <p className="text-sm text-secondary-700 whitespace-pre-line">{viewQuotation.terms}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* ── Delete Modal ── */}
      <Modal isOpen={!!deleteQuotation} onClose={() => setDeleteQuotation(null)} title="Delete Quotation">
        {deleteQuotation && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl bg-error-50 border border-error-100 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white border border-error-100">
                <Trash2 className="h-5 w-5 text-error-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-secondary-900">Are you sure?</p>
                <p className="text-xs text-surface-muted">This will permanently delete quotation <span className="font-medium text-secondary-800">{deleteQuotation.id}</span>.</p>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setDeleteQuotation(null)} className="rounded-xl border border-surface-border px-4 py-2 text-sm font-medium text-secondary-800 hover:bg-surface-bg">Cancel</button>
              <button onClick={handleDeleteConfirm} className="rounded-xl bg-error-500 px-4 py-2 text-sm font-semibold text-white hover:bg-error-400">Delete</button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── New Quotation Modal ── */}
      {showAddModal && (
        <QuotationFormModal
          title="New Quotation"
          onClose={() => setShowAddModal(false)}
          onSubmit={handleGenerate}
          submitLabel="Generate"
          {...{ clientName, setClientName, company, setCompany, email, setEmail, phone, setPhone, items, setItems, terms, setTerms, validity, setValidity, selectedTemplate, applyTemplate, updateItem, addItem, removeItem, subtotal, tax, total, inputCls }}
        />
      )}

      {/* ── Edit Quotation Modal ── */}
      {editQuotation && (
        <QuotationFormModal
          title={`Edit ${editQuotation.id}`}
          onClose={() => { setEditQuotation(null); resetForm(); }}
          onSubmit={handleEditSave}
          submitLabel="Save Changes"
          {...{ clientName, setClientName, company, setCompany, email, setEmail, phone, setPhone, items, setItems, terms, setTerms, validity, setValidity, selectedTemplate, applyTemplate, updateItem, addItem, removeItem, subtotal, tax, total, inputCls }}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

// ===================== Form Modal =====================
function QuotationFormModal({
  title, onClose, onSubmit, submitLabel,
  clientName, setClientName, company, setCompany, email, setEmail, phone, setPhone,
  items, terms, setTerms, validity, setValidity, selectedTemplate,
  applyTemplate, updateItem, addItem, removeItem, subtotal, tax, total, inputCls,
}) {
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl bg-white/95 shadow-2xl backdrop-blur-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-surface-border p-6 shrink-0">
            <h2 className="text-lg font-bold text-secondary-900">{title}</h2>
            <button onClick={onClose} className="rounded-lg p-1.5 text-surface-muted hover:bg-gray-100 hover:text-secondary-900">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto flex-1 min-h-0 space-y-5">
            {/* Templates */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-surface-muted">Choose a Template</label>
              <div className="grid grid-cols-3 gap-3">
                {TEMPLATES.map((tpl) => {
                  const Icon = tpl.icon;
                  const active = selectedTemplate === tpl.name;
                  return (
                    <button key={tpl.name} type="button" onClick={() => applyTemplate(tpl)}
                      className={`rounded-xl border-2 p-3 text-left transition-all duration-200 ${active ? 'border-primary-500 bg-primary-50 shadow-sm' : 'border-surface-border hover:border-primary-300 hover:bg-gray-50'}`}>
                      <Icon className={`h-5 w-5 ${active ? 'text-primary-600' : 'text-gray-400'}`} />
                      <p className={`mt-1.5 text-sm font-semibold ${active ? 'text-primary-700' : 'text-secondary-800'}`}>{tpl.name}</p>
                      <p className="mt-0.5 text-[11px] leading-tight text-surface-muted">{tpl.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Client Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-secondary-800"><User className="h-3.5 w-3.5 text-gray-400" /> Client Name</label>
                <input type="text" placeholder="John Doe" value={clientName} onChange={(e) => setClientName(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-secondary-800"><Building2 className="h-3.5 w-3.5 text-gray-400" /> Company</label>
                <input type="text" placeholder="Acme Corp" value={company} onChange={(e) => setCompany(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-secondary-800"><Mail className="h-3.5 w-3.5 text-gray-400" /> Email</label>
                <input type="email" placeholder="client@company.com" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-secondary-800"><Phone className="h-3.5 w-3.5 text-gray-400" /> Phone</label>
                <input type="tel" placeholder="+91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} />
              </div>
            </div>

            {/* Line Items */}
            <div>
              <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-secondary-800"><ClipboardList className="h-3.5 w-3.5 text-gray-400" /> Line Items</label>
              <div className="mb-1 grid grid-cols-12 gap-2 px-1">
                <span className="col-span-5 text-[11px] font-semibold uppercase text-surface-muted">Description</span>
                <span className="col-span-2 text-[11px] font-semibold uppercase text-surface-muted">Qty</span>
                <span className="col-span-2 text-[11px] font-semibold uppercase text-surface-muted">Rate</span>
                <span className="col-span-2 text-right text-[11px] font-semibold uppercase text-surface-muted">Amount</span>
                <span className="col-span-1" />
              </div>
              <div className="space-y-2">
                {items.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                    <input type="text" placeholder="Item description" value={item.description} onChange={(e) => updateItem(idx, 'description', e.target.value)}
                      className="col-span-5 rounded-lg border border-surface-border px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20" />
                    <input type="number" min="1" placeholder="1" value={item.quantity || ''} onChange={(e) => updateItem(idx, 'quantity', e.target.value)}
                      className="col-span-2 rounded-lg border border-surface-border px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20" />
                    <input type="number" min="0" placeholder="0" value={item.rate || ''} onChange={(e) => updateItem(idx, 'rate', e.target.value)}
                      className="col-span-2 rounded-lg border border-surface-border px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20" />
                    <div className="col-span-2 text-right text-sm font-semibold text-secondary-800">{formatCurrency((item.quantity || 0) * (item.rate || 0))}</div>
                    <button type="button" onClick={() => removeItem(idx)} className="col-span-1 flex items-center justify-center rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={addItem} className="mt-2 flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700">
                <Plus className="h-3.5 w-3.5" /> Add Item
              </button>
            </div>

            {/* Totals */}
            <div className="rounded-xl bg-gray-50 p-4 space-y-1.5">
              <div className="flex justify-between text-sm text-surface-muted"><span>Subtotal</span><span className="font-medium text-secondary-800">{formatCurrency(subtotal)}</span></div>
              <div className="flex justify-between text-sm text-surface-muted"><span>GST (18%)</span><span className="font-medium text-secondary-800">{formatCurrency(tax)}</span></div>
              <div className="flex justify-between border-t border-gray-200 pt-1.5 text-base font-bold text-secondary-900"><span>Total</span><span className="text-primary-600">{formatCurrency(total)}</span></div>
            </div>

            {/* Validity */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-secondary-800"><Calendar className="h-3.5 w-3.5 text-gray-400" /> Validity Period</label>
              <select value={validity} onChange={(e) => setValidity(e.target.value)} className={inputCls + ' appearance-none'}>
                {VALIDITY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {/* Terms */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-secondary-800">Terms & Conditions</label>
              <textarea rows={3} value={terms} onChange={(e) => setTerms(e.target.value)} className={inputCls + ' resize-none'} placeholder="Payment terms, conditions..." />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t border-surface-border p-6 shrink-0">
            <button type="button" onClick={onClose} className="rounded-xl border border-surface-border px-5 py-2.5 text-sm font-medium text-secondary-800 hover:bg-surface-bg">Cancel</button>
            <button type="button" onClick={onSubmit} className="flex items-center gap-2 rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-600">
              <FileText className="h-4 w-4" /> {submitLabel}
            </button>
          </div>
        </div>
      </div>
    </>
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
            <Icon className="h-4 w-4" /> {item.label}
          </button>
        );
      })}
    </div>
  );
}
