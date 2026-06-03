'use client';

import { useState } from 'react';
import type { CreateUnidadDto } from '@/services/unidades.service';

interface UnidadFormProps {
  initialData?: CreateUnidadDto & { id?: number };
  onSubmit: (data: CreateUnidadDto) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function UnidadForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: UnidadFormProps) {
  const [formData, setFormData] = useState<CreateUnidadDto>(
    initialData || {
      nombre: '',
      abreviatura: '',
    }
  );

  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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

    if (!formData.abreviatura.trim()) {
      setError('La abreviatura es requerida');
      return;
    }

    if (formData.abreviatura.trim().length < 1) {
      setError('La abreviatura debe tener al menos 1 carácter');
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
          Nombre de la Unidad *
        </label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Ej: Litro, Mililitro, Botella"
          className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
          disabled={isLoading}
        />
      </div>

      {/* Abreviatura */}
      <div>
        <label className="block text-sm font-medium text-slate-300">
          Abreviatura *
        </label>
        <input
          type="text"
          name="abreviatura"
          value={formData.abreviatura}
          onChange={handleChange}
          placeholder="Ej: L, ml, bot"
          maxLength={10}
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
          {isLoading ? 'Guardando...' : 'Guardar Unidad'}
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
