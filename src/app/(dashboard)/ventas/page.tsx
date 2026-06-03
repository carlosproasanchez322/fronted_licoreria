'use client';

import { useEffect, useState } from 'react';
import type { Producto } from '@/types';
import {
  getProductos,
} from '@/services/productos.service';
import {
  createVenta,
  getVentas,
  type Venta,
  type CreateVentaDto,
  getMetodosPago,
  type MetodoPago,
  deleteVenta,
} from '@/services/ventas.service';
import { VentaModal } from './components/VentaModal';
import { VentasPOS } from './components/VentasPOS';
import { VentasHistorial } from './components/VentasHistorial';
import { Toast, useToast } from '@/components/Toast';
import type { CarritoItemData } from './components/CarritoItem';

export default function VentasPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [metodosPago, setMetodosPago] = useState<MetodoPago[]>([]);
  const [carrito, setCarrito] = useState<CarritoItemData[]>([]);
  const [error, setError] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<number>(1);
  const { toasts, showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'pos' | 'historial'>('pos');

  // Modales
  const [showVentaModal, setShowVentaModal] = useState(false);
  const [selectedVenta, setSelectedVenta] = useState<Venta | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar datos
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productosData, ventasData, metodosData] = await Promise.all([
        getProductos(),
        getVentas(),
        getMetodosPago(),
      ]);
      setProductos(productosData);
      setVentas(ventasData);
      setMetodosPago(metodosData);
      if (metodosData.length > 0) {
        setSelectedPaymentMethod(metodosData[0].idMetodo);
      }
    } catch (err) {
      setError('Error al cargar datos');
      console.error(err);
    }
  };

  // Agregar producto al carrito
  const [selectedClient, setSelectedClient] = useState('');

  const handleAddProducto = (producto: Producto, cantidad: number = 1) => {
    const existingItem = carrito.find((item) => item.producto.id === producto.id);

    if (existingItem) {
      // Si ya existe, aumentar cantidad por lo especificado
      setCarrito(
        carrito.map((item) =>
          item.producto.id === producto.id
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        )
      );
    } else {
      // Agregar nuevo item con la cantidad especificada
      setCarrito([
        ...carrito,
        {
          producto,
          cantidad,
          descuento: 0,
        },
      ]);
    }
  };

  // Actualizar item del carrito
  const handleUpdateItem = (index: number, cantidad: number, descuento: number) => {
    const newCarrito = [...carrito];
    newCarrito[index] = {
      ...newCarrito[index],
      cantidad,
      descuento,
    };
    setCarrito(newCarrito);
  };

  // Remover item del carrito
  const handleRemoveItem = (index: number) => {
    setCarrito(carrito.filter((_, i) => i !== index));
  };

  // Limpiar carrito
  const handleClearCarrito = () => {
    setCarrito([]);
  };

  // Eliminar venta
  const handleDeleteVenta = async (idVenta: number) => {
    try {
      await deleteVenta(idVenta);
      setVentas(ventas.filter((v) => v.idVenta !== idVenta));
      showToast('Venta eliminada correctamente', 'success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar venta';
      showToast(errorMessage, 'error');
    }
  };

  // Procesar venta
  const handleCheckout = async () => {
    if (carrito.length === 0) {
      setError('El carrito está vacío');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      const dto: CreateVentaDto = {
        items: carrito.map((item) => ({
          idProducto: item.producto.id,
          cantidad: item.cantidad,
          descuento: item.descuento,
        })),
        idMetodo: selectedPaymentMethod,
      };

      const venta = await createVenta(dto);
      
      // Actualizar productos (reducir stock)
      setProductos(
        productos.map((p) => {
          const item = carrito.find((c) => c.producto.id === p.id);
          if (item) {
            return { ...p, stock: p.stock - item.cantidad };
          }
          return p;
        })
      );

      // Agregar venta a la lista
      setVentas([venta, ...ventas]);

      // Mostrar ticket
      setSelectedVenta(venta);
      setShowVentaModal(true);

      // Limpiar carrito y cliente
      setCarrito([]);
      setSelectedClient('');

      showToast('Venta registrada exitosamente', 'success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al procesar venta';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 h-screen flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Ventas</h1>
        <p className="mt-1 text-slate-400">
          {ventas.length} ventas registradas
        </p>
      </div>

      {/* Errores */}
      {error && (
        <div className="mb-4 rounded-lg bg-red-500/10 px-4 py-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6 flex gap-2 border-b border-slate-800">
        <button
          onClick={() => setActiveTab('pos')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'pos'
              ? 'border-b-2 border-emerald-600 text-emerald-400'
              : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          🛒 POS - Nueva Venta
        </button>
        <button
          onClick={() => setActiveTab('historial')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'historial'
              ? 'border-b-2 border-emerald-600 text-emerald-400'
              : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          📊 Historial

          
        </button>
        
      </div>

      {/* Contenido de Tabs */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'pos' && (
          <VentasPOS
            productos={productos}
            carrito={carrito}
            metodosPago={metodosPago}
            selectedPaymentMethod={selectedPaymentMethod}
            isLoading={isSubmitting}
            onAddProducto={handleAddProducto}
            onUpdateItem={handleUpdateItem}
            onRemoveItem={handleRemoveItem}
            onClear={handleClearCarrito}
            onCheckout={handleCheckout}
            onPaymentMethodChange={setSelectedPaymentMethod}
            selectedClient={selectedClient}
            onClientChange={setSelectedClient}
          />
        )}

        {activeTab === 'historial' && (
          <div className="overflow-y-auto h-full">
            <VentasHistorial
              ventas={ventas}
              onViewVenta={(venta) => {
                setSelectedVenta(venta);
                setShowVentaModal(true);
              }}
              onDeleteVenta={handleDeleteVenta}
            />
          </div>
        )}
      </div>

      {/* Modal de Venta */}
      <VentaModal
        isOpen={showVentaModal}
        venta={selectedVenta}
        onClose={() => {
          setShowVentaModal(false);
          setSelectedVenta(undefined);
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
