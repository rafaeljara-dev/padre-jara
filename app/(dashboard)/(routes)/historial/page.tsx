"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/sonner";
import { Eye, FileText, Pencil, Trash2, ArrowLeft } from "lucide-react";
import { DatosCotizacion, generarPDF } from "@/components/cotizacion-pdf";
import { Input } from "@/components/ui/input";

// Interfaz para cotización guardada
interface CotizacionGuardada extends DatosCotizacion {
  id: string;
  fecha: string;
  nombre: string;
  referencia?: string;
}

export default function HistorialPage() {
  const router = useRouter();
  const [cotizaciones, setCotizaciones] = useState<CotizacionGuardada[]>([]);
  const [filtroBusqueda, setFiltroBusqueda] = useState("");

  // Cargar cotizaciones desde localStorage
  useEffect(() => {
    const cotizacionesGuardadas = localStorage.getItem("cotizaciones");
    if (cotizacionesGuardadas) {
      try {
        const parsed = JSON.parse(cotizacionesGuardadas);
        setCotizaciones(parsed);
      } catch (e) {
        console.error("Error al cargar las cotizaciones:", e);
        toast.error("Error al cargar las cotizaciones");
      }
    }
  }, []);

  // Función para formatear fecha
  const formatearFecha = (fechaISO: string) => {
    try {
      const fecha = new Date(fechaISO);
      return fecha.toLocaleDateString("es-MX", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return "Fecha inválida";
    }
  };

  // Función para calcular el total de una cotización
  const calcularTotal = (cotizacion: CotizacionGuardada) => {
    const subtotal = cotizacion.productos.reduce(
      (acc, producto) => acc + producto.cantidad * producto.precio,
      0
    );
    return cotizacion.aplicarIva ? subtotal * 1.08 : subtotal;
  };

  // Función para eliminar una cotización
  const eliminarCotizacion = (id: string) => {
    const cotizacionesActualizadas = cotizaciones.filter((cot) => cot.id !== id);
    setCotizaciones(cotizacionesActualizadas);
    localStorage.setItem("cotizaciones", JSON.stringify(cotizacionesActualizadas));

    toast.success("Cotización eliminada correctamente", {
      style: { backgroundColor: "#FFF8E1", color: "#F59E0B", borderColor: "#F59E0B" },
      icon: <Trash2 className="h-5 w-5 text-amber-500" />,
    });
  };

  // Función para editar una cotización (navegar a página de cotizaciones)
  const editarCotizacion = (id: string) => {
    // Guardar ID de la cotización a editar en localStorage para que la página de cotizaciones la cargue
    localStorage.setItem("cotizacionEditarId", id);
    router.push("/cotizaciones");
  };

  // Función para regenerar PDF
  const regenerarPDF = (cotizacion: CotizacionGuardada) => {
    generarPDF(cotizacion, () => {
      toast.success("¡PDF generado y descargado correctamente!", {
        style: { backgroundColor: "#E8F5E9", color: "#22C55E", borderColor: "#22C55E" },
        icon: <FileText className="h-5 w-5 text-green-500" />,
      });
    });
  };

  // Filtrar cotizaciones según la búsqueda
  const cotizacionesFiltradas = cotizaciones.filter((cot) => {
    if (!filtroBusqueda) return true;

    const terminoBusqueda = filtroBusqueda.toLowerCase();

    // Verificar que nombre exista antes de usar toLowerCase
    const nombreCoincide = cot.nombre ? cot.nombre.toLowerCase().includes(terminoBusqueda) : false;

    // Verificar cliente
    const clienteCoincide = cot.cliente ? cot.cliente.toLowerCase().includes(terminoBusqueda) : false;

    // Verificar empresa
    const empresaCoincide = cot.empresa ? cot.empresa.toLowerCase().includes(terminoBusqueda) : false;

    // Verificar referencia (REF)
    const referenciaCoincide = cot.referencia ? cot.referencia.toLowerCase().includes(terminoBusqueda) : false;

    return nombreCoincide || clienteCoincide || empresaCoincide || referenciaCoincide;
  });

  // Ordenar por fecha más reciente
  const cotizacionesOrdenadas = [...cotizacionesFiltradas].sort((a, b) => {
    return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
  });

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/cotizaciones")}
            aria-label="Volver a cotizaciones"
            className="h-10 w-10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Historial de Cotizaciones</h1>
        </div>

        <div className="relative w-full max-w-lg">
          <div className="flex items-center bg-white rounded-lg shadow-md border-2 border-blue-200 hover:border-blue-400 transition-all duration-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 overflow-hidden">
            <div className="p-3 bg-blue-50 text-blue-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </div>
            <Input
              placeholder="Buscar por nombre, cliente o REF..."
              value={filtroBusqueda}
              onChange={(e) => setFiltroBusqueda(e.target.value)}
              className="flex-1 h-12 text-base border-0 focus-visible:ring-0 focus-visible:ring-offset-0 pl-2"
            />
            {filtroBusqueda && (
              <Button
                variant="ghost"
                size="icon"
                className="h-12 aspect-square rounded-none border-l border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                onClick={() => setFiltroBusqueda("")}
                aria-label="Limpiar búsqueda"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </Button>
            )}
          </div>
        </div>
      </div>

      <Card className="border shadow-sm">
        <CardHeader className="pb-2 p-2">
          <CardTitle className="text-xl font-bold">Cotizaciones guardadas</CardTitle>
          <CardDescription className="text-base">
            Historial de todas tus cotizaciones generadas
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto p-2">
            <Table className=" border-2 border-gray-200 rounded-lg">
              <TableCaption className="text-base">
                {cotizacionesOrdenadas.length === 0
                  ? "No hay cotizaciones guardadas"
                  : `Total de ${cotizacionesOrdenadas.length} cotizaciones`}
              </TableCaption>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="w-[200px] text-base">Cliente</TableHead>
                  <TableHead className="hidden md:table-cell text-base">Productos</TableHead>
                  <TableHead className="hidden md:table-cell text-base">Referencia</TableHead>
                  <TableHead className="hidden lg:table-cell text-base">Total</TableHead>
                  <TableHead className="hidden md:table-cell text-base">Fecha</TableHead>
                  <TableHead className="text-right text-base">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cotizacionesOrdenadas.map((cotizacion) => (
                  <TableRow key={cotizacion.id}>
                    <TableCell className="font-medium text-base">
                      <div>
                        {cotizacion.cliente || cotizacion.empresa || "-"}
                        <div className="md:hidden mt-1 text-sm">
                          <span className="rounded-full bg-blue-100 px-2.5 py-1.5 text-blue-700 inline-block">
                            {formatearFecha(cotizacion.fecha)}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="rounded-full bg-amber-100 px-2.5 py-1.5 text-amber-700 text-sm">
                        {cotizacion.productos.length}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm">
                      {cotizacion.referencia || "-"}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-base font-medium">
                      ${calcularTotal(cotizacion).toLocaleString("es-MX", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="rounded-full bg-blue-100 px-2.5 py-1.5 text-blue-700 text-sm">
                        {formatearFecha(cotizacion.fecha)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 hover:text-indigo-800 hover:scale-110 transition-all duration-200 shadow-sm"
                              aria-label="Ver detalles"
                            >
                              <Eye className="h-5 w-5" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
                            <DialogHeader>
                              <DialogTitle className="text-xl">Detalles de la cotización</DialogTitle>
                              <DialogDescription className="text-base">
                                {cotizacion.nombre} - {formatearFecha(cotizacion.fecha)}
                                {cotizacion.referencia && <span className="ml-2 text-sm font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md">REF: {cotizacion.referencia}</span>}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                  <h3 className="font-medium mb-2 text-lg">Información del cliente</h3>
                                  <p className="text-base">
                                    <strong>Cliente:</strong> {cotizacion.cliente || "-"}
                                  </p>
                                  <p className="text-base">
                                    <strong>Empresa:</strong> {cotizacion.empresa || "-"}
                                  </p>
                                </div>
                                <div>
                                  <h3 className="font-medium mb-2 text-lg">Configuración</h3>
                                  <p className="text-base">
                                    <strong>Aplicar IVA:</strong> {cotizacion.aplicarIva ? "Sí" : "No"}
                                  </p>
                                  <p className="text-base">
                                    <strong>Datos bancarios:</strong>{" "}
                                    {cotizacion.mostrarDatosBancarios ? "Visibles" : "Ocultos"}
                                  </p>
                                </div>
                              </div>
                              <div>
                                <h3 className="font-medium mb-2 text-lg">Productos</h3>
                                <div className="rounded-md border overflow-x-auto">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Producto</TableHead>
                                        <TableHead className="text-center">Cantidad</TableHead>
                                        <TableHead className="text-right">Precio</TableHead>
                                        <TableHead className="text-right">Subtotal</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {cotizacion.productos.map((producto) => (
                                        <TableRow key={producto.id}>
                                          <TableCell>{producto.nombre}</TableCell>
                                          <TableCell className="text-center">{producto.cantidad}</TableCell>
                                          <TableCell className="text-right">
                                            ${producto.precio.toLocaleString("es-MX", {
                                              minimumFractionDigits: 2,
                                              maximumFractionDigits: 2,
                                            })}
                                          </TableCell>
                                          <TableCell className="text-right">
                                            ${(producto.cantidad * producto.precio).toLocaleString("es-MX", {
                                              minimumFractionDigits: 2,
                                              maximumFractionDigits: 2,
                                            })}
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                      {cotizacion.aplicarIva && (
                                        <TableRow>
                                          <TableCell colSpan={3} className="text-right font-medium">
                                            Subtotal:
                                          </TableCell>
                                          <TableCell className="text-right">
                                            ${cotizacion.productos
                                              .reduce((acc, p) => acc + p.cantidad * p.precio, 0)
                                              .toLocaleString("es-MX", {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                              })}
                                          </TableCell>
                                        </TableRow>
                                      )}
                                      {cotizacion.aplicarIva && (
                                        <TableRow>
                                          <TableCell colSpan={3} className="text-right font-medium">
                                            IVA (8%):
                                          </TableCell>
                                          <TableCell className="text-right">
                                            ${(cotizacion.productos
                                              .reduce((acc, p) => acc + p.cantidad * p.precio, 0) * 0.08)
                                              .toLocaleString("es-MX", {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                              })}
                                          </TableCell>
                                        </TableRow>
                                      )}
                                      <TableRow>
                                        <TableCell colSpan={3} className="text-right font-bold">
                                          Total:
                                        </TableCell>
                                        <TableCell className="text-right font-bold">
                                          ${calcularTotal(cotizacion).toLocaleString("es-MX", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                          })}
                                        </TableCell>
                                      </TableRow>
                                    </TableBody>
                                  </Table>
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                              <Button
                                onClick={() => regenerarPDF(cotizacion)}
                                className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 transition-all duration-200 text-base h-10 px-4"
                              >
                                <FileText className="h-5 w-5" />
                                Generar PDF
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 bg-amber-100 text-amber-700 hover:bg-amber-200 hover:text-amber-800 hover:scale-110 transition-all duration-200 shadow-sm"
                          onClick={() => editarCotizacion(cotizacion.id)}
                          aria-label="Editar cotización"
                        >
                          <Pencil className="h-5 w-5" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 hover:text-emerald-800 hover:scale-110 transition-all duration-200 shadow-sm"
                          onClick={() => regenerarPDF(cotizacion)}
                          aria-label="Generar PDF"
                        >
                          <FileText className="h-5 w-5" />
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 bg-rose-100 text-rose-700 hover:bg-rose-200 hover:text-rose-800 hover:scale-110 transition-all duration-200 shadow-sm"
                              aria-label="Eliminar cotización"
                            >
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-xl">
                                ¿Eliminar esta cotización?
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-base">
                                Esta acción no se puede deshacer. Esta cotización se
                                eliminará permanentemente de tus registros.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="mt-6">
                              <AlertDialogCancel className="text-base h-10">
                                Cancelar
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => eliminarCotizacion(cotizacion.id)}
                                className="bg-red-500 hover:bg-red-600 text-base h-10"
                              >
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            Las cotizaciones se guardan localmente en tu navegador.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}