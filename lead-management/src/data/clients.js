// Mock clients (won leads / active customers)
export const clients = [
  { id: 1, name: 'TechNova Solutions', contact: 'Aarav Mehta',  email: 'aarav@technova.io',     phone: '+91 98765 43210', industry: 'SaaS',          city: 'Bengaluru', plan: 'Enterprise', status: 'Active',   since: '2025-11-12' },
  { id: 2, name: 'CloudOps Pvt Ltd',   contact: 'Sneha Iyer',   email: 'sneha@cloudops.in',     phone: '+91 99887 76655', industry: 'DevOps',        city: 'Pune',      plan: 'Growth',     status: 'Active',   since: '2025-09-04' },
  { id: 3, name: 'BlueWave Media',     contact: 'Vikram Singh', email: 'vikram@bluewave.com',   phone: '+91 90909 12121', industry: 'Media',         city: 'Mumbai',    plan: 'Starter',    status: 'Trial',    since: '2026-02-21' },
  { id: 4, name: 'Finlytics',          contact: 'Meera Nair',   email: 'meera@finlytics.co',    phone: '+91 98123 45678', industry: 'FinTech',       city: 'Hyderabad', plan: 'Enterprise', status: 'Active',   since: '2025-07-30' },
  { id: 5, name: 'GreenLeaf Retail',   contact: 'Karan Bhalla', email: 'karan@greenleaf.in',    phone: '+91 91111 22223', industry: 'Retail',        city: 'Delhi',     plan: 'Growth',     status: 'Active',   since: '2025-12-01' },
  { id: 6, name: 'Brightpath Edu',     contact: 'Anjali Verma', email: 'anjali@brightpath.edu', phone: '+91 93333 44445', industry: 'Education',     city: 'Jaipur',    plan: 'Starter',    status: 'Inactive', since: '2025-06-15' },
  { id: 7, name: 'Orbit Logistics',    contact: 'Rahul Kapoor', email: 'rahul@orbitlog.com',    phone: '+91 95555 66667', industry: 'Logistics',     city: 'Chennai',   plan: 'Growth',     status: 'Active',   since: '2025-10-20' },
];

export const clientStatusStyles = {
  Active:   'bg-accent-50  text-accent-600  border-accent-100',
  Trial:    'bg-primary-50 text-primary-700 border-primary-100',
  Inactive: 'bg-error-50   text-error-500   border-error-50',
};
