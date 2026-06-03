'use client';

import { X } from 'lucide-react';
import { CategoriaForm } from './CategoriaForm';
import type { Categoria } from '@/types';
import type { CreateCategoriaDto } from '@/services/categorias.service';

interface CategoriaModalProps {
  isOpen: boolean;
  categoria?: Categoria;
  onClose: () => void;
  onSubmit: (data: CreateCategoriaDto) => Promise<void>;
  isLoading?: boolean;
}

export function CategoriaModal({
  isOpen,
  categoria,
  onClose,
  onSubmit,
  isLoading = false,
}: CategoriaModalProps) {
  if (!isOpen) return null;

  const initialData = categoria
    ? {
        id: categoria.id,
        nombre: categoria.nombre,
        descripcion: categoria.descripcion || undefined,
      }
    : undefined;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-6">
          <h2 className="text-xl font-bold text-white">
            {categoria ? 'Editar Categoría' : 'Crear Nueva Categoría'}
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
          <CategoriaForm
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
