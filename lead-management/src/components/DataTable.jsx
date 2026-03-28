import { useState } from 'react';
import { Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { StatusBadge, SourceBadge } from './Badge';
import { getStatusColor, getSourceColor } from '../data/leads';

export default function DataTable({ data, onRowClick }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredData = data
    .filter((lead) => {
      const matchesSearch =
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (sortDirection === 'asc') return aVal > bVal ? 1 : -1;
      return aVal < bVal ? 1 : -1;
    });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronDown className="h-4 w-4 text-gray-300" />;
    return sortDirection === 'asc' ? (
      <ChevronUp className="h-4 w-4 text-primary-600" />
    ) : (
      <ChevronDown className="h-4 w-4 text-primary-600" />
    );
  };

  const statuses = ['All', 'New', 'Contacted', 'Qualified', 'Proposal', 'Converted', 'Lost'];

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-md">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 border-b border-surface-border p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-muted" />
          <input
            type="text"
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-surface-border bg-surface-bg py-2.5 pl-10 pr-4 text-sm outline-none transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-surface-muted" />
          <div className="flex gap-1">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                  statusFilter === status
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-surface-bg text-surface-muted hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-surface-border bg-surface-bg/50">
              <th
                className="cursor-pointer px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-surface-muted"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-1">
                  Lead <SortIcon field="name" />
                </div>
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-surface-muted">
                Source
              </th>
              <th
                className="cursor-pointer px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-surface-muted"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center gap-1">
                  Status <SortIcon field="status" />
                </div>
              </th>
              <th
                className="cursor-pointer px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-surface-muted"
                onClick={() => handleSort('value')}
              >
                <div className="flex items-center gap-1">
                  Value <SortIcon field="value" />
                </div>
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-surface-muted">
                Assigned To
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-surface-muted">
                Last Contact
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border">
            {filteredData.map((lead) => (
              <tr
                key={lead.id}
                onClick={() => onRowClick?.(lead)}
                className="cursor-pointer transition-colors duration-150 hover:bg-primary-50/50"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-sm font-semibold text-white">
                      {lead.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-semibold text-secondary-900">{lead.name}</p>
                      <p className="text-sm text-surface-muted">{lead.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <SourceBadge source={lead.source} colors={getSourceColor(lead.source)} />
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={lead.status} colors={getStatusColor(lead.status)} />
                </td>
                <td className="px-6 py-4">
                  <span className="font-semibold text-secondary-800">
                    ₹{(lead.value / 1000).toFixed(0)}K
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-surface-muted">{lead.assignedTo}</td>
                <td className="px-6 py-4 text-sm text-surface-muted">{lead.lastContact}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-surface-border px-6 py-3">
        <p className="text-sm text-surface-muted">
          Showing {filteredData.length} of {data.length} leads
        </p>
        <div className="flex gap-1">
          <button className="rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-medium text-white">1</button>
          <button className="rounded-lg px-3 py-1.5 text-xs font-medium text-surface-muted hover:bg-gray-100">2</button>
          <button className="rounded-lg px-3 py-1.5 text-xs font-medium text-surface-muted hover:bg-gray-100">3</button>
        </div>
      </div>
    </div>
  );
}
