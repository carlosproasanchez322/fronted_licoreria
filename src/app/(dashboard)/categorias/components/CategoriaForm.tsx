'use client';

import { useState } from 'react';
import type { CreateCategoriaDto } from '@/services/categorias.service';
import type { Categoria } from '@/types';

interface CategoriaFormProps {
  initialData?: CreateCategoriaDto & { id?: number };
  onSubmit: (data: CreateCategoriaDto) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function CategoriaForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: CategoriaFormProps) {
  const [formData, setFormData] = useState<CreateCategoriaDto>(
    initialData || {
      nombre: '',
      descripcion: '',
    }
  );

  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === '' ? undefined : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.nombre.trim()) {
      setError('El nombre es requerido');
      return;
    }

    if (formData.nombre.trim().length < 2) {
      setError('El nombre debe tener al menos 2 caracteres');
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-500/10 px-4 py-3 text-red-400">
          {error}
        </div>
      )}

      {/* Nombre */}
      <div>
        <label className="block text-sm font-medium text-slate-300">
          Nombre de la Categoría *
        </label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Ej: Whisky, Ron, Cerveza"
          className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
          disabled={isLoading}
        />
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm font-medium text-slate-300">
          Descripción
        </label>
        <textarea
          name="descripcion"
          value={formData.descripcion || ''}
          onChange={handleChange}
          placeholder="Descripción de la categoría"
          rows={3}
          className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
          disabled={isLoading}
        />
      </div>

      {/* Botones */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {isLoading ? 'Guardando...' : 'Guardar Categoría'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 rounded-lg border border-slate-700 px-4 py-2 font-medium text-slate-300 hover:bg-slate-800 disabled:opacity-50 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
