export const users = [
  {
    id: 1,
    name: 'Pranjali Shrikhande',
    email: 'pranjali@yopmail.com',
    role: 'EMPLOYEE',
    status: 'Active',
    joined: '6 Apr 2026',
  },
  {
    id: 2,
    name: 'Vikas Sharma',
    email: 'vikassharma85109@gmail.com',
    role: 'EMPLOYEE',
    status: 'Active',
    joined: '4 Apr 2026',
  },
  {
    id: 3,
    name: 'Admin User',
    email: 'admin@bindassdeal.com',
    role: 'SUPER_ADMIN',
    status: 'Active',
    joined: '2 Apr 2026',
  },
];

export const getInitials = (name) =>
  name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
