'use client';

import { Edit2, Eye, Trash2 } from 'lucide-react';
import type { Marca } from '@/types';

interface MarcaCardProps {
  marca: Marca;
  onView: (marca: Marca) => void;
  onEdit: (marca: Marca) => void;
  onDelete: (id: number) => void;
}

export function MarcaCard({ marca, onView, onEdit, onDelete }: MarcaCardProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 hover:border-slate-700 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white">{marca.nombre}</h3>
          <p className="mt-4 text-xs text-amber-400/80 font-medium">
            {marca._count?.productos ?? 0} productos
          </p>
        </div>
        <div className="flex gap-2 ml-4">
          <button
            onClick={() => onView(marca)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-emerald-400 transition-colors"
            title="Ver productos"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => onEdit(marca)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-blue-400 transition-colors"
            title="Editar"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(marca.id)}
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
