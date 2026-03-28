import { useState } from 'react';
import { Calendar, CheckCircle2, Circle, Phone, Mail, Users } from 'lucide-react';
import { getPriorityColor } from '../data/followups';

export default function TaskCard({ task }) {
  const [completed, setCompleted] = useState(task.completed);
  const priorityColors = getPriorityColor(task.priority);

  const typeIcons = {
    call: Phone,
    email: Mail,
    meeting: Users,
  };
  const TypeIcon = typeIcons[task.type] || Phone;

  return (
    <div
      className={`group rounded-xl border-l-4 ${priorityColors.border} bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md ${
        completed ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={() => setCompleted(!completed)}
          className="mt-0.5 flex-shrink-0 transition-colors duration-200"
        >
          {completed ? (
            <CheckCircle2 className="h-5 w-5 text-accent-500" />
          ) : (
            <Circle className="h-5 w-5 text-gray-300 group-hover:text-primary-400" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className={`font-semibold text-secondary-900 ${completed ? 'line-through' : ''}`}>
              {task.title}
            </h4>
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${priorityColors.badge} ${priorityColors.text}`}>
              {task.priority}
            </span>
          </div>

          <p className="mt-1 text-sm text-surface-muted">{task.description}</p>

          <div className="mt-3 flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-surface-muted">
              <TypeIcon className="h-3.5 w-3.5" />
              <span>{task.type}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-surface-muted">
              <Calendar className="h-3.5 w-3.5" />
              <span>{task.dueDate}</span>
            </div>
            <span className="text-xs text-surface-muted">
              {task.company}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
