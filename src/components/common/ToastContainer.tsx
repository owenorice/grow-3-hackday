import React from 'react';
import { useToast, ToastType } from '../../context/ToastContext';
import { CheckCircle2, AlertTriangle, ShieldAlert, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useToast();

  if (toasts.length === 0) return null;

  const getToastIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-[#97D700] shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-[#FFC107] shrink-0" />;
      case 'error':
        return <ShieldAlert className="w-4 h-4 text-[#DC3545] shrink-0" />;
      case 'info':
      default:
        return <Info className="w-4 h-4 text-sky-400 shrink-0" />;
    }
  };

  const getToastBorder = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'border-[#97D700] shadow-[0_0_25px_rgba(151,215,0,0.25)]';
      case 'warning':
        return 'border-[#FFC107] shadow-[0_0_25px_rgba(255,193,7,0.25)]';
      case 'error':
        return 'border-[#DC3545] shadow-[0_0_25px_rgba(220,53,69,0.25)]';
      case 'info':
      default:
        return 'border-sky-400 shadow-[0_0_25px_rgba(56,189,248,0.25)]';
    }
  };

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full px-4 pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`pointer-events-auto bg-black border-2 ${getToastBorder(
            toast.type
          )} p-3.5 flex items-start justify-between gap-3 text-white transition-all transform animate-in fade-in slide-in-from-top-3 duration-200`}
        >
          {/* Tactical Corner Accent */}
          <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-[#97D700]" />

          <div className="flex items-start gap-2.5 min-w-0">
            {getToastIcon(toast.type)}
            <p className="text-xs font-bold tracking-wide uppercase leading-snug break-words">
              {toast.message}
            </p>
          </div>

          <button
            onClick={() => dismissToast(toast.id)}
            className="text-[#777777] hover:text-white transition-colors p-0.5 ml-2 shrink-0"
            aria-label="Dismiss toast"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
