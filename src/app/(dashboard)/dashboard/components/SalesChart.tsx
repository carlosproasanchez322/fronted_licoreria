'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SalesData {
  month: string;
  ventas: number;
  ingresos: number;
}

interface SalesChartProps {
  data: SalesData[];
  title?: string;
}

export function SalesChart({ data, title = 'Ventas por Mes' }: SalesChartProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="month" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #475569',
              borderRadius: '8px',
            }}
            labelStyle={{ color: '#e2e8f0' }}
          />
          <Legend wrapperStyle={{ color: '#cbd5e1' }} />
          <Bar dataKey="ventas" fill="#f59e0b" name="Cantidad de Ventas" />
          <Bar dataKey="ingresos" fill="#10b981" name="Ingresos (S/)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
