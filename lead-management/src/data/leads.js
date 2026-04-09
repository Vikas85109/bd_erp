// Mock leads data
export const leads = [
  { id: 1, name: 'Aarav Mehta',   company: 'TechNova Solutions', email: 'aarav@technova.io',     phone: '+91 98765 43210', source: 'Website',   status: 'New',       value: 125000, owner: 'Priya Sharma', createdAt: '2026-04-02' },
  { id: 2, name: 'Sneha Iyer',    company: 'CloudOps Pvt Ltd',   email: 'sneha@cloudops.in',     phone: '+91 99887 76655', source: 'Referral',  status: 'Contacted', value: 86000,  owner: 'Rohan Patel',  createdAt: '2026-04-03' },
  { id: 3, name: 'Vikram Singh',  company: 'BlueWave Media',     email: 'vikram@bluewave.com',   phone: '+91 90909 12121', source: 'LinkedIn',  status: 'Qualified', value: 240000, owner: 'Priya Sharma', createdAt: '2026-04-04' },
  { id: 4, name: 'Meera Nair',    company: 'Finlytics',          email: 'meera@finlytics.co',    phone: '+91 98123 45678', source: 'Cold Call', status: 'Proposal',  value: 310000, owner: 'Aditya Rao',   createdAt: '2026-04-05' },
  { id: 5, name: 'Karan Bhalla',  company: 'GreenLeaf Retail',   email: 'karan@greenleaf.in',    phone: '+91 91111 22223', source: 'Website',   status: 'Won',       value: 175000, owner: 'Rohan Patel',  createdAt: '2026-04-05' },
  { id: 6, name: 'Anjali Verma',  company: 'Brightpath Edu',     email: 'anjali@brightpath.edu', phone: '+91 93333 44445', source: 'Event',     status: 'Lost',      value: 64000,  owner: 'Priya Sharma', createdAt: '2026-04-06' },
  { id: 7, name: 'Rahul Kapoor',  company: 'Orbit Logistics',    email: 'rahul@orbitlog.com',    phone: '+91 95555 66667', source: 'Referral',  status: 'Contacted', value: 198000, owner: 'Aditya Rao',   createdAt: '2026-04-07' },
  { id: 8, name: 'Divya Reddy',   company: 'PixelForge Studio',  email: 'divya@pixelforge.io',   phone: '+91 97777 88889', source: 'Website',   status: 'Qualified', value: 142000, owner: 'Priya Sharma', createdAt: '2026-04-08' },
];

export const leadStatuses = ['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost'];

export const statusStyles = {
  New:       'bg-primary-50 text-primary-700 border-primary-100',
  Contacted: 'bg-accent-50  text-accent-600  border-accent-100',
  Qualified: 'bg-warning-50 text-warning-500 border-warning-50',
  Proposal:  'bg-primary-50 text-primary-600 border-primary-100',
  Won:       'bg-accent-50  text-accent-600  border-accent-100',
  Lost:      'bg-error-50   text-error-500   border-error-50',
};
