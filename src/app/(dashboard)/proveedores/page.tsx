'use client';

import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import type { Proveedor } from '@/types';

export default function ProveedoresPage() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Proveedor[]>('/proveedores')
      .then((r) => setProveedores(r.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white">Proveedores</h1>
      {loading ? (
        <p className="mt-8 text-slate-400">Cargando...</p>
      ) : (
        <div className="mt-6 space-y-3">
          {proveedores.map((p) => (
            <div
              key={p.id}
              className="rounded-xl border border-slate-800 bg-slate-900 px-5 py-4"
            >
              <p className="font-medium text-white">{p.razonSocial}</p>
              <p className="text-sm text-slate-400">
                RUC: {p.ruc ?? '—'} · {p.telefono ?? '—'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
