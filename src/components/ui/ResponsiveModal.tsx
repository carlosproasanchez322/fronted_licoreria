'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';

interface ResponsiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnEsc?: boolean;
  closeOnOverlayClick?: boolean;
}

export function ResponsiveModal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnEsc = true,
  closeOnOverlayClick = true,
}: ResponsiveModalProps) {
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, closeOnEsc]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
    full: 'sm:max-w-full sm:m-4',
  }[size];

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-black/50 transition-opacity duration-300"
        onClick={closeOnOverlayClick ? onClose : undefined}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        <div
          className={`w-full max-h-[90vh] overflow-hidden rounded-lg bg-slate-900 border border-slate-800 shadow-xl ${sizeClasses}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {(title || closeOnEsc) && (
            <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3 sm:px-6 sm:py-4">
              {title && (
                <h2 className="text-base sm:text-lg font-semibold text-white">
                  {title}
                </h2>
              )}
              <button
                onClick={onClose}
                className="ml-auto rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                aria-label="Cerrar modal"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          )}

          {/* Content */}
          <div className="max-h-[calc(90vh-80px)] overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}

// Componente para modales de formulario
interface ResponsiveFormModalProps extends Omit<ResponsiveModalProps, 'children'> {
  onSubmit?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  children: React.ReactNode;
}

export function ResponsiveFormModal({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  submitLabel = 'Guardar',
  cancelLabel = 'Cancelar',
  isLoading = false,
  size = 'md',
}: ResponsiveFormModalProps) {
  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={size}
    >
      <div className="p-4 sm:p-6">
        {children}
      </div>

      {(onSubmit || onClose) && (
        <div className="border-t border-slate-800 p-4 sm:p-6">
          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
            {onClose && (
              <button
                onClick={onClose}
                disabled={isLoading}
                className="w-full sm:w-auto px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {cancelLabel}
              </button>
            )}
            {onSubmit && (
              <button
                onClick={onSubmit}
                disabled={isLoading}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Procesando...' : submitLabel}
              </button>
            )}
          </div>
        </div>
      )}
    </ResponsiveModal>
  );
}