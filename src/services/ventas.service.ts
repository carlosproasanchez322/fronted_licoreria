import { api } from './api';

export interface VentaDetalle {
  idDetalle: number;
  idVenta: number;
  idProducto: number;
  cantidad: number;
  precioUnitario: number;
  descuento: number;
  subtotal: number;
  producto: {
    idProducto: number;
    nombre: string;
    codigoBarra?: string;
  };
}

export interface Venta {
  idVenta: number;
  fecha: string;
  subtotal: number;
  igv: number;
  total: number;
  tipoComprobante?: string;
  numeroComprobante?: string;
  idCliente?: number;
  idUsuario: number;
  idMetodo: number;
  usuario: {
    idUsuario: number;
    nombres: string;
    usuario: string;
  };
  metodo: {
    idMetodo: number;
    nombre: string;
  };
  cliente?: {
    idCliente: number;
    nombres?: string;
    apellidos?: string;
  };
  detalles: VentaDetalle[];
}

export interface VentaItemDto {
  idProducto: number;
  cantidad: number;
  descuento?: number;
}

export interface CreateVentaDto {
  items: VentaItemDto[];
  idMetodo?: number;
  idCliente?: number;
  tipoComprobante?: string;
  numeroComprobante?: string;
}

export interface ResumenDia {
  _sum: {
    total: number | null;
    subtotal: number | null;
    igv: number | null;
  };
  _count: {
    idVenta: number;
  };
}

export async function getVentas() {
  const { data } = await api.get<Venta[]>('/ventas');
  return data;
}

export async function getVenta(id: number) {
  const { data } = await api.get<Venta>(`/ventas/${id}`);
  return data;
}

export async function createVenta(dto: CreateVentaDto) {
  const { data } = await api.post<Venta>('/ventas', dto);
  return data;
}

export async function getResumenDia() {
  const { data } = await api.get<ResumenDia>('/ventas/resumen/dia');
  return data;
}

export interface MetodoPago {
  idMetodo: number;
  nombre: string;
}

export async function getMetodosPago() {
  const { data } = await api.get<MetodoPago[]>('/metodos-pago');
  return data;
}

export async function deleteVenta(id: number) {
  const { data } = await api.delete<Venta>(`/ventas/${id}`);
  return data;
}
