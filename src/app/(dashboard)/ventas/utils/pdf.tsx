import { jsPDF } from 'jspdf';
import type { Venta } from '@/services/ventas.service';

export function exportVentaToPDF(venta: Venta) {
  const doc = new jsPDF('p', 'mm', [80, 150]); // Tamaño de boleta térmica
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 8;
  const margin = 5;

  // ==================== ENCABEZADO ====================
  // Nombre de la empresa (placeholder)
  doc.setFontSize(12);
  doc.setFont('Helvetica', 'bold');
  doc.text('LICORERÍA TACU 2.0', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 5;

  // RUC
  doc.setFontSize(8);
  doc.setFont('Helvetica', 'normal');
  doc.text('RUC: 1075243983', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 4;

  // Dirección
  doc.setFontSize(7);
  doc.text('Av. aurora Martinez, Huancayo, Perú', pageWidth / 2, yPosition, {
    align: 'center',
  });
  yPosition += 3;

  // Teléfono
  doc.text('Tel: 994841296', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 5;

  // Línea separadora
  doc.setDrawColor(0);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 4;

  // ==================== NÚMERO DE COMPROBANTE ====================
  doc.setFontSize(11);
  doc.setFont('Helvetica', 'bold');
  doc.text(`BOLETA N°${venta.idVenta}`, pageWidth / 2, yPosition, {
    align: 'center',
  });
  yPosition += 5;

  // ==================== INFORMACIÓN GENERAL ====================
  doc.setFontSize(7);
  doc.setFont('Helvetica', 'normal');

  const fecha = new Date(venta.fecha).toLocaleDateString('es-PE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const hora = new Date(venta.fecha).toLocaleTimeString('es-PE', {
    hour: '2-digit',
    minute: '2-digit',
  });

  doc.text(`Fecha: ${fecha}  ${hora}`, margin, yPosition);
  yPosition += 3;
  doc.text(`Vendedor: ${venta.usuario.nombres}`, margin, yPosition);
  yPosition += 3;
  doc.text(`Pago: ${venta.metodo.nombre}`, margin, yPosition);
  yPosition += 3;

  // Cliente
  const clienteNombre = venta.cliente?.nombres || 'Mostrador';
  doc.text(`Cliente: ${clienteNombre}`, margin, yPosition);
  yPosition += 4;

  // Línea separadora
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 4;

  // ==================== ENCABEZADO DE TABLA ====================
  doc.setFontSize(7);
  doc.setFont('Helvetica', 'bold');

  const colProducto = margin;
  const colCantidad = pageWidth * 0.55;
  const colPrecio = pageWidth * 0.75;

  doc.text('PRODUCTO', colProducto, yPosition);
  doc.text('CANT', colCantidad, yPosition);
  doc.text('TOTAL', colPrecio, yPosition);
  yPosition += 3;

  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 2;

  // ==================== DETALLES DE PRODUCTOS ====================
  doc.setFontSize(7);
  doc.setFont('Helvetica', 'normal');

  venta.detalles.forEach((detalle) => {
    // Nombre del producto (truncado si es muy largo)
    const productoText = detalle.producto.nombre;
    const productoLines = doc.splitTextToSize(
      productoText,
      pageWidth * 0.5 - margin * 2
    );

    // Primera línea del producto
    doc.text(productoLines[0] || productoText, colProducto, yPosition);
    doc.text(`${detalle.cantidad}`, colCantidad, yPosition);
    doc.text(`S/ ${Number(detalle.subtotal).toFixed(2)}`, colPrecio, yPosition);
    yPosition += 3;

    // Líneas adicionales del producto si existen
    for (let i = 1; i < productoLines.length; i++) {
      doc.text(productoLines[i], colProducto, yPosition);
      yPosition += 3;
    }

    // Información del descuento si existe
    if (detalle.descuento > 0) {
      doc.setFont('Helvetica', 'italic');
      doc.text(
        `  Desc: S/ ${Number(detalle.descuento).toFixed(2)}`,
        colProducto,
        yPosition
      );
      yPosition += 2;
      doc.setFont('Helvetica', 'normal');
    }

    // Verificar si necesita nueva página
    if (yPosition > pageHeight - 25) {
      doc.addPage();
      yPosition = 8;
    }
  });

  yPosition += 2;

  // ==================== LÍNEA SEPARADORA ====================
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 6;

  // ==================== TOTALES ====================
  doc.setFontSize(8);

  // Subtotal
  doc.setFont('Helvetica', 'normal');
  doc.text('Subtotal:', pageWidth * 0.45, yPosition);
  doc.text(
    `S/ ${Number(venta.subtotal).toFixed(2)}`,
    colPrecio,
    yPosition,
    { align: 'right' }
  );
  yPosition += 3;

  // IGV
  doc.text('IGV (18%):', pageWidth * 0.45, yPosition);
  doc.text(
    `S/ ${Number(venta.igv).toFixed(2)}`,
    colPrecio,
    yPosition,
    { align: 'right' }
  );
  yPosition += 4;

  // TOTAL - DESTACADO
  doc.setDrawColor(0);

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('TOTAL:', pageWidth * 0.40, yPosition);
  doc.text(
    `S/ ${Number(venta.total).toFixed(2)}`,
    colPrecio,
    yPosition,
    { align: 'right' }
  );
  yPosition += 4;

  doc.line(pageWidth * 0.45, yPosition - 1, pageWidth - margin, yPosition - 1);
  yPosition += 3;

  // ==================== PIE DE PÁGINA ====================
  doc.setFontSize(7);
  doc.setFont('Helvetica', 'italic');
  doc.text('¡Gracias por su compra!', pageWidth / 2, yPosition, {
    align: 'center',
  });
  yPosition += 3;

  doc.setFont('Helvetica', 'normal');
  doc.text('Verificar producto antes de retirarse', pageWidth / 2, yPosition, {
    align: 'center',
  });
  yPosition += 3;

  // Código de transacción simulado
  doc.setFontSize(6);
  doc.text(`Código: VTA${venta.idVenta}${fecha.replace(/\//g, '')}`, pageWidth / 2, yPosition, {
    align: 'center',
  });

  // Guardar PDF
  doc.save(
    `boleta_${venta.idVenta}_${new Date().toISOString().split('T')[0]}.pdf`
  );
}
