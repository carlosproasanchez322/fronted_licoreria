'use client';

import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import type { Producto } from '@/types';
import { ProductoSelector } from './ProductoSelector';
import { Carrito } from './Carrito';
import type { CarritoItemData } from './CarritoItem';
import type { MetodoPago } from '@/services/ventas.service';

interface VentasPOSProps {
  productos: Producto[];
  carrito: CarritoItemData[];
  metodosPago: MetodoPago[];
  selectedPaymentMethod: number;
  isLoading: boolean;
  onAddProducto: (producto: Producto, cantidad?: number) => void;
  onUpdateItem: (index: number, cantidad: number, descuento: number) => void;
  onRemoveItem: (index: number) => void;
  onClear: () => void;
  onCheckout: () => void;
  onPaymentMethodChange: (idMetodo: number) => void;
  selectedClient?: string;
  onClientChange?: (client: string) => void;
}

export function VentasPOS({
  productos,
  carrito,
  metodosPago,
  selectedPaymentMethod,
  isLoading,
  onAddProducto,
  onUpdateItem,
  onRemoveItem,
  onClear,
  onCheckout,
  onPaymentMethodChange,
  selectedClient,
  onClientChange,
}: VentasPOSProps) {
  const [showCarritoModal, setShowCarritoModal] = useState(false);

  return (
    <>
      <div className="flex flex-col h-full">
        {/* Header con botón de carrito */}
        <div className="flex justify-end px-6 py-3 border-b border-slate-800">
          <button
            onClick={() => setShowCarritoModal(true)}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700 transition-colors"
          >
            <ShoppingCart className="h-4 w-4" />
            Carrito
            {carrito.length > 0 && (
              <span className="ml-1 rounded-full bg-white text-emerald-600 px-2 py-0.5 text-xs font-bold">
                {carrito.length}
              </span>
            )}
          </button>
        </div>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 h-full overflow-hidden px-6 py-6">
          {/* Selector de Productos - 4 columnas */}
          <div className="lg:col-span-4 overflow-hidden">
            <ProductoSelector
              productos={productos}
              onSelectProducto={onAddProducto}
              isLoading={false}
            />
          </div>

        </div>
      </div>

      {/* Modal del Carrito */}
      {showCarritoModal && (
        <Carrito
          items={carrito}
          onAddProducto={onAddProducto}
          onUpdateItem={onUpdateItem}
          onRemoveItem={onRemoveItem}
          onClear={onClear}
          onCheckout={onCheckout}
          isLoading={isLoading}
          paymentMethods={metodosPago}
          selectedPaymentMethod={selectedPaymentMethod}
          onPaymentMethodChange={onPaymentMethodChange}
          selectedClient={selectedClient}
          onClientChange={onClientChange}
          isModal={true}
          onClose={() => setShowCarritoModal(false)}
        />
      )}
    </>
  );
}
