'use client';

import { Trash2, User, X } from 'lucide-react';
import { CarritoItem, type CarritoItemData } from './CarritoItem';
import type { Producto } from '@/types';

interface PaymentMethod {
  idMetodo: number;
  nombre: string;
}

interface CarritoProps {
  items: CarritoItemData[];
  onAddProducto: (producto: Producto) => void;
  onUpdateItem: (index: number, cantidad: number, descuento: number) => void;
  onRemoveItem: (index: number) => void;
  onClear: () => void;
  onCheckout: () => void;
  isLoading?: boolean;
  paymentMethods?: PaymentMethod[];
  selectedPaymentMethod?: number;
  onPaymentMethodChange?: (idMetodo: number) => void;
  selectedClient?: string;
  onClientChange?: (client: string) => void;
  isModal?: boolean;
  onClose?: () => void;
}

export function Carrito({
  items,
  onRemoveItem,
  onClear,
  onCheckout,
  onUpdateItem,
  isLoading = false,
  paymentMethods = [],
  selectedPaymentMethod = 1,
  onPaymentMethodChange,
  selectedClient = '',
  onClientChange,
  isModal = false,
  onClose,
}: CarritoProps) {
  const subtotal = items.reduce(
    (sum, item) => sum + (item.producto.precioVenta * item.cantidad - item.descuento),
    0
  );

  const igv = subtotal * 0.18;
  const total = subtotal + igv;

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
        <div className="w-full max-w-2xl rounded-xl border border-slate-800 bg-slate-900 shadow-xl my-8">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 p-6">
            <div>
              <h2 className="text-xl font-bold text-white">Carrito de Compras</h2>
              <p className="mt-1 text-sm text-slate-400">
                {items.length} producto{items.length !== 1 ? 's' : ''} en carrito
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
          <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto space-y-6">
            {items.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-slate-400">Carrito vacío</p>
              </div>
            ) : (
              <>
                {/* Tabla de Productos */}
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
                      {items.map((item, index) => (
                        <tr key={index} className="text-slate-300">
                          <td className="px-4 py-2">
                            <p className="font-medium text-white line-clamp-2">
                              {item.producto.nombre}
                            </p>
                          </td>
                          <td className="px-4 py-2 text-right">{item.cantidad}</td>
                          <td className="px-4 py-2 text-right">
                            S/ {item.producto.precioVenta.toFixed(2)}
                          </td>
                          <td className="px-4 py-2 text-right font-medium">
                            S/ {(item.producto.precioVenta * item.cantidad - item.descuento).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Información de Cliente y Método de Pago */}
                <div className="space-y-3 border-t border-slate-700 pt-4">
                  {/* Método de Pago */}
                  {paymentMethods.length > 0 && (
                    <div>
                      <label className="text-xs font-medium text-slate-400 block mb-2">
                        Método de Pago
                      </label>
                      <select
                        value={selectedPaymentMethod}
                        onChange={(e) => onPaymentMethodChange?.(Number(e.target.value))}
                        className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-600 transition-colors"
                      >
                        {paymentMethods.map((method) => (
                          <option key={method.idMetodo} value={method.idMetodo}>
                            {method.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Cliente Opcional */}
                  <div>
                    <label className="text-xs font-medium text-slate-400 block mb-2 flex items-center gap-1">
                      <User className="h-3 w-3" />
                      Cliente (Opcional)
                    </label>
                    <input
                      type="text"
                      placeholder="Nombre del cliente..."
                      value={selectedClient}
                      onChange={(e) => onClientChange?.(e.target.value)}
                      className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-600 transition-colors"
                    />
                  </div>
                </div>

                {/* Totales */}
                <div className="space-y-2 border-t border-slate-700 pt-4">
                  <div className="flex justify-between text-slate-300">
                    <span>Subtotal:</span>
                    <span>S/ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>IGV (18%):</span>
                    <span>S/ {igv.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-700 pt-2 text-lg font-bold text-white">
                    <span>Total:</span>
                    <span className="text-emerald-400">S/ {total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Botones de Acción */}
                <div className="flex gap-2 border-t border-slate-700 pt-4">
                  <button
                    onClick={onClear}
                    className="flex items-center gap-2 rounded-lg bg-red-600/20 px-4 py-2 font-medium text-red-400 hover:bg-red-600/30 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    Limpiar
                  </button>
                  <button
                    onClick={onCheckout}
                    disabled={isLoading || items.length === 0}
                    className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 font-bold text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? 'Procesando...' : 'Procesar Venta'}
                  </button>
                  <button
                    onClick={onClose}
                    className="rounded-lg border border-slate-700 px-4 py-2 font-medium text-slate-300 hover:bg-slate-800 transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Vista normal (sidebar)
  return (
    <div className="sticky top-8 rounded-lg border border-slate-800 bg-slate-900 p-6 max-h-[calc(100vh-120px)] flex flex-col">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Carrito</h2>
        {items.length > 0 && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-red-400 hover:bg-red-600/20 transition-colors"
          >
            <Trash2 className="h-3 w-3" />
            Limpiar
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex-1 flex items-center justify-center rounded-lg border border-slate-800 bg-slate-900/50">
          <p className="text-sm text-slate-400">Carrito vacío</p>
        </div>
      ) : (
        <>
          {/* Items del Carrito */}
          <div className="mb-4 flex-1 space-y-2 overflow-y-auto pr-2">
            {items.map((item, index) => (
              <CarritoItem
                key={index}
                item={item}
                onUpdateCantidad={(cantidad) =>
                  onUpdateItem(index, cantidad, item.descuento)
                }
                onUpdateDescuento={(descuento) =>
                  onUpdateItem(index, item.cantidad, descuento)
                }
                onRemove={() => onRemoveItem(index)}
              />
            ))}
          </div>

          {/* Separador */}
          <div className="border-t border-slate-700 pt-4 space-y-3">
            {/* Resumen de Totales */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Subtotal:</span>
                <span className="font-medium text-white">S/ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">IGV (18%):</span>
                <span className="font-medium text-white">S/ {igv.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-700 pt-2">
                <span className="font-bold text-white">Total:</span>
                <span className="text-lg font-bold text-emerald-400">
                  S/ {total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Método de Pago */}
            {paymentMethods.length > 0 && (
              <div className="pt-2">
                <label className="text-xs font-medium text-slate-400 block mb-2">
                  Método de Pago
                </label>
                <select
                  value={selectedPaymentMethod}
                  onChange={(e) => onPaymentMethodChange?.(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-600 transition-colors"
                >
                  {paymentMethods.map((method) => (
                    <option key={method.idMetodo} value={method.idMetodo}>
                      {method.nombre}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Cliente Opcional */}
            <div className="pt-2">
              <label className="text-xs font-medium text-slate-400 block mb-2 flex items-center gap-1">
                <User className="h-3 w-3" />
                Cliente (Opcional)
              </label>
              <input
                type="text"
                placeholder="Nombre del cliente..."
                value={selectedClient}
                onChange={(e) => onClientChange?.(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-600 transition-colors"
              />
            </div>

            {/* Botón Checkout */}
            <button
              onClick={onCheckout}
              disabled={isLoading || items.length === 0}
              className="w-full rounded-lg bg-emerald-600 px-4 py-3 font-bold text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-2"
            >
              {isLoading ? 'Procesando...' : 'Procesar Venta'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
