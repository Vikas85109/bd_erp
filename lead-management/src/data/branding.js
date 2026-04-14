// Default brand identity used across customer-facing surfaces
// (quotation headers, email signatures, invoice PDFs, etc.)
export const defaultBranding = {
  companyName: 'Bindass Deal',
  legalName: 'Bindass Deal Pvt. Ltd.',
  tagline: 'Smart deals. Faster closes.',
  monogram: 'BD',
  logoShape: 'rounded',
  brandColor: '#6366F1',
  accentColor: '#14B8A6',
  email: 'hello@bindassdeal.com',
  phone: '+91 98765 43210',
  website: 'www.bindassdeal.com',
  gstin: '29ABCDE1234F1Z5',
  address: '4th Floor, Skyline Tower, MG Road, Bengaluru 560001',
  social: {
    linkedin: 'company/bindassdeal',
    twitter: '@bindassdeal',
    instagram: '@bindassdeal',
  },
};

export const socialPlatforms = [
  { key: 'linkedin', label: 'LinkedIn', placeholder: 'company/your-handle' },
  { key: 'twitter', label: 'Twitter / X', placeholder: '@yourhandle' },
  { key: 'instagram', label: 'Instagram', placeholder: '@yourhandle' },
];

// Curated brand palettes for one-click application
export const colorPresets = [
  { name: 'Indigo Mist', brand: '#6366F1', accent: '#14B8A6' },
  { name: 'Sunset',      brand: '#F43F5E', accent: '#FB923C' },
  { name: 'Ocean',       brand: '#0EA5E9', accent: '#06B6D4' },
  { name: 'Forest',      brand: '#10B981', accent: '#059669' },
  { name: 'Royal',       brand: '#8B5CF6', accent: '#EC4899' },
  { name: 'Midnight',    brand: '#1E293B', accent: '#64748B' },
  { name: 'Rose Gold',   brand: '#EC4899', accent: '#F59E0B' },
  { name: 'Citrus',      brand: '#EAB308', accent: '#84CC16' },
];

// Logo tile shapes — radius is used as inline style so it composes
// with user-chosen brand colors that Tailwind cannot generate at build time
export const logoShapes = [
  { key: 'square',  label: 'Square',  radius: '6px'    },
  { key: 'rounded', label: 'Rounded', radius: '14px'   },
  { key: 'circle',  label: 'Circle',  radius: '9999px' },
];

export function getShapeRadius(shapeKey) {
  return (logoShapes.find((s) => s.key === shapeKey) || logoShapes[1]).radius;
}
