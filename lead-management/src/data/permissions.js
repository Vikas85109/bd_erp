// Role-based access control (RBAC) — modules × actions matrix.
// Each role has explicit permissions per module. Easy to extend.

export const modules = [
  { key: 'dashboard',  label: 'Dashboard'  },
  { key: 'leads',      label: 'Leads'      },
  { key: 'quotations', label: 'Quotations' },
  { key: 'clients',    label: 'Clients'    },
  { key: 'products',   label: 'Products'   },
  { key: 'users',      label: 'Users'      },
  { key: 'settings',   label: 'Settings'   },
];

export const actions = ['view', 'create', 'edit', 'delete'];

export const roles = ['Admin', 'Manager', 'Sales Rep', 'Support', 'Viewer'];

// true = allowed, false = denied
export const rolePermissions = {
  Admin: {
    dashboard:  { view: true, create: true,  edit: true,  delete: true  },
    leads:      { view: true, create: true,  edit: true,  delete: true  },
    quotations: { view: true, create: true,  edit: true,  delete: true  },
    clients:    { view: true, create: true,  edit: true,  delete: true  },
    products:   { view: true, create: true,  edit: true,  delete: true  },
    users:      { view: true, create: true,  edit: true,  delete: true  },
    settings:   { view: true, create: true,  edit: true,  delete: true  },
  },
  Manager: {
    dashboard:  { view: true, create: false, edit: false, delete: false },
    leads:      { view: true, create: true,  edit: true,  delete: true  },
    quotations: { view: true, create: true,  edit: true,  delete: false },
    clients:    { view: true, create: true,  edit: true,  delete: false },
    products:   { view: true, create: true,  edit: true,  delete: false },
    users:      { view: true, create: false, edit: false, delete: false },
    settings:   { view: true, create: false, edit: false, delete: false },
  },
  'Sales Rep': {
    dashboard:  { view: true, create: false, edit: false, delete: false },
    leads:      { view: true, create: true,  edit: true,  delete: false },
    quotations: { view: true, create: true,  edit: true,  delete: false },
    clients:    { view: true, create: true,  edit: false, delete: false },
    products:   { view: true, create: false, edit: false, delete: false },
    users:      { view: false,create: false, edit: false, delete: false },
    settings:   { view: false,create: false, edit: false, delete: false },
  },
  Support: {
    dashboard:  { view: true, create: false, edit: false, delete: false },
    leads:      { view: true, create: false, edit: true,  delete: false },
    quotations: { view: true, create: false, edit: false, delete: false },
    clients:    { view: true, create: false, edit: true,  delete: false },
    products:   { view: true, create: false, edit: false, delete: false },
    users:      { view: false,create: false, edit: false, delete: false },
    settings:   { view: false,create: false, edit: false, delete: false },
  },
  Viewer: {
    dashboard:  { view: true, create: false, edit: false, delete: false },
    leads:      { view: true, create: false, edit: false, delete: false },
    quotations: { view: true, create: false, edit: false, delete: false },
    clients:    { view: true, create: false, edit: false, delete: false },
    products:   { view: true, create: false, edit: false, delete: false },
    users:      { view: false,create: false, edit: false, delete: false },
    settings:   { view: false,create: false, edit: false, delete: false },
  },
};

// Helper: check if a role can perform an action on a module
export const can = (role, module, action) => {
  return Boolean(rolePermissions?.[role]?.[module]?.[action]);
};
