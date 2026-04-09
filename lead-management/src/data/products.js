// Mock product catalog
export const categories = [
  { id: 1, name: 'Subscriptions', slug: 'subscriptions', productsCount: 3, description: 'Recurring SaaS plans'      },
  { id: 2, name: 'Add-ons',       slug: 'add-ons',       productsCount: 2, description: 'Optional capacity packs'   },
  { id: 3, name: 'Services',      slug: 'services',      productsCount: 2, description: 'Onboarding & consulting'   },
  { id: 4, name: 'Hardware',      slug: 'hardware',      productsCount: 1, description: 'Physical devices we ship'  },
];

export const products = [
  { id: 1, sku: 'SUB-STR',  name: 'Starter Plan',         category: 'Subscriptions', price: 1999,   stock: '∞', status: 'Active'   },
  { id: 2, sku: 'SUB-GRW',  name: 'Growth Plan',          category: 'Subscriptions', price: 4999,   stock: '∞', status: 'Active'   },
  { id: 3, sku: 'SUB-ENT',  name: 'Enterprise Plan',      category: 'Subscriptions', price: 19999,  stock: '∞', status: 'Active'   },
  { id: 4, sku: 'ADD-USR',  name: 'Extra User Pack (10)', category: 'Add-ons',       price: 1500,   stock: '∞', status: 'Active'   },
  { id: 5, sku: 'ADD-STR',  name: 'Storage Pack (50GB)',  category: 'Add-ons',       price: 800,    stock: '∞', status: 'Active'   },
  { id: 6, sku: 'SVC-ONB',  name: 'Onboarding Service',   category: 'Services',      price: 25000,  stock: '∞', status: 'Active'   },
  { id: 7, sku: 'SVC-CST',  name: 'Custom Integration',   category: 'Services',      price: 75000,  stock: '∞', status: 'Active'   },
  { id: 8, sku: 'HW-SCN',   name: 'Barcode Scanner',      category: 'Hardware',      price: 4200,   stock: 24,  status: 'Inactive' },
];

export const productStatusStyles = {
  Active:   'bg-accent-50 text-accent-600 border-accent-100',
  Inactive: 'bg-error-50  text-error-500  border-error-50',
};
