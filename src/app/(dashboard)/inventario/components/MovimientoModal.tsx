'use client';

import { X } from 'lucide-react';
import { MovimientoForm } from './MovimientoForm';
import type { Producto } from '@/types';
import type { MovimientoInventarioDto } from '@/services/inventario.service';

interface MovimientoModalProps {
  isOpen: boolean;
  productos: Producto[];
  onClose: () => void;
  onSubmit: (data: MovimientoInventarioDto) => Promise<void>;
  isLoading?: boolean;
}

export function MovimientoModal({
  isOpen,
  productos,
  onClose,
  onSubmit,
  isLoading = false,
}: MovimientoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-6">
          <h2 className="text-xl font-bold text-white">
            Registrar Movimiento
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5 text-slate-400" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          <MovimientoForm
            productos={productos}
            onSubmit={onSubmit}
            onCancel={onClose}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
