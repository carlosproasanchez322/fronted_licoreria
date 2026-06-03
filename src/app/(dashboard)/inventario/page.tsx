'use client';

import { useEffect, useState } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import type { Producto } from '@/types';
import {
  getKardex,
  registrarMovimiento,
  type MovimientoInventario,
  type MovimientoInventarioDto,
} from '@/services/inventario.service';
import { getProductos } from '@/services/productos.service';
import { KardexTable } from './components/KardexTable';
import { MovimientoModal } from './components/MovimientoModal';
import { Toast, useToast } from '@/components/Toast';

export default function InventarioPage() {
  const [movimientos, setMovimientos] = useState<MovimientoInventario[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { toasts, showToast } = useToast();

  // Modales
  const [showMovimientoModal, setShowMovimientoModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar datos
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [movimientosData, productosData] = await Promise.all([
        getKardex(),
        getProductos(),
      ]);
      setMovimientos(movimientosData);
      setProductos(productosData);
    } catch (err) {
      setError('Error al cargar datos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Registrar movimiento
  const handleRegistrarMovimiento = async (data: MovimientoInventarioDto) => {
    try {
      setIsSubmitting(true);
      setError('');
      const nuevoMovimiento = await registrarMovimiento(data);
      
      // Agregar el nuevo movimiento al inicio de la lista
      setMovimientos([nuevoMovimiento, ...movimientos]);
      
      // Actualizar el stock del producto en la lista
      setProductos(
        productos.map((p) =>
          p.id === data.idProducto
            ? { ...p, stock: nuevoMovimiento.stockNuevo }
            : p
        )
      );
      
      setShowMovimientoModal(false);
      showToast('Movimiento registrado exitosamente', 'success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al registrar movimiento';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Inventario</h1>
            <p className="mt-1 text-slate-400">
              Kardex y movimientos de inventario
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={loadData}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 font-medium text-slate-300 hover:bg-slate-800 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className="h-5 w-5" />
              Actualizar
            </button>
            <button
              onClick={() => setShowMovimientoModal(true)}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Nuevo Movimiento
            </button>
          </div>
        </div>
      </div>

      {/* Errores */}
      {error && (
        <div className="mb-6 rounded-lg bg-red-500/10 px-4 py-3 text-red-400">
          {error}
        </div>
      )}

      {/* Resumen de Productos */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
          <p className="text-sm text-slate-400">Total de Productos</p>
          <p className="mt-2 text-2xl font-bold text-white">{productos.length}</p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
          <p className="text-sm text-slate-400">Stock Bajo (≤ 5)</p>
          <p className="mt-2 text-2xl font-bold text-red-400">
            {productos.filter((p) => p.stock <= 5).length}
          </p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
          <p className="text-sm text-slate-400">Sin Stock</p>
          <p className="mt-2 text-2xl font-bold text-red-600">
            {productos.filter((p) => p.stock === 0).length}
          </p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
          <p className="text-sm text-slate-400">Movimientos Registrados</p>
          <p className="mt-2 text-2xl font-bold text-blue-400">
            {movimientos.length}
          </p>
        </div>
      </div>

      {/* Kardex */}
      <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
        <h2 className="mb-4 text-xl font-bold text-white">Kardex</h2>
        <KardexTable movimientos={movimientos} isLoading={loading} />
      </div>

      {/* Modal */}
      <MovimientoModal
        isOpen={showMovimientoModal}
        productos={productos}
        onClose={() => setShowMovimientoModal(false)}
        onSubmit={handleRegistrarMovimiento}
        isLoading={isSubmitting}
      />

      {/* Toasts */}
      <div className="fixed bottom-4 right-4 z-40 space-y-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={3000}
          />
        ))}
      </div>
    </div>
  );
}
