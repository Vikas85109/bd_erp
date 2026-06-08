import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  CreditCard,
  Lock,
  Plus,
  Tag,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import {
  plans,
  currentPlan,
  paymentMethod,
  billingAddress as defaultAddress,
} from '../data/billing';
import Modal from '../components/Modal';

const COUNTRIES = ['India', 'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'Singapore', 'United Arab Emirates'];

const computeOrder = (plan, period) => {
  if (!plan) return null;
  const base = period === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
  if (base === null || base === undefined) return null;

  const prorationCredit = plan.id !== currentPlan.id && base > 0 ? Math.round(currentPlan.price * 0.35) : 0;
  const subtotal = Math.max(0, base - prorationCredit);
  const tax = Math.round(subtotal * 0.18 * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;

  const nextDate = new Date();
  if (period === 'yearly') {
    nextDate.setFullYear(nextDate.getFullYear() + 1);
  } else {
    nextDate.setMonth(nextDate.getMonth() + 1);
  }

  return {
    base,
    prorationCredit,
    subtotal,
    tax,
    total,
    nextDate: nextDate.toISOString(),
    nextAmount: base,
    period,
  };
};

export default function BillingCheckout() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const planId = params.get('plan');
  const period = params.get('period') || 'monthly';

  const plan = useMemo(() => plans.find((p) => p.id === planId), [planId]);
  const order = useMemo(() => computeOrder(plan, period), [plan, period]);

  const [usingSavedCard, setUsingSavedCard] = useState(true);
  const [newCard, setNewCard] = useState({ number: '', name: '', exp: '', cvc: '' });
  const [address, setAddress] = useState(defaultAddress);
  const [coupon, setCoupon] = useState('');
  const [couponState, setCouponState] = useState(null); // { ok, message }
  const [submitting, setSubmitting] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [error, setError] = useState(null);

  if (!plan || !order) {
    return (
      <div className="p-6 lg:p-8">
        <div className="rounded-2xl border border-surface-border bg-white p-10 text-center">
          <p className="text-sm font-semibold text-secondary-900">Plan not available</p>
          <p className="mt-1 text-xs text-surface-muted">
            The plan you selected cannot be purchased online. Please return and pick a different plan.
          </p>
          <button
            type="button"
            onClick={() => navigate('/billing/upgrade')}
            className="mt-4 inline-flex rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
          >
            Back to plans
          </button>
        </div>
      </div>
    );
  }

  const applyCoupon = () => {
    if (!coupon.trim()) {
      setCouponState({ ok: false, message: 'Enter a coupon code.' });
      return;
    }
    if (coupon.trim().toUpperCase() === 'BDDWELCOME') {
      setCouponState({ ok: true, message: '10% off applied at checkout.' });
    } else {
      setCouponState({ ok: false, message: 'This coupon is invalid or expired.' });
    }
  };

  const discountedTotal = couponState?.ok
    ? Math.round(order.total * 0.9 * 100) / 100
    : order.total;

  const validateCard = () => {
    if (usingSavedCard) return true;
    const digits = newCard.number.replace(/\s/g, '');
    if (digits.length < 13) return 'Enter a valid card number.';
    if (!newCard.name.trim()) return 'Enter the cardholder name.';
    if (!/^\d{2}\/\d{2}$/.test(newCard.exp)) return 'Use MM/YY for expiry.';
    if (!/^\d{3,4}$/.test(newCard.cvc)) return 'Enter a valid CVC.';
    return true;
  };

  const handleConfirm = () => {
    setError(null);
    const cardValid = validateCard();
    if (cardValid !== true) {
      setError(cardValid);
      return;
    }
    if (!address.country || !address.city || !address.zip || !address.line) {
      setError('Please complete your billing address.');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSuccessOpen(true);
    }, 1400);
  };

  const handleSuccessClose = () => {
    setSuccessOpen(false);
    navigate('/billing', { state: { toast: 'Plan upgraded successfully' } });
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <button
          type="button"
          onClick={() => navigate('/billing/upgrade')}
          className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-surface-muted hover:text-primary-600"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to plans
        </button>
        <h1 className="text-2xl font-bold text-secondary-900">Confirm your upgrade</h1>
        <p className="mt-1 text-sm text-surface-muted">
          Review your order and complete payment to activate the {plan.name} plan.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Order summary */}
        <aside className="lg:col-span-2 space-y-4 lg:sticky lg:top-20 self-start">
          <div className="rounded-2xl border border-surface-border bg-white p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-surface-muted">
              Order summary
            </h2>

            <div className="mt-4 flex items-start justify-between">
              <div>
                <p className="text-base font-bold text-secondary-900">{plan.name} plan</p>
                <p className="text-xs text-surface-muted capitalize">{period} billing</p>
              </div>
              <p className="text-base font-bold text-secondary-900">
                ${order.base.toFixed(2)}
              </p>
            </div>

            <dl className="mt-5 space-y-3 border-t border-surface-border pt-4 text-sm">
              <div className="flex justify-between text-secondary-700">
                <dt>Plan fee</dt>
                <dd>${order.base.toFixed(2)}</dd>
              </div>
              {order.prorationCredit > 0 && (
                <div className="flex justify-between text-accent-600">
                  <dt>Proration credit</dt>
                  <dd>− ${order.prorationCredit.toFixed(2)}</dd>
                </div>
              )}
              <div className="flex justify-between text-secondary-700">
                <dt>GST (18%)</dt>
                <dd>${order.tax.toFixed(2)}</dd>
              </div>
              {couponState?.ok && (
                <div className="flex justify-between text-accent-600">
                  <dt>Coupon (BDDWELCOME)</dt>
                  <dd>− ${(order.total - discountedTotal).toFixed(2)}</dd>
                </div>
              )}
            </dl>

            <div className="mt-4 flex items-center justify-between border-t border-surface-border pt-4">
              <p className="text-sm font-semibold text-secondary-900">Total due today</p>
              <p className="text-xl font-bold text-secondary-900">
                ${discountedTotal.toFixed(2)}
              </p>
            </div>

            <p className="mt-4 rounded-xl bg-surface-bg p-3 text-xs text-surface-muted">
              Next charge of <strong>${order.nextAmount.toFixed(2)}</strong> on{' '}
              {formatDate(order.nextDate)}. Cancel anytime.
            </p>
          </div>
        </aside>

        {/* Right: payment + address */}
        <div className="lg:col-span-3 space-y-6">
          {/* Payment method */}
          <section
            aria-label="Payment method"
            className="rounded-2xl border border-surface-border bg-white p-6"
          >
            <h2 className="text-sm font-semibold text-secondary-900">Payment method</h2>

            <div className="mt-4 space-y-3">
              <label
                className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-colors ${
                  usingSavedCard
                    ? 'border-primary-500 bg-primary-50/40'
                    : 'border-surface-border hover:bg-surface-bg'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="pm"
                    className="accent-primary-600"
                    checked={usingSavedCard}
                    onChange={() => setUsingSavedCard(true)}
                  />
                  <CreditCard className="h-5 w-5 text-secondary-700" />
                  <div>
                    <p className="text-sm font-semibold text-secondary-900">
                      {paymentMethod.brand} •••• {paymentMethod.last4}
                    </p>
                    <p className="text-xs text-surface-muted">
                      Expires {String(paymentMethod.expMonth).padStart(2, '0')}/
                      {String(paymentMethod.expYear).slice(-2)} ·{' '}
                      {paymentMethod.holder}
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-accent-50 px-2 py-0.5 text-[10px] font-semibold text-accent-600">
                  Saved
                </span>
              </label>

              <label
                className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-colors ${
                  !usingSavedCard
                    ? 'border-primary-500 bg-primary-50/40'
                    : 'border-surface-border hover:bg-surface-bg'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="pm"
                    className="accent-primary-600"
                    checked={!usingSavedCard}
                    onChange={() => setUsingSavedCard(false)}
                  />
                  <Plus className="h-5 w-5 text-secondary-700" />
                  <p className="text-sm font-semibold text-secondary-900">Add new card</p>
                </div>
              </label>

              {!usingSavedCard && (
                <div className="rounded-xl border border-surface-border bg-surface-bg/60 p-4 space-y-3">
                  <div>
                    <label className="text-xs font-medium text-surface-muted" htmlFor="cc-num">
                      Card number
                    </label>
                    <input
                      id="cc-num"
                      value={newCard.number}
                      onChange={(e) => setNewCard({ ...newCard, number: e.target.value })}
                      placeholder="1234 1234 1234 1234"
                      inputMode="numeric"
                      className="mt-1 w-full rounded-lg border border-surface-border bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-surface-muted" htmlFor="cc-name">
                      Cardholder name
                    </label>
                    <input
                      id="cc-name"
                      value={newCard.name}
                      onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
                      placeholder="Name on card"
                      className="mt-1 w-full rounded-lg border border-surface-border bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-surface-muted" htmlFor="cc-exp">
                        Expiry
                      </label>
                      <input
                        id="cc-exp"
                        value={newCard.exp}
                        onChange={(e) => setNewCard({ ...newCard, exp: e.target.value })}
                        placeholder="MM/YY"
                        className="mt-1 w-full rounded-lg border border-surface-border bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-surface-muted" htmlFor="cc-cvc">
                        CVC
                      </label>
                      <input
                        id="cc-cvc"
                        value={newCard.cvc}
                        onChange={(e) => setNewCard({ ...newCard, cvc: e.target.value })}
                        placeholder="123"
                        inputMode="numeric"
                        className="mt-1 w-full rounded-lg border border-surface-border bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Billing address */}
          <section
            aria-label="Billing address"
            className="rounded-2xl border border-surface-border bg-white p-6"
          >
            <h2 className="text-sm font-semibold text-secondary-900">Billing address</h2>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="addr-line" className="text-xs font-medium text-surface-muted">
                  Address line
                </label>
                <input
                  id="addr-line"
                  value={address.line}
                  onChange={(e) => setAddress({ ...address, line: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-surface-border bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="addr-country" className="text-xs font-medium text-surface-muted">
                  Country
                </label>
                <select
                  id="addr-country"
                  value={address.country}
                  onChange={(e) => setAddress({ ...address, country: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-surface-border bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="addr-state" className="text-xs font-medium text-surface-muted">
                  State / Region
                </label>
                <input
                  id="addr-state"
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-surface-border bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="addr-city" className="text-xs font-medium text-surface-muted">
                  City
                </label>
                <input
                  id="addr-city"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-surface-border bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="addr-zip" className="text-xs font-medium text-surface-muted">
                  Postal code
                </label>
                <input
                  id="addr-zip"
                  value={address.zip}
                  onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-surface-border bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
                />
              </div>
            </div>
          </section>

          {/* Coupon */}
          <section
            aria-label="Coupon"
            className="rounded-2xl border border-surface-border bg-white p-6"
          >
            <h2 className="text-sm font-semibold text-secondary-900">Have a coupon?</h2>
            <div className="mt-3 flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-muted" />
                <input
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Enter code (try BDDWELCOME)"
                  aria-label="Coupon code"
                  className="w-full rounded-lg border border-surface-border bg-white py-2 pl-9 pr-3 text-sm focus:border-primary-500 focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={applyCoupon}
                className="rounded-lg border border-surface-border bg-white px-4 py-2 text-sm font-semibold text-secondary-900 hover:bg-surface-bg"
              >
                Apply
              </button>
            </div>
            {couponState && (
              <p
                className={`mt-2 text-xs ${
                  couponState.ok ? 'text-accent-600' : 'text-error-500'
                }`}
              >
                {couponState.message}
              </p>
            )}
          </section>

          {/* Actions */}
          <div className="rounded-2xl border border-surface-border bg-white p-6">
            {error && (
              <p className="mb-3 rounded-lg border border-error-400/30 bg-error-50 px-3 py-2 text-xs font-medium text-error-500">
                {error}
              </p>
            )}
            <button
              type="button"
              onClick={handleConfirm}
              disabled={submitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-3 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Processing payment…
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" /> Confirm upgrade · ${discountedTotal.toFixed(2)}
                </>
              )}
            </button>
            <Link
              to="/billing/upgrade"
              className="mt-3 block text-center text-xs font-medium text-surface-muted hover:text-primary-600"
            >
              Cancel and go back
            </Link>
            <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-surface-muted">
              <Lock className="h-3 w-3" /> Secured by 256-bit TLS · PCI DSS compliant
            </p>
          </div>
        </div>
      </div>

      {/* Success modal */}
      <Modal
        isOpen={successOpen}
        onClose={handleSuccessClose}
        title="Upgrade complete"
        footer={
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSuccessClose}
              className="rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
            >
              Back to billing
            </button>
          </div>
        }
      >
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-50">
            <CheckCircle2 className="h-8 w-8 text-accent-600" />
          </div>
          <p className="mt-4 text-base font-semibold text-secondary-900">
            You are now on the {plan.name} plan
          </p>
          <p className="mt-1 text-sm text-surface-muted">
            A receipt has been emailed to your billing contact. New limits are
            active immediately.
          </p>
        </div>
      </Modal>
    </div>
  );
}
