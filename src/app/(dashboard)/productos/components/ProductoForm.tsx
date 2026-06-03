'use client';

import { useEffect, useState } from 'react';
import type { Categoria, Marca, Unidad } from '@/types';
import type { CreateProductoDto } from '@/services/productos.service';
import { getCategorias } from '@/services/categorias.service';
import { getMarcas } from '@/services/marcas.service';
import { getUnidades } from '@/services/unidades.service';

interface ProductoFormProps {
  initialData?: CreateProductoDto & { id?: number };
  onSubmit: (data: CreateProductoDto) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ProductoForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: ProductoFormProps) {
  const [formData, setFormData] = useState<CreateProductoDto>(
    initialData || {
      nombre: '',
      descripcion: '',
      precioCompra: 0,
      precioVenta: 0,
      stock: 0,
      codigoBarra: '',
      idCategoria: 0,
      idMarca: undefined,
      idUnidad: 0,
    }
  );

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [unidades, setUnidades] = useState<Unidad[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [cats, marks, units] = await Promise.all([
          getCategorias(),
          getMarcas(),
          getUnidades(),
        ]);
        setCategorias(cats);
        setMarcas(marks);
        setUnidades(units);
      } catch (err) {
        setError('Error al cargar datos');
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    // Special handling for idMarca: convert 0 to undefined
    if (name === 'idMarca') {
      setFormData((prev) => ({
        ...prev,
        [name]: value === '' || value === '0' ? undefined : Number(value),
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'number'
          ? value === ''
            ? 0
            : Number(value)
          : value === ''
          ? undefined
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.nombre.trim()) {
      setError('El nombre es requerido');
      return;
    }

    if (formData.idCategoria === 0) {
      setError('Selecciona una categoría');
      return;
    }

    if (formData.idUnidad === 0) {
      setError('Selecciona una unidad de medida');
      return;
    }

    if (formData.precioCompra <= 0 || formData.precioVenta <= 0) {
      setError('Los precios deben ser mayores a 0');
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    }
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-slate-400">Cargando datos...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-500/10 px-4 py-3 text-red-400">
          {error}
        </div>
      )}

      {/* Nombre */}
      <div>
        <label className="block text-sm font-medium text-slate-300">
          Nombre del Producto *
        </label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Ej: Black Label"
          className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
          disabled={isLoading}
        />
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm font-medium text-slate-300">
          Descripción
        </label>
        <textarea
          name="descripcion"
          value={formData.descripcion || ''}
          onChange={handleChange}
          placeholder="Descripción del producto"
          rows={3}
          className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
          disabled={isLoading}
        />
      </div>

      {/* Categoría y Marca */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300">
            Categoría *
          </label>
          <select
            name="idCategoria"
            value={formData.idCategoria}
            onChange={handleChange}
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
            disabled={isLoading}
          >
            <option value={0}>Selecciona una categoría</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300">
            Marca
          </label>
          <select
            name="idMarca"
            value={formData.idMarca || 0}
            onChange={handleChange}
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
            disabled={isLoading}
          >
            <option value={0}>Sin marca</option>
            {marcas.map((marca) => (
              <option key={marca.id} value={marca.id}>
                {marca.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Unidad de Medida */}
      <div>
        <label className="block text-sm font-medium text-slate-300">
          Unidad de Medida *
        </label>
        <select
          name="idUnidad"
          value={formData.idUnidad}
          onChange={handleChange}
          className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
          disabled={isLoading}
        >
          <option value={0}>Selecciona una unidad</option>
          {unidades.map((unit) => (
            <option key={unit.id} value={unit.id}>
              {unit.nombre} ({unit.abreviatura})
            </option>
          ))}
        </select>
      </div>

      {/* Precios */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300">
            Precio Compra *
          </label>
          <input
            type="number"
            name="precioCompra"
            value={formData.precioCompra}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300">
            Precio Venta *
          </label>
          <input
            type="number"
            name="precioVenta"
            value={formData.precioVenta}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Stock y Código de Barra */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300">
            Stock *
          </label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            placeholder="0"
            min="0"
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300">
            Código de Barra
          </label>
          <input
            type="text"
            name="codigoBarra"
            value={formData.codigoBarra || ''}
            onChange={handleChange}
            placeholder="Ej: 5000267001234"
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Guardando...' : 'Guardar Producto'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 rounded-lg border border-slate-700 px-4 py-2 font-medium text-slate-300 hover:bg-slate-800 disabled:opacity-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
