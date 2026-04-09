import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users as UsersIcon,
  FileText,
  UserCircle,
  Package,
  Box,
  FolderTree,
  Settings as SettingsIcon,
  Palette,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronDown,
} from 'lucide-react';

const navItems = [
  { to: '/',           icon: LayoutDashboard, label: 'Dashboard'  },
  { to: '/leads',      icon: UsersIcon,       label: 'Leads'      },
  { to: '/quotations', icon: FileText,        label: 'Quotations' },
  { to: '/clients',    icon: UserCircle,      label: 'Clients'    },
  {
    label: 'Products',
    icon: Package,
    children: [
      { to: '/products',            icon: Box,        label: 'All Products' },
      { to: '/products/categories', icon: FolderTree, label: 'Categories'   },
    ],
  },
  { to: '/users',       icon: UsersIcon,    label: 'Users & Access' },
  { to: '/branding',    icon: Palette,      label: 'Branding'       },
  { to: '/settings',    icon: SettingsIcon, label: 'Settings'    },
];

export default function Sidebar({ collapsed, onToggle }) {
  const location = useLocation();
  const isProductsActive = location.pathname.startsWith('/products');
  const [openGroups, setOpenGroups] = useState({ Products: isProductsActive });

  const toggleGroup = (label) =>
    setOpenGroups((s) => ({ ...s, [label]: !s[label] }));

  return (
    <aside
      className={`fixed left-0 top-0 z-30 flex h-screen flex-col border-r border-surface-border bg-white transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >                              
      {/* Logo */} 
      <div className="flex h-16 items-center justify-between gap-3 border-b border-surface-border px-4"> 
        <div className="flex items-center gap-2 overflow-hidden"> 
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-primary-100 bg-primary-50">
            <span className="text-sm font-bold text-primary-600">B&gt;</span>
          </div>
          {!collapsed && <h1 className="text-base font-bold text-secondary-900">BDD CRM</h1>} 
        </div>    
        <button  
          onClick={onToggle} 
          className="shrink-0 rounded-lg p-1.5 text-surface-muted transition-colors hover:bg-surface-bg hover:text-secondary-900"
        >    
          {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </button>    
      </div> 

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3">
        <div className="space-y-1">
          {navItems.map((item) => {
            // Collapsible group
            if (item.children) {
              const isOpen = openGroups[item.label];
              return (
                <div key={item.label}>
                  <button
                    onClick={() => toggleGroup(item.label)}
                    className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 font-medium text-surface-muted transition-all duration-200 hover:bg-surface-bg hover:text-secondary-800 ${
                      collapsed ? 'justify-center' : ''
                    }`}
                  >
                    <item.icon className="h-5 w-5 shrink-0 text-surface-muted group-hover:text-primary-400" />
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-left text-sm">{item.label}</span>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        />
                      </>
                    )}
                  </button>
                  {!collapsed && isOpen && (
                    <div className="ml-4 mt-1 space-y-1 border-l border-surface-border pl-2">
                      {item.children.map((child) => (
                        <NavLink
                          key={child.to}
                          to={child.to}
                          end
                          className={({ isActive }) =>
                            `group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                              isActive
                                ? 'bg-primary-50 text-primary-600'
                                : 'text-surface-muted hover:bg-surface-bg hover:text-secondary-800'
                            }`
                          }
                        >
                          <child.icon className="h-4 w-4 shrink-0" />
                          <span>{child.label}</span>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            // Regular link
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-3 py-2.5 font-medium transition-all duration-200 ${
                    isActive
                      ? 'border border-primary-100 bg-primary-50 text-primary-600'
                      : 'text-surface-muted hover:bg-surface-bg hover:text-secondary-800'
                  } ${collapsed ? 'justify-center' : ''}`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      className={`h-5 w-5 shrink-0 ${
                        isActive ? 'text-primary-500' : 'text-surface-muted group-hover:text-primary-400'
                      }`}
                    />
                    {!collapsed && <span className="text-sm">{item.label}</span>}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {!collapsed && (
        <div className="border-t border-surface-border px-4 py-3">
          <p className="text-xs text-surface-muted">© 2026 BDD CRM</p>
        </div>
      )}
    </aside>
  );
}
