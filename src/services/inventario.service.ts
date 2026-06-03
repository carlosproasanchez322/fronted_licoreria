import { api } from './api';

export interface MovimientoInventario {
  idMovimiento: number;
  idProducto: number;
  tipoMovimiento: string;
  motivo?: string;
  cantidad: number;
  stockAnterior: number;
  stockNuevo: number;
  fecha: string;
  producto: {
    idProducto: number;
    nombre: string;
    codigoBarra?: string;
  };
}

export interface MovimientoInventarioDto {
  idProducto: number;
  tipoMovimiento: string;
  cantidad: number;
  motivo?: string;
}

export async function getKardex(idProducto?: number) {
  const params = idProducto ? `?idProducto=${idProducto}` : '';
  const { data } = await api.get<MovimientoInventario[]>(`/inventario/kardex${params}`);
  return data;
}

export async function registrarMovimiento(dto: MovimientoInventarioDto) {
  const { data } = await api.post<MovimientoInventario>('/inventario/movimiento', dto);
  return data;
}
