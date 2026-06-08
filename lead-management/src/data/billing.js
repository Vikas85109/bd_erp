// Mock billing & plans data for the BDD CRM

export const currentPlan = {
  id: 'pro',
  name: 'Pro',
  price: 49,
  period: 'month',
  renewsOn: '2026-05-14',
  status: 'Active',
  features: [
    'Up to 25 team members',
    '50 GB secure storage',
    '25,000 API calls / month',
    'Unlimited lead pipelines',
    'Advanced reporting & exports',
    'Email & in-app support',
    'Custom roles & permissions',
    'Webhooks & Zapier integration',
  ],
  limits: {
    users: 25,
    storage: 50,
    apiCalls: 25000,
    emails: 10000,
    contacts: 25000,
  },
};

export const usage = {
  users: 18,
  storage: 34.2,
  apiCalls: 19420,
  emails: 7260,
  contacts: 16380,
};

export const plans = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'For solo founders getting their first leads in.',
    monthlyPrice: 0,
    yearlyPrice: 0,
    badge: null,
    cta: 'Downgrade',
    features: [
      'Up to 3 team members',
      '1 GB storage',
      '1,000 API calls / month',
      'Basic lead pipeline',
      'Community support',
    ],
    excluded: [
      'Advanced reporting',
      'Custom roles',
      'Webhooks',
      'Priority support',
    ],
    limits: {
      users: 3,
      storage: 1,
      apiCalls: 1000,
      emails: 500,
      contacts: 500,
    },
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For growing sales teams that need automation.',
    monthlyPrice: 49,
    yearlyPrice: 490,
    badge: 'Most Popular',
    cta: 'Current plan',
    features: [
      'Up to 25 team members',
      '50 GB storage',
      '25,000 API calls / month',
      'Advanced reporting & exports',
      'Custom roles & permissions',
      'Webhooks & Zapier',
      'Email & in-app support',
    ],
    excluded: [
      'Dedicated success manager',
      'SSO / SAML',
      '99.99% SLA',
    ],
    limits: {
      users: 25,
      storage: 50,
      apiCalls: 25000,
      emails: 10000,
      contacts: 25000,
    },
  },
  {
    id: 'business',
    name: 'Business',
    description: 'For scaling organizations with higher volume.',
    monthlyPrice: 149,
    yearlyPrice: 1490,
    badge: null,
    cta: 'Upgrade',
    features: [
      'Up to 100 team members',
      '500 GB storage',
      '250,000 API calls / month',
      'Advanced automation rules',
      'Audit logs & compliance exports',
      'SSO / SAML',
      'Priority support',
    ],
    excluded: ['Dedicated success manager', '99.99% SLA'],
    limits: {
      users: 100,
      storage: 500,
      apiCalls: 250000,
      emails: 100000,
      contacts: 250000,
    },
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Custom scale, security, and support for large teams.',
    monthlyPrice: null,
    yearlyPrice: null,
    badge: null,
    cta: 'Contact sales',
    features: [
      'Unlimited team members',
      'Unlimited storage',
      'Unlimited API calls',
      'Dedicated success manager',
      'Custom contracts & DPA',
      '99.99% SLA',
      '24/7 phone support',
    ],
    excluded: [],
    limits: {
      users: 'Unlimited',
      storage: 'Unlimited',
      apiCalls: 'Unlimited',
      emails: 'Unlimited',
      contacts: 'Unlimited',
    },
  },
];

export const invoices = [
  { id: 'INV-2026-0414', date: '2026-04-14', amount: 49, status: 'paid', pdfUrl: '#' },
  { id: 'INV-2026-0314', date: '2026-03-14', amount: 49, status: 'paid', pdfUrl: '#' },
  { id: 'INV-2026-0214', date: '2026-02-14', amount: 49, status: 'paid', pdfUrl: '#' },
  { id: 'INV-2026-0114', date: '2026-01-14', amount: 49, status: 'paid', pdfUrl: '#' },
  { id: 'INV-2025-1214', date: '2025-12-14', amount: 49, status: 'paid', pdfUrl: '#' },
  { id: 'INV-2025-1114', date: '2025-11-14', amount: 49, status: 'failed', pdfUrl: '#' },
  { id: 'INV-2025-1014', date: '2025-10-14', amount: 49, status: 'paid', pdfUrl: '#' },
  { id: 'INV-2025-0914', date: '2025-09-14', amount: 49, status: 'paid', pdfUrl: '#' },
  { id: 'INV-2025-0814', date: '2025-08-14', amount: 29, status: 'pending', pdfUrl: '#' },
  { id: 'INV-2025-0714', date: '2025-07-14', amount: 29, status: 'paid', pdfUrl: '#' },
];

export const paymentMethod = {
  brand: 'Visa',
  last4: '4242',
  expMonth: 9,
  expYear: 2028,
  holder: 'Vikas Sharma',
};

export const billingAddress = {
  country: 'India',
  state: 'Maharashtra',
  city: 'Mumbai',
  zip: '400001',
  line: 'Unit 412, Lodha Supremus, Powai',
};

export const faqs = [
  {
    q: 'How does proration work when I upgrade?',
    a: 'When you upgrade mid-cycle, you are only charged for the remaining days of the new plan. Any unused portion of your previous plan is credited toward your next invoice.',
  },
  {
    q: 'What happens when I downgrade my plan?',
    a: 'Downgrades take effect at the end of your current billing cycle so you keep full access to paid features until renewal. We never delete your data — overages are hidden, not removed.',
  },
  {
    q: 'Do you offer refunds?',
    a: 'Yes. All paid plans include a 30-day money-back guarantee. If you cancel within 30 days of your first charge, we will refund the full amount, no questions asked.',
  },
  {
    q: 'Which payment methods do you accept?',
    a: 'We accept all major credit and debit cards (Visa, Mastercard, Amex, Rupay), UPI, Netbanking, and can issue invoices with wire-transfer on the Business and Enterprise plans.',
  },
  {
    q: 'How do I receive invoices?',
    a: 'Invoices are emailed to your billing contact the moment each charge succeeds, and every invoice is also downloadable as a PDF from this page for up to seven years.',
  },
  {
    q: 'Do you provide an SLA?',
    a: 'Pro and Business plans include a 99.9% uptime target. Enterprise customers get a contractual 99.99% SLA with service credits and a dedicated success manager.',
  },
];

export const getInvoiceStatusColor = (status) => {
  switch (status) {
    case 'paid':
      return 'bg-accent-50 text-accent-600 border border-accent-100';
    case 'pending':
      return 'bg-warning-50 text-warning-500 border border-warning-400/30';
    case 'failed':
      return 'bg-error-50 text-error-500 border border-error-400/30';
    default:
      return 'bg-surface-bg text-surface-muted border border-surface-border';
  }
};

export const getPlanStatusColor = (status) => {
  switch (status) {
    case 'Active':
      return 'bg-accent-50 text-accent-600 border border-accent-100';
    case 'Trial':
      return 'bg-primary-50 text-primary-600 border border-primary-100';
    case 'Past Due':
      return 'bg-error-50 text-error-500 border border-error-400/30';
    default:
      return 'bg-surface-bg text-surface-muted border border-surface-border';
  }
};

export const formatUsage = (value, unit) => {
  if (unit === 'GB') return `${value} ${unit}`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return `${value}`;
};
