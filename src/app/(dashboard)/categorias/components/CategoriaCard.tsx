'use client';

import { Edit2, Eye, Trash2 } from 'lucide-react';
import type { Categoria } from '@/types';

interface CategoriaCardProps {
  categoria: Categoria;
  onView: (categoria: Categoria) => void;
  onEdit: (categoria: Categoria) => void;
  onDelete: (id: number) => void;
}

export function CategoriaCard({ categoria, onView, onEdit, onDelete }: CategoriaCardProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 hover:border-slate-700 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white">{categoria.nombre}</h3>
          {categoria.descripcion && (
            <p className="mt-2 text-sm text-slate-400">{categoria.descripcion}</p>
          )}
          <p className="mt-4 text-xs text-amber-400/80 font-medium">
            {categoria._count?.productos ?? 0} productos
          </p>
        </div>
        <div className="flex gap-2 ml-4">
          <button
            onClick={() => onView(categoria)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-emerald-400 transition-colors"
            title="Ver productos"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => onEdit(categoria)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-blue-400 transition-colors"
            title="Editar"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(categoria.id)}
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
