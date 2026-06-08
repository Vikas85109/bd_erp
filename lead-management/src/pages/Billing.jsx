import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Check,
  ArrowUpRight,
  Download,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Calendar,
  Receipt,
  Settings2,
  FileText,
} from 'lucide-react';
import {
  currentPlan,
  usage,
  invoices as invoicesData,
  paymentMethod,
  getInvoiceStatusColor,
  getPlanStatusColor,
} from '../data/billing';
import UsageMeter from '../components/billing/UsageMeter';
import Toast from '../components/Toast';

const PAGE_SIZE = 10;

export default function Billing() {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState(
    location.state?.toast
      ? { message: location.state.toast, type: 'success' }
      : null
  );

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (location.state?.toast) {
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const totalPages = Math.max(1, Math.ceil(invoicesData.length / PAGE_SIZE));
  const pagedInvoices = useMemo(
    () => invoicesData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [page]
  );

  const nextInvoice = {
    amount: currentPlan.price,
    date: currentPlan.renewsOn,
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  const handleDownload = (invId) =>
    setToast({ message: `Preparing ${invId}.pdf for download`, type: 'info' });

  if (loading) {
    return (
      <div className="p-6 lg:p-8 space-y-6">
        <div className="h-8 w-64 skeleton rounded-lg" />
        <div className="h-32 w-full skeleton rounded-2xl" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-28 skeleton rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Billing & Plans</h1>
        <p className="mt-1 text-sm text-surface-muted">
          Manage subscription, usage, and invoices
        </p>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Hero card */}
          <section
            aria-label="Current plan overview"
            className="rounded-2xl border border-surface-border bg-white p-6"
          >
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-secondary-900">
                    {currentPlan.name} plan
                  </h2>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${getPlanStatusColor(
                      currentPlan.status
                    )}`}
                  >
                    {currentPlan.status}
                  </span>
                </div>
                <p className="mt-2 flex items-center gap-2 text-sm text-surface-muted">
                  <Calendar className="h-4 w-4" />
                  Renews on {formatDate(currentPlan.renewsOn)}
                </p>
                <p className="mt-3 text-2xl font-bold text-secondary-900">
                  ${currentPlan.price}
                  <span className="ml-1 text-sm font-normal text-surface-muted">
                    /{currentPlan.period}
                  </span>
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setToast({ message: 'Opening plan management', type: 'info' })}
                  className="inline-flex items-center gap-2 rounded-xl border border-surface-border bg-white px-4 py-2 text-sm font-semibold text-secondary-900 hover:bg-surface-bg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300"
                >
                  <Settings2 className="h-4 w-4" />
                  Manage plan
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/billing/upgrade')}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300"
                >
                  Upgrade plan
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </section>

          {/* Usage */}
          <section aria-label="Plan usage" className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-surface-muted">
              Usage this period
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <UsageMeter
                label="Team members"
                used={usage.users}
                total={currentPlan.limits.users}
                unit="users"
              />
              <UsageMeter
                label="Storage"
                used={usage.storage}
                total={currentPlan.limits.storage}
                unit="GB"
              />
              <UsageMeter
                label="API calls"
                used={usage.apiCalls}
                total={currentPlan.limits.apiCalls}
                unit="calls"
              />
              <UsageMeter
                label="Emails sent"
                used={usage.emails}
                total={currentPlan.limits.emails}
                unit="sent"
              />
              <UsageMeter
                label="Contacts"
                used={usage.contacts}
                total={currentPlan.limits.contacts}
                unit="contacts"
              />
            </div>
          </section>

          {/* Included features */}
          <section
            aria-label="Included features"
            className="rounded-2xl border border-surface-border bg-white p-6"
          >
            <h3 className="text-sm font-semibold uppercase tracking-wide text-surface-muted">
              Included in {currentPlan.name}
            </h3>
            <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {currentPlan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-secondary-800">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-50">
                    <Check className="h-3.5 w-3.5 text-accent-600" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Right sidebar */}
        <aside className="space-y-6">
          <div className="rounded-2xl border border-surface-border bg-white p-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-secondary-900">
              <Receipt className="h-4 w-4 text-primary-500" />
              Next invoice
            </div>
            <p className="mt-4 text-3xl font-bold text-secondary-900">
              ${nextInvoice.amount.toFixed(2)}
            </p>
            <p className="mt-1 text-xs text-surface-muted">
              Charged on {formatDate(nextInvoice.date)}
            </p>

            <div className="mt-5 flex items-center justify-between rounded-xl border border-surface-border bg-surface-bg px-3 py-2.5">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-secondary-700" />
                <span className="text-sm font-medium text-secondary-900">
                  {paymentMethod.brand} •••• {paymentMethod.last4}
                </span>
              </div>
              <span className="text-xs text-surface-muted">
                {String(paymentMethod.expMonth).padStart(2, '0')}/
                {String(paymentMethod.expYear).slice(-2)}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setToast({ message: 'Redirecting to update payment method', type: 'info' })}
              className="mt-4 w-full text-left text-sm font-semibold text-primary-600 hover:text-primary-700"
            >
              Update payment method →
            </button>
          </div>
        </aside>
      </div>

      {/* Invoices table */}
      <section
        aria-label="Invoice history"
        className="rounded-2xl border border-surface-border bg-white"
      >
        <div className="flex items-center justify-between border-b border-surface-border p-5">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary-500" />
            <h3 className="text-sm font-semibold text-secondary-900">Invoice history</h3>
          </div>
          <p className="text-xs text-surface-muted">{invoicesData.length} total</p>
        </div>

        {invoicesData.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm font-medium text-secondary-900">No invoices yet</p>
            <p className="mt-1 text-xs text-surface-muted">
              Your first invoice will appear here after your next billing cycle.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-border bg-surface-bg text-xs uppercase tracking-wide text-surface-muted">
                    <th className="p-4 text-left font-semibold">Date</th>
                    <th className="p-4 text-left font-semibold">Invoice #</th>
                    <th className="p-4 text-left font-semibold">Amount</th>
                    <th className="p-4 text-left font-semibold">Status</th>
                    <th className="p-4 text-right font-semibold">PDF</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedInvoices.map((inv) => (
                    <tr
                      key={inv.id}
                      className="border-b border-surface-border last:border-0 hover:bg-surface-bg/50"
                    >
                      <td className="p-4 text-secondary-800">{formatDate(inv.date)}</td>
                      <td className="p-4 font-medium text-secondary-900">{inv.id}</td>
                      <td className="p-4 text-secondary-800">${inv.amount.toFixed(2)}</td>
                      <td className="p-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${getInvoiceStatusColor(
                            inv.status
                          )}`}
                        >
                          {inv.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleDownload(inv.id)}
                          aria-label={`Download invoice ${inv.id}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-surface-muted hover:bg-surface-bg hover:text-primary-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-surface-border p-4">
                <p className="text-xs text-surface-muted">
                  Showing {(page - 1) * PAGE_SIZE + 1}–
                  {Math.min(page * PAGE_SIZE, invoicesData.length)} of {invoicesData.length}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    aria-label="Previous page"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-surface-border text-surface-muted hover:bg-surface-bg disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="px-3 text-sm font-medium text-secondary-900">
                    {page} / {totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    aria-label="Next page"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-surface-border text-surface-muted hover:bg-surface-bg disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
