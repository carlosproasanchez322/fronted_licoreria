'use client';

import { useState, useEffect } from 'react';
import type { Producto } from '@/types';
import { getMediaUrl } from '@/config/api';
import { X, Play, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductoModalProps {
  producto: Producto;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductoModal({ producto, isOpen, onClose }: ProductoModalProps) {
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  // Cerrar con ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const margenGanancia = (
    ((producto.precioVenta - producto.precioCompra) / producto.precioCompra) *
    100
  ).toFixed(1);

  const gananciaUnitaria = (producto.precioVenta - producto.precioCompra).toFixed(2);

  // Obtener media del producto
  const media = producto.media || [];
  const currentMedia = media[selectedMediaIndex];

  const isVideo = currentMedia?.tipo === 'video' || currentMedia?.mimeType?.startsWith('video/');
  const isImage = currentMedia?.tipo === 'image' || currentMedia?.mimeType?.startsWith('image/');

  const handlePrevMedia = () => {
    setSelectedMediaIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
    setIsPlayingVideo(false);
  };

  const handleNextMedia = () => {
    setSelectedMediaIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
    setIsPlayingVideo(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-xl border border-slate-800 bg-slate-900 shadow-xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-6">
          <h2 className="text-xl font-bold text-white">Detalles del Producto</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5 text-slate-400" />
          </button>
        </div>

        {/* Contenido - Scrolleable */}
        <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Galería de fotos y videos */}
          {media.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-slate-300 mb-4">
                Fotos y Videos
              </h3>
              <div className="rounded-lg bg-slate-800/50 p-4">
                <div className="relative bg-black rounded-lg overflow-hidden flex items-center justify-center aspect-video">
                  {currentMedia && isImage && (
                    <img
                      src={getMediaUrl(currentMedia.urlPublica || currentMedia.ruta)}
                      alt="Producto"
                      className="w-full h-full object-contain"
                    />
                  )}

                  {currentMedia && isVideo && (
                    <>
                      {isPlayingVideo ? (
                        <video
                          src={getMediaUrl(currentMedia.urlPublica || currentMedia.ruta)}
                          controls
                          autoPlay
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-black">
                          <button
                            onClick={() => setIsPlayingVideo(true)}
                            className="relative z-10 rounded-full bg-blue-600 p-4 hover:bg-blue-700 transition-colors shadow-lg"
                          >
                            <Play className="h-8 w-8 text-white fill-white" />
                          </button>
                        </div>
                      )}
                    </>
                  )}

                  {/* Navegación */}
                  {media.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevMedia}
                        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 hover:bg-black/75 transition-colors z-20"
                      >
                        <ChevronLeft className="h-6 w-6 text-white" />
                      </button>
                      <button
                        onClick={handleNextMedia}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 hover:bg-black/75 transition-colors z-20"
                      >
                        <ChevronRight className="h-6 w-6 text-white" />
                      </button>
                    </>
                  )}

                  {/* Indicador */}
                  {media.length > 1 && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-20">
                      {media.map((_: any, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setSelectedMediaIndex(idx);
                            setIsPlayingVideo(false);
                          }}
                          className={`h-2 rounded-full transition-all ${
                            idx === selectedMediaIndex
                              ? 'bg-blue-500 w-6'
                              : 'bg-white/50 w-2 hover:bg-white/75'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Thumbnails */}
                {media.length > 1 && (
                  <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
                    {media.map((m: any, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedMediaIndex(idx);
                          setIsPlayingVideo(false);
                        }}
                        className={`flex-shrink-0 h-16 w-16 rounded-lg overflow-hidden border-2 transition-colors ${
                          idx === selectedMediaIndex
                            ? 'border-blue-500'
                            : 'border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        {m.tipo === 'video' || m.mimeType?.startsWith('video/') ? (
                          <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                            <Play className="h-6 w-6 text-white" />
                          </div>
                        ) : (
                          <img
                            src={getMediaUrl(m.urlPublica || m.ruta)}
                            alt="Thumbnail"
                            className="w-full h-full object-cover"
                          />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Información del Producto */}
          <div className={media.length > 0 ? 'border-t border-slate-800 pt-6' : ''}>
            <h3 className="text-sm font-medium text-slate-300 mb-4">
              Información del Producto
            </h3>

            {/* Nombre y código */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-300">Nombre</label>
                <p className="mt-1 text-slate-400">{producto.nombre}</p>
              </div>

              {producto.codigoBarra && (
                <div>
                  <label className="text-sm font-medium text-slate-300">Código de Barra</label>
                  <p className="mt-1 text-slate-400">{producto.codigoBarra}</p>
                </div>
              )}

              {producto.descripcion && (
                <div>
                  <label className="text-sm font-medium text-slate-300">Descripción</label>
                  <p className="mt-1 text-slate-400">{producto.descripcion}</p>
                </div>
              )}

              {/* Categoría, Marca, Unidad */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-300">Categoría</label>
                  <p className="mt-1 text-slate-400">{producto.categoria.nombre}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300">Marca</label>
                  <p className="mt-1 text-slate-400">{producto.marca?.nombre || '—'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300">Unidad</label>
                  <p className="mt-1 text-slate-400">{producto.unidad.nombre}</p>
                </div>
              </div>

              {/* Precios */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-300">Precio de Compra</label>
                  <p className="mt-1 text-lg font-bold text-slate-300">
                    S/ {producto.precioCompra.toFixed(2)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300">Precio de Venta</label>
                  <p className="mt-1 text-lg font-bold text-emerald-400">
                    S/ {producto.precioVenta.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Ganancia */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-300">Ganancia Unitaria</label>
                  <p className="mt-1 text-lg font-bold text-blue-400">
                    S/ {gananciaUnitaria}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300">Margen de Ganancia</label>
                  <p className="mt-1 text-lg font-bold text-purple-400">
                    {margenGanancia}%
                  </p>
                </div>
              </div>

              {/* Stock */}
              <div>
                <label className="text-sm font-medium text-slate-300">Stock Disponible</label>
                <div className="mt-1 flex items-baseline gap-2">
                  <p className={`text-2xl font-bold ${
                    producto.stock <= 5 ? 'text-red-400' : 'text-emerald-400'
                  }`}>
                    {producto.stock}
                  </p>
                  <p className="text-slate-400">{producto.unidad.abreviatura}</p>
                </div>
                {producto.stock <= 5 && (
                  <p className="mt-2 text-sm text-red-400">
                    ⚠️ Stock bajo - Considera hacer un pedido
                  </p>
                )}
              </div>

              {/* Valor total en stock */}
              <div>
                <label className="text-sm font-medium text-slate-300">Valor Total en Stock</label>
                <p className="mt-1 text-lg font-bold text-emerald-400">
                  S/ {(producto.precioVenta * producto.stock).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 p-6">
          <button
            onClick={onClose}
            className="w-full rounded-lg bg-slate-800 px-4 py-2 font-medium text-slate-300 hover:bg-slate-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
