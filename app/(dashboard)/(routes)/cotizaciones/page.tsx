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
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Trash, PlusCircle, Download, Eye, Pencil } from "lucide-react";
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
    aplicarIva: true,
    mostrarDatosBancarios: true
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

  // Función para generar PDF
  const generarPDFHandler = () => {
    if (cotizacion.productos.length === 0) {
      toast.error("No se puede generar el PDF. Agregue al menos un producto.");
      return;
    }
    
    generarPDF(cotizacion, () => {
      // Callback de éxito (opcional)
    });
  };

  // Función para ver vista previa
  const verVistaPreviaPDF = async () => {
    if (cotizacion.productos.length === 0) {
      toast.error("No se puede generar la vista previa. Agregue al menos un producto.");
      return;
    }

    setCargandoVistaPrevia(true);
    const url = await generarVistaPreviaURL(cotizacion);
    setPdfURL(url);
    setCargandoVistaPrevia(false);
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
              Información del cliente para la cotización
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="cliente">Nombre del cliente (opcional)</Label>
              <Input
                id="cliente"
                placeholder="Nombre del cliente"
                value={cotizacion.cliente}
                onChange={(e) => setCotizacion({
                  ...cotizacion,
                  cliente: e.target.value
                })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="empresa">Empresa (opcional)</Label>
              <Input
                id="empresa"
                placeholder="Nombre de la empresa"
                value={cotizacion.empresa}
                onChange={(e) => setCotizacion({
                  ...cotizacion,
                  empresa: e.target.value
                })}
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
            <TableCaption className="pb-4">Lista de productos para cotización</TableCaption>
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
                          className="border-amber-500 bg-amber-100 hover:text-amber-700"
                        >
                          <Pencil className="h-4 w-4 text-amber-500" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => eliminarProducto(producto.id)}
                          className="border-red-500 bg-red-100 hover:text-red-700"
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
          
          <div className="flex flex-col sm:flex-row items-end justify-end gap-4 mt-6">
            <div className="flex items-center space-x-2 w-full sm:w-auto bg-gray-100 border border-gray-200 rounded-md px-3 py-2">
              <Label htmlFor="aplicar-iva" className="text-sm font-medium text-gray-700">
                Aplicar IVA (8%):
              </Label>
              <Switch
                id="aplicar-iva"
                checked={cotizacion.aplicarIva}
                onCheckedChange={(checked: boolean) => 
                  setCotizacion({...cotizacion, aplicarIva: checked})
                }
                className="data-[state=checked]:bg-emerald-600"
              />
            </div>
            <div className="flex items-center space-x-2 w-full sm:w-auto bg-gray-100 border border-gray-200 rounded-md px-3 py-2">
              <Label htmlFor="mostrar-datos-bancarios" className="text-sm font-medium text-gray-700">
                Mostrar datos bancarios:
              </Label>
              <Switch
                id="mostrar-datos-bancarios"
                checked={cotizacion.mostrarDatosBancarios}
                onCheckedChange={(checked: boolean) => 
                  setCotizacion({...cotizacion, mostrarDatosBancarios: checked})
                }
                className="data-[state=checked]:bg-emerald-600"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col md:flex-row gap-4 justify-end p-6">
          <Dialog open={vistaPrevia} onOpenChange={(open) => {
            setVistaPrevia(open);
            if (open && cotizacion.productos.length > 0) {
              verVistaPreviaPDF();
            } else if (!open) {
              setPdfURL('');
            }
          }}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                disabled={cotizacion.productos.length === 0}
              >
                <Eye className="mr-2 h-4 w-4" />
                Vista previa
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
              <DialogHeader>
                <DialogTitle>Vista previa de la cotización</DialogTitle>
                <DialogDescription>
                  Previsualización de la cotización antes de generar el PDF
                </DialogDescription>
              </DialogHeader>
              
              {cargandoVistaPrevia ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                  <span className="ml-3">Generando vista previa...</span>
                </div>
              ) : pdfURL ? (
                <>
                  {/* Vista previa del PDF para pantallas grandes */}
                  <div className="hidden md:block w-full rounded-md overflow-hidden border border-gray-200" style={{height: "70vh"}}>
                    <iframe 
                      src={pdfURL} 
                      className="w-full h-full" 
                      title="Vista previa de cotización"
                    />
                  </div>
                  
                  {/* Versión simplificada para dispositivos móviles */}
                  <div className="block md:hidden space-y-6">
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-bold">Cotización</h3>
                      <p className="text-xs text-muted-foreground">Fecha: {new Date().toLocaleDateString('es-MX', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}</p>
                      <p className="mt-2 text-xs">REF: COT-{new Date().getFullYear()}-{String(Math.floor(Math.random() * 10000)).padStart(4, '0')}</p>
                    </div>
                    
                    {(cotizacion.cliente || cotizacion.empresa) && (
                      <div className="bg-gray-50 rounded-md p-3 mb-4">
                        <h4 className="text-sm font-semibold mb-1">Información del cliente:</h4>
                        {cotizacion.cliente && <p className="text-sm">{cotizacion.cliente}</p>}
                        {cotizacion.empresa && <p className="text-sm text-muted-foreground">Empresa: {cotizacion.empresa}</p>}
                      </div>
                    )}
                    
                    <div className="border rounded-md overflow-hidden">
                      <div className="bg-gray-100 px-3 py-2">
                        <h4 className="text-sm font-semibold">Resumen de productos</h4>
                      </div>
                      <div className="p-2 space-y-2">
                        {cotizacion.productos.map((producto) => (
                          <div key={producto.id} className="border-b pb-2">
                            <div className="flex justify-between">
                              <span className="font-medium text-sm">{producto.nombre}</span>
                              <span className="text-sm">${(producto.cantidad * producto.precio).toLocaleString('es-MX', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>{producto.cantidad} x ${producto.precio.toLocaleString('es-MX', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="border-t px-3 py-2">
                        <div className="flex justify-between text-sm">
                          <span>Subtotal:</span>
                          <span>${calcularSubtotal(cotizacion.productos).toLocaleString('es-MX', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>IVA (8%):</span>
                          <span>{cotizacion.aplicarIva ? `$${calcularIva(cotizacion.productos).toLocaleString('es-MX', {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : "$0.00"}</span>
                        </div>
                        <div className="flex justify-between font-bold mt-1 pt-1 border-t">
                          <span>Total:</span>
                          <span>${calcularTotal(cotizacion.productos, cotizacion.aplicarIva).toLocaleString('es-MX', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 text-center text-xs text-muted-foreground">
                      <p>Esta es una versión simplificada. Para ver todos los detalles, descargue el PDF.</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-10 text-center text-muted-foreground">
                  {generarVistaPreviaPDF(cotizacion)}
                </div>
              )}
            </DialogContent>
          </Dialog>
          
          <Button
            onClick={generarPDFHandler}
            disabled={cotizacion.productos.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            Generar PDF
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CotizacionesPage;