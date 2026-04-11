export const users = [
  {
    id: 1,
    name: 'Pranjali Shrikhande',
    email: 'pranjali@yopmail.com',
    role: 'Support',
    status: 'Active',
    joined: '6 Apr 2026',
    lastLogin: '09/04/2026, 17:43:07',
  },
  {
    id: 2,
    name: 'Vikas Sharma',
    email: 'vikassharma85109@gmail.com',
    role: 'Manager',
    status: 'Active',
    joined: '4 Apr 2026',
    lastLogin: '09/04/2026, 17:38:16',
  },
  {
    id: 3,
    name: 'Admin User',
    email: 'admin@bindassdeal.com',
    role: 'Super Admin',
    status: 'Active',
    joined: '2 Apr 2026',
    lastLogin: '10/04/2026, 19:38:14',
    currentSession: true,
  },
  {
    id: 4,
    name: 'Rahul Mehta',
    email: 'rahul@yopmail.com',
    role: 'Billing',
    status: 'Active',
    joined: '3 Apr 2026',
    lastLogin: '08/04/2026, 18:55:36',
  },
  {
    id: 5,
    name: 'Sneha Patil',
    email: 'sneha@yopmail.com',
    role: 'Employee',
    status: 'Suspended',
    joined: '5 Apr 2026',
    lastLogin: '01/04/2026, 10:22:45',
  },
];

export const ROLE_OPTIONS = ['Super Admin', 'Manager', 'Billing', 'Support', 'Employee'];

export const getInitials = (name) =>
  name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
