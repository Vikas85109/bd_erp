import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Plus, MoreHorizontal, Eye, Pencil, Shield, ShieldCheck, Trash2, X, ChevronDown,
  Save, RotateCcw, CreditCard, Headphones, Users2, UserCog,
} from 'lucide-react';
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
const PERM_ACTIONS = ['read', 'create', 'update', 'delete'];

const defaultPerms = () => {
  const map = {};
  RESOURCES.forEach((r) => { map[r.key] = { read: true, create: false, update: false, delete: false }; });
  map.dashboard = { read: true, create: true, update: true, delete: true };
  map.followups.create = true;
  return map;
};

// Role icon + color mapping
const ROLE_CONFIG = {
  'Super Admin': { icon: ShieldCheck, color: 'text-purple-600' },
  'Manager':     { icon: Users2,      color: 'text-blue-600' },
  'Billing':     { icon: CreditCard,  color: 'text-emerald-600' },
  'Support':     { icon: Headphones,  color: 'text-amber-600' },
  'Employee':    { icon: UserCog,     color: 'text-secondary-600' },
};

function getRoleIcon(role) {
  return ROLE_CONFIG[role] || ROLE_CONFIG['Employee'];
}

export default function Users() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [userList, setUserList] = useState(initialUsers);
  const [openMenu, setOpenMenu] = useState(null);
  const [toast, setToast] = useState(null);

  // Modals
  const [viewUser, setViewUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [roleUser, setRoleUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [permUser, setPermUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Forms
  const [editForm, setEditForm] = useState({ name: '', email: '', role: '' });
  const [newRole, setNewRole] = useState('');
  const [addForm, setAddForm] = useState({ name: '', email: '', role: 'Employee' });
  const [perms, setPerms] = useState(defaultPerms());

  const menuRef = useRef(null);

  // Filtering
  const filtered = userList.filter((u) => {
    const matchesQuery = u.name.toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase());
    const matchesRole = roleFilter === 'All Roles' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'All Status' || u.status === statusFilter;
    return matchesQuery && matchesRole && matchesStatus;
  });

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpenMenu(null);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Handlers
  const handleView = (user) => { setViewUser(user); setOpenMenu(null); };

  const handleEditOpen = (user) => {
    setEditForm({ name: user.name, email: user.email, role: user.role });
    setEditUser(user);
    setOpenMenu(null);
  };

  const handleEditSave = () => {
    if (!editForm.name.trim() || !editForm.email.trim()) return;
    setUserList((prev) => prev.map((u) => u.id === editUser.id ? { ...u, name: editForm.name.trim(), email: editForm.email.trim(), role: editForm.role } : u));
    setEditUser(null);
    setToast({ message: 'User updated successfully', type: 'success' });
  };

  const handleRoleOpen = (user) => { setNewRole(user.role); setRoleUser(user); setOpenMenu(null); };

  const handleRoleSave = () => {
    setUserList((prev) => prev.map((u) => u.id === roleUser.id ? { ...u, role: newRole } : u));
    setRoleUser(null);
    setToast({ message: 'Role updated successfully', type: 'success' });
  };

  const handleDeleteOpen = (user) => { setDeleteUser(user); setOpenMenu(null); };

  const handleDeleteConfirm = () => {
    setUserList((prev) => prev.filter((u) => u.id !== deleteUser.id));
    setDeleteUser(null);
    setToast({ message: 'User deleted successfully', type: 'success' });
  };

  const handleToggleStatus = (user) => {
    const next = user.status === 'Active' ? 'Suspended' : 'Active';
    setUserList((prev) => prev.map((u) => u.id === user.id ? { ...u, status: next } : u));
    setOpenMenu(null);
    setToast({ message: `User ${next === 'Active' ? 'activated' : 'suspended'}`, type: 'success' });
  };

  const handlePermOpen = (user) => { setPerms(defaultPerms()); setPermUser(user); setOpenMenu(null); };

  const handlePermSave = () => {
    setToast({ message: `Permissions saved for ${permUser.name}`, type: 'success' });
    setPermUser(null);
  };

  const handleAddUser = () => {
    if (!addForm.name.trim() || !addForm.email.trim()) return;
    const now = new Date();
    const newUser = {
      id: Date.now(),
      name: addForm.name.trim(),
      email: addForm.email.trim(),
      role: addForm.role,
      status: 'Active',
      joined: now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      lastLogin: 'Never',
    };
    setUserList((prev) => [newUser, ...prev]);
    setShowAddModal(false);
    setAddForm({ name: '', email: '', role: 'Employee' });
    setToast({ message: 'User added successfully', type: 'success' });
  };

  const togglePerm = (resKey, action) => {
    setPerms((p) => ({ ...p, [resKey]: { ...p[resKey], [action]: !p[resKey][action] } }));
  };
  const toggleAllPerm = (resKey) => {
    const allOn = PERM_ACTIONS.every((a) => perms[resKey][a]);
    setPerms((p) => ({ ...p, [resKey]: PERM_ACTIONS.reduce((acc, a) => ({ ...acc, [a]: !allOn }), {}) }));
  };
  const isAllPerm = (resKey) => PERM_ACTIONS.every((a) => perms[resKey][a]);

  const roleBadge = (role) => {
    const cfg = getRoleIcon(role);
    return cfg.color;
  };

  const menuItems = (user) => [
    { icon: Eye, label: 'View Profile', onClick: () => handleView(user) },
    { icon: Pencil, label: 'Edit User', onClick: () => { setOpenMenu(null); navigate(`/users/${user.id}/edit`); } },
    { icon: Shield, label: 'Change Role', onClick: () => handleRoleOpen(user) },
    { icon: Shield, label: 'Manage Permissions', onClick: () => { setOpenMenu(null); navigate(`/users/${user.id}/edit`); } },
    {
      icon: user.status === 'Active' ? X : Eye,
      label: user.status === 'Active' ? 'Suspend' : 'Activate',
      onClick: () => handleToggleStatus(user),
      disabled: !!user.currentSession,
    },
    { icon: Trash2, label: 'Delete', onClick: () => handleDeleteOpen(user), danger: true, disabled: !!user.currentSession },
  ];

  const selectCls = 'appearance-none rounded-xl border border-surface-border bg-white py-2.5 pl-4 pr-9 text-sm font-medium text-secondary-800 focus:outline-none focus:ring-2 focus:ring-primary-100 cursor-pointer';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Admin Users</h1>
          <p className="text-sm text-surface-muted mt-1">Manage admin accounts</p>
        </div>
        <button onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 transition-colors">
          <Plus className="h-4 w-4" /> Add Admin
        </button>
      </div>

      {/* Toolbar — Search + Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-muted" />
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or email..."
            className="w-full rounded-xl border border-surface-border bg-white py-2.5 pl-10 pr-4 text-sm placeholder:text-surface-muted focus:outline-none focus:ring-2 focus:ring-primary-100" />
        </div>
        <div className="relative">
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className={selectCls}>
            <option>All Roles</option>
            {ROLE_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-muted pointer-events-none" />
        </div>
        <div className="relative">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={selectCls}>
            <option>All Status</option>
            <option>Active</option>
            <option>Suspended</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-muted pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-surface-border bg-white overflow-visible">
        <table className="w-full">
          <thead>
            <tr className="border-b border-surface-border bg-surface-bg/40">
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-surface-muted uppercase tracking-wider rounded-tl-2xl">Admin</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-surface-muted uppercase tracking-wider">Role</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-surface-muted uppercase tracking-wider">Status</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-surface-muted uppercase tracking-wider">Last Login</th>
              <th className="px-6 py-3.5 rounded-tr-2xl"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border">
            {filtered.map((u) => {
              const roleConfig = getRoleIcon(u.role);
              const RoleIcon = roleConfig.icon;
              return (
                <tr key={u.id} className="hover:bg-surface-bg/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-50 border border-primary-100 text-sm font-semibold text-primary-600">
                        {getInitials(u.name)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-secondary-900 truncate">{u.name}</p>
                          {u.currentSession && (
                            <span className="rounded-full border border-primary-200 bg-primary-50 px-2 py-0.5 text-[10px] font-semibold text-primary-600">
                              Current Session
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-surface-muted truncate">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <RoleIcon className={`h-4 w-4 ${roleConfig.color}`} />
                      <span className="text-sm font-medium text-secondary-800">{u.role}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${
                      u.status === 'Active'
                        ? 'bg-accent-50 text-accent-600 border-accent-100'
                        : 'bg-error-50 text-error-500 border-error-100'
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${u.status === 'Active' ? 'bg-accent-500' : 'bg-error-400'}`}></span>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-surface-muted">{u.lastLogin}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="relative inline-block" ref={openMenu === u.id ? menuRef : null}>
                      <button onClick={() => setOpenMenu(openMenu === u.id ? null : u.id)}
                        className="text-surface-muted hover:text-secondary-900 p-1 rounded-lg hover:bg-surface-bg">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                      {openMenu === u.id && <DropdownMenu items={menuItems(u)} />}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-surface-muted">No users found.</p>
          </div>
        )}
      </div>

      {/* ── View Profile Modal ── */}
      <Modal isOpen={!!viewUser} onClose={() => setViewUser(null)} title="User Profile">
        {viewUser && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary-50 border border-primary-100 text-lg font-bold text-primary-600">
                {getInitials(viewUser.name)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-secondary-900">{viewUser.name}</h3>
                <p className="text-sm text-surface-muted">{viewUser.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-surface-bg/60 p-3">
                <p className="text-xs text-surface-muted mb-1">Role</p>
                <div className="flex items-center gap-2">
                  {(() => { const cfg = getRoleIcon(viewUser.role); const I = cfg.icon; return <I className={`h-4 w-4 ${cfg.color}`} />; })()}
                  <span className="text-sm font-medium text-secondary-900">{viewUser.role}</span>
                </div>
              </div>
              <div className="rounded-xl bg-surface-bg/60 p-3">
                <p className="text-xs text-surface-muted mb-1">Status</p>
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${viewUser.status === 'Active' ? 'bg-accent-50 text-accent-600 border-accent-100' : 'bg-error-50 text-error-500 border-error-100'}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${viewUser.status === 'Active' ? 'bg-accent-500' : 'bg-error-400'}`}></span>
                  {viewUser.status}
                </span>
              </div>
              <div className="rounded-xl bg-surface-bg/60 p-3">
                <p className="text-xs text-surface-muted mb-1">Joined</p>
                <p className="text-sm font-medium text-secondary-900">{viewUser.joined}</p>
              </div>
              <div className="rounded-xl bg-surface-bg/60 p-3">
                <p className="text-xs text-surface-muted mb-1">Last Login</p>
                <p className="text-sm font-medium text-secondary-900">{viewUser.lastLogin}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Edit User Modal ── */}
      <Modal
        isOpen={!!editUser}
        onClose={() => setEditUser(null)}
        title="Edit User"
        footer={
          <div className="flex justify-end gap-3">
            <button onClick={() => setEditUser(null)} className="rounded-xl border border-surface-border px-4 py-2 text-sm font-medium text-secondary-800 hover:bg-surface-bg">Cancel</button>
            <button onClick={handleEditSave} className="rounded-xl bg-primary-500 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600">Save Changes</button>
          </div>
        }
      >
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
            <div>
              <label className="block text-sm font-medium text-secondary-800 mb-1.5">Role</label>
              <div className="relative">
                <select value={editForm.role} onChange={(e) => setEditForm((f) => ({ ...f, role: e.target.value }))}
                  className="w-full appearance-none rounded-xl border border-surface-border bg-white px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary-100">
                  {ROLE_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-muted pointer-events-none" />
              </div>
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

      {/* ── Manage Permissions Modal ── */}
      {permUser && (
        <PermissionsModal
          user={permUser} perms={perms}
          onToggle={togglePerm} onToggleAll={toggleAllPerm} isAll={isAllPerm}
          onReset={() => setPerms(defaultPerms())} onSave={handlePermSave} onClose={() => setPermUser(null)}
        />
      )}

      {/* ── Delete Modal ── */}
      <Modal isOpen={!!deleteUser} onClose={() => setDeleteUser(null)} title="Delete User">
        {deleteUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl bg-error-50 border border-error-100 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white border border-error-100">
                <Trash2 className="h-5 w-5 text-error-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-secondary-900">Are you sure?</p>
                <p className="text-xs text-surface-muted">This will permanently delete <span className="font-medium text-secondary-800">{deleteUser.name}</span>.</p>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setDeleteUser(null)} className="rounded-xl border border-surface-border px-4 py-2 text-sm font-medium text-secondary-800 hover:bg-surface-bg">Cancel</button>
              <button onClick={handleDeleteConfirm} className="rounded-xl bg-error-500 px-4 py-2 text-sm font-semibold text-white hover:bg-error-400">Delete User</button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Add Admin Modal ── */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Admin"
        footer={
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowAddModal(false)} className="rounded-xl border border-surface-border px-4 py-2 text-sm font-medium text-secondary-800 hover:bg-surface-bg">Cancel</button>
            <button onClick={handleAddUser} className="rounded-xl bg-primary-500 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600">Add Admin</button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary-800 mb-1.5">Full Name</label>
            <input type="text" value={addForm.name} onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))} placeholder="Enter full name"
              className="w-full rounded-xl border border-surface-border bg-white px-4 py-2.5 text-sm placeholder:text-surface-muted focus:outline-none focus:ring-2 focus:ring-primary-100" />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-800 mb-1.5">Email</label>
            <input type="email" value={addForm.email} onChange={(e) => setAddForm((f) => ({ ...f, email: e.target.value }))} placeholder="Enter email address"
              className="w-full rounded-xl border border-surface-border bg-white px-4 py-2.5 text-sm placeholder:text-surface-muted focus:outline-none focus:ring-2 focus:ring-primary-100" />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-800 mb-1.5">Role</label>
            <div className="relative">
              <select value={addForm.role} onChange={(e) => setAddForm((f) => ({ ...f, role: e.target.value }))}
                className="w-full appearance-none rounded-xl border border-surface-border bg-white px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary-100">
                {ROLE_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-muted pointer-events-none" />
            </div>
          </div>
        </div>
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

/* ── Permissions Modal ── */
function PermissionsModal({ user, perms, onToggle, onToggleAll, isAll, onReset, onSave, onClose }) {
  const roleConfig = getRoleIcon(user.role);
  const RoleIcon = roleConfig.icon;
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl bg-white/95 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-surface-border p-5 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-50 border border-primary-100 text-sm font-semibold text-primary-600">
                {getInitials(user.name)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-secondary-900 truncate">{user.name}</h2>
                  <div className="flex items-center gap-1">
                    <RoleIcon className={`h-3.5 w-3.5 ${roleConfig.color}`} />
                    <span className="text-xs font-medium text-secondary-600">{user.role}</span>
                  </div>
                </div>
                <p className="text-xs text-surface-muted truncate">{user.email}</p>
              </div>
            </div>
            <button onClick={onClose} className="rounded-lg p-1.5 text-surface-muted hover:bg-gray-100 hover:text-secondary-900">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="overflow-y-auto overflow-x-auto flex-1 min-h-0">
            <table className="w-full">
              <thead className="sticky top-0 z-10">
                <tr className="border-b border-surface-border bg-surface-bg">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-surface-muted uppercase tracking-wider">Resource</th>
                  {PERM_ACTIONS.map((a) => (
                    <th key={a} className="px-3 py-3 text-center text-xs font-semibold text-surface-muted uppercase tracking-wider">{a}</th>
                  ))}
                  <th className="px-3 py-3 text-center text-xs font-semibold text-surface-muted uppercase tracking-wider">All</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {RESOURCES.map((r) => (
                  <tr key={r.key} className="hover:bg-surface-bg/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-semibold text-secondary-900">{r.name}</p>
                      <p className="text-xs text-surface-muted">{r.desc}</p>
                    </td>
                    {PERM_ACTIONS.map((a) => (
                      <td key={a} className="px-3 py-3.5 text-center">
                        <PermCheckbox checked={perms[r.key][a]} onChange={() => onToggle(r.key, a)} />
                      </td>
                    ))}
                    <td className="px-3 py-3.5 text-center">
                      <PermCheckbox checked={isAll(r.key)} onChange={() => onToggleAll(r.key)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-end gap-2 border-t border-surface-border p-4 shrink-0">
            <button onClick={onReset} className="flex items-center gap-2 rounded-xl border border-surface-border bg-white px-3 py-2 text-sm font-medium text-secondary-800 hover:bg-surface-bg">
              <RotateCcw className="h-4 w-4" />Reset
            </button>
            <button onClick={onClose} className="rounded-xl border border-surface-border px-4 py-2 text-sm font-medium text-secondary-800 hover:bg-surface-bg">Cancel</button>
            <button onClick={onSave} className="flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600">
              <Save className="h-4 w-4" />Save Permissions
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function PermCheckbox({ checked, onChange }) {
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
    <div className="absolute right-0 top-full mt-1 z-30 w-52 rounded-xl border border-surface-border bg-white py-1.5 shadow-lg">
      {items.map((item, i) => {
        const Icon = item.icon;
        if (item.disabled) {
          return (
            <span key={i} className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-surface-muted/50 cursor-not-allowed" title="Cannot perform on current session">
              <Icon className="h-4 w-4" /> {item.label}
            </span>
          );
        }
        return (
          <button key={i} onClick={item.onClick}
            className={`flex w-full items-center gap-2.5 px-4 py-2 text-sm transition-colors ${item.danger ? 'text-error-500 hover:bg-error-50' : 'text-secondary-800 hover:bg-surface-bg'}`}>
            <Icon className="h-4 w-4" /> {item.label}
          </button>
        );
      })}
    </div>
  );
}
