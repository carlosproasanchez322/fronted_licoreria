'use client';

import { X, Download } from 'lucide-react';
import type { Venta } from '@/services/ventas.service';
import { exportVentaToPDF } from '../utils/pdf';

interface VentaModalProps {
  isOpen: boolean;
  venta?: Venta;
  onClose: () => void;
}

export function VentaModal({ isOpen, venta, onClose }: VentaModalProps) {
  if (!isOpen || !venta) return null;

  const handleExportPDF = () => {
    exportVentaToPDF(venta);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-xl border border-slate-800 bg-slate-900 shadow-xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-6">
          <div>
            <h2 className="text-xl font-bold text-white">
              Ticket de Venta #{venta.idVenta}
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              {new Date(venta.fecha).toLocaleDateString('es-PE', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              PDF
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1 hover:bg-slate-800 transition-colors"
            >
              <X className="h-5 w-5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6">
          {/* Información General */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-400">Vendedor</p>
              <p className="text-sm font-medium text-white">{venta.usuario.nombres}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Método de Pago</p>
              <p className="text-sm font-medium text-white">{venta.metodo.nombre}</p>
            </div>
          </div>

          {/* Detalles */}
          <div className="rounded-lg border border-slate-800 overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-800 text-slate-300">
                <tr>
                  <th className="px-4 py-2">Producto</th>
                  <th className="px-4 py-2 text-right">Cantidad</th>
                  <th className="px-4 py-2 text-right">Precio</th>
                  <th className="px-4 py-2 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-900/50">
                {venta.detalles.map((detalle) => (
                  <tr key={detalle.idDetalle} className="text-slate-300">
                    <td className="px-4 py-2">
                      <p className="font-medium text-white">
                        {detalle.producto.nombre}
                      </p>
                    </td>
                    <td className="px-4 py-2 text-right">{detalle.cantidad}</td>
                    <td className="px-4 py-2 text-right">
                      S/ {Number(detalle.precioUnitario).toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-right font-medium">
                      S/ {Number(detalle.subtotal).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totales */}
          <div className="space-y-2 border-t border-slate-700 pt-4">
            <div className="flex justify-between text-slate-300">
              <span>Subtotal:</span>
              <span>S/ {Number(venta.subtotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>IGV (18%):</span>
              <span>S/ {Number(venta.igv).toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-slate-700 pt-2 text-lg font-bold text-white">
              <span>Total:</span>
              <span className="text-emerald-400">S/ {Number(venta.total).toFixed(2)}</span>
            </div>
          </div>

          {/* Botón Cerrar */}
          <button
            onClick={onClose}
            className="w-full rounded-lg border border-slate-700 px-4 py-2 font-medium text-slate-300 hover:bg-slate-800 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
