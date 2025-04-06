"use client";

import { toast } from "@/components/ui/sonner";

// Interfaces para los datos
export interface ProductoItem {
    id: string;
    nombre: string;
    cantidad: number;
    precio: number;
}

export interface DatosCotizacion {
    cliente: string;
    empresa: string;
    productos: ProductoItem[];
    aplicarIva?: boolean;
}

interface CotizacionPDFProps {
    cotizacion: DatosCotizacion;
    onSuccess?: () => void;
}

export const generarVistaPreviaPDF = (cotizacion: DatosCotizacion) => {
    return (
        <div className="p-4 border rounded-lg">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold">Cotización</h2>
                <p className="text-muted-foreground">Fecha: {new Date().toLocaleDateString()}</p>
            </div>

            <div className="mb-6">
                <h3 className="font-bold mb-2">Cliente:</h3>
                <p>{cotizacion.cliente}</p>
                {cotizacion.empresa && <p>Empresa: {cotizacion.empresa}</p>}
            </div>

            <div className="mb-6">
                <h3 className="font-bold mb-2">Detalles:</h3>
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b">
                            <th className="text-left py-2">Producto</th>
                            <th className="text-center py-2">Cantidad</th>
                            <th className="text-right py-2">Precio</th>
                            <th className="text-right py-2">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cotizacion.productos.map((item) => (
                            <tr key={item.id} className="border-b">
                                <td className="py-2">{item.nombre}</td>
                                <td className="text-center py-2">{item.cantidad}</td>
                                <td className="text-right py-2">${item.precio.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                <td className="text-right py-2">${(item.cantidad * item.precio).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            </tr>
                        ))}
                        <tr>
                            <td colSpan={3} className="text-right font-bold py-2">Total:</td>
                            <td className="text-right font-bold py-2">${calcularTotal(cotizacion.productos, cotizacion.aplicarIva).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="text-sm text-muted-foreground">
                <p>Esta cotización es válida por 30 días.</p>
            </div>
        </div>
    );
};

// Calcular el total de la cotización
export const calcularTotal = (productos: ProductoItem[], aplicarIva = false) => {
    const subtotal = productos.reduce((total, producto) => {
        return total + (producto.cantidad * producto.precio);
    }, 0);

    return aplicarIva ? subtotal * 1.08 : subtotal;
};

// Calcular el subtotal (sin IVA)
export const calcularSubtotal = (productos: ProductoItem[]) => {
    return productos.reduce((total, producto) => {
        return total + (producto.cantidad * producto.precio);
    }, 0);
};

// Calcular el IVA
export const calcularIva = (productos: ProductoItem[]) => {
    const subtotal = calcularSubtotal(productos);
    return subtotal * 0.08;
};

// Genera una vista previa del PDF como URL para iframe
export const generarVistaPreviaURL = async (cotizacion: DatosCotizacion): Promise<string> => {
    // Validar datos
    if (!cotizacion.cliente || cotizacion.productos.length === 0) {
        toast.error("No se puede generar la vista previa. Verifique que ha ingresado el cliente y al menos un producto.");
        return '';
    }

    try {
        // Importar jsPDF dinámicamente solo cuando se necesite
        const jsPDFModule = await import('jspdf');
        const jsPDF = jsPDFModule.default;

        // Crear un nuevo documento PDF
        const doc = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
        });

        // Configuración básica del documento
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 15;

        // Definir colores neutros
        const colorPrimario = [80, 80, 80]; // Gris oscuro para elementos principales
        const colorSecundario = [130, 130, 130]; // Gris medio para elementos secundarios
        const colorAcento = [50, 50, 50]; // Gris más oscuro para acentos
        const colorFondo = [248, 248, 248]; // Gris muy claro casi blanco
        const colorTerminos = [180, 180, 180]; // Gris muy claro para términos menos resaltables

        // Encabezado minimalista con línea delgada
        doc.setDrawColor(colorPrimario[0], colorPrimario[1], colorPrimario[2]);
        doc.setLineWidth(0.5);
        doc.line(margin, 20, pageWidth - margin, 20);

        // Logo minimalista (solo texto)
        doc.setTextColor(colorAcento[0], colorAcento[1], colorAcento[2]);
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");

        // Información de la empresa en diseño limpio
        doc.setTextColor(colorPrimario[0], colorPrimario[1], colorPrimario[2]);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("Rafael Armando Jara Fernandez", pageWidth - margin, 12, { align: "right" });
        doc.setFontSize(8);
        doc.text("San Luis Río Colorado, Sonora, México", pageWidth - margin, 16, { align: "right" });

        // Número de cotización con diseño minimalista
        const numeroReferencia = `COT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
        const fechaActual = new Date().toLocaleDateString();

        let y = 35;

        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(colorAcento[0], colorAcento[1], colorAcento[2]);
        doc.text("COTIZACIÓN", margin, y);

        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(colorSecundario[0], colorSecundario[1], colorSecundario[2]);
        doc.text(`REF: ${numeroReferencia}  |  Fecha: ${fechaActual}`, pageWidth - margin, y, { align: "right" });

        // Datos del cliente con diseño minimalista
        y += 20;

        // Título de sección
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(colorAcento[0], colorAcento[1], colorAcento[2]);
        doc.text("INFORMACIÓN DEL CLIENTE", margin, y);

        // Línea horizontal fina debajo del título
        doc.setDrawColor(colorSecundario[0], colorSecundario[1], colorSecundario[2]);
        doc.setLineWidth(0.2);
        doc.line(margin, y + 2, margin + 60, y + 2);

        y += 10;

        // Datos del cliente
        doc.setTextColor(colorPrimario[0], colorPrimario[1], colorPrimario[2]);
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.text("Cliente:", margin, y);
        doc.setFont("helvetica", "normal");
        doc.text(cotizacion.cliente, margin + 30, y);

        if (cotizacion.empresa) {
            y += 6;
            doc.setFont("helvetica", "bold");
            doc.text("Empresa:", margin, y);
            doc.setFont("helvetica", "normal");
            doc.text(cotizacion.empresa, margin + 30, y);
        }

        // Emisor de forma discreta
        doc.setFontSize(8);
        doc.setTextColor(colorSecundario[0], colorSecundario[1], colorSecundario[2]);
        doc.text("Documento emitido por: Rafael Armando Jara", pageWidth - margin, y - (cotizacion.empresa ? 0 : 6), { align: "right" });

        // Detalles de la cotización
        y += 20;

        // Título de sección
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(colorAcento[0], colorAcento[1], colorAcento[2]);
        doc.text("DETALLE DE PRODUCTOS", margin, y);

        // Línea horizontal fina debajo del título
        doc.setDrawColor(colorSecundario[0], colorSecundario[1], colorSecundario[2]);
        doc.setLineWidth(0.2);
        doc.line(margin, y + 2, margin + 60, y + 2);

        y += 10;

        // Tabla de productos con diseño minimalista
        // Encabezados de tabla
        const col1Width = pageWidth - (margin * 2) - 90;
        const col2Width = 20;
        const col3Width = 35;
        const col4Width = 35;

        doc.setFillColor(colorFondo[0], colorFondo[1], colorFondo[2]);
        doc.rect(margin, y, pageWidth - (margin * 2), 8, 'F');

        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(colorPrimario[0], colorPrimario[1], colorPrimario[2]);
        doc.text("PRODUCTO", margin + 5, y + 5);
        doc.text("CANT.", margin + col1Width + 5, y + 5);
        doc.text("PRECIO", margin + col1Width + col2Width + 5, y + 5);
        doc.text("TOTAL", margin + col1Width + col2Width + col3Width + 5, y + 5);

        y += 8;

        // Filas de productos
        doc.setFont("helvetica", "normal");
        doc.setTextColor(colorPrimario[0], colorPrimario[1], colorPrimario[2]);

        cotizacion.productos.forEach((producto, index) => {
            const altura = 8;

            // Alternar colores de fondo muy sutilmente
            if (index % 2 === 0) {
                doc.setFillColor(255, 255, 255); // Blanco
            } else {
                doc.setFillColor(colorFondo[0], colorFondo[1], colorFondo[2]); // Gris muy claro
            }
            doc.rect(margin, y, pageWidth - (margin * 2), altura, 'F');

            // Texto
            doc.text(producto.nombre, margin + 5, y + 5);
            doc.text(producto.cantidad.toString(), margin + col1Width + col2Width - 5, y + 5, { align: "right" });
            doc.text(`$${producto.precio.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, margin + col1Width + col2Width + col3Width - 5, y + 5, { align: "right" });
            doc.text(`$${(producto.cantidad * producto.precio).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, margin + col1Width + col2Width + col3Width + col4Width - 5, y + 5, { align: "right" });

            y += altura;
        });

        // Línea fina antes del total
        doc.setDrawColor(colorPrimario[0], colorPrimario[1], colorPrimario[2]);
        doc.setLineWidth(0.2);
        doc.line(margin, y + 1, pageWidth - margin, y + 1);

        y += 6;

        // Subtotal, IVA y Total con diseño minimalista
        doc.setFont("helvetica", "bold");
        const subtotal = calcularSubtotal(cotizacion.productos);
        doc.text("SUBTOTAL:", margin + col1Width + col2Width + col3Width - 40, y);
        doc.text(`$${subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, margin + col1Width + col2Width + col3Width + col4Width - 5, y, { align: "right" });

        if (cotizacion.aplicarIva) {
            y += 6;
            const iva = calcularIva(cotizacion.productos);
            doc.text("IVA (8%):", margin + col1Width + col2Width + col3Width - 40, y);
            doc.text(`$${iva.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, margin + col1Width + col2Width + col3Width + col4Width - 5, y, { align: "right" });
        }

        y += 6;
        doc.setFontSize(10);
        doc.text("TOTAL:", margin + col1Width + col2Width + col3Width - 40, y);
        doc.text(`$${calcularTotal(cotizacion.productos, cotizacion.aplicarIva).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, margin + col1Width + col2Width + col3Width + col4Width - 5, y, { align: "right" });

        // Pie de página minimalista
        const footerY = pageHeight - 25;

        // Datos bancarios justo arriba del separador del footer
        const bancariosY = footerY - 35;

        // Datos bancarios
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(colorAcento[0], colorAcento[1], colorAcento[2]);
        doc.text("DATOS BANCARIOS", margin, bancariosY);

        // Línea horizontal fina
        doc.setDrawColor(colorSecundario[0], colorSecundario[1], colorSecundario[2]);
        doc.setLineWidth(0.2);
        doc.line(margin, bancariosY + 2, margin + 40, bancariosY + 2);

        // Crear un recuadro difuminado para los datos bancarios
        const recuadroAlto = 25;
        doc.setFillColor(250, 250, 250); // Fondo muy sutil
        doc.setDrawColor(colorTerminos[0], colorTerminos[1], colorTerminos[2]); // Borde en gris claro
        doc.setLineWidth(0.2);
        doc.roundedRect(margin, bancariosY + 6, pageWidth - (margin * 2), recuadroAlto, 2, 2, 'FD');

        doc.setTextColor(colorPrimario[0], colorPrimario[1], colorPrimario[2]);
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text("Banco: BBVA", margin + 5, bancariosY + 11);
        doc.text("Titular: Rafael Armando Jara Fernandez", margin + 5, bancariosY + 16);
        doc.text("Cuenta: 1234 5678 9012 3456", margin + 5, bancariosY + 21);
        doc.text("CLABE: 012 3456 7890 1234 56", margin + 5, bancariosY + 26);

        // Línea del pie de página
        doc.setDrawColor(colorPrimario[0], colorPrimario[1], colorPrimario[2]);
        doc.setLineWidth(0.5);
        doc.line(margin, footerY, pageWidth - margin, footerY);

        // Términos y condiciones en el pie con color gris claro
        doc.setFontSize(6.5);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(colorTerminos[0], colorTerminos[1], colorTerminos[2]);

        doc.text("CONDICIONES: Cotización válida por 7 dias • Precios sujetos a cambio sin previo aviso.",
            pageWidth / 2, footerY + 5, { align: "center" });
        doc.text(`Tiempo de entrega según disponibilidad • ${cotizacion.aplicarIva ? 'Los precios incluyen IVA (8%)' : 'Los precios no incluyen IVA'}`,
            pageWidth / 2, footerY + 10, { align: "center" });

        // Información de contacto en el pie
        const contactoY = pageHeight - 10;
        doc.setFontSize(7);
        doc.setTextColor(colorSecundario[0], colorSecundario[1], colorSecundario[2]);
        doc.text("Tel: (653) 123-4567", margin, contactoY);
        doc.text("contacto@jara.com", pageWidth / 2, contactoY, { align: "center" });
        doc.text(`REF: ${numeroReferencia}`, pageWidth - margin, contactoY, { align: "right" });

        // Crear un blob URL del PDF para visualizar en iframe
        const blobUrl = doc.output('bloburl');
        return String(blobUrl);

    } catch (error) {
        console.error("Error al generar la vista previa del PDF:", error);
        toast.error("Ocurrió un error al generar la vista previa. Por favor, inténtelo de nuevo.");
        return '';
    }
};

export const generarPDF = async (cotizacion: DatosCotizacion, onSuccess?: () => void) => {
    // Validar datos
    if (!cotizacion.cliente || cotizacion.productos.length === 0) {
        toast.error("No se puede generar el PDF. Verifique que ha ingresado el cliente y al menos un producto.");
        return;
    }

    try {
        // Importar jsPDF dinámicamente solo cuando se necesite
        const jsPDFModule = await import('jspdf');
        const jsPDF = jsPDFModule.default;

        // Crear un nuevo documento PDF
        const doc = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
        });

        // Configuración básica del documento
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 15;

        // Definir colores neutros
        const colorPrimario = [80, 80, 80]; // Gris oscuro para elementos principales
        const colorSecundario = [130, 130, 130]; // Gris medio para elementos secundarios
        const colorAcento = [50, 50, 50]; // Gris más oscuro para acentos
        const colorFondo = [248, 248, 248]; // Gris muy claro casi blanco
        const colorTerminos = [180, 180, 180]; // Gris muy claro para términos menos resaltables

        // Encabezado minimalista con línea delgada
        doc.setDrawColor(colorPrimario[0], colorPrimario[1], colorPrimario[2]);
        doc.setLineWidth(0.5);
        doc.line(margin, 20, pageWidth - margin, 20);

        // Información de la empresa en diseño limpio
        doc.setTextColor(colorPrimario[0], colorPrimario[1], colorPrimario[2]);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("Rafael Armando Jara Fernandez", pageWidth - margin, 12, { align: "right" });
        doc.setFontSize(8);
        doc.text("San Luis Río Colorado, Sonora, México", pageWidth - margin, 16, { align: "right" });

        // Número de cotización con diseño minimalista
        const numeroReferencia = `COT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
        const fechaActual = new Date().toLocaleDateString();

        let y = 35;

        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(colorAcento[0], colorAcento[1], colorAcento[2]);
        doc.text("COTIZACIÓN", margin, y);

        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(colorSecundario[0], colorSecundario[1], colorSecundario[2]);
        doc.text(`REF: ${numeroReferencia}  |  Fecha: ${fechaActual}`, pageWidth - margin, y, { align: "right" });

        // Datos del cliente con diseño minimalista
        y += 20;

        // Título de sección
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(colorAcento[0], colorAcento[1], colorAcento[2]);
        doc.text("INFORMACIÓN DEL CLIENTE", margin, y);

        // Línea horizontal fina debajo del título
        doc.setDrawColor(colorSecundario[0], colorSecundario[1], colorSecundario[2]);
        doc.setLineWidth(0.2);
        doc.line(margin, y + 2, margin + 60, y + 2);

        y += 10;

        // Datos del cliente
        doc.setTextColor(colorPrimario[0], colorPrimario[1], colorPrimario[2]);
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.text("Cliente:", margin, y);
        doc.setFont("helvetica", "normal");
        doc.text(cotizacion.cliente, margin + 30, y);

        if (cotizacion.empresa) {
            y += 6;
            doc.setFont("helvetica", "bold");
            doc.text("Empresa:", margin, y);
            doc.setFont("helvetica", "normal");
            doc.text(cotizacion.empresa, margin + 30, y);
        }

        // Emisor de forma discreta
        doc.setFontSize(8);
        doc.setTextColor(colorSecundario[0], colorSecundario[1], colorSecundario[2]);
        doc.text("Documento emitido por: Rafael Armando Jara", pageWidth - margin, y - (cotizacion.empresa ? 0 : 6), { align: "right" });

        // Detalles de la cotización
        y += 20;

        // Título de sección
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(colorAcento[0], colorAcento[1], colorAcento[2]);
        doc.text("DETALLE DE PRODUCTOS", margin, y);

        // Línea horizontal fina debajo del título
        doc.setDrawColor(colorSecundario[0], colorSecundario[1], colorSecundario[2]);
        doc.setLineWidth(0.2);
        doc.line(margin, y + 2, margin + 60, y + 2);

        y += 10;

        // Tabla de productos con diseño minimalista
        // Encabezados de tabla
        const col1Width = pageWidth - (margin * 2) - 90;
        const col2Width = 20;
        const col3Width = 35;
        const col4Width = 35;

        doc.setFillColor(colorFondo[0], colorFondo[1], colorFondo[2]);
        doc.rect(margin, y, pageWidth - (margin * 2), 8, 'F');

        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(colorPrimario[0], colorPrimario[1], colorPrimario[2]);
        doc.text("PRODUCTO", margin + 5, y + 5);
        doc.text("CANT.", margin + col1Width + 5, y + 5);
        doc.text("PRECIO", margin + col1Width + col2Width + 5, y + 5);
        doc.text("TOTAL", margin + col1Width + col2Width + col3Width + 5, y + 5);

        y += 8;

        // Filas de productos
        doc.setFont("helvetica", "normal");
        doc.setTextColor(colorPrimario[0], colorPrimario[1], colorPrimario[2]);

        cotizacion.productos.forEach((producto, index) => {
            const altura = 8;

            // Alternar colores de fondo muy sutilmente
            if (index % 2 === 0) {
                doc.setFillColor(255, 255, 255); // Blanco
            } else {
                doc.setFillColor(colorFondo[0], colorFondo[1], colorFondo[2]); // Gris muy claro
            }
            doc.rect(margin, y, pageWidth - (margin * 2), altura, 'F');

            // Texto
            doc.text(producto.nombre, margin + 5, y + 5);
            doc.text(producto.cantidad.toString(), margin + col1Width + col2Width - 5, y + 5, { align: "right" });
            doc.text(`$${producto.precio.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, margin + col1Width + col2Width + col3Width - 5, y + 5, { align: "right" });
            doc.text(`$${(producto.cantidad * producto.precio).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, margin + col1Width + col2Width + col3Width + col4Width - 5, y + 5, { align: "right" });

            y += altura;
        });

        // Línea fina antes del total
        doc.setDrawColor(colorPrimario[0], colorPrimario[1], colorPrimario[2]);
        doc.setLineWidth(0.2);
        doc.line(margin, y + 1, pageWidth - margin, y + 1);

        y += 6;

        // Subtotal, IVA y Total con diseño minimalista
        doc.setFont("helvetica", "bold");
        const subtotal = calcularSubtotal(cotizacion.productos);
        doc.text("SUBTOTAL:", margin + col1Width + col2Width + col3Width - 40, y);
        doc.text(`$${subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, margin + col1Width + col2Width + col3Width + col4Width - 5, y, { align: "right" });

        if (cotizacion.aplicarIva) {
            y += 6;
            const iva = calcularIva(cotizacion.productos);
            doc.text("IVA (8%):", margin + col1Width + col2Width + col3Width - 40, y);
            doc.text(`$${iva.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, margin + col1Width + col2Width + col3Width + col4Width - 5, y, { align: "right" });
        }

        y += 6;
        doc.setFontSize(10);
        doc.text("TOTAL:", margin + col1Width + col2Width + col3Width - 40, y);
        doc.text(`$${calcularTotal(cotizacion.productos, cotizacion.aplicarIva).toFixed(2)}`, margin + col1Width + col2Width + col3Width + col4Width - 5, y, { align: "right" });

        // Pie de página minimalista
        const footerY = pageHeight - 25;

        // Datos bancarios justo arriba del separador del footer
        const bancariosY = footerY - 35;

        // Datos bancarios
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(colorAcento[0], colorAcento[1], colorAcento[2]);
        doc.text("DATOS BANCARIOS", margin, bancariosY);

        // Línea horizontal fina
        doc.setDrawColor(colorSecundario[0], colorSecundario[1], colorSecundario[2]);
        doc.setLineWidth(0.2);
        doc.line(margin, bancariosY + 2, margin + 40, bancariosY + 2);

        // Crear un recuadro difuminado para los datos bancarios
        const recuadroAlto = 25;
        doc.setFillColor(250, 250, 250); // Fondo muy sutil
        doc.setDrawColor(colorTerminos[0], colorTerminos[1], colorTerminos[2]); // Borde en gris claro
        doc.setLineWidth(0.2);
        doc.roundedRect(margin, bancariosY + 6, pageWidth - (margin * 2), recuadroAlto, 2, 2, 'FD');

        doc.setTextColor(colorPrimario[0], colorPrimario[1], colorPrimario[2]);
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text("Banco: BBVA", margin + 5, bancariosY + 11);
        doc.text("Titular: Rafael Armando Jara Fernandez", margin + 5, bancariosY + 16);
        doc.text("Cuenta: 1234 5678 9012 3456", margin + 5, bancariosY + 21);
        doc.text("CLABE: 012 3456 7890 1234 56", margin + 5, bancariosY + 26);

        // Línea del pie de página
        doc.setDrawColor(colorPrimario[0], colorPrimario[1], colorPrimario[2]);
        doc.setLineWidth(0.5);
        doc.line(margin, footerY, pageWidth - margin, footerY);

        // Términos y condiciones en el pie con color gris claro
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(colorTerminos[0], colorTerminos[1], colorTerminos[2]);

        doc.text("Cotización válida por 30 días • Precios sujetos a cambio sin previo aviso • Se requiere 50% de anticipo",
            pageWidth / 2, footerY + 5, { align: "center" });
        doc.text(`Tiempo de entrega según disponibilidad • ${cotizacion.aplicarIva ? 'Los precios incluyen IVA (8%)' : 'Los precios no incluyen IVA'}`,
            pageWidth / 2, footerY + 10, { align: "center" });

        // Información de contacto en el pie
        const contactoY = pageHeight - 10;
        doc.setFontSize(7);
        doc.setTextColor(colorSecundario[0], colorSecundario[1], colorSecundario[2]);
        doc.text("Tel: (653) 123-4567", margin, contactoY);
        doc.text("contacto@jara.com", pageWidth / 2, contactoY, { align: "center" });
        doc.text(`REF: ${numeroReferencia}`, pageWidth - margin, contactoY, { align: "right" });

        // Guardar el PDF
        const nombreArchivo = `Cotizacion_${cotizacion.cliente.replace(/\s+/g, '_')}_${numeroReferencia}.pdf`;
        doc.save(nombreArchivo);

        // Mostrar mensaje de éxito
        toast.success("¡PDF generado y descargado correctamente!");

        // Llamar al callback de éxito si existe
        if (onSuccess) {
            onSuccess();
        }
    } catch (error) {
        console.error("Error al generar el PDF:", error);
        toast.error("Ocurrió un error al generar el PDF. Por favor, inténtelo de nuevo.");
    }
};

// Componente para generar PDF (puede ser usado directamente en la UI)
const CotizacionPDF = ({ }: CotizacionPDFProps) => {

    return null; // Este componente no renderiza nada, solo proporciona funcionalidad
};

export default CotizacionPDF; 