import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { DatosCotizacion, calcularSubtotal, calcularIva, calcularTotal } from "@/components/cotizacion-pdf";

interface ActionButtonsProps {
  cotizacion: DatosCotizacion;
  pdfURL: string;
  cargandoVistaPrevia: boolean;
  vistaPrevia: boolean;
  setVistaPrevia: (value: boolean) => void;
  verVistaPreviaPDF: () => void;
  generarPDFHandler: () => void;
  isMobile?: boolean;
  nombreCotizacion?: string;
  setNombreCotizacion?: (nombre: string) => void;
  cotizacionEnEdicionId?: string | null;
}

interface CotizacionGuardada extends DatosCotizacion {
  id: string;
  fecha: string;
  nombre: string;
  referencia: string;
}

export const ActionButtons = ({
  cotizacion,
  pdfURL,
  cargandoVistaPrevia,
  vistaPrevia,
  setVistaPrevia,
  verVistaPreviaPDF,
  generarPDFHandler,
  isMobile = false,
  nombreCotizacion = "",
  setNombreCotizacion,
  cotizacionEnEdicionId = null
}: ActionButtonsProps) => {
  // Estado para controlar si se ha presionado el área del contenedor
  const [contenedorPresionado, setContenedorPresionado] = useState(false);
  // Estado para rastrear si ya se ha guardado la cotización actual
  const [cotizacionGuardada, setCotizacionGuardada] = useState(Boolean(cotizacionEnEdicionId));

  // Manejar el clic en el contenedor cuando los botones están deshabilitados
  const handleContenedorClick = () => {
    if (cotizacion.productos.length === 0 && !contenedorPresionado) {
      setContenedorPresionado(true);
      toast.warning("Debe agregar al menos un producto para activar estas opciones", {
        duration: 3000,
        onDismiss: () => setContenedorPresionado(false)
      });
      setTimeout(() => setContenedorPresionado(false), 3000);
    }
  };

  // Función para guardar en historial automáticamente al generar PDF
  const handleGenerarPDF = () => {
    generarPDFHandler();

    // También guardar en historial si hay productos
    if (cotizacion.productos.length > 0) {
      // Generar nombre para la cotización basado en el cliente o empresa
      let nombreGenerado = nombreCotizacion;

      // Si no hay nombre definido manualmente, usamos el cliente o empresa
      if (!nombreGenerado || nombreGenerado.trim() === '') {
        if (cotizacion.cliente && cotizacion.cliente.trim() !== '') {
          nombreGenerado = `${cotizacion.cliente}`;
        } else if (cotizacion.empresa && cotizacion.empresa.trim() !== '') {
          nombreGenerado = ` ${cotizacion.empresa}`;
        } else {
          nombreGenerado = "Cotización Sin Nombre";
        }
      }

      // Crear objeto para guardar
      const fechaActual = new Date().toISOString();
      // Usar el ID existente si estamos editando, de lo contrario crear uno nuevo
      const idCotizacion = cotizacionEnEdicionId || Date.now().toString();

      // Generar una referencia única si no existe
      const referencia = cotizacion.referencia ||
        `COT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;

      const cotizacionParaGuardar: CotizacionGuardada = {
        id: idCotizacion,
        fecha: fechaActual,
        nombre: nombreGenerado,
        ...cotizacion,
        referencia: referencia
      };

      // Obtener cotizaciones existentes
      const cotizacionesGuardadasString = localStorage.getItem("cotizaciones");
      let cotizacionesGuardadas: CotizacionGuardada[] = [];

      if (cotizacionesGuardadasString) {
        try {
          cotizacionesGuardadas = JSON.parse(cotizacionesGuardadasString);
        } catch (error) {
          console.error("Error al parsear cotizaciones guardadas:", error);
        }
      }

      // Verificar si estamos editando o si ya se guardó anteriormente la cotización actual
      if (cotizacionEnEdicionId) {
        // Estamos editando, actualizar la existente
        cotizacionesGuardadas = cotizacionesGuardadas.map(cot =>
          cot.id === cotizacionEnEdicionId ? cotizacionParaGuardar : cot
        );

        // Mostrar mensaje
        toast.success("¡Cotización actualizada en historial!", {
          duration: 3000
        });
      } else if (cotizacionGuardada) {
        // Ya se guardó anteriormente, identificar por nombre, cliente y productos
        const cotizacionExistente = cotizacionesGuardadas.find(cot =>
          (cot.cliente === cotizacion.cliente && cot.empresa === cotizacion.empresa) &&
          JSON.stringify(cot.productos) === JSON.stringify(cotizacion.productos)
        );

        if (cotizacionExistente) {
          // Actualizar la existente
          cotizacionesGuardadas = cotizacionesGuardadas.map(cot =>
            cot.id === cotizacionExistente.id ? { ...cotizacionParaGuardar, id: cotizacionExistente.id } : cot
          );

          // Mostrar mensaje
          toast.success("¡Cotización actualizada en historial!", {
            duration: 3000
          });
        } else {
          // Extrañamente no encontramos coincidencia, agregar como nueva
          cotizacionesGuardadas.push(cotizacionParaGuardar);

          // Mostrar mensaje
          toast.success("¡Cotización guardada en historial!", {
            duration: 3000
          });
        }
      } else {
        // Es nueva, agregarla al array
        cotizacionesGuardadas.push(cotizacionParaGuardar);

        // Marcar como guardada para evitar duplicados
        setCotizacionGuardada(true);

        // Mostrar mensaje
        toast.success("¡Cotización guardada en historial!", {
          duration: 3000
        });
      }

      // Guardar en localStorage
      localStorage.setItem("cotizaciones", JSON.stringify(cotizacionesGuardadas));

      // Actualizar nombre de cotización en el componente padre si existe
      if (setNombreCotizacion) {
        setNombreCotizacion(nombreGenerado);
      }
    }
  };

  return (
    <div
      className={isMobile ? "flex gap-3 max-w-screen-sm mx-auto" : "flex flex-row gap-4 justify-end p-6"}
      onClick={handleContenedorClick}
    >
      <Dialog open={vistaPrevia} onOpenChange={(open) => {
        setVistaPrevia(open);
        if (open && cotizacion.productos.length > 0) {
          verVistaPreviaPDF();
        }
      }}>
        <DialogTrigger asChild>
          <Button
            disabled={cotizacion.productos.length === 0}
            variant={"default"}
            className={`${isMobile ? "flex-1" : ""}transition-all duration-200 disabled:opacity-60 disabled:pointer-events-none`}
          >
            <Eye className="mr-2 h-4 w-4" />
            Vista previa
          </Button>
        </DialogTrigger>
        <DialogContent className="py-2 max-h-[90vh] overflow-auto justify-center items-center">
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
              <div className="hidden md:block w-full rounded-md overflow-hidden border border-gray-200" style={{ height: "70vh" }}>
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
                          <span className="text-sm">${(producto.cantidad * producto.precio).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{producto.cantidad} x ${producto.precio.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t px-3 py-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>${calcularSubtotal(cotizacion.productos).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>IVA (8%):</span>
                      <span>{cotizacion.aplicarIva ? `$${calcularIva(cotizacion.productos).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$0.00"}</span>
                    </div>
                    <div className="flex justify-between font-bold mt-1 pt-1 border-t">
                      <span>Total:</span>
                      <span>${calcularTotal(cotizacion.productos, cotizacion.aplicarIva).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
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
              No se pudo generar la vista previa
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Button
        onClick={handleGenerarPDF}
        disabled={cotizacion.productos.length === 0}
        className={`${isMobile ? "flex-1" : ""} bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-600 hover:border-emerald-700 transition-all duration-200 disabled:opacity-60 disabled:pointer-events-none`}
        variant={"default"}
      >
        <Download className="mr-2 h-4 w-4" />
        Guardar PDF
      </Button>
    </div>
  );
};

export default ActionButtons; 