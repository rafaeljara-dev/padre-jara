"use client";

import { useState } from "react";
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
import { Trash, PlusCircle, FileText, Download, Eye, Pencil } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Switch } from "@/components/ui/switch";

import { 
  DatosCotizacion, 
  ProductoItem,
  calcularTotal,
  calcularSubtotal,
  calcularIva,
  generarPDF,
  generarVistaPreviaPDF,
  generarVistaPreviaURL
} from "@/components/cotizacion-pdf";

const CotizacionesPage = () => {
  // Estado para los datos de la cotización
  const [cotizacion, setCotizacion] = useState<DatosCotizacion>({
    cliente: "",
    empresa: "",
    productos: [],
    aplicarIva: true
  });

  // Estado para controlar la entrada de un nuevo producto
  const [nuevoProducto, setNuevoProducto] = useState<Omit<ProductoItem, "id">>({
    nombre: "",
    cantidad: 1,
    precio: 0
  });

  // Estado para controlar el diálogo de vista previa
  const [vistaPrevia, setVistaPrevia] = useState(false);
  
  // Estado para almacenar la URL de la vista previa del PDF
  const [pdfURL, setPdfURL] = useState<string>('');
  
  // Estado para indicar si se está cargando la vista previa
  const [cargandoVistaPrevia, setCargandoVistaPrevia] = useState(false);

  // Estado para controlar si estamos editando un producto existente
  const [productoEnEdicion, setProductoEnEdicion] = useState<string | null>(null);

  // Función para agregar un producto
  const agregarProducto = () => {
    if (!nuevoProducto.nombre || nuevoProducto.cantidad <= 0 || nuevoProducto.precio <= 0) {
      toast.error("Por favor complete todos los campos del producto correctamente");
      return;
    }

    if (productoEnEdicion) {
      // Estamos editando un producto existente
      setCotizacion({
        ...cotizacion,
        productos: cotizacion.productos.map(p => 
          p.id === productoEnEdicion 
            ? { ...nuevoProducto, id: productoEnEdicion } 
            : p
        )
      });
      
      setProductoEnEdicion(null);
      toast.success("Producto actualizado correctamente");
    } else {
      // Estamos agregando un nuevo producto
      const producto: ProductoItem = {
        id: Date.now().toString(),
        ...nuevoProducto
      };

      setCotizacion({
        ...cotizacion,
        productos: [...cotizacion.productos, producto]
      });

      toast.success("Producto agregado correctamente");
    }

    // Resetear el formulario de nuevo producto
    setNuevoProducto({
      nombre: "",
      cantidad: 1,
      precio: 0
    });
  };

  // Función para editar un producto
  const editarProducto = (id: string) => {
    const producto = cotizacion.productos.find(p => p.id === id);
    if (producto) {
      setNuevoProducto({
        nombre: producto.nombre,
        cantidad: producto.cantidad,
        precio: producto.precio
      });
      setProductoEnEdicion(id);
      
      // Hacer scroll al formulario de edición
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  };

  // Función para cancelar la edición
  const cancelarEdicion = () => {
    setProductoEnEdicion(null);
    setNuevoProducto({
      nombre: "",
      cantidad: 1,
      precio: 0
    });
  };

  // Función para eliminar un producto
  const eliminarProducto = (id: string) => {
    setCotizacion({
      ...cotizacion,
      productos: cotizacion.productos.filter(producto => producto.id !== id)
    });
    
    toast.info("Producto eliminado");
  };

  // Para manejar la generación del PDF
  const handleGenerarPDF = async () => {
    await generarPDF(cotizacion, () => setVistaPrevia(false));
  };

  // Para generar vista previa (sin descargar)
  const verVistaPreviaPDF = async () => {
    setCargandoVistaPrevia(true);
    setVistaPrevia(true);
    
    try {
      const url = await generarVistaPreviaURL(cotizacion);
      setPdfURL(url);
    } catch (error) {
      console.error("Error al generar la vista previa:", error);
      toast.error("No se pudo generar la vista previa");
    } finally {
      setCargandoVistaPrevia(false);
    }
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
            <CardTitle>{productoEnEdicion ? "Editar producto" : "Agregar producto"}</CardTitle>
            <CardDescription>
              {productoEnEdicion 
                ? "Modifique los detalles del producto seleccionado" 
                : "Ingrese los detalles del producto a cotizar"}
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
          <CardFooter className="flex justify-between">
            {productoEnEdicion && (
              <Button 
                variant="outline"
                onClick={cancelarEdicion}
              >
                Cancelar
              </Button>
            )}
            <Button 
              className={`${productoEnEdicion ? "bg-amber-500 hover:bg-amber-600" : "w-full"}`}
              onClick={agregarProducto}
            >
              {productoEnEdicion ? (
                <>
                  <Pencil className="mr-2 h-4 w-4" />
                  Actualizar producto
                </>
              ) : (
                <>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Agregar producto
                </>
              )}
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
                    <TableCell>${producto.precio.toLocaleString('es-MX', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</TableCell>
                    <TableCell>${(producto.cantidad * producto.precio).toLocaleString('es-MX', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline"
                          size="icon"
                          onClick={() => editarProducto(producto.id)}
                          className="border-amber-500 hover:bg-amber-100 hover:text-amber-700"
                        >
                          <Pencil className="h-4 w-4 text-amber-500" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => eliminarProducto(producto.id)}
                          className="border-red-500 hover:bg-red-100 hover:text-red-700"
                        >
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
              {cotizacion.productos.length > 0 && (
                <>
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-bold">Subtotal:</TableCell>
                    <TableCell className="font-medium">${calcularSubtotal(cotizacion.productos).toLocaleString('es-MX', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                  
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-bold">IVA (8%):</TableCell>
                    <TableCell className="font-medium">
                      {cotizacion.aplicarIva 
                        ? `$${calcularIva(cotizacion.productos).toLocaleString('es-MX', {minimumFractionDigits: 2, maximumFractionDigits: 2})}` 
                        : "$0.00"}
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                  
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-bold">Total:</TableCell>
                    <TableCell className="font-bold">${calcularTotal(cotizacion.productos, cotizacion.aplicarIva).toLocaleString('es-MX', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </>
              )}
            </TableBody>
          </Table>
          
          <div className="flex items-center justify-end space-x-2 mt-4">
            <Label htmlFor="aplicar-iva" className="text-sm text-muted-foreground">
              Aplicar IVA (8%):
            </Label>
            <Switch
              id="aplicar-iva"
              checked={cotizacion.aplicarIva}
              onCheckedChange={(checked: boolean) => 
                setCotizacion({...cotizacion, aplicarIva: checked})
              }
            />
          </div>
        </CardContent>
        {cotizacion.productos.length > 0 && (
          <CardFooter className="flex flex-wrap gap-2 justify-end">
            <Dialog open={vistaPrevia} onOpenChange={(open) => {
              setVistaPrevia(open);
              if (!open) setPdfURL('');
            }}>
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
              <DialogContent className="max-w-4xl max-h-[90vh]">
                <DialogHeader>
                  <DialogTitle>Vista previa de cotización</DialogTitle>
                  <DialogDescription>
                    Cotización para {cotizacion.cliente}{cotizacion.empresa ? ` de ${cotizacion.empresa}` : ''}
                  </DialogDescription>
                </DialogHeader>
                
                {cargandoVistaPrevia ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                    <span className="ml-3">Generando vista previa...</span>
                  </div>
                ) : pdfURL ? (
                  <div className="w-full rounded-md overflow-hidden border border-gray-200" style={{height: "70vh"}}>
                    <iframe 
                      src={pdfURL} 
                      className="w-full h-full" 
                      title="Vista previa de cotización"
                    />
                  </div>
                ) : (
                  <div className="py-10 text-center text-muted-foreground">
                    {generarVistaPreviaPDF(cotizacion)}
                  </div>
                )}
                
                <DialogFooter>
                  <Button onClick={handleGenerarPDF} className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Descargar PDF
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Button 
              disabled={!cotizacion.cliente || cotizacion.productos.length === 0} 
              onClick={handleGenerarPDF}
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