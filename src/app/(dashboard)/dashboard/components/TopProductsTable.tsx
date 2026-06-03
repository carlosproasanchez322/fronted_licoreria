import { TrendingUp } from 'lucide-react';

interface TopProduct {
  nombre: string;
  cantidad: number;
  ingresos: number;
  porcentaje: number;
}

interface TopProductsTableProps {
  products: TopProduct[];
  title?: string;
}

export function TopProductsTable({ products, title = 'Top 10 Productos Vendidos' }: TopProductsTableProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900">
      <div className="border-b border-slate-800 px-6 py-4 flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-amber-400" />
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-800 bg-slate-800/50">
            <tr>
              <th className="px-6 py-3 font-medium text-slate-300">Producto</th>
              <th className="px-6 py-3 font-medium text-slate-300 text-right">Cantidad</th>
              <th className="px-6 py-3 font-medium text-slate-300 text-right">Ingresos</th>
              <th className="px-6 py-3 font-medium text-slate-300 text-right">% del Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {products.map((product, index) => (
              <tr key={index} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4 text-slate-200">{product.nombre}</td>
                <td className="px-6 py-4 text-right text-slate-300">{product.cantidad}</td>
                <td className="px-6 py-4 text-right text-emerald-400 font-medium">
                  S/ {product.ingresos.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-16 h-2 rounded-full bg-slate-700 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-amber-500"
                        style={{ width: `${product.porcentaje}%` }}
                      />
                    </div>
                    <span className="text-slate-300 text-xs w-10 text-right">
                      {product.porcentaje.toFixed(1)}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
