import type { Producto } from '@/types';
import { api } from './api';

export interface CreateProductoDto {
  nombre: string;
  descripcion?: string;
  precioCompra: number;
  precioVenta: number;
  stock: number;
  codigoBarra?: string;
  idCategoria: number;
  idMarca?: number;
  idUnidad: number;
}

export interface UpdateProductoDto extends Partial<CreateProductoDto> {}

export async function getProductos() {
  const { data } = await api.get<Producto[]>('/productos');
  return data;
}

export async function getProducto(id: number) {
  const { data } = await api.get<Producto>(`/productos/${id}`);
  return data;
}

export async function createProducto(dto: CreateProductoDto) {
  const { data } = await api.post<Producto>('/productos', dto);
  return data;
}

export async function updateProducto(id: number, dto: UpdateProductoDto) {
  const { data } = await api.patch<Producto>(`/productos/${id}`, dto);
  return data;
}

export async function deleteProducto(id: number) {
  await api.delete(`/productos/${id}`);
}
