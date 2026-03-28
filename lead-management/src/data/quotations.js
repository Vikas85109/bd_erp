export const quotations = [
  {
    id: 'Q-2847',
    leadName: 'Meera Nair',
    company: 'HealthPlus Clinics',
    date: '2026-03-24',
    validUntil: '2026-04-24',
    status: 'Sent',
    items: [
      { description: 'Enterprise Plan - Annual', quantity: 1, rate: 240000, amount: 240000 },
      { description: 'Additional Users (25)', quantity: 25, rate: 2000, amount: 50000 },
      { description: 'Priority Support', quantity: 1, rate: 30000, amount: 30000 },
    ],
    subtotal: 320000,
    tax: 57600,
    total: 377600,
  },
  {
    id: 'Q-2846',
    leadName: 'Vikram Singh',
    company: 'BuildFast Construction',
    date: '2026-03-22',
    validUntil: '2026-04-22',
    status: 'Draft',
    items: [
      { description: 'Enterprise Plan - Annual', quantity: 1, rate: 240000, amount: 240000 },
      { description: 'Additional Users (50)', quantity: 50, rate: 1800, amount: 90000 },
      { description: 'Custom Integration', quantity: 1, rate: 80000, amount: 80000 },
      { description: 'Training & Onboarding', quantity: 1, rate: 40000, amount: 40000 },
    ],
    subtotal: 450000,
    tax: 81000,
    total: 531000,
  },
];

export const quotationStatuses = ['Draft', 'Sent', 'Approved', 'Rejected', 'Expired'];
