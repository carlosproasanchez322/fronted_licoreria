'use client';

import { useEffect, useState } from 'react';
import { Plus, Search, Grid, List, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Producto, Categoria } from '@/types';
import {
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto,
  type CreateProductoDto,
} from '@/services/productos.service';
import { getCategorias } from '@/services/categorias.service';
import { ProductoCard } from './components/ProductoCard';
import { ProductoModal } from './components/ProductoModal';
import { ProductoFormModal } from './components/ProductoFormModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { Toast, useToast } from '@/components/Toast';

const ITEMS_PER_PAGE = 12;

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const { toasts, showToast } = useToast();

  // Modales
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<Producto | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Cargar productos y categorías
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [productosData, categoriasData] = await Promise.all([
        getProductos(),
        getCategorias(),
      ]);
      setProductos(productosData);
      setCategorias(categoriasData);
    } catch (err) {
      setError('Error al cargar datos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar productos
  const filteredProductos = productos.filter((p) => {
    const matchesSearch =
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.codigoBarra?.includes(searchTerm) ||
      p.categoria.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.marca?.nombre.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategoryId === null || p.categoria.id === selectedCategoryId;

    return matchesSearch && matchesCategory;
  });

  // Paginación
  const totalPages = Math.ceil(filteredProductos.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedProductos = filteredProductos.slice(startIndex, endIndex);

  // Resetear a página 1 cuando cambia el filtro
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategoryId]);

  // Crear producto
  const handleCreate = async (data: CreateProductoDto) => {
    try {
      setIsSubmitting(true);
      setError('');
      const newProducto = await createProducto(data);
      setProductos([newProducto, ...productos]);
      // Establecer como selectedProducto para mostrar fotos
      setSelectedProducto(newProducto);
      // NO cerrar el modal, mantenerlo abierto para agregar fotos
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear producto');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Actualizar producto
  const handleUpdate = async (data: CreateProductoDto) => {
    if (!selectedProducto) return;

    try {
      setIsSubmitting(true);
      setError('');
      const updated = await updateProducto(selectedProducto.id, data);
      setProductos(
        productos.map((p) => (p.id === updated.id ? updated : p))
      );
      setShowFormModal(false);
      setSelectedProducto(undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar producto');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Eliminar producto
  const handleDelete = async (id: number) => {
    const producto = productos.find((p) => p.id === id);
    if (!producto) return;

    setSelectedProducto(producto);
    setShowDeleteModal(true);
  };

  // Confirmar eliminación
  const handleConfirmDelete = async () => {
    if (!selectedProducto) return;

    try {
      setIsDeleting(true);
      setError('');
      await deleteProducto(selectedProducto.id);
      setProductos(productos.filter((p) => p.id !== selectedProducto.id));
      setShowDeleteModal(false);
      showToast(`Producto "${selectedProducto.nombre}" eliminado exitosamente`, 'success');
      setSelectedProducto(undefined);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar producto';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Abrir modal de edición
  const handleEditClick = (producto: Producto) => {
    setSelectedProducto(producto);
    setShowFormModal(true);
  };

  // Abrir modal de detalles
  const handleViewClick = (producto: Producto) => {
    setSelectedProducto(producto);
    setShowDetailModal(true);
  };

  // Cerrar modales
  const handleCloseFormModal = () => {
    setShowFormModal(false);
    setSelectedProducto(undefined);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Productos</h1>
            <p className="mt-1 text-sm sm:text-base text-slate-400">
              {filteredProductos.length} de {productos.length} productos
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedProducto(undefined);
              setShowFormModal(true);
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span className="hidden sm:inline">Nuevo Producto</span>
            <span className="sm:hidden">Nuevo</span>
          </button>
        </div>
      </div>

      {/* Errores */}
      {error && (
        <div className="mb-4 sm:mb-6 rounded-lg bg-red-500/10 px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base text-red-400">
          {error}
        </div>
      )}

      {/* Controles */}
      <div className="mb-4 sm:mb-6 space-y-3 sm:space-y-4">
        {/* Primera fila: Búsqueda y Vista */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          {/* Búsqueda */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar por nombre, código, categoría o marca..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 text-sm sm:text-base text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Vista */}
          <div className="flex gap-2 rounded-lg border border-slate-700 bg-slate-900 p-1 self-start">
            <button
              onClick={() => setViewMode('grid')}
              className={`rounded px-2 sm:px-3 py-1 transition-colors ${
                viewMode === 'grid'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Grid className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`rounded px-2 sm:px-3 py-1 transition-colors ${
                viewMode === 'list'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>

        {/* Segunda fila: Filtro de categoría */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          <button
            onClick={() => setSelectedCategoryId(null)}
            className={`flex-shrink-0 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-colors ${
              selectedCategoryId === null
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Todas
          </button>
          {categorias.map((categoria) => (
            <button
              key={categoria.id}
              onClick={() => setSelectedCategoryId(categoria.id)}
              className={`flex-shrink-0 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-colors ${
                selectedCategoryId === categoria.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {categoria.nombre}
            </button>
          ))}
        </div>
      </div>

      {/* Contenido */}
      {loading ? (
        <div className="flex items-center justify-center py-8 sm:py-12">
          <p className="text-slate-400 text-sm sm:text-base">Cargando productos...</p>
        </div>
      ) : filteredProductos.length === 0 ? (
        <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-6 sm:p-8 md:p-12 text-center">
          <p className="text-slate-400 text-sm sm:text-base">
            {searchTerm || selectedCategoryId
              ? 'No se encontraron productos'
              : 'No hay productos. Crea uno para empezar.'}
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        /* Vista Grid */
        <>
          <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {paginatedProductos.map((producto) => (
              <ProductoCard
                key={producto.id}
                producto={producto}
                onEdit={handleEditClick}
                onDelete={handleDelete}
                onView={handleViewClick}
              />
            ))}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="mt-6 sm:mt-8 flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="rounded-lg border border-slate-700 bg-slate-900 p-2 text-slate-400 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`rounded-lg px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'border border-slate-700 bg-slate-900 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-slate-700 bg-slate-900 p-2 text-slate-400 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          )}
        </>
      ) : (
        /* Vista Lista - Responsive */
        <>
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-slate-900 text-slate-400">
                <tr>
                  <th className="px-4 sm:px-6 py-3">Producto</th>
                  <th className="px-4 sm:px-6 py-3">Categoría</th>
                  <th className="px-4 sm:px-6 py-3 hidden sm:table-cell">Marca</th>
                  <th className="px-4 sm:px-6 py-3 text-right">P. Compra</th>
                  <th className="px-4 sm:px-6 py-3 text-right">P. Venta</th>
                  <th className="px-4 sm:px-6 py-3 text-right">Stock</th>
                  <th className="px-4 sm:px-6 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-900/50">
                {paginatedProductos.map((p) => (
                  <tr key={p.id} className="text-slate-300 hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <div>
                        <p className="font-medium text-white text-sm sm:text-base">{p.nombre}</p>
                        {p.codigoBarra && (
                          <p className="text-xs text-slate-500">{p.codigoBarra}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <span className="text-xs sm:text-sm">{p.categoria.nombre}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 hidden sm:table-cell">
                      <span className="text-xs sm:text-sm">{p.marca?.nombre ?? '—'}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-right">
                      <span className="text-xs sm:text-sm">S/ {p.precioCompra.toFixed(2)}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-right font-medium text-emerald-400">
                      <span className="text-xs sm:text-sm">S/ {p.precioVenta.toFixed(2)}</span>
                    </td>
                    <td
                      className={`px-4 sm:px-6 py-3 sm:py-4 text-right font-medium ${
                        p.stock <= 5 ? 'text-red-400' : 'text-slate-300'
                      }`}
                    >
                      <span className="text-xs sm:text-sm">{p.stock} {p.unidad.abreviatura}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-right">
                      <div className="flex justify-end gap-1 sm:gap-2">
                        <button
                          onClick={() => handleViewClick(p)}
                          className="rounded px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                          title="Ver"
                        >
                          <span className="hidden sm:inline">Ver</span>
                          <span className="sm:hidden text-xs">👁️</span>
                        </button>
                        <button
                          onClick={() => handleEditClick(p)}
                          className="rounded px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs text-blue-400 hover:bg-blue-600/20 transition-colors"
                          title="Editar"
                        >
                          <span className="hidden sm:inline">Editar</span>
                          <span className="sm:hidden text-xs">✏️</span>
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="rounded px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs text-red-400 hover:bg-red-600/20 transition-colors"
                          title="Eliminar"
                        >
                          <span className="hidden sm:inline">Eliminar</span>
                          <span className="sm:hidden text-xs">🗑️</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="mt-6 sm:mt-8 flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="rounded-lg border border-slate-700 bg-slate-900 p-2 text-slate-400 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`rounded-lg px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'border border-slate-700 bg-slate-900 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-slate-700 bg-slate-900 p-2 text-slate-400 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          )}
        </>
      )}

      {/* Modales */}
      <ProductoFormModal
        isOpen={showFormModal}
        producto={selectedProducto}
        onClose={handleCloseFormModal}
        onSubmit={selectedProducto ? handleUpdate : handleCreate}
        isLoading={isSubmitting}
      />

      {selectedProducto && (
        <ProductoModal
          producto={selectedProducto}
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
        />
      )}

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        productName={selectedProducto?.nombre || ''}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setSelectedProducto(undefined);
        }}
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

