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
import { Trash2, AlertTriangle, CheckCircle, XCircle, FileText, Hammer } from "lucide-react";
import { toast } from "@/components/ui/sonner";

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

  return (
    <div className="flex flex-col pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Cotizaciones</h1>
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
        />
      </div>

      {/* Padding adicional para evitar que el contenido quede detrás de la barra fija en móviles */}
      <div className="pb-10 md:pb-0"></div>
    </div>
  );
};

export default CotizacionesPage;