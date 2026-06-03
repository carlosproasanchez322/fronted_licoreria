'use client';

import { useState, useMemo } from 'react';
import { Download, Eye, Filter, X, Trash2, ArrowUpDown } from 'lucide-react';
import type { Venta } from '@/services/ventas.service';
import { exportVentaToPDF } from '../utils/pdf';

interface VentasHistorialProps {
  ventas: Venta[];
  onViewVenta: (venta: Venta) => void;
  onDeleteVenta?: (idVenta: number) => Promise<void>;
}

export function VentasHistorial({ ventas, onViewVenta, onDeleteVenta }: VentasHistorialProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMethod, setFilterMethod] = useState<number | 'all'>('all');
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' });
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const itemsPerPage = 10;

  // Filtrar ventas
  const filteredVentas = useMemo(() => {
    let result = ventas.filter((venta) => {
      // Filtro por búsqueda (ID de venta o cliente)
      const searchMatch =
        venta.idVenta.toString().includes(searchTerm) ||
        venta.usuario.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (venta.cliente?.nombres || '').toLowerCase().includes(searchTerm.toLowerCase());

      // Filtro por método de pago
      const methodMatch =
        filterMethod === 'all' || venta.idMetodo === filterMethod;

      // Filtro por fecha
      let dateMatch = true;
      if (dateFilter.start || dateFilter.end) {
        const ventaDate = new Date(venta.fecha).toISOString().split('T')[0];
        if (dateFilter.start && ventaDate < dateFilter.start) dateMatch = false;
        if (dateFilter.end && ventaDate > dateFilter.end) dateMatch = false;
      }

      return searchMatch && methodMatch && dateMatch;
    });

    // Ordenar por ID (más reciente arriba)
    result = result.sort((a, b) => {
      return sortOrder === 'desc' ? b.idVenta - a.idVenta : a.idVenta - b.idVenta;
    });

    return result;
  }, [ventas, searchTerm, filterMethod, dateFilter, sortOrder]);

  // Paginación
  const totalPages = Math.ceil(filteredVentas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVentas = filteredVentas.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Obtener métodos únicos
  const uniqueMethods = Array.from(
    new Map(ventas.map((v) => [v.idMetodo, v.metodo])).values()
  );

  // Calcular totales
  const totals = useMemo(() => {
    return {
      count: filteredVentas.length,
      subtotal: filteredVentas.reduce((sum, v) => sum + Number(v.subtotal), 0),
      igv: filteredVentas.reduce((sum, v) => sum + Number(v.igv), 0),
      total: filteredVentas.reduce((sum, v) => sum + Number(v.total), 0),
    };
  }, [filteredVentas]);

  // Exportar a PDF
  const handleExportPDF = (venta: Venta) => {
    exportVentaToPDF(venta);
  };
  const handleExport = () => {
    const headers = [
      'ID Venta',
      'Fecha',
      'Cliente',
      'Vendedor',
      'Método Pago',
      'Subtotal',
      'IGV',
      'Total',
    ];
    const rows = filteredVentas.map((v) => [
      v.idVenta,
      new Date(v.fecha).toLocaleDateString('es-PE'),
      v.cliente?.nombres || 'Mostrador',
      v.usuario.nombres,
      v.metodo.nombre,
      Number(v.subtotal).toFixed(2),
      Number(v.igv).toFixed(2),
      Number(v.total).toFixed(2),
    ]);

    const csv = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ventas_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterMethod('all');
    setDateFilter({ start: '', end: '' });
    setCurrentPage(1);
  };

  const handleDelete = async (idVenta: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta venta?')) {
      return;
    }

    try {
      setDeletingId(idVenta);
      if (onDeleteVenta) {
        await onDeleteVenta(idVenta);
      }
    } catch (error) {
      console.error('Error al eliminar venta:', error);
      alert('Error al eliminar la venta');
    } finally {
      setDeletingId(null);
    }
  };

  const hasActiveFilters =
    searchTerm || filterMethod !== 'all' || dateFilter.start || dateFilter.end;

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Historial de Ventas</h2>
          <p className="mt-1 text-sm text-slate-400">
            {totals.count} venta{totals.count !== 1 ? 's' : ''} encontrada
            {totals.count !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 transition-colors"
        >
          <Download className="h-4 w-4" />
          Exportar
        </button>
      </div>

      {/* Filtros */}
      <div className="mb-6 space-y-4 rounded-lg border border-slate-700 bg-slate-800/50 p-4">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Filter className="h-4 w-4" />
          <span>Filtros</span>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Búsqueda */}
          <input
            type="text"
            placeholder="Buscar por ID, cliente o vendedor..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-600"
          />

          {/* Método de pago */}
          <select
            value={filterMethod}
            onChange={(e) => {
              setFilterMethod(
                e.target.value === 'all' ? 'all' : Number(e.target.value)
              );
              setCurrentPage(1);
            }}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-600"
          >
            <option value="all">Todos los métodos</option>
            {uniqueMethods.map((method) => (
              <option key={method.idMetodo} value={method.idMetodo}>
                {method.nombre}
              </option>
            ))}
          </select>

          {/* Fecha inicio */}
          <input
            type="date"
            value={dateFilter.start}
            onChange={(e) => {
              setDateFilter({ ...dateFilter, start: e.target.value });
              setCurrentPage(1);
            }}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-600"
          />

          {/* Fecha fin */}
          <input
            type="date"
            value={dateFilter.end}
            onChange={(e) => {
              setDateFilter({ ...dateFilter, end: e.target.value });
              setCurrentPage(1);
            }}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-600"
          />
        </div>

        {/* Botón reset */}
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-2 rounded px-3 py-1 text-sm text-slate-400 hover:bg-slate-700 transition-colors"
          >
            <X className="h-4 w-4" />
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Tabla */}
      <div className="mb-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-700 bg-slate-800">
            <tr>
              <th
                onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                className="px-4 py-3 font-semibold text-slate-300 cursor-pointer hover:bg-slate-700 transition-colors"
                title="Haz clic para ordenar"
              >
                <div className="flex items-center gap-2">
                  ID
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </th>
              <th className="px-4 py-3 font-semibold text-slate-300">Fecha y Hora</th>
              <th className="px-4 py-3 font-semibold text-slate-300">Cliente</th>
              <th className="px-4 py-3 font-semibold text-slate-300">Vendedor</th>
              <th className="px-4 py-3 font-semibold text-slate-300">Método</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-300">
                Total
              </th>
              <th className="px-4 py-3 text-center font-semibold text-slate-300">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {paginatedVentas.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                  No hay ventas que coincidan con los filtros
                </td>
              </tr>
            ) : (
              paginatedVentas.map((venta) => (
                <tr
                  key={venta.idVenta}
                  className="hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-white">
                    #{venta.idVenta}
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {new Date(venta.fecha).toLocaleDateString('es-PE', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {venta.cliente?.nombres || 'Mostrador'}
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {venta.usuario.nombres}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-block rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-emerald-400">
                      {venta.metodo.nombre}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-emerald-400">
                    S/ {Number(venta.total).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {/* Ver */}
                      <button
                        onClick={() => onViewVenta(venta)}
                        className="inline-flex rounded-lg p-2 hover:bg-slate-700 transition-colors"
                        title="Ver detalles"
                      >
                        <Eye className="h-4 w-4 text-blue-400" />
                      </button>

                      {/* Exportar PDF */}
                      <button
                        onClick={() => handleExportPDF(venta)}
                        className="inline-flex rounded-lg p-2 hover:bg-slate-700 transition-colors"
                        title="Exportar a PDF"
                      >
                        <Download className="h-4 w-4 text-green-400" />
                      </button>

                      {/* Eliminar */}
                      <button
                        onClick={() => handleDelete(venta.idVenta)}
                        disabled={deletingId === venta.idVenta}
                        className="inline-flex rounded-lg p-2 hover:bg-red-600/20 transition-colors disabled:opacity-50"
                        title="Eliminar venta"
                      >
                        <Trash2
                          className={`h-4 w-4 ${
                            deletingId === venta.idVenta
                              ? 'text-red-300'
                              : 'text-red-400'
                          }`}
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Totales */}
      <div className="mb-6 rounded-lg border border-slate-700 bg-slate-800/50 p-4">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <p className="text-xs text-slate-400">Cantidad</p>
            <p className="text-lg font-bold text-white">{totals.count}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Subtotal</p>
            <p className="text-lg font-bold text-white">
              S/ {totals.subtotal.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400">IGV</p>
            <p className="text-lg font-bold text-white">
              S/ {totals.igv.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Total</p>
            <p className="text-lg font-bold text-emerald-400">
              S/ {totals.total.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-400">
            Página {currentPage} de {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 disabled:opacity-50 transition-colors"
            >
              Anterior
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  currentPage === page
                    ? 'bg-emerald-600 text-white'
                    : 'border border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 disabled:opacity-50 transition-colors"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
