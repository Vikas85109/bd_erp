import { useState, useMemo } from 'react';
import {
  Plus,
  FileText,
  Send,
  Download,
  Trash2,
  ChevronDown,
  LayoutTemplate,
  Building2,
  User,
  Mail,
  Phone,
  MessageCircle,
  Eye,
  Calendar,
  IndianRupee,
  ClipboardList,
} from 'lucide-react';
import { quotations as seedQuotations, quotationStatuses } from '../data/quotations';
import Toast from '../components/Toast';

// --------------- Templates ---------------
const TEMPLATES = [
  {
    name: 'Standard',
    icon: FileText,
    description: 'Basic plan with essential features',
    items: [
      { description: 'Standard Plan - Annual', quantity: 1, rate: 120000 },
      { description: 'Additional Users (10)', quantity: 10, rate: 1500 },
      { description: 'Email Support', quantity: 1, rate: 12000 },
    ],
    terms: 'Payment due within 30 days of invoice date.\nAll prices are exclusive of applicable taxes.\nSupport is available Mon-Fri, 9AM-6PM IST.',
    validity: '30',
  },
  {
    name: 'Enterprise',
    icon: Building2,
    description: 'Full-featured plan for large teams',
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
    name: 'Custom',
    icon: LayoutTemplate,
    description: 'Tailored solution - start from scratch',
    items: [{ description: '', quantity: 1, rate: 0 }],
    terms: 'Payment terms as mutually agreed.\nAll prices are exclusive of applicable taxes.',
    validity: '30',
  },
];

const VALIDITY_OPTIONS = [
  { label: '7 days', value: '7' },
  { label: '15 days', value: '15' },
  { label: '30 days', value: '30' },
  { label: '45 days', value: '45' },
  { label: '60 days', value: '60' },
  { label: '90 days', value: '90' },
];

// --------------- Helpers ---------------
function generateId() {
  return 'Q-' + (Math.floor(Math.random() * 9000) + 1000);
}

function formatCurrency(n) {
  return '₹' + Number(n || 0).toLocaleString('en-IN');
}

function addDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + Number(days));
  return d.toISOString().slice(0, 10);
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

const emptyItem = () => ({ description: '', quantity: 1, rate: 0 });

// --------------- Component ---------------
export default function Quotations() {
  // Quotation list
  const [quotationList, setQuotationList] = useState(seedQuotations);
  const [selectedQuotation, setSelectedQuotation] = useState(null);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [clientName, setClientName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [items, setItems] = useState([emptyItem()]);
  const [terms, setTerms] = useState(TEMPLATES[0].terms);
  const [validity, setValidity] = useState('30');
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Toast
  const [toast, setToast] = useState(null);

  // Derived calculations
  const subtotal = useMemo(() => items.reduce((s, i) => s + (i.quantity || 0) * (i.rate || 0), 0), [items]);
  const tax = useMemo(() => Math.round(subtotal * 0.18), [subtotal]);
  const total = subtotal + tax;

  // --------------- Actions ---------------
  function applyTemplate(tpl) {
    setSelectedTemplate(tpl.name);
    setItems(tpl.items.map((i) => ({ ...i })));
    setTerms(tpl.terms);
    setValidity(tpl.validity);
  }

  function updateItem(index, field, value) {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, [field]: field === 'description' ? value : Number(value) || 0 } : it)));
  }

  function addItem() {
    setItems((prev) => [...prev, emptyItem()]);
  }

  function removeItem(index) {
    setItems((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== index)));
  }

  function resetForm() {
    setClientName('');
    setCompany('');
    setEmail('');
    setPhone('');
    setItems([emptyItem()]);
    setTerms(TEMPLATES[0].terms);
    setValidity('30');
    setSelectedTemplate(null);
  }

  function buildQuotationObject(status = 'Draft') {
    const date = todayStr();
    return {
      id: generateId(),
      leadName: clientName || 'Unnamed Client',
      company: company || '-',
      email,
      phone,
      date,
      validUntil: addDays(date, validity),
      status,
      items: items.map((i) => ({ ...i, amount: (i.quantity || 0) * (i.rate || 0) })),
      subtotal,
      tax,
      total,
      terms,
    };
  }

  function handleGenerate() {
    if (items.every((i) => !i.description && !i.rate)) {
      setToast({ message: 'Add at least one line item', type: 'error' });
      return;
    }
    const q = buildQuotationObject('Draft');
    setQuotationList((prev) => [q, ...prev]);
    setSelectedQuotation(q);
    setShowForm(false);
    resetForm();
    setToast({ message: `Quotation ${q.id} generated!`, type: 'success' });
  }

  function handleSendToClient() {
    if (!selectedQuotation) return;
    setQuotationList((prev) => prev.map((q) => (q.id === selectedQuotation.id ? { ...q, status: 'Sent' } : q)));
    setSelectedQuotation((prev) => ({ ...prev, status: 'Sent' }));
    setToast({ message: 'Quotation sent via email', type: 'success' });
  }

  function handleDownloadPDF() {
    const q = selectedQuotation;
    if (!q) return;
    const lines = [
      '='.repeat(50),
      '                   QUOTATION',
      '='.repeat(50),
      '',
      `Quotation #: ${q.id}`,
      `Date: ${q.date}`,
      `Valid Until: ${q.validUntil}`,
      `Status: ${q.status}`,
      '',
      '--- Client ---',
      `Name: ${q.leadName}`,
      `Company: ${q.company}`,
      q.email ? `Email: ${q.email}` : '',
      q.phone ? `Phone: ${q.phone}` : '',
      '',
      '--- Items ---',
      '-'.repeat(50),
      'Description'.padEnd(28) + 'Qty'.padStart(5) + 'Rate'.padStart(10) + 'Amount'.padStart(10),
      '-'.repeat(50),
      ...q.items.map(
        (i) => (i.description || '-').padEnd(28) + String(i.quantity).padStart(5) + String(i.rate).padStart(10) + String(i.amount).padStart(10)
      ),
      '-'.repeat(50),
      '',
      `${'Subtotal:'.padStart(40)} ${formatCurrency(q.subtotal)}`,
      `${'GST (18%):'.padStart(40)} ${formatCurrency(q.tax)}`,
      `${'TOTAL:'.padStart(40)} ${formatCurrency(q.total)}`,
      '',
      '--- Terms & Conditions ---',
      q.terms || 'Standard terms apply.',
      '',
      '='.repeat(50),
      '          Generated by BindassDeal ERP',
      '='.repeat(50),
    ].join('\n');

    const blob = new Blob([lines], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${q.id}_Quotation.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setToast({ message: 'Quotation downloaded', type: 'success' });
  }

  function handleShareWhatsApp() {
    if (!selectedQuotation) return;
    setToast({ message: 'Shared via WhatsApp', type: 'success' });
  }

  function changeStatus(qId, newStatus) {
    setQuotationList((prev) => prev.map((q) => (q.id === qId ? { ...q, status: newStatus } : q)));
    if (selectedQuotation?.id === qId) setSelectedQuotation((prev) => ({ ...prev, status: newStatus }));
  }

  // Preview data source — live form if form open, otherwise selected quotation
  const previewData = useMemo(() => {
    if (showForm) {
      const date = todayStr();
      return {
        id: 'Q-XXXX',
        leadName: clientName || 'Client Name',
        company: company || 'Company',
        email,
        phone,
        date,
        validUntil: addDays(date, validity),
        status: 'Draft',
        items: items.map((i) => ({ ...i, amount: (i.quantity || 0) * (i.rate || 0) })),
        subtotal,
        tax,
        total,
        terms,
      };
    }
    return selectedQuotation;
  }, [showForm, clientName, company, email, phone, items, subtotal, tax, total, terms, validity, selectedQuotation]);

  // --------------- Shared Styles ---------------
  const inputCls =
    'w-full rounded-xl border border-surface-border bg-white px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 placeholder:text-gray-400';
  const btnPrimary =
    'flex items-center gap-2 rounded-xl bg-primary-500 hover:bg-primary-600 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-primary-500/15 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5';
  const btnOutline =
    'flex items-center gap-2 rounded-xl border border-surface-border px-4 py-2.5 text-sm font-medium text-secondary-700 transition-all duration-200 hover:bg-gray-50';

  // ===================== RENDER =====================
  return (
    <div className="space-y-6">
      {/* ---------- Page Header ---------- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Quotations</h1>
          <p className="mt-1 text-sm text-surface-muted">Create and manage sales quotations</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className={btnPrimary}
        >
          <Plus className="h-4 w-4" />
          {showForm ? 'Cancel' : 'New Quotation'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        {/* ========== LEFT COLUMN ========== */}
        <div className="space-y-6 xl:col-span-2">
          {/* ---------- Template Selector + Builder Form ---------- */}
          {showForm && (
            <div className="rounded-2xl bg-white p-6 shadow-md space-y-5">
              <h2 className="text-lg font-bold text-secondary-900">Create Quotation</h2>

              {/* Template Cards */}
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-surface-muted">Choose a Template</label>
                <div className="grid grid-cols-3 gap-3">
                  {TEMPLATES.map((tpl) => {
                    const Icon = tpl.icon;
                    const active = selectedTemplate === tpl.name;
                    return (
                      <button
                        key={tpl.name}
                        type="button"
                        onClick={() => applyTemplate(tpl)}
                        className={`rounded-xl border-2 p-3 text-left transition-all duration-200 ${
                          active ? 'border-primary-500 bg-primary-50 shadow-sm' : 'border-surface-border hover:border-primary-300 hover:bg-gray-50'
                        }`}
                      >
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
                  <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-secondary-800">
                    <User className="h-3.5 w-3.5 text-gray-400" /> Client Name
                  </label>
                  <input type="text" placeholder="John Doe" value={clientName} onChange={(e) => setClientName(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-secondary-800">
                    <Building2 className="h-3.5 w-3.5 text-gray-400" /> Company
                  </label>
                  <input type="text" placeholder="Acme Corp" value={company} onChange={(e) => setCompany(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-secondary-800">
                    <Mail className="h-3.5 w-3.5 text-gray-400" /> Email
                  </label>
                  <input type="email" placeholder="client@company.com" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-secondary-800">
                    <Phone className="h-3.5 w-3.5 text-gray-400" /> Phone
                  </label>
                  <input type="tel" placeholder="+91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} />
                </div>
              </div>

              {/* Line Items */}
              <div>
                <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-secondary-800">
                  <ClipboardList className="h-3.5 w-3.5 text-gray-400" /> Line Items
                </label>
                {/* Header row */}
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
                      <input
                        type="text"
                        placeholder="Item description"
                        value={item.description}
                        onChange={(e) => updateItem(idx, 'description', e.target.value)}
                        className="col-span-5 rounded-lg border border-surface-border px-3 py-2 text-sm outline-none transition-all focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20"
                      />
                      <input
                        type="number"
                        min="1"
                        placeholder="1"
                        value={item.quantity || ''}
                        onChange={(e) => updateItem(idx, 'quantity', e.target.value)}
                        className="col-span-2 rounded-lg border border-surface-border px-3 py-2 text-sm outline-none transition-all focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20"
                      />
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={item.rate || ''}
                        onChange={(e) => updateItem(idx, 'rate', e.target.value)}
                        className="col-span-2 rounded-lg border border-surface-border px-3 py-2 text-sm outline-none transition-all focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20"
                      />
                      <div className="col-span-2 text-right text-sm font-semibold text-secondary-800">
                        {formatCurrency((item.quantity || 0) * (item.rate || 0))}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(idx)}
                        className="col-span-1 flex items-center justify-center rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                        title="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <button type="button" onClick={addItem} className="mt-2 flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
                  <Plus className="h-3.5 w-3.5" /> Add Item
                </button>
              </div>

              {/* Totals inline */}
              <div className="rounded-xl bg-gray-50 p-4 space-y-1.5">
                <div className="flex justify-between text-sm text-surface-muted">
                  <span>Subtotal</span>
                  <span className="font-medium text-secondary-800">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-surface-muted">
                  <span>GST (18%)</span>
                  <span className="font-medium text-secondary-800">{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-1.5 text-base font-bold text-secondary-900">
                  <span>Total</span>
                  <span className="text-primary-600">{formatCurrency(total)}</span>
                </div>
              </div>

              {/* Validity */}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-secondary-800">
                  <Calendar className="h-3.5 w-3.5 text-gray-400" /> Validity Period
                </label>
                <select value={validity} onChange={(e) => setValidity(e.target.value)} className={inputCls + ' appearance-none'}>
                  {VALIDITY_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Terms */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-secondary-800">Terms & Conditions</label>
                <textarea
                  rows={3}
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  className={inputCls + ' resize-none'}
                  placeholder="Payment terms, conditions..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-1">
                <button type="button" onClick={handleGenerate} className={btnPrimary}>
                  <FileText className="h-4 w-4" /> Generate
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleGenerate();
                    setTimeout(() => setToast({ message: 'Quotation sent via email', type: 'success' }), 400);
                  }}
                  className={btnOutline}
                >
                  <Send className="h-4 w-4" /> Send to Client
                </button>
              </div>
            </div>
          )}

          {/* ---------- Quotation List ---------- */}
          <div className="rounded-2xl bg-white shadow-md">
            <div className="border-b border-surface-border p-4">
              <h2 className="font-semibold text-secondary-900">Quotations ({quotationList.length})</h2>
            </div>
            <div className="divide-y divide-surface-border max-h-130 overflow-y-auto">
              {quotationList.map((q) => (
                <div
                  key={q.id}
                  className={`flex items-center justify-between p-4 transition-colors duration-200 hover:bg-surface-bg cursor-pointer ${
                    selectedQuotation?.id === q.id ? 'bg-primary-50' : ''
                  }`}
                >
                  {/* Click area */}
                  <button
                    onClick={() => {
                      setSelectedQuotation(q);
                      setShowForm(false);
                    }}
                    className="flex-1 text-left"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-secondary-900">{q.id}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          q.status === 'Sent'
                            ? 'bg-blue-100 text-blue-700'
                            : q.status === 'Draft'
                            ? 'bg-gray-100 text-gray-600'
                            : q.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-700'
                            : q.status === 'Rejected'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {q.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-surface-muted">
                      {q.leadName} &mdash; {q.company}
                    </p>
                    <p className="text-xs text-surface-muted">{q.date}</p>
                  </button>

                  {/* Right side: total + status changer */}
                  <div className="flex flex-col items-end gap-1.5 ml-3 shrink-0">
                    <span className="text-lg font-bold text-secondary-900">{formatCurrency(q.total)}</span>
                    <div className="relative">
                      <select
                        value={q.status}
                        onChange={(e) => changeStatus(q.id, e.target.value)}
                        className="appearance-none rounded-lg border border-surface-border bg-white py-0.5 pl-2 pr-6 text-[11px] font-medium text-secondary-700 outline-none transition-all focus:border-primary-500"
                      >
                        {quotationStatuses.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                </div>
              ))}

              {quotationList.length === 0 && (
                <div className="p-8 text-center text-sm text-surface-muted">No quotations yet. Create one to get started.</div>
              )}
            </div>
          </div>
        </div>

        {/* ========== RIGHT COLUMN — Live Preview ========== */}
        <div className="xl:col-span-3">
          {previewData ? (
            <div className="rounded-2xl bg-white shadow-md">
              {/* Preview badge */}
              <div className="flex items-center justify-between rounded-t-2xl bg-gray-50 px-6 py-3 border-b border-surface-border">
                <div className="flex items-center gap-2 text-sm font-medium text-surface-muted">
                  <Eye className="h-4 w-4" />
                  {showForm ? 'Live Preview' : 'Quotation Preview'}
                </div>
                {showForm && (
                  <span className="animate-pulse rounded-full bg-primary-100 px-2.5 py-0.5 text-[11px] font-semibold text-primary-600">
                    Updating live
                  </span>
                )}
              </div>

              <div className="p-8">
                {/* Invoice Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-secondary-900">QUOTATION</h2>
                    <p className="mt-1 text-lg font-semibold text-primary-600">{previewData.id}</p>
                  </div>
                  <div className="text-right">
                    <h3 className="text-xl font-bold text-primary-500">BindassDeal ERP</h3>
                    <p className="text-sm text-surface-muted">123 Business Street</p>
                    <p className="text-sm text-surface-muted">Mumbai, MH 400001</p>
                  </div>
                </div>

                <div className="my-6 border-t border-surface-border" />

                {/* Client Details */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-semibold uppercase text-surface-muted">Bill To</p>
                    <p className="mt-1 font-semibold text-secondary-900">{previewData.leadName}</p>
                    <p className="text-sm text-surface-muted">{previewData.company}</p>
                    {previewData.email && <p className="text-sm text-surface-muted">{previewData.email}</p>}
                    {previewData.phone && <p className="text-sm text-surface-muted">{previewData.phone}</p>}
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm">
                      <span className="text-surface-muted">Date:</span> <span className="font-medium">{previewData.date}</span>
                    </p>
                    <p className="text-sm">
                      <span className="text-surface-muted">Valid Until:</span> <span className="font-medium">{previewData.validUntil}</span>
                    </p>
                    <p className="text-sm">
                      <span className="text-surface-muted">Status:</span>{' '}
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                          previewData.status === 'Sent'
                            ? 'bg-blue-100 text-blue-700'
                            : previewData.status === 'Draft'
                            ? 'bg-gray-100 text-gray-600'
                            : previewData.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-700'
                            : previewData.status === 'Rejected'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {previewData.status}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Items Table */}
                <div className="mt-8 overflow-hidden rounded-xl border border-surface-border">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-surface-muted">Description</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-surface-muted">Qty</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-surface-muted">Rate</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-surface-muted">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-border">
                      {previewData.items
                        .filter((i) => i.description || i.rate)
                        .map((item, idx) => (
                          <tr key={idx} className="transition-colors">
                            <td className="px-4 py-3 text-sm font-medium text-secondary-900">{item.description || '-'}</td>
                            <td className="px-4 py-3 text-center text-sm text-surface-muted">{item.quantity}</td>
                            <td className="px-4 py-3 text-right text-sm text-surface-muted">{formatCurrency(item.rate)}</td>
                            <td className="px-4 py-3 text-right text-sm font-semibold text-secondary-900">{formatCurrency(item.amount)}</td>
                          </tr>
                        ))}
                      {previewData.items.filter((i) => i.description || i.rate).length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-4 py-6 text-center text-sm text-surface-muted italic">
                            No items added yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="mt-4 flex justify-end">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-surface-muted">Subtotal</span>
                      <span className="font-medium">{formatCurrency(previewData.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-surface-muted">GST (18%)</span>
                      <span className="font-medium">{formatCurrency(previewData.tax)}</span>
                    </div>
                    <div className="border-t border-surface-border pt-2">
                      <div className="flex justify-between">
                        <span className="text-lg font-bold text-secondary-900">Total</span>
                        <span className="text-lg font-bold text-primary-500">{formatCurrency(previewData.total)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Terms */}
                {previewData.terms && (
                  <div className="mt-8 rounded-xl bg-gray-50 p-4">
                    <p className="text-xs font-semibold uppercase text-surface-muted mb-1">Terms & Conditions</p>
                    <p className="text-sm text-secondary-700 whitespace-pre-line">{previewData.terms}</p>
                  </div>
                )}

                {/* Preview Action Buttons */}
                {!showForm && selectedQuotation && (
                  <div className="mt-8 flex flex-wrap gap-3">
                    <button type="button" onClick={handleSendToClient} className={btnPrimary}>
                      <Send className="h-4 w-4" /> Send to Client
                    </button>
                    <button type="button" onClick={handleDownloadPDF} className={btnOutline}>
                      <Download className="h-4 w-4" /> Download PDF
                    </button>
                    <button type="button" onClick={handleShareWhatsApp} className={btnOutline}>
                      <MessageCircle className="h-4 w-4" /> Share WhatsApp
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-2xl border-2 border-dashed border-surface-border bg-white">
              <div className="text-center">
                <FileText className="mx-auto h-10 w-10 text-gray-300" />
                <p className="mt-3 text-sm font-medium text-surface-muted">Select a quotation or create a new one</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
