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
import { Trash2, AlertTriangle, CheckCircle, XCircle, FileText, Hammer, Save, History, ArrowLeft } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  DatosCotizacion,
  ProductoItem,
  generarPDF,
  generarVistaPreviaURL
} from "@/components/cotizacion-pdf";

// Importar los componentes modulares
import ClienteForm from "@/components/cotizacion/ClienteForm";
import ProductoForm from "@/components/cotizacion/ProductoForm";
import ProductoTable from "@/components/cotizacion/ProductoTable";
import ActionButtons from "@/components/cotizacion/ActionButtons";

// Interfaz para cotización guardada
interface CotizacionGuardada extends DatosCotizacion {
  id: string;
  fecha: string;
  nombre: string;
  referencia: string;
}

const CotizacionesPage = () => {
  const router = useRouter();

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
    cantidad: 0,
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

  // Estado para animación de confirmación
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Estado para el diálogo de guardar cotización
  const [mostrarGuardarDialog, setMostrarGuardarDialog] = useState(false);

  // Estado para el nombre de la cotización
  const [nombreCotizacion, setNombreCotizacion] = useState("");

  // Estado para saber si estamos editando una cotización guardada
  const [cotizacionEnEdicionId, setCotizacionEnEdicionId] = useState<string | null>(null);

  // Efecto para verificar si hay una cotización a editar
  useEffect(() => {
    const cotizacionEditarId = localStorage.getItem("cotizacionEditarId");

    if (cotizacionEditarId) {
      cargarCotizacionPorId(cotizacionEditarId);
      // Limpiar después de cargar
      localStorage.removeItem("cotizacionEditarId");
    }
  }, []);

  // Función para cargar una cotización por su ID
  const cargarCotizacionPorId = (id: string) => {
    const cotizacionesGuardadas = localStorage.getItem("cotizaciones");

    if (cotizacionesGuardadas) {
      try {
        const cotizaciones: CotizacionGuardada[] = JSON.parse(cotizacionesGuardadas);
        const cotizacionEncontrada = cotizaciones.find(c => c.id === id);

        if (cotizacionEncontrada) {
          // Cargar la cotización
          setCotizacion({
            cliente: cotizacionEncontrada.cliente || "",
            empresa: cotizacionEncontrada.empresa || "",
            productos: cotizacionEncontrada.productos,
            aplicarIva: cotizacionEncontrada.aplicarIva !== undefined ? cotizacionEncontrada.aplicarIva : true,
            mostrarDatosBancarios: cotizacionEncontrada.mostrarDatosBancarios !== undefined ? cotizacionEncontrada.mostrarDatosBancarios : true
          });

          // Establecer el nombre y el ID para edición
          setNombreCotizacion(cotizacionEncontrada.nombre);
          setCotizacionEnEdicionId(id);

          toast.success(`Cotización "${cotizacionEncontrada.nombre}" cargada para edición`, {
            style: { backgroundColor: "#E8F5E9", color: "#22C55E", borderColor: "#22C55E" },
            icon: <CheckCircle className="h-5 w-5 text-green-500" />,
          });
        } else {
          toast.error("No se encontró la cotización especificada", {
            style: { backgroundColor: "#FFEBEE", color: "#EF4444", borderColor: "#EF4444" },
            icon: <XCircle className="h-5 w-5 text-red-500" />,
          });
        }
      } catch (error) {
        console.error("Error al cargar la cotización:", error);
        toast.error("Error al cargar la cotización");
      }
    }
  };

  // Función para manejar cambios en los campos del cliente
  const handleClienteChange = (field: string, value: string) => {
    setCotizacion({
      ...cotizacion,
      [field]: value
    });
  };

  // Función para manejar cambios en los switches
  const handleSwitchChange = (field: string, value: boolean) => {
    setCotizacion({
      ...cotizacion,
      [field]: value
    });
  };

  // Función para agregar un producto
  const agregarProducto = () => {
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
      toast.success("¡Producto actualizado correctamente!", {
        style: { backgroundColor: "#E8F5E9", color: "#22C55E", borderColor: "#22C55E" },
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      });
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

      toast.success("¡Producto agregado correctamente!", {
        style: { backgroundColor: "#E8F5E9", color: "#22C55E", borderColor: "#22C55E" },
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      });
    }

    // Mostrar animación de confirmación
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 1000);

    // Resetear el formulario de nuevo producto
    setNuevoProducto({
      nombre: "",
      cantidad: 0,
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
      cantidad: 0,
      precio: 0
    });
  };

  // Función para eliminar un producto
  const eliminarProducto = (id: string) => {
    setCotizacion({
      ...cotizacion,
      productos: cotizacion.productos.filter(producto => producto.id !== id)
    });

    toast.warning("Producto eliminado", {
      style: { backgroundColor: "#FFF8E1", color: "#F59E0B", borderColor: "#F59E0B" },
      icon: <Trash2 className="h-5 w-5 text-amber-500" />,
    });
  };

  // Función para generar PDF
  const generarPDFHandler = () => {
    if (cotizacion.productos.length === 0) {
      toast.error("No se puede generar el PDF. Agregue al menos un producto.", {
        style: { backgroundColor: "#FFF8E1", color: "#F59E0B", borderColor: "#F59E0B" },
        icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
      });
      return;
    }

    generarPDF(cotizacion, () => {
      toast.success("¡PDF generado y descargado correctamente!", {
        style: { backgroundColor: "#E8F5E9", color: "#22C55E", borderColor: "#22C55E" },
        icon: <FileText className="h-5 w-5 text-green-500" />,
      });
    });
  };

  // Función para ver vista previa
  const verVistaPreviaPDF = async () => {
    if (cotizacion.productos.length === 0) {
      toast.error("No se puede generar la vista previa. Agregue al menos un producto.", {
        style: { backgroundColor: "#FFF8E1", color: "#F59E0B", borderColor: "#F59E0B" },
        icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
      });
      return;
    }

    setCargandoVistaPrevia(true);
    const url = await generarVistaPreviaURL(cotizacion);
    setPdfURL(url);
    setCargandoVistaPrevia(false);

    if (!url) {
      toast.error("No se pudo generar la vista previa. Intente de nuevo.", {
        style: { backgroundColor: "#FFEBEE", color: "#EF4444", borderColor: "#EF4444" },
        icon: <XCircle className="h-5 w-5 text-red-500" />,
      });
    }
  };

  // Función para guardar cotización
  const guardarCotizacion = () => {
    if (cotizacion.productos.length === 0) {
      toast.error("No se puede guardar la cotización. Agregue al menos un producto.", {
        style: { backgroundColor: "#FFF8E1", color: "#F59E0B", borderColor: "#F59E0B" },
        icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
      });
      return;
    }

    if (!nombreCotizacion.trim()) {
      toast.error("Debe asignar un nombre a la cotización.", {
        style: { backgroundColor: "#FFF8E1", color: "#F59E0B", borderColor: "#F59E0B" },
        icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
      });
      return;
    }

    // Crear objeto para guardar
    const fechaActual = new Date().toISOString();
    const idCotizacion = cotizacionEnEdicionId || Date.now().toString();

    // Generar una referencia única si no existe
    const referencia = cotizacion.referencia ||
      `COT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;

    const cotizacionParaGuardar: CotizacionGuardada = {
      id: idCotizacion,
      fecha: fechaActual,
      nombre: nombreCotizacion,
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

    // Actualizar o agregar la cotización
    if (cotizacionEnEdicionId) {
      // Estamos editando, actualizar la existente
      cotizacionesGuardadas = cotizacionesGuardadas.map(cot =>
        cot.id === cotizacionEnEdicionId ? cotizacionParaGuardar : cot
      );
    } else {
      // Es nueva, agregarla al array
      cotizacionesGuardadas.push(cotizacionParaGuardar);
    }

    // Guardar en localStorage
    localStorage.setItem("cotizaciones", JSON.stringify(cotizacionesGuardadas));

    // Cerrar diálogo y mostrar mensaje
    setMostrarGuardarDialog(false);

    toast.success(cotizacionEnEdicionId ? "¡Cotización actualizada correctamente!" : "¡Cotización guardada correctamente!", {
      style: { backgroundColor: "#E8F5E9", color: "#22C55E", borderColor: "#22C55E" },
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    });
  };

  // Función para limpiar y crear una nueva cotización
  const nuevaCotizacion = () => {
    setCotizacion({
      cliente: "",
      empresa: "",
      productos: [],
      aplicarIva: true,
      mostrarDatosBancarios: true
    });
    setNombreCotizacion("");
    setCotizacionEnEdicionId(null);

    toast.success("Nueva cotización creada", {
      style: { backgroundColor: "#E8F5E9", color: "#22C55E", borderColor: "#22C55E" },
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    });
  };

  return (
    <div className="flex flex-col pb-8">
      <div className="flex items-center justify-between mb-4">
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
          <h1 className="text-2xl font-bold">Cotizaciones</h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={nuevaCotizacion}
            className="flex items-center gap-1"
          >
            <FileText className="h-4 w-4" />
            <span className="hidden md:inline">Nueva</span>
          </Button>

          <Dialog open={mostrarGuardarDialog} onOpenChange={setMostrarGuardarDialog}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-1"
                disabled={cotizacion.productos.length === 0}
              >
                <Save className="h-4 w-4" />
                <span className="hidden md:inline">Guardar</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{cotizacionEnEdicionId ? "Actualizar cotización" : "Guardar cotización"}</DialogTitle>
                <DialogDescription>
                  {cotizacionEnEdicionId ? "Actualice los datos de la cotización" : "Asigne un nombre para identificar esta cotización"}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="nombre-cotizacion">Nombre de la cotización</Label>
                  <Input
                    id="nombre-cotizacion"
                    placeholder="Ej. Cotización para Cliente ABC"
                    value={nombreCotizacion}
                    onChange={(e) => setNombreCotizacion(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setMostrarGuardarDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={guardarCotizacion}>
                  {cotizacionEnEdicionId ? "Actualizar" : "Guardar"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button
            variant="outline"
            className="flex items-center gap-1"
            onClick={() => router.push("/historial")}
          >
            <History className="h-4 w-4" />
            <span className="hidden md:inline">Historial</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-6">
        {/* Datos del cliente */}
        <ClienteForm
          cotizacion={cotizacion}
          onClienteChange={handleClienteChange}
        />

        {/* Agregar productos */}
        <ProductoForm
          nuevoProducto={nuevoProducto}
          setNuevoProducto={setNuevoProducto}
          agregarProducto={agregarProducto}
          productoEnEdicion={productoEnEdicion}
          cancelarEdicion={cancelarEdicion}
          showConfirmation={showConfirmation}
        />
      </div>

      {/* Lista de productos */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <span className="inline-flex p-1.5 rounded-full bg-amber-100 text-amber-700">
              <Hammer size={14} />
            </span>
            Lista de productos
          </CardTitle>
          <CardDescription>
            Productos incluidos en la cotización
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProductoTable
            cotizacion={cotizacion}
            onDeleteProducto={eliminarProducto}
            onEditProducto={editarProducto}
            onSwitchChange={handleSwitchChange}
          />
        </CardContent>

        {/* Botones de acción en CardFooter - visible solo en escritorio */}
        <CardFooter className="hidden md:block">
          <ActionButtons
            cotizacion={cotizacion}
            pdfURL={pdfURL}
            cargandoVistaPrevia={cargandoVistaPrevia}
            vistaPrevia={vistaPrevia}
            setVistaPrevia={setVistaPrevia}
            verVistaPreviaPDF={verVistaPreviaPDF}
            generarPDFHandler={generarPDFHandler}
            nombreCotizacion={nombreCotizacion}
            setNombreCotizacion={setNombreCotizacion}
            cotizacionEnEdicionId={cotizacionEnEdicionId}
          />
        </CardFooter>
      </Card>

      {/* Barra fija en la parte inferior para móviles */}
      <div className={`fixed bottom-0 left-0 right-0 md:hidden z-40 my-2 px-2 py-1.5 backdrop-blur-sm rounded-xl border shadow-lg transition-colors duration-300 ${cotizacion.productos.length > 0
        ? "bg-white/95 border-gray-200"
        : "bg-gray-200/95 border-gray-300"
        }`}>
        <ActionButtons
          cotizacion={cotizacion}
          pdfURL={pdfURL}
          cargandoVistaPrevia={cargandoVistaPrevia}
          vistaPrevia={vistaPrevia}
          setVistaPrevia={setVistaPrevia}
          verVistaPreviaPDF={verVistaPreviaPDF}
          generarPDFHandler={generarPDFHandler}
          isMobile={true}
          nombreCotizacion={nombreCotizacion}
          setNombreCotizacion={setNombreCotizacion}
          cotizacionEnEdicionId={cotizacionEnEdicionId}
        />
      </div>

      {/* Padding adicional para evitar que el contenido quede detrás de la barra fija en móviles */}
      <div className="pb-10 md:pb-0"></div>
    </div>
  );
};

export default CotizacionesPage;