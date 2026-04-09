// Mock quotations data
export const quotations = [
  { id: 'Q-2841', client: 'TechNova Solutions', contact: 'Aarav Mehta',  amount: 125000, status: 'Draft',    issuedAt: '2026-04-02', validTill: '2026-04-30' },
  { id: 'Q-2842', client: 'CloudOps Pvt Ltd',   contact: 'Sneha Iyer',   amount: 86000,  status: 'Sent',     issuedAt: '2026-04-03', validTill: '2026-05-03' },
  { id: 'Q-2843', client: 'BlueWave Media',     contact: 'Vikram Singh', amount: 240000, status: 'Sent',     issuedAt: '2026-04-04', validTill: '2026-05-04' },
  { id: 'Q-2844', client: 'Finlytics',          contact: 'Meera Nair',   amount: 310000, status: 'Accepted', issuedAt: '2026-04-05', validTill: '2026-05-05' },
  { id: 'Q-2845', client: 'GreenLeaf Retail',   contact: 'Karan Bhalla', amount: 175000, status: 'Accepted', issuedAt: '2026-04-05', validTill: '2026-05-05' },
  { id: 'Q-2846', client: 'Brightpath Edu',     contact: 'Anjali Verma', amount: 64000,  status: 'Rejected', issuedAt: '2026-04-06', validTill: '2026-05-06' },
  { id: 'Q-2847', client: 'Orbit Logistics',    contact: 'Rahul Kapoor', amount: 198000, status: 'Sent',     issuedAt: '2026-04-07', validTill: '2026-05-07' },
  { id: 'Q-2848', client: 'PixelForge Studio',  contact: 'Divya Reddy',  amount: 142000, status: 'Draft',    issuedAt: '2026-04-08', validTill: '2026-05-08' },
];

export const quotationStatuses = ['Draft', 'Sent', 'Accepted', 'Rejected'];

export const quotationStatusStyles = {
  Draft:    'bg-surface-bg text-secondary-700 border-surface-border',
  Sent:     'bg-primary-50 text-primary-700  border-primary-100',
  Accepted: 'bg-accent-50  text-accent-600   border-accent-100',
  Rejected: 'bg-error-50   text-error-500    border-error-50',
};
