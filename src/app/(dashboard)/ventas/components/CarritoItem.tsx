'use client';

import { Trash2 } from 'lucide-react';
import type { Producto } from '@/types';

export interface CarritoItemData {
  producto: Producto;
  cantidad: number;
  descuento: number;
}

interface CarritoItemProps {
  item: CarritoItemData;
  onUpdateCantidad: (cantidad: number) => void;
  onUpdateDescuento: (descuento: number) => void;
  onRemove: () => void;
}

export function CarritoItem({
  item,
  onUpdateCantidad,
  onUpdateDescuento,
  onRemove,
}: CarritoItemProps) {
  const subtotal = item.producto.precioVenta * item.cantidad - item.descuento;

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800 p-3 space-y-2">
      {/* Nombre del producto */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-medium text-white text-sm">{item.producto.nombre}</h4>
          <p className="text-xs text-slate-400">
            S/ {item.producto.precioVenta.toFixed(2)} c/u
          </p>
        </div>
        <button
          onClick={onRemove}
          className="rounded p-1 text-slate-400 hover:bg-red-600/20 hover:text-red-400 transition-colors"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>

      {/* Cantidad, Descuento y Subtotal */}
      <div className="grid grid-cols-3 gap-2">
        {/* Cantidad */}
        <div>
          <label className="text-xs text-slate-400 block mb-1">Cant</label>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onUpdateCantidad(Math.max(1, item.cantidad - 1))}
              className="rounded px-1.5 py-0.5 text-xs text-slate-400 hover:bg-slate-700 transition-colors font-bold"
            >
              −
            </button>
            <input
              type="number"
              value={item.cantidad}
              onChange={(e) => onUpdateCantidad(Math.max(1, Number(e.target.value)))}
              className="w-full rounded border border-slate-600 bg-slate-900 px-1 py-0.5 text-center text-xs text-white"
              min="1"
            />
            <button
              onClick={() => onUpdateCantidad(item.cantidad + 1)}
              className="rounded px-1.5 py-0.5 text-xs text-slate-400 hover:bg-slate-700 transition-colors font-bold"
            >
              +
            </button>
          </div>
        </div>

        {/* Descuento */}
        <div>
          <label className="text-xs text-slate-400 block mb-1">Desc</label>
          <input
            type="number"
            value={item.descuento}
            onChange={(e) => onUpdateDescuento(Math.max(0, Number(e.target.value)))}
            placeholder="0.00"
            className="w-full rounded border border-slate-600 bg-slate-900 px-1 py-0.5 text-center text-xs text-white placeholder-slate-500"
            min="0"
          />
        </div>

        {/* Subtotal */}
        <div>
          <label className="text-xs text-slate-400 block mb-1">Total</label>
          <div className="rounded border border-slate-600 bg-slate-900/50 px-1 py-0.5 text-center">
            <span className="font-bold text-xs text-emerald-400">
              S/ {subtotal.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
