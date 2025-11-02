import type { Metadata } from 'next';
import { getProductoById } from '../data';
import DetallesProductoClient from './client';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);
  const producto = getProductoById(id);

  if (!producto) {
    return {
      title: 'Producto no encontrado',
      description: 'El producto que buscas no existe',
    };
  }

  const imageUrl = producto.imagenURL || '/assets/tanque-bg.webp';
  const fullImageUrl = imageUrl.startsWith('http')
    ? imageUrl
    : `https://rafael-lazalde.vercel.app${imageUrl}`;

  return {
    title: `${producto.nombre} - Rafael Jara`,
    description: producto.descripcion,
    keywords: `${producto.nombre}, ${producto.categoria}, gas LP, equipos`,
    openGraph: {
      title: `${producto.nombre} - Rafael Jara`,
      description: producto.descripcion,
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: producto.nombre,
        },
      ],
      url: `https://rafael-lazalde.vercel.app/productos/${producto.id}`,
      type: 'website',
      locale: 'es_MX',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${producto.nombre} - Rafael Jara`,
      description: producto.descripcion,
      images: [fullImageUrl],
    },
  };
}

export default async function DetallesProducto({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <DetallesProductoClient params={resolvedParams} />;
}
