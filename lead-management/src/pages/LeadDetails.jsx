import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  ArrowLeft, Mail, Phone, Building2, Calendar, Tag,
  Clock, CalendarCheck, Send, MessageSquare, Globe,
  CheckCircle2, Circle, Users, FileText, IndianRupee,
  Star, AlertCircle,
} from 'lucide-react';
import { StatusBadge } from '../components/Badge';
import { leads, getStatusColor, leadStatuses } from '../data/leads';
import { getLeadFollowups, getPriorityColor } from '../data/followups';
import { getChatMessages } from '../data/chat';
import { quotations } from '../data/quotations';
import Toast from '../components/Toast';

export default function LeadDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const lead = leads.find((l) => l.id === parseInt(id));
  const [status, setStatus] = useState(lead?.status || 'New');
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState(lead ? [{ id: 1, text: lead.notes, time: lead.createdAt }] : []);
  const [activeTab, setActiveTab] = useState('followups');
  const [toast, setToast] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  const leadFollowups = getLeadFollowups(lead?.id);
  const leadMessages = getChatMessages(lead?.id);
  const leadQuotations = quotations.filter((q) => q.leadName === lead?.name);

  // Follow-up state (local toggle)
  const [completedTasks, setCompletedTasks] = useState(
    new Set(leadFollowups.filter((f) => f.completed).map((f) => f.id))
  );

  if (!lead) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="h-12 w-12 text-surface-muted" />
        <h2 className="mt-4 text-xl font-bold text-secondary-900">Lead not found</h2>
        <p className="mt-2 text-surface-muted">The lead you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/leads')} className="mt-6 rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-primary-600">
          Back to Leads
        </button>
      </div>
    );
  }

  const toggleTask = (taskId) => {
    setCompletedTasks((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) next.delete(taskId);
      else next.add(taskId);
      return next;
    });
  };

  const addNote = () => {
    if (!note.trim()) return;
    setNotes((prev) => [{ id: Date.now(), text: note, time: new Date().toLocaleDateString() }, ...prev]);
    setNote('');
    setToast({ message: 'Note saved', type: 'success' });
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    setToast({ message: `Status changed to ${newStatus}`, type: 'success' });
  };

  const handleSendReminder = (task) => {
    setToast({ message: `Reminder sent to ${task.leadName} via ${task.type}`, type: 'success' });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    setNewMessage('');
    setToast({ message: `Message sent to ${lead.name}`, type: 'success' });
  };

  const sourceIcon = { Website: Globe, Email: Mail, WhatsApp: MessageSquare };
  const SourceIcon = sourceIcon[lead.source] || Globe;

  // Qualification score
  const daysSinceContact = Math.floor((new Date() - new Date(lead.lastContact)) / (1000 * 60 * 60 * 24));
  const qualScore = Math.min(100, Math.max(0,
    (lead.value > 300000 ? 30 : lead.value > 150000 ? 20 : 10) +
    (['Qualified', 'Proposal'].includes(lead.status) ? 40 : lead.status === 'Converted' ? 50 : lead.status === 'Contacted' ? 20 : 10) +
    (daysSinceContact < 3 ? 30 : daysSinceContact < 7 ? 20 : 10)
  ));
  const qualLabel = qualScore >= 70 ? 'Hot' : qualScore >= 40 ? 'Warm' : 'Cold';
  const qualColor = qualScore >= 70 ? 'text-error-400' : qualScore >= 40 ? 'text-warning-500' : 'text-primary-400';

  const tabs = [
    { key: 'followups', label: 'Follow-ups', count: leadFollowups.filter((f) => !completedTasks.has(f.id)).length },
    { key: 'conversations', label: 'Conversations', count: leadMessages.length },
    { key: 'quotations', label: 'Quotations', count: leadQuotations.length },
    { key: 'notes', label: 'Notes', count: notes.length },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/leads')} className="rounded-xl p-2 text-surface-muted transition-all duration-200 hover:bg-surface-bg hover:text-secondary-900">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-secondary-900">{lead.name}</h1>
            <StatusBadge status={status} colors={getStatusColor(status)} />
            <span className={`text-xs font-bold ${qualColor}`}>● {qualLabel} ({qualScore}%)</span>
          </div>
          <div className="mt-1 flex items-center gap-3 text-sm text-surface-muted">
            <span>{lead.company}</span>
            <span>·</span>
            <span className="flex items-center gap-1"><SourceIcon className="h-3.5 w-3.5" /> {lead.source}</span>
            <span>·</span>
            <span>₹{(lead.value / 1000).toFixed(0)}K deal value</span>
          </div>
        </div>
        <select value={status} onChange={(e) => handleStatusChange(e.target.value)} className="rounded-xl border border-surface-border bg-white px-4 py-2.5 text-sm font-medium outline-none transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20">
          {leadStatuses.map((s) => (<option key={s} value={s}>{s}</option>))}
        </select>
      </div>

      {/* Split Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Left Panel */}
        <div className="space-y-5 lg:col-span-2">
          {/* Contact Info */}
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-surface-border/60">
            <h2 className="font-bold text-secondary-900">Contact Information</h2>
            <div className="mt-4 space-y-3">
              {[
                { icon: Mail, label: 'Email', value: lead.email },
                { icon: Phone, label: 'Phone', value: lead.phone },
                { icon: Building2, label: 'Company', value: lead.company },
                { icon: Calendar, label: 'Created', value: lead.createdAt },
                { icon: Clock, label: 'Last Contact', value: `${lead.lastContact} (${daysSinceContact}d ago)` },
                { icon: Users, label: 'Assigned To', value: lead.assignedTo },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
                    <Icon className="h-4 w-4 text-secondary-800" />
                  </div>
                  <div>
                    <p className="text-xs text-surface-muted">{label}</p>
                    <p className="text-sm font-medium text-secondary-900">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-surface-border/60">
            <h2 className="font-bold text-secondary-900">Quick Actions</h2>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button onClick={() => setToast({ message: 'Email sent to ' + lead.name, type: 'success' })} className="flex items-center gap-2 rounded-xl border border-surface-border px-3 py-2.5 text-sm font-medium text-secondary-700 transition-all hover:bg-surface-bg">
                <Mail className="h-4 w-4" /> Send Email
              </button>
              <button onClick={() => setToast({ message: 'WhatsApp opened for ' + lead.name, type: 'success' })} className="flex items-center gap-2 rounded-xl border border-surface-border px-3 py-2.5 text-sm font-medium text-secondary-700 transition-all hover:bg-surface-bg">
                <MessageSquare className="h-4 w-4" /> WhatsApp
              </button>
              <button onClick={() => navigate('/quotations')} className="flex items-center gap-2 rounded-xl border border-surface-border px-3 py-2.5 text-sm font-medium text-secondary-700 transition-all hover:bg-surface-bg">
                <FileText className="h-4 w-4" /> New Quote
              </button>
              <button onClick={() => setToast({ message: 'Demo scheduled for ' + lead.name, type: 'success' })} className="flex items-center gap-2 rounded-xl border border-surface-border px-3 py-2.5 text-sm font-medium text-secondary-700 transition-all hover:bg-surface-bg">
                <CalendarCheck className="h-4 w-4" /> Schedule
              </button>
            </div>
          </div>

          {/* Tags */}
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-surface-border/60">
            <h2 className="font-bold text-secondary-900">Tags</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {lead.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-secondary-700">
                  <Tag className="h-3 w-3" /> {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Deal Value */}
          <div className="rounded-2xl bg-gray-100 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-surface-muted">Deal Value</p>
                <p className="mt-1 text-2xl font-bold text-secondary-900">₹{(lead.value / 1000).toFixed(0)}K</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-surface-muted">Score</p>
                <p className={`mt-1 text-2xl font-bold ${qualColor}`}>{qualScore}%</p>
              </div>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div className={`h-full rounded-full transition-all duration-700 ${qualScore >= 70 ? 'bg-error-400' : qualScore >= 40 ? 'bg-warning-400' : 'bg-primary-300'}`} style={{ width: `${qualScore}%` }} />
            </div>
          </div>
        </div>

        {/* Right Panel - Tabbed Content */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl bg-white shadow-sm border border-surface-border/60">
            {/* Tab Header */}
            <div className="flex border-b border-surface-border">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 px-4 py-3.5 text-sm font-medium transition-all border-b-2 ${
                    activeTab === tab.key
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-surface-muted hover:text-secondary-800'
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-xs ${
                      activeTab === tab.key ? 'bg-primary-50 text-primary-500' : 'bg-gray-100 text-surface-muted'
                    }`}>{tab.count}</span>
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-5">
              {/* Follow-ups Tab */}
              {activeTab === 'followups' && (
                <div className="space-y-3">
                  {leadFollowups.length > 0 ? leadFollowups.map((task) => {
                    const isCompleted = completedTasks.has(task.id);
                    const priorityColors = getPriorityColor(task.priority);
                    const isOverdue = !isCompleted && new Date(task.dueDate) < new Date();
                    return (
                      <div key={task.id} className={`rounded-xl border-l-4 ${priorityColors.border} bg-white p-4 shadow-sm ${isCompleted ? 'opacity-50' : ''} ${isOverdue ? 'ring-1 ring-error-400/30' : ''}`}>
                        <div className="flex items-start gap-3">
                          <button onClick={() => toggleTask(task.id)} className="mt-0.5 shrink-0">
                            {isCompleted ? <CheckCircle2 className="h-5 w-5 text-accent-500" /> : <Circle className="h-5 w-5 text-gray-300 hover:text-primary-400" />}
                          </button>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className={`font-semibold text-secondary-900 ${isCompleted ? 'line-through' : ''}`}>{task.title}</h4>
                              {isOverdue && <span className="text-xs font-medium text-error-400">Overdue</span>}
                            </div>
                            <p className="mt-1 text-sm text-surface-muted">{task.description}</p>
                            <div className="mt-2 flex items-center gap-3">
                              <span className="text-xs text-surface-muted">{task.dueDate}</span>
                              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${priorityColors.badge} ${priorityColors.text}`}>{task.priority}</span>
                              <span className="text-xs text-surface-muted capitalize">{task.type}</span>
                            </div>
                          </div>
                          {!isCompleted && (
                            <button onClick={() => handleSendReminder(task)} className="shrink-0 rounded-lg border border-surface-border px-3 py-1.5 text-xs font-medium text-surface-muted hover:bg-surface-bg transition-all">
                              Remind
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  }) : (
                    <div className="py-12 text-center">
                      <CalendarCheck className="mx-auto h-10 w-10 text-gray-300" />
                      <p className="mt-3 font-medium text-secondary-800">No follow-ups</p>
                      <p className="mt-1 text-sm text-surface-muted">Create one from the Follow-ups page</p>
                    </div>
                  )}
                </div>
              )}

              {/* Conversations Tab */}
              {activeTab === 'conversations' && (
                <div>
                  {leadMessages.length > 0 ? (
                    <>
                      <div className="mb-4 text-center">
                        <span className="rounded-full bg-surface-bg px-3 py-1 text-xs text-surface-muted">{leadMessages[0].date}</span>
                      </div>
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {leadMessages.map((msg) => (
                          <div key={msg.id} className={`flex ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                              msg.sender === 'agent'
                                ? 'rounded-br-md bg-primary-500 text-white'
                                : 'rounded-bl-md bg-gray-100 text-secondary-900'
                            }`}>
                              <p className="text-sm leading-relaxed">{msg.message}</p>
                              <p className={`mt-1 text-xs ${msg.sender === 'agent' ? 'text-white/70' : 'text-surface-muted'}`}>{msg.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 flex gap-3 border-t border-surface-border pt-4">
                        <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." className="flex-1 rounded-xl border border-surface-border px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20" onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }} />
                        <button onClick={handleSendMessage} className="rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-600 transition-all">
                          <Send className="h-4 w-4" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="py-12 text-center">
                      <MessageSquare className="mx-auto h-10 w-10 text-gray-300" />
                      <p className="mt-3 font-medium text-secondary-800">No conversations yet</p>
                      <p className="mt-1 text-sm text-surface-muted">Start a conversation with {lead.name}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Quotations Tab */}
              {activeTab === 'quotations' && (
                <div>
                  {leadQuotations.length > 0 ? (
                    <div className="space-y-3">
                      {leadQuotations.map((q) => (
                        <div key={q.id} className="flex items-center justify-between rounded-xl border border-surface-border p-4 hover:bg-surface-bg transition-colors">
                          <div>
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-secondary-800" />
                              <span className="font-semibold text-secondary-900">{q.id}</span>
                              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                q.status === 'Sent' ? 'bg-primary-50 text-primary-500' :
                                q.status === 'Approved' ? 'bg-accent-50 text-accent-500' :
                                'bg-gray-100 text-secondary-600'
                              }`}>{q.status}</span>
                            </div>
                            <p className="mt-1 text-sm text-surface-muted">{q.date} · Valid until {q.validUntil}</p>
                          </div>
                          <span className="text-lg font-bold text-secondary-900">₹{q.total.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center">
                      <FileText className="mx-auto h-10 w-10 text-gray-300" />
                      <p className="mt-3 font-medium text-secondary-800">No quotations</p>
                      <button onClick={() => navigate('/quotations')} className="mt-3 rounded-xl bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600 transition-all">
                        Create Quotation
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Notes Tab */}
              {activeTab === 'notes' && (
                <div>
                  <div className="mb-4">
                    <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note..." rows={3} className="w-full rounded-xl border border-surface-border px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20" />
                    <button onClick={addNote} className="mt-2 rounded-lg bg-primary-500 px-4 py-2 text-xs font-medium text-white transition-all hover:bg-primary-600">
                      Save Note
                    </button>
                  </div>
                  <div className="space-y-3">
                    {notes.map((n) => (
                      <div key={n.id} className="rounded-xl bg-surface-bg p-4">
                        <p className="text-sm text-secondary-900">{n.text}</p>
                        <p className="mt-2 text-xs text-surface-muted">{n.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
