import { useState, useRef, useEffect } from 'react';
import { Search, RotateCcw, Save, MoreVertical, Eye, Pencil, Shield, Trash2, ChevronDown } from 'lucide-react';
import { users as initialUsers, getInitials, ROLE_OPTIONS } from '../data/users';
import Modal from '../components/Modal';
import Toast from '../components/Toast';

const RESOURCES = [
  { key: 'dashboard', name: 'Dashboard', desc: 'View dashboard analytics' },
  { key: 'leads', name: 'Leads', desc: 'Manage sales leads' },
  { key: 'followups', name: 'Follow-ups', desc: 'Manage lead follow-ups' },
  { key: 'quotations', name: 'Quotations', desc: 'Manage quotations' },
  { key: 'clients', name: 'Clients', desc: 'Manage client organizations' },
  { key: 'products', name: 'Products', desc: 'Manage product catalog' },
  { key: 'users', name: 'Users', desc: 'Manage team members' },
];

const ACTIONS = ['read', 'create', 'update', 'delete'];

const defaultPerms = () => {
  const map = {};
  RESOURCES.forEach((r) => {
    map[r.key] = { read: true, create: false, update: false, delete: false };
  });
  map.dashboard = { read: true, create: true, update: true, delete: true };
  map.followups.create = true;
  return map;
};

export default function Permissions() {
  const [userList, setUserList] = useState(initialUsers);
  const [selectedId, setSelectedId] = useState(userList[0].id);
  const [query, setQuery] = useState('');
  const [perms, setPerms] = useState(defaultPerms());
  const [openMenu, setOpenMenu] = useState(null);
  const [toast, setToast] = useState(null);

  // Modal states
  const [viewUser, setViewUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '' });
  const [roleUser, setRoleUser] = useState(null);
  const [newRole, setNewRole] = useState('');
  const [deleteUser, setDeleteUser] = useState(null);

  const menuRef = useRef(null);

  const selected = userList.find((u) => u.id === selectedId);
  const filtered = userList.filter(
    (u) =>
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const toggle = (resKey, action) => {
    setPerms((p) => ({ ...p, [resKey]: { ...p[resKey], [action]: !p[resKey][action] } }));
  };

  const toggleAll = (resKey) => {
    const allOn = ACTIONS.every((a) => perms[resKey][a]);
    setPerms((p) => ({ ...p, [resKey]: ACTIONS.reduce((acc, a) => ({ ...acc, [a]: !allOn }), {}) }));
  };

  const isAll = (resKey) => ACTIONS.every((a) => perms[resKey][a]);

  const roleBadge = (role) =>
    role === 'Super Admin'
      ? 'bg-primary-50 text-primary-600 border border-primary-100'
      : 'bg-surface-bg text-secondary-800 border border-surface-border';

  // Handlers
  const handleView = (user) => { setViewUser(user); setOpenMenu(null); };

  const handleEditOpen = (user) => {
    setEditForm({ name: user.name, email: user.email });
    setEditUser(user);
    setOpenMenu(null);
  };

  const handleEditSave = () => {
    if (!editForm.name.trim() || !editForm.email.trim()) return;
    setUserList((prev) =>
      prev.map((u) => u.id === editUser.id ? { ...u, name: editForm.name.trim(), email: editForm.email.trim() } : u)
    );
    setEditUser(null);
    setToast({ message: 'User updated successfully', type: 'success' });
  };

  const handleRoleOpen = (user) => {
    setNewRole(user.role);
    setRoleUser(user);
    setOpenMenu(null);
  };

  const handleRoleSave = () => {
    setUserList((prev) => prev.map((u) => u.id === roleUser.id ? { ...u, role: newRole } : u));
    setRoleUser(null);
    setToast({ message: 'Role updated successfully', type: 'success' });
  };

  const handleDeleteOpen = (user) => { setDeleteUser(user); setOpenMenu(null); };

  const handleDeleteConfirm = () => {
    const id = deleteUser.id;
    setUserList((prev) => prev.filter((u) => u.id !== id));
    if (selectedId === id) {
      const remaining = userList.filter((u) => u.id !== id);
      if (remaining.length > 0) setSelectedId(remaining[0].id);
    }
    setDeleteUser(null);
    setToast({ message: 'User deleted successfully', type: 'success' });
  };

  const handleSavePerms = () => {
    setToast({ message: `Permissions saved for ${selected.name}`, type: 'success' });
  };

  const menuItems = (user) => [
    { icon: Eye, label: 'View Profile', onClick: () => handleView(user) },
    { icon: Pencil, label: 'Edit User', onClick: () => handleEditOpen(user) },
    { icon: Shield, label: 'Change Role', onClick: () => handleRoleOpen(user) },
    { icon: Trash2, label: 'Delete', onClick: () => handleDeleteOpen(user), danger: true },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Permissions</h1>
        <p className="text-sm text-surface-muted mt-1">Manage user permissions and access control</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        {/* User list */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-muted" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search users..."
              className="w-full rounded-xl border border-surface-border bg-white py-2.5 pl-10 pr-4 text-sm placeholder:text-surface-muted focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div className="space-y-2">
            {filtered.map((u) => {
              const active = u.id === selectedId;
              return (
                <div
                  key={u.id}
                  className={`relative rounded-xl border px-4 py-3 transition-all ${
                    active
                      ? 'border-primary-200 bg-primary-50/60 ring-1 ring-primary-100'
                      : 'border-surface-border bg-white hover:bg-surface-bg/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <button onClick={() => setSelectedId(u.id)} className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-semibold text-secondary-900 truncate">{u.name}</p>
                      <p className="text-xs text-surface-muted truncate">{u.email}</p>
                    </button>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide ${roleBadge(u.role)}`}>{u.role}</span>
                      <div className="relative" ref={openMenu === u.id ? menuRef : null}>
                        <button
                          onClick={(e) => { e.stopPropagation(); setOpenMenu(openMenu === u.id ? null : u.id); }}
                          className="text-surface-muted hover:text-secondary-900 p-1 rounded-lg hover:bg-surface-bg/80"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        {openMenu === u.id && <DropdownMenu items={menuItems(u)} />}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Permissions panel */}
        {selected && (
          <div className="rounded-2xl border border-surface-border bg-white">
            <div className="flex items-start justify-between gap-4 border-b border-surface-border p-5">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-50 border border-primary-100 text-sm font-semibold text-primary-600">
                  {getInitials(selected.name)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-secondary-900 truncate">{selected.name}</h2>
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide ${roleBadge(selected.role)}`}>{selected.role}</span>
                  </div>
                  <p className="text-xs text-surface-muted truncate">{selected.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => setPerms(defaultPerms())} className="flex items-center gap-2 rounded-xl border border-surface-border bg-white px-3 py-2 text-sm font-medium text-secondary-800 hover:bg-surface-bg">
                  <RotateCcw className="h-4 w-4" />Reset to Defaults
                </button>
                <button onClick={handleSavePerms} className="flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600">
                  <Save className="h-4 w-4" />Save
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-border bg-surface-bg/40">
                    <th className="px-5 py-3 text-left text-xs font-semibold text-surface-muted uppercase tracking-wider">Resource</th>
                    <th className="px-3 py-3 text-center text-xs font-semibold text-surface-muted uppercase tracking-wider">Read</th>
                    <th className="px-3 py-3 text-center text-xs font-semibold text-surface-muted uppercase tracking-wider">Create</th>
                    <th className="px-3 py-3 text-center text-xs font-semibold text-surface-muted uppercase tracking-wider">Update</th>
                    <th className="px-3 py-3 text-center text-xs font-semibold text-surface-muted uppercase tracking-wider">Delete</th>
                    <th className="px-3 py-3 text-center text-xs font-semibold text-surface-muted uppercase tracking-wider">All</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {RESOURCES.map((r) => (
                    <tr key={r.key} className="hover:bg-surface-bg/30 transition-colors">
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-secondary-900">{r.name}</p>
                        <p className="text-xs text-surface-muted">{r.desc}</p>
                      </td>
                      {ACTIONS.map((a) => (
                        <td key={a} className="px-3 py-4 text-center">
                          <Checkbox checked={perms[r.key][a]} onChange={() => toggle(r.key, a)} />
                        </td>
                      ))}
                      <td className="px-3 py-4 text-center">
                        <Checkbox checked={isAll(r.key)} onChange={() => toggleAll(r.key)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ── View Profile Modal ── */}
      <Modal isOpen={!!viewUser} onClose={() => setViewUser(null)} title="User Profile">
        {viewUser && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary-50 border border-primary-100 text-lg font-bold text-primary-600">{getInitials(viewUser.name)}</div>
              <div>
                <h3 className="text-lg font-bold text-secondary-900">{viewUser.name}</h3>
                <p className="text-sm text-surface-muted">{viewUser.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-surface-bg/60 p-3">
                <p className="text-xs text-surface-muted mb-1">Role</p>
                <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide ${roleBadge(viewUser.role)}`}>{viewUser.role}</span>
              </div>
              <div className="rounded-xl bg-surface-bg/60 p-3">
                <p className="text-xs text-surface-muted mb-1">Status</p>
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${viewUser.status === 'Active' ? 'bg-accent-50 text-accent-600 border-accent-100' : 'bg-error-50 text-error-500 border-error-100'}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${viewUser.status === 'Active' ? 'bg-accent-500' : 'bg-error-400'}`}></span>
                  {viewUser.status}
                </span>
              </div>
              <div className="rounded-xl bg-surface-bg/60 p-3 col-span-2">
                <p className="text-xs text-surface-muted mb-1">Joined</p>
                <p className="text-sm font-medium text-secondary-900">{viewUser.joined}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Edit User Modal ── */}
      <Modal isOpen={!!editUser} onClose={() => setEditUser(null)} title="Edit User">
        {editUser && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary-800 mb-1.5">Name</label>
              <input type="text" value={editForm.name} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full rounded-xl border border-surface-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-800 mb-1.5">Email</label>
              <input type="email" value={editForm.email} onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full rounded-xl border border-surface-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-100" />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setEditUser(null)} className="rounded-xl border border-surface-border px-4 py-2 text-sm font-medium text-secondary-800 hover:bg-surface-bg">Cancel</button>
              <button onClick={handleEditSave} className="rounded-xl bg-primary-500 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600">Save Changes</button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Change Role Modal ── */}
      <Modal isOpen={!!roleUser} onClose={() => setRoleUser(null)} title="Change Role">
        {roleUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl bg-surface-bg/60 p-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-50 border border-primary-100 text-sm font-semibold text-primary-600">{getInitials(roleUser.name)}</div>
              <div>
                <p className="text-sm font-semibold text-secondary-900">{roleUser.name}</p>
                <p className="text-xs text-surface-muted">{roleUser.email}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-800 mb-1.5">Select Role</label>
              <div className="relative">
                <select value={newRole} onChange={(e) => setNewRole(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-surface-border bg-white px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary-100">
                  {ROLE_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-muted pointer-events-none" />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setRoleUser(null)} className="rounded-xl border border-surface-border px-4 py-2 text-sm font-medium text-secondary-800 hover:bg-surface-bg">Cancel</button>
              <button onClick={handleRoleSave} className="rounded-xl bg-primary-500 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600">Update Role</button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Delete Confirmation Modal ── */}
      <Modal isOpen={!!deleteUser} onClose={() => setDeleteUser(null)} title="Delete User">
        {deleteUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl bg-error-50 border border-error-100 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white border border-error-100">
                <Trash2 className="h-5 w-5 text-error-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-secondary-900">Are you sure?</p>
                <p className="text-xs text-surface-muted">This will permanently delete <span className="font-medium text-secondary-800">{deleteUser.name}</span>. This action cannot be undone.</p>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setDeleteUser(null)} className="rounded-xl border border-surface-border px-4 py-2 text-sm font-medium text-secondary-800 hover:bg-surface-bg">Cancel</button>
              <button onClick={handleDeleteConfirm} className="rounded-xl bg-error-500 px-4 py-2 text-sm font-semibold text-white hover:bg-error-400">Delete User</button>
            </div>
          </div>
        )}
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

function Checkbox({ checked, onChange }) {
  return (
    <button type="button" onClick={onChange}
      className={`inline-flex h-5 w-5 items-center justify-center rounded-md border transition-all ${checked ? 'bg-primary-500 border-primary-500 text-white' : 'bg-white border-surface-border hover:border-primary-300'}`}>
      {checked && (
        <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.42l-7.5 7.5a1 1 0 01-1.42 0l-3.5-3.5a1 1 0 011.42-1.42L8.5 12.08l6.79-6.79a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      )}
    </button>
  );
}

function DropdownMenu({ items }) {
  return (
    <div className="absolute right-0 top-full mt-1 z-30 w-48 rounded-xl border border-surface-border bg-white py-1.5 shadow-lg">
      {items.map((item, i) => {
        const Icon = item.icon;
        return (
          <button key={i} onClick={item.onClick}
            className={`flex w-full items-center gap-2.5 px-4 py-2 text-sm transition-colors ${item.danger ? 'text-error-500 hover:bg-error-50' : 'text-secondary-800 hover:bg-surface-bg'}`}>
            <Icon className="h-4 w-4" />
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
