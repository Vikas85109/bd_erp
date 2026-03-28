import { useState } from 'react';
import { CalendarCheck, Filter, Plus, ListFilter } from 'lucide-react';
import TaskCard from '../components/TaskCard';
import { followups } from '../data/followups';

export default function FollowUps() {
  const [filter, setFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const filteredTasks = followups.filter((task) => {
    const matchesStatus =
      filter === 'all' ||
      (filter === 'pending' && !task.completed) ||
      (filter === 'completed' && task.completed);
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    return matchesStatus && matchesPriority;
  });

  const pendingCount = followups.filter((t) => !t.completed).length;
  const todayCount = followups.filter((t) => t.dueDate === '2026-03-28').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Follow-ups</h1>
          <p className="mt-1 text-sm text-surface-muted">Track and manage your follow-up tasks</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-primary-500/25 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
          <Plus className="h-4 w-4" />
          Add Follow-up
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-md">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
              <CalendarCheck className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary-900">{pendingCount}</p>
              <p className="text-sm text-surface-muted">Pending Tasks</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-md">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100">
              <CalendarCheck className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary-900">{todayCount}</p>
              <p className="text-sm text-surface-muted">Due Today</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-md">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
              <CalendarCheck className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary-900">{followups.length - pendingCount}</p>
              <p className="text-sm text-surface-muted">Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <ListFilter className="h-4 w-4 text-surface-muted" />
          <span className="text-sm font-medium text-surface-muted">Status:</span>
          {['all', 'pending', 'completed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-all duration-200 ${
                filter === f ? 'bg-primary-600 text-white shadow-sm' : 'bg-surface-bg text-surface-muted hover:bg-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-surface-muted" />
          <span className="text-sm font-medium text-surface-muted">Priority:</span>
          {['all', 'high', 'medium', 'low'].map((p) => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-all duration-200 ${
                priorityFilter === p ? 'bg-primary-600 text-white shadow-sm' : 'bg-surface-bg text-surface-muted hover:bg-gray-200'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => <TaskCard key={task.id} task={task} />)
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-16 shadow-md">
            <div className="text-5xl">🎉</div>
            <h3 className="mt-4 text-lg font-bold text-secondary-900">All caught up!</h3>
            <p className="mt-1 text-sm text-surface-muted">No follow-ups matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
