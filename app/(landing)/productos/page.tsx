'use client';

import { LandingNavbar } from "@/components/landing-navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { List } from "lucide-react";
import { useState } from "react";
import { useOrden } from "./context";
import { productos } from "./data";

const ProductosCatalogo = () => {
  const { items, agregarProducto } = useOrden();
  const [addedId, setAddedId] = useState<number | null>(null);

  const handleAgregarOrden = (e: React.MouseEvent, producto: typeof productos[0]) => {
    e.preventDefault();
    e.stopPropagation();

    agregarProducto({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: 1,
      imagen: producto.imagen,
    });

    // Mostrar feedback visual
    setAddedId(producto.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div className="min-h-screen flex flex-col relative" style={{ backgroundColor: '#eef4f9' }}>
      {/* Background con patrón */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

      <div className="relative z-10">
        <LandingNavbar />
      </div>

      <div className="flex-1 flex flex-col px-4 py-8 relative z-10">
        <div className="max-w-7xl mx-auto w-full">
          {/* Encabezado */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
              Nuestros Productos
            </h1>
            <p className="text-lg text-muted-foreground">
              Haz clic en un producto para ver detalles
            </p>
          </div>

          {/* Grid de productos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productos.map((producto) => (
              <Link
                key={producto.id}
                href={`/productos/${producto.id}`}
              >
                <Card
                  className="flex flex-col h-full hover:shadow-lg transition-shadow bg-white overflow-hidden cursor-pointer"
                >
                  {/* Imagen/Icono */}
                  <div className="aspect-square bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-6xl border-b overflow-hidden">
                    {producto.imagenURL ? (
                      <Image
                        src={producto.imagenURL}
                        alt={producto.nombre}
                        width={300}
                        height={300}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      producto.imagen
                    )}
                  </div>

                  {/* Contenido */}
                  <div className="flex-1 flex flex-col p-4">
                    {/* Categoría */}
                    <span className="text-sm font-medium text-blue-600 mb-2">
                      {producto.categoria}
                    </span>

                    {/* Nombre */}
                    <h3 className="text-lg font-bold text-foreground mb-2">
                      {producto.nombre}
                    </h3>

                    {/* Descripción */}
                    <p className="text-sm text-muted-foreground mb-4 flex-1">
                      {producto.descripcion}
                    </p>

                    {/* Precio */}
                    <div className="flex items-center justify-between items-end">
                      <div>
                        <p className="text-sm text-muted-foreground">Precio</p>
                        <p className="text-2xl font-bold text-green-600">
                          ${producto.precio.toLocaleString('es-MX')}
                        </p>
                      </div>

                      {/* Botón agregar */}
                      <Button
                        size="sm"
                        variant={addedId === producto.id ? "success" : "default"}
                        className="gap-2"
                        onClick={(e) => handleAgregarOrden(e, producto)}
                      >
                        <List className="h-4 w-4" />
                        <span className="hidden sm:inline">
                          {addedId === producto.id ? "✓ Agregado" : "Agregar"}
                        </span>
                      </Button>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Botón flotante de orden */}
      {items.length > 0 && (
        <div className="relative z-20">
          <Link href="/productos/orden">
            <Button
              size="lg"
              className="fixed bottom-6 right-6 rounded-full w-16 h-16 p-0 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex flex-col items-center">
                <List className="h-6 w-6" />
                <span className="text-xs font-bold mt-1">{items.length}</span>
              </div>
            </Button>
          </Link>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 mt-auto p-6 bg-card border-t border-border text-center text-muted-foreground">
        © {new Date().getFullYear()} Sistema de Cotizaciones - Todos los derechos reservados
      </footer>
    </div>
  );
};

export default ProductosCatalogo;
