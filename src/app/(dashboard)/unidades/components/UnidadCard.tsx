'use client';

import { Edit2, Eye, Trash2 } from 'lucide-react';
import type { Unidad } from '@/types';

interface UnidadCardProps {
  unidad: Unidad;
  onView: (unidad: Unidad) => void;
  onEdit: (unidad: Unidad) => void;
  onDelete: (id: number) => void;
}

export function UnidadCard({ unidad, onView, onEdit, onDelete }: UnidadCardProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 hover:border-slate-700 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-3xl font-bold text-amber-400">{unidad.abreviatura}</p>
          <h3 className="mt-2 text-lg font-semibold text-white">{unidad.nombre}</h3>
          <p className="mt-4 text-xs text-slate-400 font-medium">
            {unidad._count?.productos ?? 0} productos
          </p>
        </div>
        <div className="flex gap-2 ml-4">
          <button
            onClick={() => onView(unidad)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-emerald-400 transition-colors"
            title="Ver productos"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => onEdit(unidad)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-blue-400 transition-colors"
            title="Editar"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(unidad.id)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors"
            title="Eliminar"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
