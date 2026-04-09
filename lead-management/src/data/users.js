// Mock app users
export const users = [
  { id: 1, name: 'Priya Sharma',  email: 'priya@bddcrm.io',  role: 'Admin',        status: 'Active',  lastActive: '2026-04-09' },
  { id: 2, name: 'Rohan Patel',   email: 'rohan@bddcrm.io',  role: 'Manager',      status: 'Active',  lastActive: '2026-04-09' },
  { id: 3, name: 'Aditya Rao',    email: 'aditya@bddcrm.io', role: 'Sales Rep',    status: 'Active',  lastActive: '2026-04-08' },
  { id: 4, name: 'Neha Kulkarni', email: 'neha@bddcrm.io',   role: 'Sales Rep',    status: 'Active',  lastActive: '2026-04-07' },
  { id: 5, name: 'Imran Sheikh',  email: 'imran@bddcrm.io',  role: 'Support',      status: 'Invited', lastActive: '—'         },
  { id: 6, name: 'Tanya Desai',   email: 'tanya@bddcrm.io',  role: 'Viewer',       status: 'Inactive',lastActive: '2026-03-12' },
];

export const userStatusStyles = {
  Active:   'bg-accent-50  text-accent-600  border-accent-100',
  Invited:  'bg-primary-50 text-primary-700 border-primary-100',
  Inactive: 'bg-error-50   text-error-500   border-error-50',
};

export const roleStyles = {
  Admin:       'bg-primary-50 text-primary-700 border-primary-100',
  Manager:     'bg-accent-50  text-accent-600  border-accent-100',
  'Sales Rep': 'bg-warning-50 text-warning-500 border-warning-50',
  Support:     'bg-surface-bg text-secondary-700 border-surface-border',
  Viewer:      'bg-surface-bg text-secondary-700 border-surface-border',
};
