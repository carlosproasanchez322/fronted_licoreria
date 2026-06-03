# 🎨 Componentes de Productos - Frontend

## 📋 Descripción General

Sistema completo de componentes React para gestión de productos con CRUD, búsqueda, filtros y vistas múltiples.

---

## 📦 Componentes Creados

### 1. **ProductoForm** 
Formulario completo para crear/editar productos.

**Ubicación:** `src/components/productos/ProductoForm.tsx`

**Props:**
```typescript
interface ProductoFormProps {
  initialData?: CreateProductoDto & { id?: number };
  onSubmit: (data: CreateProductoDto) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}
```

**Características:**
- ✅ Validación de campos requeridos
- ✅ Carga dinámica de categorías, marcas y unidades
- ✅ Campos numéricos con validación
- ✅ Manejo de errores
- ✅ Estado de carga

**Campos:**
- Nombre (requerido)
- Descripción (opcional)
- Categoría (requerida)
- Marca (opcional)
- Unidad de Medida (requerida)
- Precio Compra (requerido)
- Precio Venta (requerido)
- Stock (requerido)
- Código de Barra (opcional)

---

### 2. **ProductoCard**
Tarjeta visual de producto con información resumida.

**Ubicación:** `src/components/productos/ProductoCard.tsx`

**Props:**
```typescript
interface ProductoCardProps {
  producto: Producto;
  onEdit: (producto: Producto) => void;
  onDelete: (id: number) => void;
  onView: (producto: Producto) => void;
}
```

**Características:**
- ✅ Imagen placeholder con icono
- ✅ Información de categoría y marca
- ✅ Precios y margen de ganancia
- ✅ Stock con indicador de bajo stock
- ✅ Botones de acción (Ver, Editar, Eliminar)
- ✅ Diseño responsive

**Información Mostrada:**
- Nombre y código de barra
- Categoría y marca
- Precio de compra y venta
- Margen de ganancia (%)
- Stock disponible
- Descripción (truncada)

---

### 3. **ProductoModal**
Modal para ver detalles completos del producto.

**Ubicación:** `src/components/productos/ProductoModal.tsx`

**Props:**
```typescript
interface ProductoModalProps {
  producto: Producto;
  isOpen: boolean;
  onClose: () => void;
}
```

**Características:**
- ✅ Información completa del producto
- ✅ Cálculos financieros
- ✅ Imagen placeholder
- ✅ Información de categoría, marca y unidad
- ✅ Valor total en stock
- ✅ Alerta de stock bajo

**Información Mostrada:**
- Nombre, descripción y código de barra
- Imagen (placeholder)
- Precios (compra, venta)
- Ganancia unitaria
- Margen de ganancia (%)
- Stock disponible
- Categoría, marca y unidad
- Valor total en stock

---

### 4. **ProductoFormModal**
Modal que contiene el formulario de crear/editar.

**Ubicación:** `src/components/productos/ProductoFormModal.tsx`

**Props:**
```typescript
interface ProductoFormModalProps {
  isOpen: boolean;
  producto?: Producto;
  onClose: () => void;
  onSubmit: (data: CreateProductoDto) => Promise<void>;
  isLoading?: boolean;
}
```

**Características:**
- ✅ Integra ProductoForm
- ✅ Título dinámico (Crear/Editar)
- ✅ Botón de cerrar
- ✅ Manejo de estado de carga

---

### 5. **ProductosPage**
Página principal con CRUD completo.

**Ubicación:** `src/app/(dashboard)/productos/page.tsx`

**Características:**
- ✅ Listado de productos
- ✅ Búsqueda en tiempo real
- ✅ Dos vistas: Grid y Lista
- ✅ Crear nuevo producto
- ✅ Editar producto
- ✅ Eliminar producto
- ✅ Ver detalles
- ✅ Manejo de errores
- ✅ Estados de carga

**Funcionalidades:**
- Búsqueda por: nombre, código, categoría, marca
- Vista Grid: Tarjetas de productos
- Vista Lista: Tabla con información
- Filtrado en tiempo real
- Contador de productos

---

## 🔧 Servicios Actualizados

### **productos.service.ts**
```typescript
// Funciones disponibles
getProductos()                          // Obtener todos
getProducto(id)                         // Obtener uno
createProducto(dto)                     // Crear
updateProducto(id, dto)                 // Actualizar
deleteProducto(id)                      // Eliminar
```

### **categorias.service.ts**
```typescript
// Funciones disponibles
getCategorias()                         // Obtener todas
getCategoria(id)                        // Obtener una
createCategoria(dto)                    // Crear
updateCategoria(id, dto)                // Actualizar
deleteCategoria(id)                     // Eliminar
```

### **marcas.service.ts** (NUEVO)
```typescript
// Funciones disponibles
getMarcas()                             // Obtener todas
getMarca(id)                            // Obtener una
createMarca(dto)                        // Crear
updateMarca(id, dto)                    // Actualizar
deleteMarca(id)                         // Eliminar
```

### **unidades.service.ts** (NUEVO)
```typescript
// Funciones disponibles
getUnidades()                           // Obtener todas
getUnidad(id)                           // Obtener una
createUnidad(dto)                       // Crear
updateUnidad(id, dto)                   // Actualizar
deleteUnidad(id)                        // Eliminar
```

---

## 📊 Flujo de Datos

```
ProductosPage
├── Estado: productos, loading, error, searchTerm, viewMode
├── Modales: showFormModal, showDetailModal, selectedProducto
│
├── ProductoFormModal (crear/editar)
│   └── ProductoForm
│       ├── getCategorias()
│       ├── getMarcas()
│       └── getUnidades()
│
├── ProductoCard (vista grid)
│   ├── onEdit → abre ProductoFormModal
│   ├── onDelete → elimina producto
│   └── onView → abre ProductoModal
│
├── ProductoModal (detalles)
│   └── Información completa del producto
│
└── Tabla (vista lista)
    ├── onEdit → abre ProductoFormModal
    ├── onDelete → elimina producto
    └── onView → abre ProductoModal
```

---

## 🎯 Casos de Uso

### Crear Producto
1. Click en "Nuevo Producto"
2. Se abre ProductoFormModal vacío
3. Llenar formulario
4. Click en "Guardar Producto"
5. Se crea y actualiza la lista

### Editar Producto
1. Click en "Editar" en tarjeta o tabla
2. Se abre ProductoFormModal con datos
3. Modificar campos
4. Click en "Guardar Producto"
5. Se actualiza la lista

### Ver Detalles
1. Click en "Ver" en tarjeta o tabla
2. Se abre ProductoModal con información completa
3. Ver cálculos financieros
4. Click en "Cerrar"

### Eliminar Producto
1. Click en "Eliminar" en tarjeta o tabla
2. Confirmación
3. Se elimina de la lista

### Buscar Productos
1. Escribir en el campo de búsqueda
2. Se filtra en tiempo real por:
   - Nombre
   - Código de barra
   - Categoría
   - Marca

### Cambiar Vista
1. Click en icono de Grid o Lista
2. Se cambia la visualización
3. Mismos datos, diferente presentación

---

## 🎨 Estilos y Diseño

### Colores
- **Fondo:** `bg-slate-900`
- **Bordes:** `border-slate-800`
- **Texto:** `text-white`, `text-slate-300`, `text-slate-400`
- **Primario:** `bg-blue-600`
- **Éxito:** `text-emerald-400`
- **Error:** `text-red-400`
- **Advertencia:** `text-yellow-400`

### Componentes
- Inputs: `rounded-lg border border-slate-700 bg-slate-900`
- Botones: `rounded-lg px-4 py-2 font-medium`
- Tarjetas: `rounded-lg border border-slate-800 bg-slate-900/50`
- Modales: `fixed inset-0 z-50 bg-black/50`

---

## 📱 Responsividad

### Grid de Productos
```
Mobile:  1 columna
Tablet:  2 columnas (sm:grid-cols-2)
Desktop: 3 columnas (lg:grid-cols-3)
XL:      4 columnas (xl:grid-cols-4)
```

### Tabla
- Scroll horizontal en móvil
- Completa en desktop

---

## ⚡ Optimizaciones

1. **Búsqueda en tiempo real**
   - Filtrado local sin API calls
   - Búsqueda por múltiples campos

2. **Carga de datos**
   - Carga inicial de productos
   - Carga de categorías/marcas/unidades en formulario

3. **Estados**
   - Loading durante operaciones
   - Error handling
   - Confirmación antes de eliminar

4. **UX**
   - Contador de productos
   - Indicador de stock bajo
   - Cálculo de margen de ganancia
   - Vistas múltiples

---

## 🔐 Seguridad

- ✅ Validación de campos en formulario
- ✅ Validación en backend (API)
- ✅ Manejo de errores
- ✅ Confirmación antes de eliminar
- ✅ JWT Token en requests

---

## 📝 Ejemplo de Uso

```typescript
// En ProductosPage
const handleCreate = async (data: CreateProductoDto) => {
  try {
    setIsSubmitting(true);
    const newProducto = await createProducto(data);
    setProductos([newProducto, ...productos]);
    setShowFormModal(false);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Error');
  } finally {
    setIsSubmitting(false);
  }
};
```

---

## 🚀 Próximas Mejoras

1. **Imagen de Producto**
   - Upload de imagen
   - Preview
   - Almacenamiento en cloud

2. **Filtros Avanzados**
   - Por categoría
   - Por marca
   - Por rango de precio
   - Por stock

3. **Exportación**
   - Exportar a CSV
   - Exportar a PDF
   - Impresión

4. **Importación**
   - Importar desde CSV
   - Importar desde Excel
   - Validación de datos

5. **Historial**
   - Cambios de precio
   - Movimientos de stock
   - Auditoría

---

## 📚 Archivos Creados

```
src/
├── components/
│   └── productos/
│       ├── ProductoForm.tsx
│       ├── ProductoCard.tsx
│       ├── ProductoModal.tsx
│       ├── ProductoFormModal.tsx
│       └── index.ts
│
├── services/
│   ├── productos.service.ts (actualizado)
│   ├── categorias.service.ts (actualizado)
│   ├── marcas.service.ts (nuevo)
│   └── unidades.service.ts (nuevo)
│
└── app/
    └── (dashboard)/
        └── productos/
            └── page.tsx (actualizado)
```

---

## ✅ Checklist

- ✅ ProductoForm creado
- ✅ ProductoCard creado
- ✅ ProductoModal creado
- ✅ ProductoFormModal creado
- ✅ ProductosPage actualizada
- ✅ Servicios actualizados
- ✅ CRUD completo
- ✅ Búsqueda
- ✅ Vistas múltiples
- ✅ Manejo de errores
- ✅ Validaciones
- ✅ Documentación

---

## 🎉 Estado

✅ **COMPONENTES COMPLETADOS**

Todos los componentes están listos para usar con:
- CRUD completo
- Búsqueda
- Vistas múltiples
- Manejo de errores
- Validaciones
- Diseño responsive

---

**Versión:** 1.0.0  
**Fecha:** 22 de Mayo de 2026  
**Estado:** ✅ COMPLETADO
