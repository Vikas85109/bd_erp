import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Download,
  Upload,
  Zap,
  ZapOff,
  Globe,
  Mail,
  MessageCircle,
  Radio,
  Clock,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  User,
  Building2,
  Phone,
  IndianRupee,
  StickyNote,
  Tag,
} from 'lucide-react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import { leads as initialLeads, getStatusColor, getSourceColor, leadStatuses } from '../data/leads';

// --- Simulated auto-capture data pools ---
const firstNames = ['Aarav', 'Diya', 'Kabir', 'Ishaan', 'Saanvi', 'Aditya', 'Nisha', 'Rohan', 'Pooja', 'Karthik', 'Lakshmi', 'Manish', 'Ritu', 'Sanjay', 'Tara'];
const lastNames = ['Sharma', 'Patel', 'Gupta', 'Singh', 'Reddy', 'Jain', 'Verma', 'Nair', 'Iyer', 'Das', 'Malhotra', 'Chopra', 'Rao', 'Bose', 'Menon'];
const companies = ['NovaTech Labs', 'PrimeRetail Co', 'SwiftLogistics', 'GreenEnergy Corp', 'DataMind AI', 'UrbanBuild Infra', 'FinEdge Solutions', 'MedCare Plus', 'EduSpark Academy', 'CloudNine Systems', 'FreshHarvest Agri', 'CreativePixel Studios', 'AutoDrive Motors', 'SafeGuard Insurance', 'TravelEasy Holidays'];
const domains = ['techcorp.in', 'bizmail.com', 'startup.io', 'enterprise.co', 'solutions.dev', 'global.org', 'india.biz'];

const SOURCE_TAGS = {
  Website: 'Web Inquiry',
  Email: 'Email Lead',
  WhatsApp: 'Chat Lead',
};

const SOURCE_TABS = ['All', 'Email', 'WhatsApp', 'Website'];

const ITEMS_PER_PAGE = 8;

function generateRandomLead(id, source) {
  const first = firstNames[Math.floor(Math.random() * firstNames.length)];
  const last = lastNames[Math.floor(Math.random() * lastNames.length)];
  const company = companies[Math.floor(Math.random() * companies.length)];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  const value = Math.floor(Math.random() * 500 + 50) * 1000;
  const assignees = ['Priya Sharma', 'Amit Patel', 'Rahul Verma'];
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];

  return {
    id,
    name: `${first} ${last}`,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@${domain}`,
    phone: `+91 ${Math.floor(10000 + Math.random() * 90000)} ${Math.floor(10000 + Math.random() * 90000)}`,
    company,
    source,
    status: 'New',
    value,
    avatar: null,
    assignedTo: assignees[Math.floor(Math.random() * assignees.length)],
    createdAt: dateStr,
    lastContact: dateStr,
    notes: `Auto-captured from ${source}. Tagged as ${SOURCE_TAGS[source] || source}.`,
    tags: [SOURCE_TAGS[source] || source],
    capturedAt: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  };
}

// --- Source icon helper ---
function SourceIcon({ source, className }) {
  switch (source) {
    case 'Website':
      return <Globe className={className} />;
    case 'Email':
      return <Mail className={className} />;
    case 'WhatsApp':
      return <MessageCircle className={className} />;
    default:
      return <Globe className={className} />;
  }
}

export default function Leads() {
  const navigate = useNavigate();
  const [allLeads, setAllLeads] = useState(
    initialLeads.map((l) => ({
      ...l,
      tags: l.tags && l.tags.length > 0 ? l.tags : [SOURCE_TAGS[l.source] || l.source],
    }))
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeSourceTab, setActiveSourceTab] = useState('All');
  const [autoCapture, setAutoCapture] = useState(false);
  const [liveFeed, setLiveFeed] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const nextIdRef = useRef(initialLeads.length + 1);
  const intervalRef = useRef(null);

  // --- Form state for Add Lead modal ---
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '+91 ',
    company: '',
    source: 'Website',
    value: '',
    notes: '',
  });

  // --- Auto-capture engine ---
  const captureNewLead = useCallback(() => {
    const sources = ['Website', 'Email', 'WhatsApp'];
    const source = sources[Math.floor(Math.random() * sources.length)];
    const newLead = generateRandomLead(nextIdRef.current++, source);
    setAllLeads((prev) => [newLead, ...prev]);
    setLiveFeed((prev) => [newLead, ...prev].slice(0, 20));
    setToast({ message: `New ${source} lead captured: ${newLead.name}`, type: 'info' });
  }, []);

  useEffect(() => {
    if (autoCapture) {
      // Fire one immediately
      captureNewLead();
      intervalRef.current = setInterval(() => {
        captureNewLead();
      }, 4000 + Math.random() * 3000); // 4-7 seconds
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoCapture, captureNewLead]);

  // --- Filtering, searching, sorting ---
  const filteredLeads = allLeads
    .filter((lead) => {
      const matchesSource = activeSourceTab === 'All' || lead.source === activeSourceTab;
      const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
      const matchesSearch =
        searchTerm === '' ||
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSource && matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (sortDirection === 'asc') return aVal > bVal ? 1 : -1;
      return aVal < bVal ? 1 : -1;
    });

  // --- Pagination ---
  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedLeads = filteredLeads.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeSourceTab, statusFilter, searchTerm]);

  // --- Status change handler ---
  const handleStatusChange = (leadId, newStatus) => {
    setAllLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    );
    setToast({ message: `Lead status updated to ${newStatus}`, type: 'success' });
  };

  // --- Add lead handler ---
  const handleAddLead = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      setToast({ message: 'Name and Email are required.', type: 'error' });
      return;
    }
    const newLead = {
      id: nextIdRef.current++,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      source: formData.source,
      status: 'New',
      value: parseInt(formData.value) || 0,
      avatar: null,
      assignedTo: 'Priya Sharma',
      createdAt: new Date().toISOString().split('T')[0],
      lastContact: new Date().toISOString().split('T')[0],
      notes: formData.notes,
      tags: [SOURCE_TAGS[formData.source] || formData.source],
    };
    setAllLeads((prev) => [newLead, ...prev]);
    setShowAddModal(false);
    setFormData({ name: '', email: '', phone: '+91 ', company: '', source: 'Website', value: '', notes: '' });
    setToast({ message: 'Lead added successfully!', type: 'success' });
  };

  // --- CSV Export ---
  const handleExport = () => {
    const headers = ['Name', 'Email', 'Phone', 'Company', 'Source', 'Status', 'Value', 'Assigned To', 'Created', 'Last Contact', 'Tags', 'Notes'];
    const rows = filteredLeads.map((l) => [
      l.name,
      l.email,
      l.phone,
      l.company,
      l.source,
      l.status,
      l.value,
      l.assignedTo,
      l.createdAt,
      l.lastContact,
      (l.tags || []).join('; '),
      (l.notes || '').replace(/,/g, ' '),
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `leads_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setToast({ message: `Exported ${filteredLeads.length} leads to CSV`, type: 'success' });
  };

  // --- Sort handler ---
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronDown className="h-3.5 w-3.5 text-gray-300" />;
    return sortDirection === 'asc' ? (
      <ChevronUp className="h-3.5 w-3.5 text-primary-600" />
    ) : (
      <ChevronDown className="h-3.5 w-3.5 text-primary-600" />
    );
  };

  // --- Page numbers to render ---
  const pageNumbers = [];
  const maxVisible = 5;
  let startPage = Math.max(1, safeCurrentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);
  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }
  for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);

  const sourceTabCounts = {
    All: allLeads.length,
    Email: allLeads.filter((l) => l.source === 'Email').length,
    WhatsApp: allLeads.filter((l) => l.source === 'WhatsApp').length,
    Website: allLeads.filter((l) => l.source === 'Website').length,
  };

  const sourceTabIcons = {
    All: <Radio className="h-4 w-4" />,
    Email: <Mail className="h-4 w-4" />,
    WhatsApp: <MessageCircle className="h-4 w-4" />,
    Website: <Globe className="h-4 w-4" />,
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Leads</h1>
          <p className="mt-1 text-sm text-surface-muted">
            Manage and track all your leads in one place
            {autoCapture && (
              <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-accent-50 px-2 py-0.5 text-xs font-medium text-accent-500">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-500" />
                </span>
                Auto-capturing
              </span>
            )}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {/* Auto-Capture Toggle */}
          <button
            onClick={() => setAutoCapture((prev) => !prev)}
            className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium shadow-sm transition-all duration-200 ${
              autoCapture
                ? 'border-accent-200 bg-accent-50 text-accent-600 hover:bg-accent-100'
                : 'border-surface-border bg-white text-surface-muted hover:bg-surface-bg hover:text-secondary-900'
            }`}
          >
            {autoCapture ? <Zap className="h-4 w-4" /> : <ZapOff className="h-4 w-4" />}
            {autoCapture ? 'Auto-Capture ON' : 'Auto-Capture'}
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 rounded-xl border border-surface-border bg-white px-4 py-2.5 text-sm font-medium text-surface-muted shadow-sm transition-all duration-200 hover:bg-surface-bg hover:text-secondary-900"
          >
            <Download className="h-4 w-4" />
            Export CSV
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

      {/* Source Tabs */}
      <div className="flex items-center gap-1 rounded-xl bg-surface-bg/80 p-1 border border-surface-border w-fit">
        {SOURCE_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSourceTab(tab)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
              activeSourceTab === tab
                ? 'bg-white text-primary-600 shadow-sm border border-primary-100'
                : 'text-surface-muted hover:text-secondary-900 hover:bg-white/50'
            }`}
          >
            {sourceTabIcons[tab]}
            {tab}
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                activeSourceTab === tab ? 'bg-primary-50 text-primary-600' : 'bg-surface-bg text-surface-muted'
              }`}
            >
              {sourceTabCounts[tab]}
            </span>
          </button>
        ))}
      </div>

      {/* Main Content: Table + Live Feed Side Panel */}
      <div className="flex gap-5">
        {/* Left: Table Area */}
        <div className="flex-1 min-w-0">
          <div className="overflow-hidden rounded-2xl bg-white shadow-md">
            {/* Toolbar: Search + Status Filter */}
            <div className="flex flex-col gap-4 border-b border-surface-border p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-muted" />
                <input
                  type="text"
                  placeholder="Search by name, email, or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-surface-border bg-surface-bg py-2.5 pl-10 pr-4 text-sm outline-none transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-surface-muted" />
                <div className="flex gap-1 flex-wrap">
                  {['All', ...leadStatuses].map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                        statusFilter === status
                          ? 'bg-primary-50 text-primary-600 border border-primary-100'
                          : 'bg-surface-bg text-surface-muted hover:bg-gray-100'
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
                      Tags
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {paginatedLeads.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-sm text-surface-muted">
                        No leads found matching your filters.
                      </td>
                    </tr>
                  ) : (
                    paginatedLeads.map((lead) => {
                      const statusColors = getStatusColor(lead.status);
                      const sourceColors = getSourceColor(lead.source);
                      return (
                        <tr
                          key={lead.id}
                          className="cursor-pointer transition-colors duration-150 hover:bg-primary-50/50"
                        >
                          <td className="px-6 py-4" onClick={() => navigate(`/leads/${lead.id}`)}>
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 border border-primary-100 text-sm font-semibold text-primary-600">
                                {lead.name
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')}
                              </div>
                              <div>
                                <p className="font-semibold text-secondary-900">{lead.name}</p>
                                <p className="text-sm text-surface-muted">{lead.company || lead.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${sourceColors.bg} ${sourceColors.text}`}
                            >
                              <SourceIcon source={lead.source} className="h-3 w-3" />
                              {lead.source}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={lead.status}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleStatusChange(lead.id, e.target.value);
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className={`rounded-lg border-0 px-2.5 py-1 text-xs font-semibold outline-none cursor-pointer transition-all duration-200 focus:ring-2 focus:ring-primary-500/20 ${statusColors.bg} ${statusColors.text}`}
                            >
                              {leadStatuses.map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-6 py-4" onClick={() => navigate(`/leads/${lead.id}`)}>
                            <span className="font-semibold text-secondary-800">
                              {lead.value > 0 ? `₹${(lead.value / 1000).toFixed(0)}K` : '—'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-surface-muted" onClick={() => navigate(`/leads/${lead.id}`)}>
                            {lead.assignedTo}
                          </td>
                          <td className="px-6 py-4" onClick={() => navigate(`/leads/${lead.id}`)}>
                            <div className="flex flex-wrap gap-1">
                              {(lead.tags || []).slice(0, 2).map((tag) => (
                                <span
                                  key={tag}
                                  className="inline-flex items-center rounded-md bg-surface-bg px-2 py-0.5 text-[10px] font-medium text-surface-muted border border-surface-border"
                                >
                                  {tag}
                                </span>
                              ))}
                              {(lead.tags || []).length > 2 && (
                                <span className="text-[10px] text-surface-muted">+{lead.tags.length - 2}</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="flex items-center justify-between border-t border-surface-border px-6 py-3">
              <p className="text-sm text-surface-muted">
                Showing {filteredLeads.length === 0 ? 0 : (safeCurrentPage - 1) * ITEMS_PER_PAGE + 1}
                {' '}-{' '}
                {Math.min(safeCurrentPage * ITEMS_PER_PAGE, filteredLeads.length)} of{' '}
                {filteredLeads.length} leads
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={safeCurrentPage === 1}
                  className="rounded-lg p-1.5 text-surface-muted transition-colors hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {pageNumbers.map((num) => (
                  <button
                    key={num}
                    onClick={() => setCurrentPage(num)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                      safeCurrentPage === num
                        ? 'bg-primary-50 border border-primary-100 text-primary-600'
                        : 'text-surface-muted hover:bg-gray-100'
                    }`}
                  >
                    {num}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safeCurrentPage === totalPages}
                  className="rounded-lg p-1.5 text-surface-muted transition-colors hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Feed Panel */}
        <div className="hidden xl:block w-80 flex-shrink-0">
          <div className="sticky top-6 overflow-hidden rounded-2xl bg-white shadow-md border border-surface-border">
            <div className="flex items-center gap-2 border-b border-surface-border bg-surface-bg/50 px-4 py-3">
              <div className="relative flex h-2 w-2">
                <span className={`absolute inline-flex h-full w-full rounded-full ${autoCapture ? 'animate-ping bg-accent-400 opacity-75' : 'bg-gray-300'}`} />
                <span className={`relative inline-flex h-2 w-2 rounded-full ${autoCapture ? 'bg-accent-500' : 'bg-gray-400'}`} />
              </div>
              <h3 className="text-sm font-semibold text-secondary-900">Live Capture Feed</h3>
              <span className="ml-auto rounded-full bg-surface-bg px-2 py-0.5 text-[10px] font-bold text-surface-muted border border-surface-border">
                {liveFeed.length}
              </span>
            </div>
            <div className="max-h-[calc(100vh-280px)] overflow-y-auto">
              {liveFeed.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <div className="mb-3 rounded-full bg-surface-bg p-3">
                    <Zap className="h-5 w-5 text-surface-muted" />
                  </div>
                  <p className="text-sm font-medium text-surface-muted">No captured leads yet</p>
                  <p className="mt-1 text-xs text-surface-muted/70">
                    Toggle Auto-Capture to start receiving leads
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-surface-border">
                  {liveFeed.map((lead, idx) => {
                    const sourceColors = getSourceColor(lead.source);
                    return (
                      <div
                        key={`${lead.id}-${idx}`}
                        className={`px-4 py-3 transition-all duration-300 hover:bg-primary-50/30 cursor-pointer ${
                          idx === 0 ? 'bg-accent-50/30' : ''
                        }`}
                        onClick={() => navigate(`/leads/${lead.id}`)}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${sourceColors.bg}`}
                          >
                            <SourceIcon source={lead.source} className={`h-3.5 w-3.5 ${sourceColors.text}`} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-secondary-900">{lead.name}</p>
                            <p className="truncate text-xs text-surface-muted">{lead.company}</p>
                            <div className="mt-1 flex items-center gap-2">
                              <span
                                className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold ${sourceColors.bg} ${sourceColors.text}`}
                              >
                                {SOURCE_TAGS[lead.source]}
                              </span>
                              <span className="flex items-center gap-1 text-[10px] text-surface-muted">
                                <Clock className="h-2.5 w-2.5" />
                                {lead.capturedAt}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Lead Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Lead">
        <form onSubmit={handleAddLead} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-secondary-800">
                <User className="h-3.5 w-3.5 text-surface-muted" />
                Full Name <span className="text-error-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Enter full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-xl border border-surface-border px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-secondary-800">
                <Mail className="h-3.5 w-3.5 text-surface-muted" />
                Email <span className="text-error-400">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="Enter email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-xl border border-surface-border px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-secondary-800">
                <Phone className="h-3.5 w-3.5 text-surface-muted" />
                Phone
              </label>
              <input
                type="tel"
                placeholder="+91"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full rounded-xl border border-surface-border px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-secondary-800">
                <Building2 className="h-3.5 w-3.5 text-surface-muted" />
                Company
              </label>
              <input
                type="text"
                placeholder="Company name"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full rounded-xl border border-surface-border px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-secondary-800">
                <Globe className="h-3.5 w-3.5 text-surface-muted" />
                Source
              </label>
              <select
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className="w-full rounded-xl border border-surface-border px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              >
                <option>Website</option>
                <option>Email</option>
                <option>WhatsApp</option>
                <option>Phone</option>
                <option>Referral</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-secondary-800">
                <IndianRupee className="h-3.5 w-3.5 text-surface-muted" />
                Expected Value
              </label>
              <input
                type="number"
                placeholder="e.g. 250000"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                className="w-full rounded-xl border border-surface-border px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-secondary-800">
              <StickyNote className="h-3.5 w-3.5 text-surface-muted" />
              Notes
            </label>
            <textarea
              rows={3}
              placeholder="Any additional notes..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full rounded-xl border border-surface-border px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          {/* Auto-tag preview */}
          <div className="rounded-xl bg-surface-bg/80 border border-surface-border px-4 py-3">
            <div className="flex items-center gap-2 text-xs text-surface-muted">
              <Tag className="h-3.5 w-3.5" />
              <span>Auto-tag:</span>
              <span className="rounded-md bg-primary-50 px-2 py-0.5 text-[11px] font-semibold text-primary-600 border border-primary-100">
                {SOURCE_TAGS[formData.source] || formData.source}
              </span>
            </div>
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
