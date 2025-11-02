'use client';

import { LandingNavbar } from "@/components/landing-navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, List } from "lucide-react";
import { useParams } from "next/navigation";
import { getProductoById, productos } from "../data";
import { useOrden } from "../context";
import { useState } from "react";

export default function DetallesProductoClient({ params }: { params: { id: string } }) {
  const actualParams = useParams();
  const id = parseInt((actualParams?.id as string) || params.id);
  const producto = getProductoById(id);
  const { agregarProducto } = useOrden();
  const [addedToOrder, setAddedToOrder] = useState(false);

  if (!producto) {
    return (
      <div className="min-h-screen flex flex-col relative" style={{ backgroundColor: '#eef4f9' }}>
        {/* Background con patrón */}
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

        <div className="relative z-10">
          <LandingNavbar />
        </div>

        <div className="flex-1 flex items-center justify-center px-4 relative z-10">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Producto no encontrado
            </h1>
            <Button asChild>
              <Link href="/productos">Volver al catálogo</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleAgregarOrden = () => {
    agregarProducto({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: 1,
      imagen: producto.imagen,
    });
    setAddedToOrder(true);
    setTimeout(() => setAddedToOrder(false), 2000);
  };

  const productosRelacionados = productos.filter(
    (p) => p.categoria === producto.categoria && p.id !== producto.id
  );

  return (
    <div className="min-h-screen flex flex-col relative" style={{ backgroundColor: '#eef4f9' }}>
      {/* Background con patrón */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

      <div className="relative z-10">
        <LandingNavbar />
      </div>

      <div className="flex-1 flex flex-col px-4 py-8 relative z-10">
        <div className="max-w-5xl mx-auto w-full">
          {/* Botón atrás */}
          <Link href="/productos" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6">
            <ArrowLeft className="h-4 w-4" />
            <span>Volver al catálogo</span>
          </Link>

          {/* Contenedor principal */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Galería de imágenes */}
            <div>
              <Card className="overflow-hidden">
                <div className="aspect-square bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-9xl overflow-hidden">
                  {producto.imagenURL ? (
                    <Image
                      src={producto.imagenURL}
                      alt={producto.nombre}
                      width={500}
                      height={500}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    producto.imagen
                  )}
                </div>
              </Card>

              {/* Imágenes pequeñas */}
              <div className="flex gap-4 mt-4">
                {producto.imagenesURL?.map((img, idx) => (
                  <div
                    key={idx}
                    className="w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center text-4xl border-2 border-gray-200 cursor-pointer hover:border-blue-600 transition overflow-hidden flex-shrink-0"
                  >
                    <Image
                      src={img}
                      alt={`${producto.nombre} ${idx + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )) || producto.imagenes.map((img, idx) => (
                  <div
                    key={idx}
                    className="w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center text-4xl border-2 border-gray-200 cursor-pointer hover:border-blue-600 transition flex-shrink-0"
                  >
                    {img}
                  </div>
                ))}
              </div>
            </div>

            {/* Información del producto */}
            <div className="flex flex-col">
              {/* Categoría */}
              <span className="text-sm font-medium text-blue-600 mb-2">
                {producto.categoria}
              </span>

              {/* Nombre */}
              <h1 className="text-4xl font-bold text-foreground mb-4">
                {producto.nombre}
              </h1>

              {/* Precio grande */}
              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-2">Precio</p>
                <p className="text-5xl font-bold text-green-600">
                  ${producto.precio.toLocaleString('es-MX')}
                </p>
              </div>

              {/* Descripción larga */}
              <div className="mb-6">
                <h2 className="text-lg font-bold text-foreground mb-2">Descripción</h2>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {producto.descripcionLarga}
                </p>
              </div>

              {/* Especificaciones */}
              <div className="mb-6">
                <h2 className="text-lg font-bold text-foreground mb-3">Especificaciones</h2>
                <div className="space-y-2">
                  {producto.especificaciones.map((spec, idx) => (
                    <div key={idx} className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-muted-foreground">{spec.label}</span>
                      <span className="font-medium text-foreground">{spec.valor}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botón agregar a orden */}
              <Button
                size="lg"
                onClick={handleAgregarOrden}
                className="w-full gap-2 text-lg py-6"
                variant={addedToOrder ? "success" : "default"}
              >
                <List className="h-5 w-5" />
                {addedToOrder ? "✓ Agregado a la orden" : "Agregar a la orden"}
              </Button>
            </div>
          </div>

          {/* Productos relacionados */}
          {productosRelacionados.length > 0 && (
            <div className="mt-12">
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Otros productos en {producto.categoria}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {productosRelacionados.map((prod) => (
                  <Link key={prod.id} href={`/productos/${prod.id}`}>
                    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow bg-white cursor-pointer">
                      <div className="aspect-square bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-6xl border-b overflow-hidden">
                        {prod.imagenURL ? (
                          <Image
                            src={prod.imagenURL}
                            alt={prod.nombre}
                            width={300}
                            height={300}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          prod.imagen
                        )}
                      </div>
                      <div className="flex-1 flex flex-col p-4">
                        <h3 className="text-base font-bold text-foreground mb-2">
                          {prod.nombre}
                        </h3>
                        <p className="text-sm text-green-600 font-bold mt-auto">
                          ${prod.precio.toLocaleString('es-MX')}
                        </p>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 mt-auto p-6 bg-card border-t border-border text-center text-muted-foreground">
        © {new Date().getFullYear()} Sistema de Cotizaciones - Todos los derechos reservados
      </footer>
    </div>
  );
}
