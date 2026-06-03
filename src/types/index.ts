export type Usuario = {
  idUsuario: number;
  nombres: string;
  apellidos: string;
  usuario: string;
  email: string;
  estado: boolean;
  idRol: number;
  createdAt?: string;
  updatedAt?: string;
  rol?: {
    idRol: number;
    nombre: string;
  };
};

export type Rol = {
  idRol: number;
  nombre: string;
};

export type LoginResponse = {
  access_token: string;
  usuario: Usuario;
};

export type MediaProducto = {
  id: number;
  tipo: string;
  nombreArchivo: string;
  ruta: string;
  urlPublica?: string | null;
  tamano: number;
  mimeType: string;
  esPrincipal: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Producto = {
  id: number;
  nombre: string;
  descripcion?: string | null;
  precioCompra: number;
  precioVenta: number;
  stock: number;
  codigoBarra?: string | null;
  categoria: { id: number; nombre: string };
  marca: { id: number; nombre: string } | null;
  unidad: { id: number; nombre: string; abreviatura: string };
  media?: MediaProducto[];
};

export type Categoria = {
  id: number;
  nombre: string;
  descripcion?: string | null;
  _count?: { productos: number };
  productos?: Array<{
    idProducto: number;
    nombre: string;
    precioVenta: number;
    stock: number;
  }>;
};

export type Marca = {
  id: number;
  nombre: string;
  _count?: { productos: number };
  productos?: Array<{
    idProducto: number;
    nombre: string;
    precioVenta: number;
    stock: number;
  }>;
};

export type Proveedor = {
  id: number;
  razonSocial: string;
  ruc?: string | null;
  telefono?: string | null;
  email?: string | null;
};

export type Unidad = {
  id: number;
  nombre: string;
  abreviatura: string;
  _count?: { productos: number };
  productos?: Array<{
    idProducto: number;
    nombre: string;
    precioVenta: number;
    stock: number;
  }>;
};

export type ResumenDia = {
  _sum: { total: number | null; subtotal: number | null; igv: number | null };
  _count: { idVenta: number };
};
