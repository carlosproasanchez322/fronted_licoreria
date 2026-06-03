'use client';

import { X } from 'lucide-react';
import { UnidadForm } from './UnidadForm';
import type { Unidad } from '@/types';
import type { CreateUnidadDto } from '@/services/unidades.service';

interface UnidadModalProps {
  isOpen: boolean;
  unidad?: Unidad;
  onClose: () => void;
  onSubmit: (data: CreateUnidadDto) => Promise<void>;
  isLoading?: boolean;
}

export function UnidadModal({
  isOpen,
  unidad,
  onClose,
  onSubmit,
  isLoading = false,
}: UnidadModalProps) {
  if (!isOpen) return null;

  const initialData = unidad
    ? {
        id: unidad.id,
        nombre: unidad.nombre,
        abreviatura: unidad.abreviatura,
      }
    : undefined;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-6">
          <h2 className="text-xl font-bold text-white">
            {unidad ? 'Editar Unidad' : 'Crear Nueva Unidad'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5 text-slate-400" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6">
          <UnidadForm
            initialData={initialData}
            onSubmit={onSubmit}
            onCancel={onClose}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
