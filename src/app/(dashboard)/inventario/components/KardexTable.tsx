'use client';

import type { MovimientoInventario } from '@/services/inventario.service';

interface KardexTableProps {
  movimientos: MovimientoInventario[];
  isLoading?: boolean;
}

export function KardexTable({ movimientos, isLoading }: KardexTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-slate-400">Cargando movimientos...</p>
      </div>
    );
  }

  if (movimientos.length === 0) {
    return (
      <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-8 text-center">
        <p className="text-slate-400">No hay movimientos de inventario</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-800">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-800 text-slate-300">
          <tr>
            <th className="px-6 py-3 font-medium">Fecha</th>
            <th className="px-6 py-3 font-medium">Producto</th>
            <th className="px-6 py-3 font-medium">Tipo</th>
            <th className="px-6 py-3 font-medium text-right">Cantidad</th>
            <th className="px-6 py-3 font-medium text-right">Stock Anterior</th>
            <th className="px-6 py-3 font-medium text-right">Stock Nuevo</th>
            <th className="px-6 py-3 font-medium">Motivo</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800 bg-slate-900/50">
          {movimientos.map((mov) => (
            <tr
              key={mov.idMovimiento}
              className="text-slate-300 hover:bg-slate-800/50 transition-colors"
            >
              <td className="px-6 py-4 text-sm">
                {new Date(mov.fecha).toLocaleDateString('es-PE', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </td>
              <td className="px-6 py-4">
                <div>
                  <p className="font-medium text-white">{mov.producto.nombre}</p>
                  {mov.producto.codigoBarra && (
                    <p className="text-xs text-slate-500">{mov.producto.codigoBarra}</p>
                  )}
                </div>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                    mov.tipoMovimiento === 'ENTRADA'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : mov.tipoMovimiento === 'SALIDA'
                      ? 'bg-red-500/20 text-red-400'
                      : mov.tipoMovimiento === 'VENTA'
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-slate-500/20 text-slate-400'
                  }`}
                >
                  {mov.tipoMovimiento}
                </span>
              </td>
              <td className="px-6 py-4 text-right font-medium">{mov.cantidad}</td>
              <td className="px-6 py-4 text-right">{mov.stockAnterior}</td>
              <td className="px-6 py-4 text-right font-medium text-amber-400">
                {mov.stockNuevo}
              </td>
              <td className="px-6 py-4 text-sm text-slate-400">
                {mov.motivo || '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
