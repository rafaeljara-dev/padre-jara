"use client";

import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Trash, PlusCircle, FileText, Download, Eye } from "lucide-react";
import { toast } from "@/components/ui/sonner";

// Interfaces para los datos
interface ProductoItem {
  id: string;
  nombre: string;
  cantidad: number;
  precio: number;
}

interface DatosCotizacion {
  cliente: string;
  empresa: string;
  productos: ProductoItem[];
}

const CotizacionesPage = () => {
  // Estado para los datos de la cotización
  const [cotizacion, setCotizacion] = useState<DatosCotizacion>({
    cliente: "",
    empresa: "",
    productos: []
  });

  // Estado para controlar la entrada de un nuevo producto
  const [nuevoProducto, setNuevoProducto] = useState<Omit<ProductoItem, "id">>({
    nombre: "",
    cantidad: 1,
    precio: 0
  });

  // Estado para controlar el diálogo de vista previa
  const [vistaPrevia, setVistaPrevia] = useState(false);
  
  // Estado para controlar si el navegador está listo
  const [isBrowser, setIsBrowser] = useState(false);

  // Verificar si estamos en el navegador
  useEffect(() => {
    setIsBrowser(true);
  }, []);

  // Función para agregar un producto
  const agregarProducto = () => {
    if (!nuevoProducto.nombre || nuevoProducto.cantidad <= 0 || nuevoProducto.precio <= 0) {
      toast.error("Por favor complete todos los campos del producto correctamente");
      return;
    }

    const producto: ProductoItem = {
      id: Date.now().toString(),
      ...nuevoProducto
    };

    setCotizacion({
      ...cotizacion,
      productos: [...cotizacion.productos, producto]
    });

    // Resetear el formulario de nuevo producto
    setNuevoProducto({
      nombre: "",
      cantidad: 1,
      precio: 0
    });

    toast.success("Producto agregado correctamente");
  };

  // Función para eliminar un producto
  const eliminarProducto = (id: string) => {
    setCotizacion({
      ...cotizacion,
      productos: cotizacion.productos.filter(producto => producto.id !== id)
    });
    
    toast.info("Producto eliminado");
  };

  // Calcular el total de la cotización
  const calcularTotal = () => {
    return cotizacion.productos.reduce((total, producto) => {
      return total + (producto.cantidad * producto.precio);
    }, 0);
  };

  // Generar la cotización en PDF
  const generarPDF = async () => {
    if (!isBrowser || !cotizacion.cliente || cotizacion.productos.length === 0) {
      toast.error("No se puede generar el PDF. Verifique que ha ingresado el cliente y al menos un producto.");
      return;
    }

    // Mostrar toast de carga
    toast.loading("Generando PDF...");

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
      const margin = 20;
      let y = 20;

      // Título
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("COTIZACIÓN", pageWidth / 2, y, { align: "center" });
      y += 10;

      // Fecha
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      const fechaActual = new Date().toLocaleDateString();
      doc.text(`Fecha: ${fechaActual}`, pageWidth / 2, y, { align: "center" });
      y += 15;

      // Información del cliente
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Datos del cliente:", margin, y);
      y += 7;
      
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`Cliente: ${cotizacion.cliente}`, margin, y);
      y += 7;
      
      if (cotizacion.empresa) {
        doc.text(`Empresa: ${cotizacion.empresa}`, margin, y);
        y += 7;
      }
      
      y += 10;

      // Tabla de productos manualmente
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Productos:", margin, y);
      y += 10;

      // Crear la tabla manualmente
      const colWidths = [80, 20, 30, 30]; // Ancho de columnas
      const startX = margin;
      const rowHeight = 8;
      
      // Encabezados de la tabla
      doc.setFillColor(220, 220, 220);
      doc.rect(startX, y, pageWidth - (margin * 2), rowHeight, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("Producto", startX + 2, y + 5);
      doc.text("Cantidad", startX + colWidths[0] + 2, y + 5);
      doc.text("Precio", startX + colWidths[0] + colWidths[1] + 2, y + 5);
      doc.text("Subtotal", startX + colWidths[0] + colWidths[1] + colWidths[2] + 2, y + 5);
      
      y += rowHeight;
      
      // Filas de la tabla
      doc.setFont("helvetica", "normal");
      
      cotizacion.productos.forEach((producto, index) => {
        // Alternar color de fondo para las filas
        if (index % 2 === 0) {
          doc.setFillColor(240, 240, 240);
          doc.rect(startX, y, pageWidth - (margin * 2), rowHeight, "F");
        }
        
        doc.text(producto.nombre, startX + 2, y + 5);
        doc.text(producto.cantidad.toString(), startX + colWidths[0] + 2, y + 5);
        doc.text(`$${producto.precio.toFixed(2)}`, startX + colWidths[0] + colWidths[1] + 2, y + 5);
        doc.text(`$${(producto.cantidad * producto.precio).toFixed(2)}`, startX + colWidths[0] + colWidths[1] + colWidths[2] + 2, y + 5);
        
        y += rowHeight;
      });
      
      // Fila del total
      doc.setFont("helvetica", "bold");
      doc.setFillColor(240, 240, 240);
      doc.rect(startX, y, pageWidth - (margin * 2), rowHeight, "F");
      doc.text("Total:", startX + colWidths[0] + colWidths[1] + 2, y + 5);
      doc.text(`$${calcularTotal().toFixed(2)}`, startX + colWidths[0] + colWidths[1] + colWidths[2] + 2, y + 5);
      
      y += rowHeight + 10;

      // Pie de página
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text("Esta cotización es válida por 30 días a partir de la fecha de emisión.", margin, y);
      doc.text("Gracias por su confianza.", margin, y + 7);

      // Guardar el PDF
      const nombreArchivo = `Cotizacion_${cotizacion.cliente.replace(/\s+/g, '_')}_${fechaActual.replace(/\//g, '-')}.pdf`;
      doc.save(nombreArchivo);
      
      // Mostrar mensaje de éxito
      toast.success("¡PDF generado y descargado correctamente!");
      setVistaPrevia(false);
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      toast.error("Ocurrió un error al generar el PDF. Por favor, inténtelo de nuevo.");
    }
  };

  // Para generar vista previa (sin descargar)
  const verVistaPreviaPDF = () => {
    setVistaPrevia(true);
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Cotizaciones</h1>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Datos del cliente */}
        <Card>
          <CardHeader>
            <CardTitle>Datos del cliente</CardTitle>
            <CardDescription>
              Ingrese los datos del cliente para la cotización
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cliente">Nombre del cliente</Label>
              <Input 
                id="cliente" 
                placeholder="Ej. Juan Pérez" 
                value={cotizacion.cliente}
                onChange={(e) => setCotizacion({...cotizacion, cliente: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="empresa">Empresa (opcional)</Label>
              <Input 
                id="empresa" 
                placeholder="Ej. Empresas SA" 
                value={cotizacion.empresa}
                onChange={(e) => setCotizacion({...cotizacion, empresa: e.target.value})}
              />
            </div>
          </CardContent>
        </Card>

        {/* Agregar productos */}
        <Card>
          <CardHeader>
            <CardTitle>Agregar producto</CardTitle>
            <CardDescription>
              Ingrese los detalles del producto a cotizar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombreProducto">Nombre del producto</Label>
              <Input 
                id="nombreProducto" 
                placeholder="Ej. Laptop HP" 
                value={nuevoProducto.nombre}
                onChange={(e) => setNuevoProducto({...nuevoProducto, nombre: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cantidad">Cantidad</Label>
                <Input 
                  id="cantidad" 
                  type="number"
                  min="1"
                  value={nuevoProducto.cantidad}
                  onChange={(e) => setNuevoProducto({...nuevoProducto, cantidad: parseInt(e.target.value) || 0})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="precio">Precio (MXN)</Label>
                <Input 
                  id="precio" 
                  type="number"
                  min="0"
                  step="0.01"
                  value={nuevoProducto.precio}
                  onChange={(e) => setNuevoProducto({...nuevoProducto, precio: parseFloat(e.target.value) || 0})}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={agregarProducto}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Agregar producto
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Lista de productos */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de productos</CardTitle>
          <CardDescription>
            Productos incluidos en la cotización
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>Lista de productos para cotización</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Precio unitario</TableHead>
                <TableHead>Subtotal</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cotizacion.productos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No hay productos agregados a la cotización
                  </TableCell>
                </TableRow>
              ) : (
                cotizacion.productos.map((producto) => (
                  <TableRow key={producto.id}>
                    <TableCell className="font-medium">{producto.nombre}</TableCell>
                    <TableCell>{producto.cantidad}</TableCell>
                    <TableCell>${producto.precio.toFixed(2)}</TableCell>
                    <TableCell>${(producto.cantidad * producto.precio).toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => eliminarProducto(producto.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
              {cotizacion.productos.length > 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-bold">Total:</TableCell>
                  <TableCell className="font-bold">${calcularTotal().toFixed(2)}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        {cotizacion.productos.length > 0 && (
          <CardFooter className="flex flex-wrap gap-2 justify-end">
            <Dialog open={vistaPrevia} onOpenChange={setVistaPrevia}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  disabled={!cotizacion.cliente}
                  className="w-full sm:w-auto"
                  onClick={verVistaPreviaPDF}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Vista previa
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Vista previa de cotización</DialogTitle>
                  <DialogDescription>
                    Cotización para {cotizacion.cliente}{cotizacion.empresa ? ` de ${cotizacion.empresa}` : ''}
                  </DialogDescription>
                </DialogHeader>
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
                            <td className="text-right py-2">${item.precio.toFixed(2)}</td>
                            <td className="text-right py-2">${(item.cantidad * item.precio).toFixed(2)}</td>
                          </tr>
                        ))}
                        <tr>
                          <td colSpan={3} className="text-right font-bold py-2">Total:</td>
                          <td className="text-right font-bold py-2">${calcularTotal().toFixed(2)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    <p>Esta cotización es válida por 30 días.</p>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={generarPDF} className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Descargar PDF
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Button 
              disabled={!cotizacion.cliente || cotizacion.productos.length === 0} 
              onClick={generarPDF}
              className="w-full sm:w-auto"
            >
              <FileText className="mr-2 h-4 w-4" />
              Generar PDF
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default CotizacionesPage;