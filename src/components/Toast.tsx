'use client';

import { useEffect, useState } from 'react';
import { Check, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
}

export function Toast({ message, type = 'info', duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const bgColor = {
    success: 'bg-emerald-500/90',
    error: 'bg-red-500/90',
    info: 'bg-blue-500/90',
  }[type];

  const Icon = {
    success: Check,
    error: AlertCircle,
    info: Info,
  }[type];

  return (
    <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 sm:gap-3 rounded-lg ${bgColor} px-3 sm:px-4 py-2 sm:py-3 text-white shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-[calc(100vw-2rem)] sm:max-w-md`}>
      <Icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
      <p className="text-xs sm:text-sm font-medium flex-1 break-words">{message}</p>
      <button
        onClick={() => setIsVisible(false)}
        className="ml-1 sm:ml-2 rounded hover:bg-white/20 p-0.5 sm:p-1 transition-colors"
        aria-label="Cerrar notificación"
      >
        <X className="h-3 w-3 sm:h-4 sm:w-4" />
      </button>
    </div>
  );
}

// Hook para usar toasts
export function useToast() {
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: ToastType }>>([]);

  const showToast = (message: string, type: ToastType = 'info', duration = 3000) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  };

  return { toasts, showToast };
}
