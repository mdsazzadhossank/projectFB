import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useMessaging } from '../../context/MessagingContext';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useMessaging();

  if (toasts.length === 0) return null;

  return (
    <div
      id="toast-container"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            id={`toast-${toast.id}`}
            className="pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl shadow-xl border border-neutral-800 dark:border-neutral-200 text-sm animate-in slide-in-from-bottom-3 duration-200"
          >
            <div className="flex items-center gap-2.5">
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />}
              {isError && <AlertCircle className="w-4 h-4 text-rose-400 dark:text-rose-600 shrink-0" />}
              {!isSuccess && !isError && <Info className="w-4 h-4 text-sky-400 dark:text-sky-600 shrink-0" />}
              <span className="font-medium text-xs sm:text-sm">{toast.message}</span>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-neutral-400 hover:text-white dark:hover:text-neutral-950 p-1 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
