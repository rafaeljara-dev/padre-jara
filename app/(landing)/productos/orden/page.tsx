'use client';

import { LandingNavbar } from "@/components/landing-navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Plus, Minus, Trash2, List } from "lucide-react";
import { useOrden } from "../context";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { getProductoById } from "../data";

const OrdenPage = () => {
  const { items, actualizarCantidad, eliminarProducto, limpiarOrden, total } = useOrden();
  const [nombreCliente, setNombreCliente] = useState("");
  const [telefonoCliente, setTelefonoCliente] = useState("");

  const handleEnviarAlEncargado = () => {
    if (items.length === 0) {
      alert("No hay productos en la orden");
      return;
    }

    // Generar lista de productos
    const listaProductos = items
      .map((item) => `• ${item.nombre} (${item.cantidad})`)
      .join("\n");

    const mensaje = `Hola, me gustaría hacer un pedido:

${listaProductos}

${nombreCliente ? `Cliente: ${nombreCliente}` : ""}
${telefonoCliente ? `Teléfono: ${telefonoCliente}` : ""}`;

    // Número de WhatsApp
    const numeroWhatsApp = "5216538495703";

    // Codificar el mensaje para URL
    const mensajeEncodificado = encodeURIComponent(mensaje);

    // URL de WhatsApp
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensajeEncodificado}`;

    // Abrir WhatsApp
    window.open(urlWhatsApp, "_blank");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col relative" style={{ backgroundColor: '#eef4f9' }}>
        {/* Background con patrón */}
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

        <div className="relative z-10">
          <LandingNavbar />
        </div>

        <div className="flex-1 flex items-center justify-center px-4 relative z-10">
          <div className="text-center max-w-md">
            <div className="text-5xl sm:text-6xl mb-4">📋</div>
            <h1 className="text-xl sm:text-3xl font-bold text-foreground mb-2">
              Tu orden está vacía
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mb-6">
              Agrega productos desde el catálogo para crear una orden
            </p>
            <Button asChild size="lg" className="text-base py-4">
              <Link href="/productos">Ver productos</Link>
            </Button>
          </div>
        </div>

        <footer className="relative z-10 mt-auto p-6 bg-card border-t border-border text-center text-muted-foreground">
          © {new Date().getFullYear()} Sistema de Cotizaciones - Todos los derechos reservados
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative" style={{ backgroundColor: '#f1efe6' }}>
      {/* Background con patrón */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

      <div className="relative z-10">
        <LandingNavbar />
      </div>

      <div className="flex-1 flex flex-col px-4 py-8 relative z-10">
        <div className="max-w-3xl mx-auto w-full">
          {/* Botón atrás */}
          <Link href="/productos" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 text-sm">
            <ArrowLeft className="h-4 w-4" />
            <span>Volver</span>
          </Link>

          {/* Encabezado */}
          <h1 className="text-2xl sm:text-4xl font-bold text-foreground mb-6 sm:mb-8">
            Mi Orden
          </h1>

          {/* Datos del cliente */}
          <Card className="p-4 sm:p-6 mb-8 bg-white">
            <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4">
              Información del Cliente
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-base font-medium text-foreground mb-2">
                  Nombre (opcional)
                </label>
                <Input
                  placeholder="Tu nombre"
                  value={nombreCliente}
                  onChange={(e) => setNombreCliente(e.target.value)}
                  className="text-base p-2 sm:text-lg sm:p-3"
                />
              </div>
              <div>
                <label className="block text-base font-medium text-foreground mb-2">
                  Teléfono (opcional)
                </label>
                <Input
                  placeholder="Tu teléfono"
                  value={telefonoCliente}
                  onChange={(e) => setTelefonoCliente(e.target.value)}
                  className="text-base p-2 sm:text-lg sm:p-3"
                />
              </div>
            </div>
          </Card>

          {/* Items de la orden */}
          <div className="space-y-4 mb-8">
            {items.map((item) => {
              const producto = getProductoById(item.id);
              return (
              <Card key={item.id} className="p-4 bg-white">
                {/* Header: Imagen y nombre */}
                <div className="flex items-start gap-3 mb-4">
                  {/* Icono/Imagen */}
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center text-3xl">
                    {producto?.imagenURL ? (
                      <Image
                        src={producto.imagenURL}
                        alt={item.nombre}
                        width={64}
                        height={64}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      item.imagen
                    )}
                  </div>

                  {/* Información del producto */}
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-foreground">
                      {item.nombre}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      ${item.precio.toLocaleString('es-MX')} c/u
                    </p>
                  </div>

                  {/* Eliminar */}
                  <button
                    onClick={() => eliminarProducto(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition flex-shrink-0"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>

                {/* Footer: Cantidad y subtotal */}
                <div className="flex items-center justify-between">
                  {/* Cantidad */}
                  <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-2">
                    <button
                      onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                      className="p-1 hover:bg-gray-200 rounded transition"
                    >
                      <Minus className="h-4 w-4 text-gray-700" />
                    </button>
                    <span className="w-6 text-center font-bold text-foreground">
                      {item.cantidad}
                    </span>
                    <button
                      onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                      className="p-1 hover:bg-gray-200 rounded transition"
                    >
                      <Plus className="h-4 w-4 text-gray-700" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Subtotal</p>
                    <p className="text-lg font-bold text-green-600">
                      ${(item.precio * item.cantidad).toLocaleString('es-MX')}
                    </p>
                  </div>
                </div>
              </Card>
              );
            })}
          </div>

          {/* Resumen */}
          <Card className="p-4 sm:p-8 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 mb-8">
            <div className="space-y-3">
              <div className="flex justify-between items-center text-base sm:text-lg">
                <span className="text-foreground">Subtotal:</span>
                <span className="font-semibold text-foreground">
                  ${total.toLocaleString('es-MX')}
                </span>
              </div>
              <div className="flex justify-between items-center text-xl sm:text-3xl font-bold border-t-2 border-blue-300 pt-3">
                <span className="text-foreground">Total:</span>
                <span className="text-green-600">
                  ${total.toLocaleString('es-MX')}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {items.length} producto(s) en la orden
              </p>
            </div>
          </Card>

          {/* Acciones */}
          <div className="flex flex-col gap-3 sm:gap-2">
            <Button
              onClick={handleEnviarAlEncargado}
              size="lg"
              className="w-full gap-2 text-base sm:text-lg py-4 sm:py-6 bg-green-600 hover:bg-green-700"
            >
              <List className="h-5 w-5" />
              Enviar al Encargado
            </Button>
            <div className="flex gap-3 sm:gap-2">
              <Button
                asChild
                variant="outline"
                size="lg"
                className="flex-1 gap-2 text-sm sm:text-lg py-4 sm:py-6"
              >
                <Link href="/productos">
                  Agregar más
                </Link>
              </Button>
              <Button
                onClick={limpiarOrden}
                variant="destructive"
                size="lg"
                className="flex-1 gap-1 text-sm sm:text-lg py-4 sm:py-6"
              >
                <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">Limpiar</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 mt-auto p-6 bg-card border-t border-border text-center text-muted-foreground">
        © {new Date().getFullYear()} Sistema de Cotizaciones - Todos los derechos reservados
      </footer>
    </div>
  );
};

export default OrdenPage;
