import { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

const styles = {
  success: 'border-accent-500 bg-accent-500/10',
  error: 'border-error-500 bg-error-500/10',
  info: 'border-primary-500 bg-primary-500/10',
};

const iconStyles = {
  success: 'text-accent-500',
  error: 'text-error-500',
  info: 'text-primary-500',
};

export default function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  const [visible, setVisible] = useState(true);
  const Icon = icons[type];

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border-l-4 bg-white px-4 py-3 shadow-lg transition-all duration-300 ${
        styles[type]
      } ${visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
    >
      <Icon className={`h-5 w-5 ${iconStyles[type]}`} />
      <p className="text-sm font-medium text-secondary-900">{message}</p>
      <button onClick={onClose} className="ml-2 text-surface-muted hover:text-secondary-900">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
