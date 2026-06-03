'use client';

import { X } from 'lucide-react';
import { MarcaForm } from './MarcaForm';
import type { Marca } from '@/types';
import type { CreateMarcaDto } from '@/services/marcas.service';

interface MarcaModalProps {
  isOpen: boolean;
  marca?: Marca;
  onClose: () => void;
  onSubmit: (data: CreateMarcaDto) => Promise<void>;
  isLoading?: boolean;
}

export function MarcaModal({
  isOpen,
  marca,
  onClose,
  onSubmit,
  isLoading = false,
}: MarcaModalProps) {
  if (!isOpen) return null;

  const initialData = marca
    ? {
        id: marca.id,
        nombre: marca.nombre,
      }
    : undefined;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-6">
          <h2 className="text-xl font-bold text-white">
            {marca ? 'Editar Marca' : 'Crear Nueva Marca'}
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
          <MarcaForm
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
