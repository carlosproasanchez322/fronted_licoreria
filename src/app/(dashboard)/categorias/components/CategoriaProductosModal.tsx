'use client';

import { X } from 'lucide-react';
import type { Categoria } from '@/types';

interface CategoriaProductosModalProps {
  isOpen: boolean;
  categoria?: Categoria;
  onClose: () => void;
}

export function CategoriaProductosModal({
  isOpen,
  categoria,
  onClose,
}: CategoriaProductosModalProps) {
  if (!isOpen || !categoria) return null;

  const productos = categoria.productos || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="w-full max-w-4xl rounded-xl border border-slate-800 bg-slate-900 shadow-xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-6">
          <div>
            <h2 className="text-xl font-bold text-white">
              Productos en "{categoria.nombre}"
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              {productos.length} producto{productos.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5 text-slate-400" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {productos.length === 0 ? (
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-8 text-center">
              <p className="text-slate-400">
                No hay productos en esta categoría
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-slate-800">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-800 text-slate-300">
                  <tr>
                    <th className="px-6 py-3 font-medium">Producto</th>
                    <th className="px-6 py-3 font-medium text-right">P. Venta</th>
                    <th className="px-6 py-3 font-medium text-right">Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-900/50">
                  {productos.map((producto: any) => (
                    <tr
                      key={producto.idProducto}
                      className="text-slate-300 hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-white">
                          {producto.nombre}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-emerald-400 font-medium">
                          S/ {Number(producto.precioVenta).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span
                          className={`font-medium ${
                            producto.stock <= 5
                              ? 'text-red-400'
                              : 'text-slate-300'
                          }`}
                        >
                          {producto.stock}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
