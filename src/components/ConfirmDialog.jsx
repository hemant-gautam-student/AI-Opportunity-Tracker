import { AlertTriangle, X } from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function ConfirmDialog({
  open,
  title = 'Confirm Action',
  message = 'Are you sure?',
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  variant = 'danger', // 'danger' | 'warning' | 'info'
  onConfirm,
  onCancel,
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (open) {
      dialogRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape' && open) onCancel?.();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onCancel]);

  if (!open) return null;

  const variantStyles = {
    danger: {
      icon: 'text-red-500 bg-red-100 dark:bg-red-900/30',
      button: 'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white',
    },
    warning: {
      icon: 'text-amber-500 bg-amber-100 dark:bg-amber-900/30',
      button: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500 text-white',
    },
    info: {
      icon: 'text-primary-500 bg-primary-100 dark:bg-primary-900/30',
      button: 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 text-white',
    },
  };

  const style = variantStyles[variant] || variantStyles.danger;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        className="relative bg-white dark:bg-surface-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-0">
          <div className={`p-2.5 rounded-xl ${style.icon}`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <button
            onClick={onCancel}
            className="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 pt-4">
          <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">
            {title}
          </h3>
          <p className="text-sm text-surface-600 dark:text-surface-400 leading-relaxed">
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 pb-6">
          <button
            onClick={onCancel}
            className="px-4 py-2.5 text-sm font-medium rounded-xl text-surface-700 dark:text-surface-300 bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2.5 text-sm font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-surface-800 ${style.button}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}