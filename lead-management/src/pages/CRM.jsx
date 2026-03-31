import { useState, useCallback } from 'react';
import {
  Kanban,
  TrendingUp,
  IndianRupee,
  Users,
  ChevronRight,
  ChevronLeft,
  Eye,
  StickyNote,
  Plus,
  MessageSquare,
  Mail,
  Globe,
  FileText,
  BarChart3,
  Target,
  ArrowRightLeft,
  Trophy,
  Clock,
} from 'lucide-react';
import { pipelineStages, formatCurrency } from '../data/crm';
import { quotations } from '../data/quotations';
import Toast from '../components/Toast';
import Modal from '../components/Modal';

const STAGE_ORDER = ['new', 'qualified', 'proposal', 'converted'];
const STAGE_PROBABILITY = { new: 0.1, qualified: 0.3, proposal: 0.6, converted: 1.0 };
const PRIORITY_COLORS = { high: 'bg-red-400', medium: 'bg-amber-400', low: 'bg-emerald-400' };
const CHANNEL_ICONS = { whatsapp: MessageSquare, email: Mail, website: Globe };

// Seed data for conversations
const initialConversations = {
  1: { channel: 'whatsapp', snippet: 'Hi, I wanted to know more about your enterprise plan pricing...', full: 'Hi, I wanted to know more about your enterprise plan pricing. We have about 40 users and need CRM + invoicing modules. Can you share a proposal?', date: '2 hours ago' },
  3: { channel: 'email', snippet: 'Thanks for the demo yesterday. Our team is reviewing the features...', full: 'Thanks for the demo yesterday. Our team is reviewing the features and we should have a decision by next week. Could you send over the contract terms in the meantime?', date: '1 day ago' },
  4: { channel: 'email', snippet: 'We have approved the quotation Q-2847. Please proceed with...', full: 'We have approved the quotation Q-2847. Please proceed with the onboarding process. Our IT team is available from Monday for integration setup.', date: '3 hours ago' },
  5: { channel: 'whatsapp', snippet: 'The system is working great! Can we add 10 more user licenses?', full: 'The system is working great! Can we add 10 more user licenses? Also interested in your analytics module for crop yield tracking.', date: '5 hours ago' },
  6: { channel: 'website', snippet: 'Submitted inquiry via contact form about student management...', full: 'Submitted inquiry via contact form about student management module. Looking for bulk enrollment, attendance tracking, and parent portal features for 500+ students.', date: '1 day ago' },
  7: { channel: 'email', snippet: 'Reviewing the proposal now. Can we schedule a call to discuss...', full: 'Reviewing the proposal now. Can we schedule a call to discuss the compliance module requirements? We need SOC 2 and RBI compliance features for our fintech operations.', date: '6 hours ago' },
  9: { channel: 'whatsapp', snippet: 'Need fleet tracking integration. Is that available?', full: 'Need fleet tracking integration with GPS. Is that available as an add-on? We manage 200+ delivery vehicles and need real-time route optimization.', date: '4 hours ago' },
  10: { channel: 'website', snippet: 'Interested in cloud infrastructure monitoring dashboards...', full: 'Interested in cloud infrastructure monitoring dashboards. We need multi-cloud support for AWS, Azure, and GCP with automated alerting and cost optimization.', date: '30 min ago' },
};

function assignPriority(lead) {
  if (lead.value >= 400000) return 'high';
  if (lead.value >= 200000) return 'medium';
  return 'low';
}

export default function CRM() {
  // Deep clone pipeline stages into state
  const [stages, setStages] = useState(() =>
    pipelineStages.map((s) => ({
      ...s,
      leads: s.leads.map((l) => ({ ...l, priority: assignPriority(l), notes: [] })),
    }))
  );
  const [toast, setToast] = useState(null);
  const [detailLead, setDetailLead] = useState(null);
  const [noteLead, setNoteLead] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [addLeadStage, setAddLeadStage] = useState(null);
  const [newLead, setNewLead] = useState({ name: '', company: '', value: '', source: 'Website' });
  const [expandedConvo, setExpandedConvo] = useState(null);

  // Computed values
  const allLeads = stages.flatMap((s) => s.leads);
  const totalLeads = allLeads.length;
  const totalValue = allLeads.reduce((sum, l) => sum + l.value, 0);
  const convertedCount = stages.find((s) => s.id === 'converted')?.leads.length || 0;
  const conversionRate = totalLeads > 0 ? ((convertedCount / totalLeads) * 100).toFixed(1) : 0;
  const avgDealSize = totalLeads > 0 ? Math.round(totalValue / totalLeads) : 0;
  const weightedValue = stages.reduce(
    (sum, s) => sum + s.leads.reduce((v, l) => v + l.value * STAGE_PROBABILITY[s.id], 0),
    0
  );

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  // Move lead between stages
  const moveLead = useCallback(
    (leadId, fromStageId, direction) => {
      const fromIdx = STAGE_ORDER.indexOf(fromStageId);
      const toIdx = fromIdx + direction;
      if (toIdx < 0 || toIdx >= STAGE_ORDER.length) return;

      setStages((prev) => {
        const next = prev.map((s) => ({ ...s, leads: [...s.leads] }));
        const fromStage = next.find((s) => s.id === STAGE_ORDER[fromIdx]);
        const toStage = next.find((s) => s.id === STAGE_ORDER[toIdx]);
        const leadIndex = fromStage.leads.findIndex((l) => l.id === leadId);
        if (leadIndex === -1) return prev;

        const [lead] = fromStage.leads.splice(leadIndex, 1);
        lead.daysInStage = 0;
        toStage.leads.push(lead);
        return next;
      });

      const lead = allLeads.find((l) => l.id === leadId);
      const toStage = stages.find((s) => s.id === STAGE_ORDER[toIdx]);
      if (lead && toStage) {
        showToast(`Moved ${lead.name} to ${toStage.title}`);
      }
    },
    [allLeads, stages, showToast]
  );

  // Add note to lead
  const addNote = useCallback(() => {
    if (!noteLead || !noteText.trim()) return;
    setStages((prev) =>
      prev.map((s) => ({
        ...s,
        leads: s.leads.map((l) =>
          l.id === noteLead.id ? { ...l, notes: [...(l.notes || []), { text: noteText, date: new Date().toLocaleDateString() }] } : l
        ),
      }))
    );
    showToast(`Note added to ${noteLead.name}`, 'info');
    setNoteLead(null);
    setNoteText('');
  }, [noteLead, noteText, showToast]);

  // Add new lead
  const handleAddLead = useCallback(() => {
    if (!newLead.name.trim() || !addLeadStage) return;
    const value = parseInt(newLead.value) || 0;
    const lead = {
      id: Date.now(),
      name: newLead.name,
      company: newLead.company || 'Unknown',
      value,
      daysInStage: 0,
      priority: assignPriority({ value }),
      notes: [],
      source: newLead.source,
    };
    setStages((prev) =>
      prev.map((s) => (s.id === addLeadStage ? { ...s, leads: [...s.leads, lead] } : s))
    );
    showToast(`Added ${lead.name} to pipeline`);
    setAddLeadStage(null);
    setNewLead({ name: '', company: '', value: '', source: 'Website' });
  }, [newLead, addLeadStage, showToast]);

  // Stage conversion rates
  const stageConversions = STAGE_ORDER.slice(0, -1).map((stageId, i) => {
    const from = stages.find((s) => s.id === stageId)?.leads.length || 0;
    const to = stages.find((s) => s.id === STAGE_ORDER[i + 1])?.leads.length || 0;
    const rate = from + to > 0 ? Math.round((to / (from + to)) * 100) : 0;
    return { from: stageId, to: STAGE_ORDER[i + 1], rate };
  });

  const winRate = totalLeads > 0 ? ((convertedCount / totalLeads) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">CRM Pipeline</h1>
        <p className="mt-1 text-sm text-surface-muted">
          Manage your sales pipeline with real-time tracking
        </p>
      </div>

      {/* Pipeline Summary Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { icon: Users, label: 'Total Leads', value: totalLeads, bg: 'bg-primary-50', iconColor: 'text-primary-400' },
          { icon: IndianRupee, label: 'Pipeline Value', value: formatCurrency(totalValue), bg: 'bg-accent-50', iconColor: 'text-accent-400' },
          { icon: TrendingUp, label: 'Conversion Rate', value: `${conversionRate}%`, bg: 'bg-violet-50', iconColor: 'text-violet-400' },
          { icon: Target, label: 'Avg Deal Size', value: formatCurrency(avgDealSize), bg: 'bg-amber-50', iconColor: 'text-amber-500' },
          { icon: BarChart3, label: 'Weighted Value', value: formatCurrency(weightedValue), bg: 'bg-sky-50', iconColor: 'text-sky-500' },
        ].map((stat) => (
          <div key={stat.label} className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-md">
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.bg}`}>
              <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
            </div>
            <div>
              <p className="text-xl font-bold text-secondary-900">{stat.value}</p>
              <p className="text-xs text-surface-muted">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Kanban Board */}
      <div className="overflow-x-auto rounded-2xl bg-white p-6 shadow-md">
        <div className="flex gap-5" style={{ minWidth: '1100px' }}>
          {stages.map((stage) => {
            const stageIdx = STAGE_ORDER.indexOf(stage.id);
            const stageValue = stage.leads.reduce((sum, l) => sum + l.value, 0);
            return (
              <div key={stage.id} className="flex w-72 shrink-0 flex-col rounded-2xl bg-surface-bg">
                {/* Column Header */}
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`h-3 w-3 rounded-full bg-linear-to-r ${stage.gradient}`} />
                      <h3 className="font-semibold text-secondary-900">{stage.title}</h3>
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-surface-muted">
                        {stage.leads.length}
                      </span>
                    </div>
                    <button
                      onClick={() => setAddLeadStage(stage.id)}
                      className="rounded-lg p-1 text-surface-muted transition-colors hover:bg-gray-200 hover:text-secondary-900"
                      title="Add lead"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="mt-1 text-sm text-surface-muted">{formatCurrency(stageValue)} total</p>
                </div>

                {/* Cards */}
                <div className="flex flex-col gap-3 p-2 pt-0" style={{ minHeight: '120px' }}>
                  {stage.leads.map((lead) => (
                    <div
                      key={lead.id}
                      className="rounded-xl bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-2">
                          <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${PRIORITY_COLORS[lead.priority]}`} title={`${lead.priority} priority`} />
                          <div>
                            <h4 className="font-semibold text-secondary-900">{lead.name}</h4>
                            <p className="text-xs text-surface-muted">{lead.company}</p>
                          </div>
                        </div>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-primary-100 bg-primary-50 text-xs font-bold text-primary-500">
                          {lead.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-sm font-semibold text-primary-500">
                          {formatCurrency(lead.value)}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-surface-muted">
                          <Clock className="h-3 w-3" />
                          {lead.daysInStage}d
                        </span>
                      </div>

                      {/* Quick actions */}
                      <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                        <div className="flex items-center gap-1">
                          {stageIdx > 0 && (
                            <button
                              onClick={() => moveLead(lead.id, stage.id, -1)}
                              className="rounded-md p-1 text-surface-muted transition-colors hover:bg-gray-100 hover:text-secondary-900"
                              title={`Move to ${stages[stageIdx - 1]?.title}`}
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </button>
                          )}
                          {stageIdx < STAGE_ORDER.length - 1 && (
                            <button
                              onClick={() => moveLead(lead.id, stage.id, 1)}
                              className="rounded-md p-1 text-surface-muted transition-colors hover:bg-gray-100 hover:text-secondary-900"
                              title={`Move to ${stages[stageIdx + 1]?.title}`}
                            >
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setDetailLead(lead)}
                            className="rounded-md p-1 text-surface-muted transition-colors hover:bg-gray-100 hover:text-primary-500"
                            title="View details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setNoteLead(lead)}
                            className="rounded-md p-1 text-surface-muted transition-colors hover:bg-gray-100 hover:text-amber-500"
                            title="Add note"
                          >
                            <StickyNote className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Grid: Conversations + Quotations + Metrics */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Conversation Monitor */}
        <div className="rounded-2xl bg-white p-6 shadow-md lg:col-span-1">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-secondary-900">
            <MessageSquare className="h-5 w-5 text-primary-400" />
            Conversations
          </h2>
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {allLeads.map((lead) => {
              const convo = initialConversations[lead.id];
              if (!convo) return null;
              const ChannelIcon = CHANNEL_ICONS[convo.channel] || Globe;
              const isExpanded = expandedConvo === lead.id;
              return (
                <div
                  key={lead.id}
                  className="cursor-pointer rounded-xl border border-gray-100 p-3 transition-all hover:border-primary-200 hover:bg-primary-50/30"
                  onClick={() => setExpandedConvo(isExpanded ? null : lead.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100">
                      <ChannelIcon className="h-3.5 w-3.5 text-surface-muted" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-secondary-900">{lead.name}</p>
                        <span className="text-xs text-surface-muted">{convo.date}</span>
                      </div>
                      <p className="mt-0.5 truncate text-xs text-surface-muted">
                        {isExpanded ? convo.full : convo.snippet}
                      </p>
                      {isExpanded && (
                        <p className="mt-2 rounded-lg bg-gray-50 p-2 text-xs leading-relaxed text-secondary-700">
                          {convo.full}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quotation History */}
        <div className="rounded-2xl bg-white p-6 shadow-md lg:col-span-1">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-secondary-900">
            <FileText className="h-5 w-5 text-accent-400" />
            Recent Quotations
          </h2>
          <div className="space-y-3">
            {quotations.map((q) => {
              const statusColors = {
                Draft: 'bg-gray-100 text-gray-600',
                Sent: 'bg-blue-50 text-blue-600',
                Approved: 'bg-emerald-50 text-emerald-600',
                Rejected: 'bg-red-50 text-red-600',
                Expired: 'bg-amber-50 text-amber-600',
              };
              return (
                <div
                  key={q.id}
                  className="rounded-xl border border-gray-100 p-4 transition-colors hover:border-primary-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-secondary-900">{q.id}</p>
                      <p className="text-xs text-surface-muted">{q.leadName} - {q.company}</p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[q.status] || statusColors.Draft}`}
                    >
                      {q.status}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm font-semibold text-primary-500">
                      {formatCurrency(q.total)}
                    </span>
                    <span className="text-xs text-surface-muted">{q.date}</span>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs text-surface-muted">
                      {q.items.length} item{q.items.length > 1 ? 's' : ''} | Valid until {q.validUntil}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Conversion Metrics */}
        <div className="rounded-2xl bg-white p-6 shadow-md lg:col-span-1">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-secondary-900">
            <ArrowRightLeft className="h-5 w-5 text-violet-400" />
            Conversion Metrics
          </h2>

          {/* Win Rate */}
          <div className="mb-5 rounded-xl bg-emerald-50/70 p-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-emerald-500" />
              <div>
                <p className="text-2xl font-bold text-emerald-600">{winRate}%</p>
                <p className="text-xs text-emerald-600/70">Win Rate</p>
              </div>
            </div>
          </div>

          {/* Stage-to-stage conversion */}
          <div className="space-y-4">
            {stageConversions.map((conv) => {
              const fromStage = stages.find((s) => s.id === conv.from);
              const toStage = stages.find((s) => s.id === conv.to);
              return (
                <div key={`${conv.from}-${conv.to}`}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-secondary-700">
                      {fromStage?.title} <span className="text-surface-muted">to</span> {toStage?.title}
                    </span>
                    <span className="font-semibold text-secondary-900">{conv.rate}%</span>
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-primary-300 to-primary-500 transition-all duration-500"
                      style={{ width: `${conv.rate}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pipeline flow summary */}
          <div className="mt-5 border-t border-gray-100 pt-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-surface-muted">
              Pipeline Flow
            </p>
            <div className="flex items-center justify-between">
              {stages.map((stage, i) => (
                <div key={stage.id} className="flex items-center">
                  <div className="text-center">
                    <div className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-r ${stage.gradient} text-sm font-bold text-white`}>
                      {stage.leads.length}
                    </div>
                    <p className="mt-1 text-xs text-surface-muted">{stage.title}</p>
                  </div>
                  {i < stages.length - 1 && (
                    <ChevronRight className="mx-1 h-4 w-4 text-gray-300" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* View Details Modal */}
      <Modal isOpen={!!detailLead} onClose={() => setDetailLead(null)} title="Lead Details">
        {detailLead && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-primary-100 bg-primary-50 text-base font-bold text-primary-500">
                {detailLead.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <h3 className="text-lg font-bold text-secondary-900">{detailLead.name}</h3>
                <p className="text-sm text-surface-muted">{detailLead.company}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-gray-50 p-3">
                <p className="text-xs text-surface-muted">Deal Value</p>
                <p className="text-lg font-bold text-primary-500">{formatCurrency(detailLead.value)}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-3">
                <p className="text-xs text-surface-muted">Days in Stage</p>
                <p className="text-lg font-bold text-secondary-900">{detailLead.daysInStage}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-3">
                <p className="text-xs text-surface-muted">Priority</p>
                <div className="mt-1 flex items-center gap-2">
                  <div className={`h-2.5 w-2.5 rounded-full ${PRIORITY_COLORS[detailLead.priority]}`} />
                  <span className="text-sm font-medium capitalize text-secondary-900">{detailLead.priority}</span>
                </div>
              </div>
              <div className="rounded-xl bg-gray-50 p-3">
                <p className="text-xs text-surface-muted">Stage</p>
                <p className="text-sm font-medium text-secondary-900">
                  {stages.find((s) => s.leads.some((l) => l.id === detailLead.id))?.title || '-'}
                </p>
              </div>
            </div>
            {initialConversations[detailLead.id] && (
              <div className="rounded-xl border border-gray-100 p-3">
                <p className="mb-1 text-xs font-semibold text-surface-muted">Last Conversation</p>
                <p className="text-sm text-secondary-700">{initialConversations[detailLead.id].full}</p>
              </div>
            )}
            {detailLead.notes && detailLead.notes.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold text-surface-muted">Notes</p>
                <div className="space-y-2">
                  {detailLead.notes.map((note, i) => (
                    <div key={i} className="rounded-lg bg-amber-50 p-2 text-sm text-secondary-700">
                      <span className="text-xs text-amber-600">{note.date}</span> - {note.text}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Add Note Modal */}
      <Modal isOpen={!!noteLead} onClose={() => { setNoteLead(null); setNoteText(''); }} title={`Add Note - ${noteLead?.name || ''}`}>
        {noteLead && (
          <div className="space-y-4">
            <textarea
              className="w-full rounded-xl border border-gray-200 p-3 text-sm text-secondary-900 placeholder-surface-muted focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
              rows={4}
              placeholder="Type your note here..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => { setNoteLead(null); setNoteText(''); }}
                className="rounded-xl px-4 py-2 text-sm font-medium text-surface-muted hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={addNote}
                disabled={!noteText.trim()}
                className="rounded-xl bg-primary-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-600 disabled:opacity-40"
              >
                Save Note
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Lead Modal */}
      <Modal isOpen={!!addLeadStage} onClose={() => setAddLeadStage(null)} title={`Add Lead to ${stages.find((s) => s.id === addLeadStage)?.title || ''}`}>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-secondary-700">Name *</label>
            <input
              type="text"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-secondary-900 placeholder-surface-muted focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
              placeholder="Lead name"
              value={newLead.name}
              onChange={(e) => setNewLead((p) => ({ ...p, name: e.target.value }))}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-secondary-700">Company</label>
            <input
              type="text"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-secondary-900 placeholder-surface-muted focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
              placeholder="Company name"
              value={newLead.company}
              onChange={(e) => setNewLead((p) => ({ ...p, company: e.target.value }))}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-secondary-700">Deal Value</label>
            <input
              type="number"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-secondary-900 placeholder-surface-muted focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
              placeholder="e.g. 250000"
              value={newLead.value}
              onChange={(e) => setNewLead((p) => ({ ...p, value: e.target.value }))}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-secondary-700">Source</label>
            <select
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-secondary-900 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
              value={newLead.source}
              onChange={(e) => setNewLead((p) => ({ ...p, source: e.target.value }))}
            >
              <option>Website</option>
              <option>WhatsApp</option>
              <option>Email</option>
              <option>Referral</option>
              <option>Cold Call</option>
            </select>
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setAddLeadStage(null)}
              className="rounded-xl px-4 py-2 text-sm font-medium text-surface-muted hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleAddLead}
              disabled={!newLead.name.trim()}
              className="rounded-xl bg-primary-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-600 disabled:opacity-40"
            >
              Add Lead
            </button>
          </div>
        </div>
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
