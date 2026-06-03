import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  bgColor?: 'blue' | 'green' | 'red' | 'amber' | 'purple';
}

const colorClasses = {
  blue: 'text-blue-400',
  green: 'text-emerald-400',
  red: 'text-red-400',
  amber: 'text-amber-400',
  purple: 'text-purple-400',
};

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  bgColor = 'blue',
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 hover:border-slate-700 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <p className={`mt-2 text-3xl font-bold ${colorClasses[bgColor]}`}>
            {value}
          </p>
          {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
        </div>
        <div className="text-2xl opacity-50">{icon}</div>
      </div>

      {trend && (
        <div className="mt-4 flex items-center gap-1">
          <span
            className={`text-sm font-medium ${
              trend.isPositive ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
          <span className="text-xs text-slate-500">vs mes anterior</span>
        </div>
      )}
    </div>
  );
}
