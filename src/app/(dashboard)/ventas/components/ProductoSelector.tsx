'use client';

import { Search, Plus, Minus, X } from 'lucide-react';
import { useState, useMemo } from 'react';
import type { Producto } from '@/types';
import { useToast } from '@/components/Toast';

interface ProductoSelectorProps {
  productos: Producto[];
  onSelectProducto: (producto: Producto, cantidad?: number) => void;
  isLoading?: boolean;
}

const PRODUCTOS_POR_PAGINA = 8;

interface ModalState {
  isOpen: boolean;
  producto: Producto | null;
  cantidad: number;
}

export function ProductoSelector({
  productos,
  onSelectProducto,
  isLoading = false,
}: ProductoSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [modal, setModal] = useState<ModalState>({ isOpen: false, producto: null, cantidad: 1 });
  const { showToast } = useToast();

  const filteredProductos = useMemo(
    () =>
      productos.filter(
        (p) =>
          p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.codigoBarra?.includes(searchTerm)
      ),
    [productos, searchTerm]
  );

  const totalPages = Math.ceil(filteredProductos.length / PRODUCTOS_POR_PAGINA);
  const startIndex = (currentPage - 1) * PRODUCTOS_POR_PAGINA;
  const paginatedProductos = filteredProductos.slice(
    startIndex,
    startIndex + PRODUCTOS_POR_PAGINA
  );

  const handleSelectProducto = (producto: Producto) => {
    if (producto.stock === 0) {
      showToast(`${producto.nombre} - Sin stock disponible`, 'error');
      return;
    }
    setModal({ isOpen: true, producto, cantidad: 1 });
  };

  const handleConfirmAdd = () => {
    if (!modal.producto) return;
    
    // Agregar el producto con la cantidad especificada
    onSelectProducto(modal.producto, modal.cantidad);
    
    // Mostrar notificación mejorada
    const mensajeNotificacion = 
      modal.cantidad === 1 
        ? `✓ ${modal.producto.nombre} agregado al carrito`
        : `✓ ${modal.cantidad}x ${modal.producto.nombre} agregado al carrito`;
    
    showToast(mensajeNotificacion, 'success');
    setModal({ isOpen: false, producto: null, cantidad: 1 });
  };

  const handleCloseModal = () => {
    setModal({ isOpen: false, producto: null, cantidad: 1 });
  };

  const handleIncrementCantidad = () => {
    if (!modal.producto) return;
    if (modal.cantidad < modal.producto.stock) {
      setModal({ ...modal, cantidad: modal.cantidad + 1 });
    }
  };

  const handleDecrementCantidad = () => {
    if (modal.cantidad > 1) {
      setModal({ ...modal, cantidad: modal.cantidad - 1 });
    }
  };

  return (
    <>
      <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 h-full flex flex-col">
        <h2 className="mb-3 text-lg font-bold text-white">Productos</h2>

        {/* Búsqueda */}
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar nombre o código..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:border-emerald-600 focus:outline-none transition-colors"
            disabled={isLoading}
          />
        </div>

        {/* Grid de Productos */}
        {isLoading ? (
          <div className="flex items-center justify-center flex-1">
            <p className="text-sm text-slate-400">Cargando productos...</p>
          </div>
        ) : filteredProductos.length === 0 ? (
          <div className="flex items-center justify-center flex-1">
            <p className="text-sm text-slate-400">
              {searchTerm ? 'No encontrado' : 'Sin productos'}
            </p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto pr-2">
              <div className="grid gap-2 grid-cols-2 lg:grid-cols-2">
                {paginatedProductos.map((producto) => (
                  <div
                    key={producto.id}
                    className={`rounded-lg border p-3 text-left text-xs transition-colors ${
                      producto.stock === 0
                        ? 'border-slate-700 bg-slate-800 opacity-40 cursor-not-allowed'
                        : 'border-slate-700 bg-slate-800 hover:border-emerald-600 hover:bg-slate-700'
                    }`}
                  >
                    <p className="font-medium text-white line-clamp-2">{producto.nombre}</p>
                    <p className="text-slate-400 mt-1">
                      S/ {producto.precioVenta.toFixed(2)}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-slate-500">Stock:</span>
                      <span
                        className={`font-bold ${
                          producto.stock <= 5 ? 'text-red-400' : 'text-emerald-400'
                        }`}
                      >
                        {producto.stock}
                      </span>
                    </div>

                    {/* Botón Agregar */}
                    <button
                      onClick={() => handleSelectProducto(producto)}
                      disabled={producto.stock === 0}
                      className="w-full mt-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-2 text-xs font-medium text-white transition-colors flex items-center justify-center gap-1"
                    >
                      <Plus className="h-3 w-3" />
                      Agregar
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between border-t border-slate-700 pt-3">
                <p className="text-xs text-slate-400">
                  Página {currentPage} de {totalPages}
                </p>
                <div className="flex gap-1">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="rounded px-2 py-1 text-xs text-slate-400 hover:bg-slate-700 disabled:opacity-50 transition-colors"
                  >
                    Ant
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="rounded px-2 py-1 text-xs text-slate-400 hover:bg-slate-700 disabled:opacity-50 transition-colors"
                  >
                    Sig
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

    {/* Modal de Cantidad */}
{modal.isOpen && modal.producto && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
    
    <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden">
      
      {/* Header */}
      <div className="flex items-start justify-between border-b border-slate-800 px-6 py-5">
        <div>
          <h2 className="text-xl font-semibold text-white">
            Agregar al carrito
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Configura la cantidad del producto
          </p>
        </div>

        <button
          onClick={handleCloseModal}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Body */}
      <div className="p-6">
        
        {/* Producto */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
          <h3 className="line-clamp-2 text-base font-medium text-white">
            {modal.producto.nombre}
          </h3>

          <div className="mt-4 flex items-center justify-between">
            
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Precio
              </p>

              <p className="mt-1 text-xl font-bold text-emerald-400">
                S/ {modal.producto.precioVenta.toFixed(2)}
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Stock
              </p>

              <p className="mt-1 text-lg font-bold text-white">
                {modal.producto.stock}
              </p>
            </div>
          </div>
        </div>

      {/* Cantidad */}
<div className="mt-6">
  <div className="mb-4 flex items-center justify-between">
    
    <div>
      <p className="text-sm font-medium text-white">
        Cantidad
      </p>

      <p className="text-xs text-slate-400">
        Ajusta la cantidad del producto
      </p>
    </div>

    <div className="rounded-full bg-emerald-500/10 px-3 py-1">
      <span className="text-xs font-medium text-emerald-400">
        Máx: {modal.producto.stock}
      </span>
    </div>
  </div>

  <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-4">
    
    <div className="flex items-center justify-center gap-5">
      
      {/* Botón Restar */}
      <button
        onClick={handleDecrementCantidad}
        disabled={modal.cantidad <= 1}
        className="group flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-700 bg-slate-800 text-slate-300 transition-all hover:scale-105 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Minus className="h-5 w-5 transition-transform group-hover:scale-110" />
      </button>

      {/* Cantidad */}
      <div className="relative flex h-20 w-28 flex-col items-center justify-center rounded-3xl border border-emerald-500/20 bg-gradient-to-b from-slate-800 to-slate-900 shadow-inner">
        
        <span className="text-[34px] font-bold leading-none text-white">
          {modal.cantidad}
        </span>

        <span className="mt-1 text-[10px] uppercase tracking-widest text-slate-500">
          unidades
        </span>
      </div>

      {/* Botón Sumar */}
      <button
        onClick={handleIncrementCantidad}
        disabled={modal.cantidad >= modal.producto.stock}
        className="group flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-700 bg-slate-800 text-slate-300 transition-all hover:scale-105 hover:bg-emerald-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Plus className="h-5 w-5 transition-transform group-hover:scale-110" />
      </button>
    </div>
  </div>
</div>
        {/* Subtotal */}
        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
          <div className="flex items-center justify-between">
            
            <span className="text-slate-400">
              Subtotal
            </span>

            <span className="text-2xl font-bold text-emerald-400">
              S/{' '}
              {(modal.producto.precioVenta * modal.cantidad).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Botones */}
        <div className="mt-6 flex gap-3">
          
          <button
            onClick={handleCloseModal}
            className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 font-medium text-slate-300 hover:bg-slate-700 transition"
          >
            Cancelar
          </button>

          <button
            onClick={handleConfirmAdd}
            className="flex-1 rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-white hover:bg-emerald-600 transition shadow-lg shadow-emerald-500/20"
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </>
  );
}
