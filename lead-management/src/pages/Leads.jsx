import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Download, Upload } from 'lucide-react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import { leads } from '../data/leads';

export default function Leads() {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast] = useState(null);

  const handleRowClick = (lead) => {
    navigate(`/leads/${lead.id}`);
  };

  const handleAddLead = (e) => {
    e.preventDefault();
    setShowAddModal(false);
    setToast({ message: 'Lead added successfully!', type: 'success' });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Leads</h1>
          <p className="mt-1 text-sm text-surface-muted">Manage and track all your leads in one place</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 rounded-xl border border-surface-border bg-white px-4 py-2.5 text-sm font-medium text-surface-muted shadow-sm transition-all duration-200 hover:bg-surface-bg hover:text-secondary-900">
            <Upload className="h-4 w-4" />
            Import
          </button>
          <button className="flex items-center gap-2 rounded-xl border border-surface-border bg-white px-4 py-2.5 text-sm font-medium text-surface-muted shadow-sm transition-all duration-200 hover:bg-surface-bg hover:text-secondary-900">
            <Download className="h-4 w-4" />
            Export
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-xl bg-primary-500 hover:bg-primary-600 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-primary-500/15 transition-all duration-200 hover:shadow-lg hover:shadow-primary-500/20 hover:-translate-y-0.5"
          >
            <Plus className="h-4 w-4" />
            Add Lead
          </button>
        </div>
      </div>

      {/* Data Table */}
      <DataTable data={leads} onRowClick={handleRowClick} />

      {/* Add Lead Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Lead">
        <form onSubmit={handleAddLead} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-secondary-800">Full Name</label>
              <input
                type="text"
                placeholder="Enter full name"
                className="w-full rounded-xl border border-surface-border px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-secondary-800">Email</label>
              <input
                type="email"
                placeholder="Enter email"
                className="w-full rounded-xl border border-surface-border px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-secondary-800">Phone</label>
              <input
                type="tel"
                placeholder="+91"
                className="w-full rounded-xl border border-surface-border px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-secondary-800">Company</label>
              <input
                type="text"
                placeholder="Company name"
                className="w-full rounded-xl border border-surface-border px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-secondary-800">Source</label>
              <select className="w-full rounded-xl border border-surface-border px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20">
                <option>Website</option>
                <option>Email</option>
                <option>WhatsApp</option>
                <option>Phone</option>
                <option>Referral</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-secondary-800">Expected Value</label>
              <input
                type="number"
                placeholder="₹"
                className="w-full rounded-xl border border-surface-border px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-secondary-800">Notes</label>
            <textarea
              rows={3}
              placeholder="Any additional notes..."
              className="w-full rounded-xl border border-surface-border px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="rounded-xl border border-surface-border px-5 py-2.5 text-sm font-medium text-surface-muted transition-all duration-200 hover:bg-surface-bg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-primary-500 hover:bg-primary-600 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-primary-500/15 transition-all duration-200 hover:shadow-lg"
            >
              Add Lead
            </button>
          </div>
        </form>
      </Modal>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
