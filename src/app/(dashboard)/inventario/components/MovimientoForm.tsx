'use client';

import { useState } from 'react';
import type { Producto } from '@/types';
import type { MovimientoInventarioDto } from '@/services/inventario.service';

interface MovimientoFormProps {
  productos: Producto[];
  onSubmit: (data: MovimientoInventarioDto) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function MovimientoForm({
  productos,
  onSubmit,
  onCancel,
  isLoading = false,
}: MovimientoFormProps) {
  const [formData, setFormData] = useState<MovimientoInventarioDto>({
    idProducto: 0,
    tipoMovimiento: 'ENTRADA',
    cantidad: 0,
    motivo: '',
  });

  const [error, setError] = useState('');
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'idProducto') {
      const producto = productos.find((p) => p.id === Number(value));
      setSelectedProducto(producto || null);
      setFormData((prev) => ({
        ...prev,
        idProducto: Number(value),
      }));
    } else if (name === 'cantidad') {
      setFormData((prev) => ({
        ...prev,
        [name]: Number(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value === '' ? undefined : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.idProducto === 0) {
      setError('Selecciona un producto');
      return;
    }

    if (formData.cantidad <= 0) {
      setError('La cantidad debe ser mayor a 0');
      return;
    }

    if (formData.tipoMovimiento === 'SALIDA' || formData.tipoMovimiento === 'VENTA') {
      if (selectedProducto && selectedProducto.stock < formData.cantidad) {
        setError(
          `Stock insuficiente. Disponible: ${selectedProducto.stock} ${selectedProducto.unidad.abreviatura}`
        );
        return;
      }
    }

    try {
      await onSubmit(formData);
      // Reset form
      setFormData({
        idProducto: 0,
        tipoMovimiento: 'ENTRADA',
        cantidad: 0,
        motivo: '',
      });
      setSelectedProducto(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar movimiento');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-500/10 px-4 py-3 text-red-400">
          {error}
        </div>
      )}

      {/* Producto */}
      <div>
        <label className="block text-sm font-medium text-slate-300">
          Producto *
        </label>
        <select
          name="idProducto"
          value={formData.idProducto}
          onChange={handleChange}
          className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
          disabled={isLoading}
        >
          <option value={0}>Selecciona un producto</option>
          {productos.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre} (Stock: {p.stock} {p.unidad.abreviatura})
            </option>
          ))}
        </select>
      </div>

      {/* Tipo de Movimiento */}
      <div>
        <label className="block text-sm font-medium text-slate-300">
          Tipo de Movimiento *
        </label>
        <select
          name="tipoMovimiento"
          value={formData.tipoMovimiento}
          onChange={handleChange}
          className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
          disabled={isLoading}
        >
          <option value="ENTRADA">Entrada (Compra)</option>
          <option value="SALIDA">Salida (Ajuste)</option>
          <option value="VENTA">Venta</option>
        </select>
      </div>

      {/* Cantidad */}
      <div>
        <label className="block text-sm font-medium text-slate-300">
          Cantidad *
        </label>
        <input
          type="number"
          name="cantidad"
          value={formData.cantidad}
          onChange={handleChange}
          placeholder="0"
          min="1"
          className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
          disabled={isLoading}
        />
        {selectedProducto && (
          <p className="mt-1 text-xs text-slate-400">
            Unidad: {selectedProducto.unidad.nombre} ({selectedProducto.unidad.abreviatura})
          </p>
        )}
      </div>

      {/* Motivo */}
      <div>
        <label className="block text-sm font-medium text-slate-300">
          Motivo
        </label>
        <textarea
          name="motivo"
          value={formData.motivo || ''}
          onChange={handleChange}
          placeholder="Ej: Compra a proveedor, Ajuste por rotura, etc."
          rows={2}
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
          {isLoading ? 'Registrando...' : 'Registrar Movimiento'}
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
