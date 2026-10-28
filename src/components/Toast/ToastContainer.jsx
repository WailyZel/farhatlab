import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';

const icons = { success: CheckCircle2, info: Info, error: AlertCircle };

export default function ToastContainer({ toasts, onDismiss }) {
  return (
    <div className="toast-container" aria-live="polite" aria-atomic="false">
      {toasts.map((t) => {
        const Icon = icons[t.type] || CheckCircle2;
        return (
          <div key={t.id} className={`toast toast-${t.type}`} role="status">
            <Icon size={20} className="toast-icon" />
            <span>{t.message}</span>
            <button className="toast-close" onClick={() => onDismiss(t.id)} aria-label="Закрыть уведомление">
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
