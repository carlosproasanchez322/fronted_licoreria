'use client';

import { Download, FileText, File } from 'lucide-react';

interface ExportButtonsProps {
  onExportPDF: () => void;
  onExportCSV: () => void;
  isLoading?: boolean;
}

export function ExportButtons({ onExportPDF, onExportCSV, isLoading = false }: ExportButtonsProps) {
  return (
    <div className="flex gap-2">
      <button
        onClick={onExportPDF}
        disabled={isLoading}
        className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FileText className="h-4 w-4" />
        Exportar PDF
      </button>
      <button
        onClick={onExportCSV}
        disabled={isLoading}
        className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <File className="h-4 w-4" />
        Exportar CSV
      </button>
    </div>
  );
}
