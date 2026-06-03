'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, Package, AlertCircle, DollarSign } from 'lucide-react';
import { getProductos } from '@/services/productos.service';
import { getResumenDia } from '@/services/ventas.service';
import type { Producto } from '@/types';
import { StatCard } from './components/StatCard';
import { SalesChart } from './components/SalesChart';
import { CategoriesChart } from './components/CategoriesChart';
import { TopProductsTable } from './components/TopProductsTable';
import { ExportButtons } from './components/ExportButtons';

interface SalesData {
  month: string;
  ventas: number;
  ingresos: number;
}

interface CategoryData {
  name: string;
  value: number;
}

interface TopProduct {
  nombre: string;
  cantidad: number;
  ingresos: number;
  porcentaje: number;
}

export default function DashboardPage() {
  const [resumen, setResumen] = useState<{
    ventas: number;
    total: number;
  } | null>(null);
  const [bajoStock, setBajoStock] = useState<Producto[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  // Datos de ejemplo para gráficos (en producción vendrían del backend)
  const salesData: SalesData[] = [
    { month: 'Enero', ventas: 45, ingresos: 4500 },
    { month: 'Febrero', ventas: 52, ingresos: 5200 },
    { month: 'Marzo', ventas: 48, ingresos: 4800 },
    { month: 'Abril', ventas: 61, ingresos: 6100 },
    { month: 'Mayo', ventas: 55, ingresos: 5500 },
    { month: 'Junio', ventas: 67, ingresos: 6700 },
  ];

  const categoriesData: CategoryData[] = [
    { name: 'Licores', value: 2400 },
    { name: 'Cervezas', value: 1398 },
    { name: 'Vinos', value: 1800 },
    { name: 'Piscos', value: 1500 },
    { name: 'Otros', value: 800 },
  ];

  const topProducts: TopProduct[] = [
    { nombre: 'Whisky Black Label 750ml', cantidad: 145, ingresos: 17400, porcentaje: 100 },
    { nombre: 'Ron Cartavio Black', cantidad: 98, ingresos: 4116, porcentaje: 24 },
    { nombre: 'Cerveza Cusqueña 630ml', cantidad: 156, ingresos: 1092, porcentaje: 6 },
    { nombre: 'Pisco Quebranta 750ml', cantidad: 67, ingresos: 2345, porcentaje: 13 },
    { nombre: 'Vodka Absolut 750ml', cantidad: 43, ingresos: 2795, porcentaje: 16 },
    { nombre: 'Gin Bombay Sapphire', cantidad: 32, ingresos: 2496, porcentaje: 14 },
    { nombre: 'Vino Tabernero', cantidad: 28, ingresos: 1064, porcentaje: 6 },
    { nombre: 'Cerveza Pilsen 630ml', cantidad: 142, ingresos: 923, porcentaje: 5 },
    { nombre: 'Tequila Don Julio', cantidad: 15, ingresos: 2475, porcentaje: 14 },
    { nombre: 'Red Bull 250ml', cantidad: 89, ingresos: 668, porcentaje: 4 },
  ];

  useEffect(() => {
    getResumenDia()
      .then((r) =>
        setResumen({
          ventas: r._count.idVenta,
          total: Number(r._sum.total ?? 0),
        }),
      )
      .catch(() => setResumen({ ventas: 0, total: 0 }));

    getProductos()
      .then((p) =>
        setBajoStock(p.filter((x) => x.stock <= 5).slice(0, 5)),
      )
      .catch(() => setBajoStock([]));
  }, []);

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      // Aquí iría la lógica para exportar a PDF
      console.log('Exportando a PDF...');
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Reporte PDF generado correctamente');
    } catch (error) {
      alert('Error al exportar PDF');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      // Aquí iría la lógica para exportar a CSV
      console.log('Exportando a CSV...');
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Reporte CSV generado correctamente');
    } catch (error) {
      alert('Error al exportar CSV');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Dashboard</h1>
          <p className="mt-1 text-sm sm:text-base text-slate-400">Resumen general del negocio</p>
        </div>
        <ExportButtons 
          onExportPDF={handleExportPDF} 
          onExportCSV={handleExportCSV}
          isLoading={isExporting}
        />
      </div>

      {/* KPIs - Tarjetas de estadísticas */}
      <div className="mb-6 sm:mb-8 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Ventas Hoy"
          value={resumen?.ventas ?? '—'}
          subtitle="transacciones completadas"
          icon={<TrendingUp />}
          bgColor="amber"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Ingresos Hoy"
          value={`S/ ${resumen?.total.toFixed(2) ?? '—'}`}
          subtitle="total vendido"
          icon={<DollarSign />}
          bgColor="green"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Stock Bajo"
          value={bajoStock.length}
          subtitle="productos críticos"
          icon={<AlertCircle />}
          bgColor="red"
          trend={{ value: 5, isPositive: false }}
        />
        <StatCard
          title="Productos Activos"
          value="450"
          subtitle="en inventario"
          icon={<Package />}
          bgColor="blue"
          trend={{ value: 3, isPositive: true }}
        />
      </div>

      {/* Gráficos */}
      <div className="mb-6 sm:mb-8 grid gap-6 grid-cols-1 lg:grid-cols-2">
        <SalesChart data={salesData} />
        <CategoriesChart data={categoriesData} />
      </div>

      {/* Tabla de Top Productos */}
      <div className="mb-8">
        <TopProductsTable products={topProducts} />
      </div>

      {/* Tabla de Stock Bajo */}
      {bajoStock.length > 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-900">
          <div className="border-b border-slate-800 px-6 py-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <h3 className="text-lg font-semibold text-white">Productos con Stock Bajo</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-800 bg-slate-800/50">
                <tr>
                  <th className="px-6 py-3 font-medium text-slate-300">Producto</th>
                  <th className="px-6 py-3 font-medium text-slate-300 text-right">Stock Actual</th>
                  <th className="px-6 py-3 font-medium text-slate-300 text-right">Stock Mínimo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {bajoStock.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 text-slate-200">{p.nombre}</td>
                    <td className="px-6 py-4 text-right text-red-400 font-medium">{p.stock}</td>
                    <td className="px-6 py-4 text-right text-slate-400">5</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
