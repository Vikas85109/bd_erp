import { useState } from 'react';
import { Plus, FileText, Send, Download, Eye, Printer } from 'lucide-react';
import { quotations } from '../data/quotations';
import Toast from '../components/Toast';

export default function Quotations() {
  const [selectedQuotation, setSelectedQuotation] = useState(quotations[0]);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState(null);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Quotations</h1>
          <p className="mt-1 text-sm text-surface-muted">Create and manage sales quotations</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-primary-500/25 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
        >
          <Plus className="h-4 w-4" />
          New Quotation
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Left - Quotation List & Form */}
        <div className="space-y-6 lg:col-span-2">
          {/* New Quotation Form */}
          {showForm && (
            <div className="rounded-2xl bg-white p-6 shadow-md">
              <h2 className="text-lg font-bold text-secondary-900">Create Quotation</h2>
              <form className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-secondary-800">Client Name</label>
                    <input
                      type="text"
                      placeholder="Enter name"
                      className="w-full rounded-xl border border-surface-border px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-secondary-800">Company</label>
                    <input
                      type="text"
                      placeholder="Company name"
                      className="w-full rounded-xl border border-surface-border px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                    />
                  </div>
                </div>

                {/* Line Items */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-secondary-800">Items</label>
                  <div className="space-y-2">
                    <div className="grid grid-cols-12 gap-2">
                      <input type="text" placeholder="Description" className="col-span-5 rounded-lg border border-surface-border px-3 py-2 text-sm outline-none focus:border-primary-500" />
                      <input type="number" placeholder="Qty" className="col-span-2 rounded-lg border border-surface-border px-3 py-2 text-sm outline-none focus:border-primary-500" />
                      <input type="number" placeholder="Rate" className="col-span-3 rounded-lg border border-surface-border px-3 py-2 text-sm outline-none focus:border-primary-500" />
                      <div className="col-span-2 flex items-center justify-center text-sm font-medium text-surface-muted">₹0</div>
                    </div>
                  </div>
                  <button type="button" className="mt-2 text-sm font-medium text-primary-600 hover:text-primary-700">
                    + Add Item
                  </button>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setToast({ message: 'Quotation generated!', type: 'success' });
                    }}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-md transition-all duration-200 hover:shadow-lg"
                  >
                    <FileText className="h-4 w-4" />
                    Generate
                  </button>
                  <button type="button" className="flex items-center gap-2 rounded-xl border border-surface-border px-4 py-2.5 text-sm font-medium text-surface-muted transition-all hover:bg-surface-bg">
                    <Send className="h-4 w-4" />
                    Send
                  </button>
                  <button type="button" className="flex items-center gap-2 rounded-xl border border-surface-border px-4 py-2.5 text-sm font-medium text-surface-muted transition-all hover:bg-surface-bg">
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Quotation List */}
          <div className="rounded-2xl bg-white shadow-md">
            <div className="border-b border-surface-border p-4">
              <h2 className="font-semibold text-secondary-900">Recent Quotations</h2>
            </div>
            <div className="divide-y divide-surface-border">
              {quotations.map((q) => (
                <button
                  key={q.id}
                  onClick={() => setSelectedQuotation(q)}
                  className={`flex w-full items-center justify-between p-4 text-left transition-colors duration-200 hover:bg-surface-bg ${
                    selectedQuotation?.id === q.id ? 'bg-primary-50' : ''
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-secondary-900">{q.id}</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        q.status === 'Sent' ? 'bg-blue-100 text-blue-700' :
                        q.status === 'Draft' ? 'bg-gray-100 text-gray-700' :
                        q.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {q.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-surface-muted">{q.leadName} — {q.company}</p>
                    <p className="text-xs text-surface-muted">{q.date}</p>
                  </div>
                  <span className="text-lg font-bold text-secondary-900">₹{(q.total / 1000).toFixed(0)}K</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right - Invoice Preview */}
        <div className="lg:col-span-3">
          {selectedQuotation && (
            <div className="rounded-2xl bg-white p-8 shadow-md">
              {/* Invoice Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-secondary-900">QUOTATION</h2>
                  <p className="mt-1 text-lg font-semibold text-primary-600">{selectedQuotation.id}</p>
                </div>
                <div className="text-right">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
                    LeadFlow CRM
                  </h3>
                  <p className="text-sm text-surface-muted">123 Business Street</p>
                  <p className="text-sm text-surface-muted">Mumbai, MH 400001</p>
                </div>
              </div>

              <div className="my-6 border-t border-surface-border" />

              {/* Client Details */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-semibold uppercase text-surface-muted">Bill To</p>
                  <p className="mt-1 font-semibold text-secondary-900">{selectedQuotation.leadName}</p>
                  <p className="text-sm text-surface-muted">{selectedQuotation.company}</p>
                </div>
                <div className="text-right">
                  <div className="space-y-1">
                    <p className="text-sm"><span className="text-surface-muted">Date:</span> <span className="font-medium">{selectedQuotation.date}</span></p>
                    <p className="text-sm"><span className="text-surface-muted">Valid Until:</span> <span className="font-medium">{selectedQuotation.validUntil}</span></p>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="mt-8 overflow-hidden rounded-xl border border-surface-border">
                <table className="w-full">
                  <thead>
                    <tr className="bg-surface-bg">
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-surface-muted">Description</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-surface-muted">Qty</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-surface-muted">Rate</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-surface-muted">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-border">
                    {selectedQuotation.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-3 text-sm font-medium text-secondary-900">{item.description}</td>
                        <td className="px-4 py-3 text-center text-sm text-surface-muted">{item.quantity}</td>
                        <td className="px-4 py-3 text-right text-sm text-surface-muted">₹{item.rate.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right text-sm font-semibold text-secondary-900">₹{item.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="mt-4 flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-surface-muted">Subtotal</span>
                    <span className="font-medium">₹{selectedQuotation.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-surface-muted">GST (18%)</span>
                    <span className="font-medium">₹{selectedQuotation.tax.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-surface-border pt-2">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold text-secondary-900">Total</span>
                      <span className="text-lg font-bold text-primary-700">₹{selectedQuotation.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 flex gap-3">
                <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg">
                  <Send className="h-4 w-4" />
                  Send to Client
                </button>
                <button className="flex items-center gap-2 rounded-xl border border-surface-border px-4 py-2.5 text-sm font-medium text-surface-muted transition-all hover:bg-surface-bg">
                  <Download className="h-4 w-4" />
                  Download PDF
                </button>
                <button className="flex items-center gap-2 rounded-xl border border-surface-border px-4 py-2.5 text-sm font-medium text-surface-muted transition-all hover:bg-surface-bg">
                  <Printer className="h-4 w-4" />
                  Print
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
