import { useState, useEffect, useCallback } from 'react';
import {
  CalendarCheck,
  Filter,
  Plus,
  ListFilter,
  Phone,
  Mail,
  Users,
  MessageCircle,
  CheckCircle2,
  Circle,
  Calendar,
  Bell,
  BellRing,
  Clock,
  Zap,
  Send,
  AlarmClock,
  ToggleLeft,
  ToggleRight,
  CheckCheck,
  AlertTriangle,
} from 'lucide-react';
import { followups as initialFollowups, getPriorityColor } from '../data/followups';
import { leads } from '../data/leads';
import Toast from '../components/Toast';
import Modal from '../components/Modal';

const TODAY = '2026-03-31';

const typeIcons = {
  call: Phone,
  email: Mail,
  meeting: Users,
  whatsapp: MessageCircle,
};

const channelIcons = {
  whatsapp: MessageCircle,
  email: Mail,
};

const autoScheduleTemplates = [
  (lead) => `Follow up on proposal with ${lead.name}`,
  (lead) => `Send pricing details to ${lead.name}`,
  (lead) => `Schedule demo call with ${lead.name}`,
  (lead) => `Check in with ${lead.name} on progress`,
  (lead) => `Share case study with ${lead.name}`,
  (lead) => `Re-engage ${lead.name} with new features`,
  (lead) => `Send onboarding docs to ${lead.name}`,
  (lead) => `Confirm meeting time with ${lead.name}`,
];

function getTaskStatus(task) {
  if (task.completed) return 'completed';
  if (task.snoozedUntil && task.snoozedUntil > Date.now()) return 'snoozed';
  if (task.dueDate < TODAY) return 'overdue';
  return 'pending';
}

export default function FollowUps() {
  const [tasks, setTasks] = useState(() =>
    initialFollowups.map((t) => ({
      ...t,
      channel: t.type === 'email' ? 'email' : t.type === 'whatsapp' ? 'whatsapp' : 'both',
      snoozedUntil: null,
    }))
  );
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [channelFilter, setChannelFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [autoSchedule, setAutoSchedule] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [snoozeOpenId, setSnoozeOpenId] = useState(null);

  // New follow-up form state
  const [formLeadId, setFormLeadId] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formType, setFormType] = useState('call');
  const [formPriority, setFormPriority] = useState('medium');
  const [formDueDate, setFormDueDate] = useState(TODAY);
  const [formChannel, setFormChannel] = useState('both');

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Auto-scheduling system
  useEffect(() => {
    if (!autoSchedule) return;
    const interval = setInterval(() => {
      const lead = leads[Math.floor(Math.random() * leads.length)];
      const template = autoScheduleTemplates[Math.floor(Math.random() * autoScheduleTemplates.length)];
      const types = ['call', 'email', 'meeting', 'whatsapp'];
      const priorities = ['high', 'medium', 'low'];
      const channels = ['whatsapp', 'email', 'both'];
      const daysAhead = Math.floor(Math.random() * 5);
      const due = new Date(TODAY);
      due.setDate(due.getDate() + daysAhead);
      const dueDateStr = due.toISOString().split('T')[0];

      const newTask = {
        id: Date.now() + Math.random(),
        leadId: lead.id,
        title: template(lead),
        description: `Auto-scheduled follow-up for ${lead.company}.`,
        leadName: lead.name,
        company: lead.company,
        dueDate: dueDateStr,
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        completed: false,
        type: types[Math.floor(Math.random() * types.length)],
        channel: channels[Math.floor(Math.random() * channels.length)],
        snoozedUntil: null,
      };

      setTasks((prev) => [newTask, ...prev]);
      addToast(`AI scheduled: "${newTask.title}"`, 'info');
    }, 8000);

    return () => clearInterval(interval);
  }, [autoSchedule, addToast]);

  // Filtering
  const filteredTasks = tasks.filter((task) => {
    const status = getTaskStatus(task);

    // Status filter
    if (statusFilter === 'pending' && status !== 'pending' && status !== 'snoozed') return false;
    if (statusFilter === 'completed' && status !== 'completed') return false;
    if (statusFilter === 'overdue' && status !== 'overdue') return false;

    // Priority filter
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;

    // Channel filter
    if (channelFilter !== 'all') {
      if (channelFilter === 'whatsapp' && task.channel !== 'whatsapp' && task.channel !== 'both') return false;
      if (channelFilter === 'email' && task.channel !== 'email' && task.channel !== 'both') return false;
      if (channelFilter === 'meeting' && task.type !== 'meeting') return false;
      if (channelFilter === 'call' && task.type !== 'call') return false;
    }

    // Date filter
    if (dateFilter === 'today' && task.dueDate !== TODAY) return false;
    if (dateFilter === 'week') {
      const start = new Date(TODAY);
      const end = new Date(TODAY);
      end.setDate(end.getDate() + (7 - end.getDay()));
      const taskDate = new Date(task.dueDate);
      if (taskDate < start || taskDate > end) return false;
    }

    return true;
  });

  // Summary counts
  const pendingCount = tasks.filter((t) => !t.completed && t.dueDate >= TODAY).length;
  const dueTodayCount = tasks.filter((t) => !t.completed && t.dueDate === TODAY).length;
  const overdueCount = tasks.filter((t) => !t.completed && t.dueDate < TODAY).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  // Actions
  const toggleComplete = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const sendReminder = (task) => {
    addToast(`Reminder sent to ${task.leadName}`, 'success');
  };

  const nudgeClient = (task) => {
    const via = task.channel === 'both' ? 'WhatsApp & Email' : task.channel === 'whatsapp' ? 'WhatsApp' : 'Email';
    addToast(`Nudge sent via ${via}`, 'success');
  };

  const snoozeTask = (id, label) => {
    let ms;
    if (label === '1h') ms = 3600000;
    else if (label === '4h') ms = 14400000;
    else ms = 86400000;
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, snoozedUntil: Date.now() + ms } : t))
    );
    setSnoozeOpenId(null);
    addToast(`Task snoozed for ${label === '1h' ? '1 hour' : label === '4h' ? '4 hours' : 'tomorrow'}`, 'info');
  };

  const toggleChannel = (id) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const order = ['whatsapp', 'email', 'both'];
        const next = order[(order.indexOf(t.channel) + 1) % order.length];
        return { ...t, channel: next };
      })
    );
  };

  const markAllComplete = () => {
    const pendingIds = filteredTasks.filter((t) => !t.completed).map((t) => t.id);
    setTasks((prev) =>
      prev.map((t) => (pendingIds.includes(t.id) ? { ...t, completed: true } : t))
    );
    addToast(`Marked ${pendingIds.length} tasks as complete`, 'success');
  };

  const sendAllReminders = () => {
    const pending = filteredTasks.filter((t) => !t.completed);
    addToast(`Reminders sent to ${pending.length} contacts`, 'success');
  };

  const handleAddFollowup = () => {
    const lead = leads.find((l) => l.id === Number(formLeadId));
    if (!lead || !formTitle.trim()) {
      addToast('Please select a lead and enter a title', 'error');
      return;
    }
    const newTask = {
      id: Date.now() + Math.random(),
      leadId: lead.id,
      title: formTitle.trim(),
      description: formDescription.trim(),
      leadName: lead.name,
      company: lead.company,
      dueDate: formDueDate,
      priority: formPriority,
      completed: false,
      type: formType,
      channel: formChannel,
      snoozedUntil: null,
    };
    setTasks((prev) => [newTask, ...prev]);
    addToast(`Follow-up added for ${lead.name}`, 'success');
    setShowAddModal(false);
    setFormTitle('');
    setFormDescription('');
    setFormLeadId('');
    setFormType('call');
    setFormPriority('medium');
    setFormDueDate(TODAY);
    setFormChannel('both');
  };

  // Render channel badge
  const ChannelBadge = ({ channel }) => {
    if (channel === 'both') {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-500">
          <MessageCircle className="h-3 w-3" />
          <Mail className="h-3 w-3" />
        </span>
      );
    }
    const Icon = channelIcons[channel] || Mail;
    const colors = channel === 'whatsapp' ? 'bg-emerald-50 text-emerald-500' : 'bg-sky-50 text-sky-500';
    return (
      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${colors}`}>
        <Icon className="h-3 w-3" />
        <span className="capitalize">{channel}</span>
      </span>
    );
  };

  const inputClass =
    'w-full rounded-xl border border-surface-border bg-white px-3 py-2 text-sm text-secondary-900 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 transition-colors';
  const labelClass = 'block text-sm font-medium text-secondary-700 mb-1';

  return (
    <div className="space-y-6">
      {/* Toasts */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
        ))}
      </div>

      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Follow-ups</h1>
          <p className="mt-1 text-sm text-surface-muted">Track and manage your follow-up tasks with automation</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Auto-Schedule Toggle */}
          <button
            onClick={() => {
              setAutoSchedule(!autoSchedule);
              if (!autoSchedule) addToast('Auto-scheduling enabled - AI will create tasks every 8s', 'info');
              else addToast('Auto-scheduling disabled', 'info');
            }}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
              autoSchedule
                ? 'bg-accent-500 text-white shadow-md shadow-accent-500/15'
                : 'bg-white text-secondary-700 border border-surface-border hover:bg-gray-50'
            }`}
          >
            {autoSchedule ? (
              <ToggleRight className="h-4 w-4" />
            ) : (
              <ToggleLeft className="h-4 w-4" />
            )}
            <Zap className="h-3.5 w-3.5" />
            Auto-Schedule
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-xl bg-primary-500 hover:bg-primary-600 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-primary-500/15 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
          >
            <Plus className="h-4 w-4" />
            Add Follow-up
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-white p-5 shadow-md">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning-50">
              <Clock className="h-5 w-5 text-warning-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary-900">{pendingCount}</p>
              <p className="text-sm text-surface-muted">Pending</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-md">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50">
              <CalendarCheck className="h-5 w-5 text-primary-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary-900">{dueTodayCount}</p>
              <p className="text-sm text-surface-muted">Due Today</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-md">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-error-50">
              <AlertTriangle className="h-5 w-5 text-error-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary-900">{overdueCount}</p>
              <p className="text-sm text-surface-muted">Overdue</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-md">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-50">
              <CheckCircle2 className="h-5 w-5 text-accent-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary-900">{completedCount}</p>
              <p className="text-sm text-surface-muted">Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-white p-4 shadow-sm">
        {/* Status */}
        <div className="flex items-center gap-2">
          <ListFilter className="h-4 w-4 text-surface-muted" />
          <span className="text-sm font-medium text-surface-muted">Status:</span>
          {['all', 'pending', 'completed', 'overdue'].map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-all duration-200 ${
                statusFilter === f
                  ? f === 'overdue'
                    ? 'bg-error-50 text-error-500 border border-error-100'
                    : 'bg-primary-50 text-primary-600 border border-primary-100'
                  : 'bg-surface-bg text-surface-muted hover:bg-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Priority */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-surface-muted" />
          <span className="text-sm font-medium text-surface-muted">Priority:</span>
          {['all', 'high', 'medium', 'low'].map((p) => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-all duration-200 ${
                priorityFilter === p
                  ? 'bg-primary-50 text-primary-600 border border-primary-100'
                  : 'bg-surface-bg text-surface-muted hover:bg-gray-200'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Channel */}
        <div className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-surface-muted" />
          <span className="text-sm font-medium text-surface-muted">Channel:</span>
          {['all', 'whatsapp', 'email', 'meeting', 'call'].map((c) => (
            <button
              key={c}
              onClick={() => setChannelFilter(c)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-all duration-200 ${
                channelFilter === c
                  ? 'bg-primary-50 text-primary-600 border border-primary-100'
                  : 'bg-surface-bg text-surface-muted hover:bg-gray-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Date */}
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-surface-muted" />
          <span className="text-sm font-medium text-surface-muted">Date:</span>
          {['all', 'today', 'week'].map((d) => (
            <button
              key={d}
              onClick={() => setDateFilter(d)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-all duration-200 ${
                dateFilter === d
                  ? 'bg-primary-50 text-primary-600 border border-primary-100'
                  : 'bg-surface-bg text-surface-muted hover:bg-gray-200'
              }`}
            >
              {d === 'week' ? 'This Week' : d}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={markAllComplete}
          className="flex items-center gap-2 rounded-xl bg-accent-50 px-4 py-2 text-sm font-medium text-accent-600 transition-all duration-200 hover:bg-accent-100"
        >
          <CheckCheck className="h-4 w-4" />
          Mark All Complete
        </button>
        <button
          onClick={sendAllReminders}
          className="flex items-center gap-2 rounded-xl bg-primary-50 px-4 py-2 text-sm font-medium text-primary-600 transition-all duration-200 hover:bg-primary-100"
        >
          <Send className="h-4 w-4" />
          Send All Reminders
        </button>
        <span className="text-xs text-surface-muted">
          {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''} shown
        </span>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => {
            const status = getTaskStatus(task);
            const isOverdue = status === 'overdue';
            const isSnoozed = status === 'snoozed';
            const priorityColors = getPriorityColor(task.priority);
            const TypeIcon = typeIcons[task.type] || Phone;

            return (
              <div
                key={task.id}
                className={`group rounded-xl border-l-4 ${
                  isOverdue ? 'border-l-error-500 ring-1 ring-error-100' : priorityColors.border
                } bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md ${
                  task.completed ? 'opacity-60' : ''
                } ${isSnoozed ? 'opacity-70' : ''}`}
              >
                <div className="flex items-start gap-3">
                  {/* Completion toggle */}
                  <button
                    onClick={() => toggleComplete(task.id)}
                    className="mt-0.5 shrink-0 transition-colors duration-200"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-accent-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-300 group-hover:text-primary-400" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    {/* Title row */}
                    <div className="flex flex-wrap items-center gap-2">
                      <h4
                        className={`font-semibold text-secondary-900 ${
                          task.completed ? 'line-through' : ''
                        }`}
                      >
                        {task.title}
                      </h4>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${priorityColors.badge} ${priorityColors.text}`}
                      >
                        {task.priority}
                      </span>
                      {isOverdue && (
                        <span className="rounded-full bg-error-50 px-2 py-0.5 text-xs font-semibold text-error-500">
                          OVERDUE
                        </span>
                      )}
                      {isSnoozed && (
                        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-500">
                          Snoozed
                        </span>
                      )}
                      {/* Channel badge - clickable to toggle */}
                      <button onClick={() => toggleChannel(task.id)} title="Click to toggle channel">
                        <ChannelBadge channel={task.channel} />
                      </button>
                    </div>

                    <p className="mt-1 text-sm text-surface-muted">{task.description}</p>

                    {/* Meta row */}
                    <div className="mt-3 flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-1.5 text-xs text-surface-muted">
                        <TypeIcon className="h-3.5 w-3.5" />
                        <span className="capitalize">{task.type}</span>
                      </div>
                      <div
                        className={`flex items-center gap-1.5 text-xs ${
                          isOverdue ? 'text-error-500 font-medium' : 'text-surface-muted'
                        }`}
                      >
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{task.dueDate}</span>
                      </div>
                      <span className="text-xs text-surface-muted">{task.company}</span>
                    </div>

                    {/* Action buttons */}
                    {!task.completed && (
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => sendReminder(task)}
                          className="flex items-center gap-1.5 rounded-lg bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary-600 transition-colors hover:bg-primary-100"
                        >
                          <Bell className="h-3.5 w-3.5" />
                          Send Reminder
                        </button>
                        <button
                          onClick={() => nudgeClient(task)}
                          className="flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-600 transition-colors hover:bg-amber-100"
                        >
                          <BellRing className="h-3.5 w-3.5" />
                          Nudge Client
                        </button>
                        <div className="relative">
                          <button
                            onClick={() =>
                              setSnoozeOpenId(snoozeOpenId === task.id ? null : task.id)
                            }
                            className="flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-medium text-secondary-600 transition-colors hover:bg-gray-100"
                          >
                            <AlarmClock className="h-3.5 w-3.5" />
                            Snooze
                          </button>
                          {snoozeOpenId === task.id && (
                            <div className="absolute left-0 top-full z-30 mt-1 flex gap-1 rounded-xl bg-white p-2 shadow-lg border border-surface-border">
                              {['1h', '4h', 'Tomorrow'].map((opt) => (
                                <button
                                  key={opt}
                                  onClick={() => snoozeTask(task.id, opt === 'Tomorrow' ? 'tomorrow' : opt)}
                                  className="whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium text-secondary-600 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-16 shadow-md">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-50">
              <CheckCircle2 className="h-8 w-8 text-accent-400" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-secondary-900">All caught up!</h3>
            <p className="mt-1 text-sm text-surface-muted">No follow-ups matching your filters.</p>
          </div>
        )}
      </div>

      {/* Add Follow-up Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Follow-up">
        <div className="space-y-4">
          {/* Lead selector */}
          <div>
            <label className={labelClass}>Lead</label>
            <select
              value={formLeadId}
              onChange={(e) => setFormLeadId(e.target.value)}
              className={inputClass}
            >
              <option value="">Select a lead...</option>
              {leads.map((lead) => (
                <option key={lead.id} value={lead.id}>
                  {lead.name} - {lead.company}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className={labelClass}>Title</label>
            <input
              type="text"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="Follow-up title..."
              className={inputClass}
            />
          </div>

          {/* Description */}
          <div>
            <label className={labelClass}>Description</label>
            <textarea
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Details about this follow-up..."
              rows={3}
              className={inputClass + ' resize-none'}
            />
          </div>

          {/* Type & Priority row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Type</label>
              <select
                value={formType}
                onChange={(e) => setFormType(e.target.value)}
                className={inputClass}
              >
                <option value="call">Call</option>
                <option value="email">Email</option>
                <option value="meeting">Meeting</option>
                <option value="whatsapp">WhatsApp</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Priority</label>
              <select
                value={formPriority}
                onChange={(e) => setFormPriority(e.target.value)}
                className={inputClass}
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          {/* Due date & Channel row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Due Date</label>
              <input
                type="date"
                value={formDueDate}
                onChange={(e) => setFormDueDate(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Channel</label>
              <select
                value={formChannel}
                onChange={(e) => setFormChannel(e.target.value)}
                className={inputClass}
              >
                <option value="whatsapp">WhatsApp</option>
                <option value="email">Email</option>
                <option value="both">Both</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setShowAddModal(false)}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-secondary-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddFollowup}
              className="flex items-center gap-2 rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-primary-500/15 hover:bg-primary-600 transition-all duration-200"
            >
              <Plus className="h-4 w-4" />
              Add Follow-up
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
