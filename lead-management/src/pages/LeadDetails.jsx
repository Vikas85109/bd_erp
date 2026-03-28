import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  ArrowLeft, Mail, Phone, Building2, Calendar, Tag,
  Clock, CalendarCheck,
} from 'lucide-react';
import TaskCard from '../components/TaskCard';
import { StatusBadge } from '../components/Badge';
import { leads, getStatusColor, leadStatuses } from '../data/leads';
import { getLeadFollowups } from '../data/followups';

export default function LeadDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const lead = leads.find((l) => l.id === parseInt(id));
  const [status, setStatus] = useState(lead?.status || 'New');
  const [note, setNote] = useState('');
  const leadFollowups = getLeadFollowups(lead?.id);

  if (!lead) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-6xl">🔍</div>
        <h2 className="mt-4 text-xl font-bold text-secondary-900">Lead not found</h2>
        <p className="mt-2 text-surface-muted">The lead you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/leads')}
          className="mt-6 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-primary-700"
        >
          Back to Leads
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/leads')}
          className="rounded-xl p-2 text-surface-muted transition-all duration-200 hover:bg-surface-bg hover:text-secondary-900"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-secondary-900">{lead.name}</h1>
            <StatusBadge status={status} colors={getStatusColor(status)} />
          </div>
          <p className="mt-1 text-sm text-surface-muted">{lead.company}</p>
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-xl border border-surface-border bg-white px-4 py-2.5 text-sm font-medium outline-none transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
        >
          {leadStatuses.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Split Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Left Panel - Lead Info */}
        <div className="space-y-6 lg:col-span-2">
          {/* Contact Info Card */}
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <h2 className="text-lg font-bold text-secondary-900">Contact Information</h2>
            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
                  <Mail className="h-4 w-4 text-secondary-800" />
                </div>
                <div>
                  <p className="text-xs text-surface-muted">Email</p>
                  <p className="text-sm font-medium text-secondary-900">{lead.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
                  <Phone className="h-4 w-4 text-secondary-800" />
                </div>
                <div>
                  <p className="text-xs text-surface-muted">Phone</p>
                  <p className="text-sm font-medium text-secondary-900">{lead.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
                  <Building2 className="h-4 w-4 text-secondary-800" />
                </div>
                <div>
                  <p className="text-xs text-surface-muted">Company</p>
                  <p className="text-sm font-medium text-secondary-900">{lead.company}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
                  <Calendar className="h-4 w-4 text-secondary-800" />
                </div>
                <div>
                  <p className="text-xs text-surface-muted">Created</p>
                  <p className="text-sm font-medium text-secondary-900">{lead.createdAt}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
                  <Clock className="h-4 w-4 text-secondary-800" />
                </div>
                <div>
                  <p className="text-xs text-surface-muted">Last Contact</p>
                  <p className="text-sm font-medium text-secondary-900">{lead.lastContact}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <h2 className="text-lg font-bold text-secondary-900">Tags</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {lead.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full bg-primary-50 border border-primary-100 px-3 py-1 text-xs font-medium text-primary-500"
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Deal Value */}
          <div className="rounded-2xl bg-primary-50 border border-primary-100 p-6 shadow-sm">
            <p className="text-sm font-medium text-surface-muted">Deal Value</p>
            <p className="mt-1 text-3xl font-bold text-primary-600">₹{(lead.value / 1000).toFixed(0)}K</p>
            <p className="mt-2 text-sm text-surface-muted">Assigned to {lead.assignedTo}</p>
          </div>

          {/* Notes */}
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <h2 className="text-lg font-bold text-secondary-900">Notes</h2>
            <p className="mt-2 text-sm text-surface-muted">{lead.notes}</p>
            <div className="mt-4">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note..."
                rows={3}
                className="w-full rounded-xl border border-surface-border px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              />
              <button className="mt-2 rounded-lg bg-primary-500 px-4 py-2 text-xs font-medium text-white transition-all hover:bg-primary-600">
                Save Note
              </button>
            </div>
          </div>

        </div>

        {/* Right Panel - Follow-ups */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl bg-white shadow-md">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-surface-border px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                  <CalendarCheck className="h-5 w-5 text-secondary-800" />
                </div>
                <div>
                  <h3 className="font-semibold text-secondary-900">Follow-ups for {lead.name}</h3>
                  <p className="text-xs text-surface-muted">{lead.company}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-primary-50 border border-primary-100 px-3 py-1 text-xs font-medium text-primary-500">
                  {leadFollowups.filter((f) => !f.completed).length} pending
                </span>
                <span className="rounded-full bg-accent-50 border border-accent-100 px-3 py-1 text-xs font-medium text-accent-500">
                  {leadFollowups.filter((f) => f.completed).length} done
                </span>
              </div>
            </div>

            {/* Follow-up Tasks */}
            <div className="p-6">
              {leadFollowups.length > 0 ? (
                <div className="space-y-3">
                  {leadFollowups.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
                    <CalendarCheck className="h-7 w-7 text-secondary-800" />
                  </div>
                  <p className="mt-4 font-medium text-secondary-800">No follow-ups yet</p>
                  <p className="mt-1 text-sm text-surface-muted">Create a follow-up task for {lead.name}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
