import type { Metadata } from 'next';
import ProductosCatalogo from './client';

export const metadata: Metadata = {
  title: 'Nuestros Productos - Rafael Jara',
  description: 'Catálogo completo de equipos de gas LP: tanques, reguladores, sensores y accesorios de alta calidad.',
  keywords: 'gas LP, tanques, reguladores, equipos de gas, accesorios',
  openGraph: {
    title: 'Nuestros Productos - Rafael Jara',
    description: 'Catálogo completo de equipos de gas LP: tanques, reguladores, sensores y accesorios de alta calidad.',
    images: [
      {
        url: 'https://rafael-lazalde.vercel.app/assets/tanque-bg.webp',
        width: 1200,
        height: 630,
        alt: 'Nuestros Productos de Gas LP',
      },
    ],
    url: 'https://rafael-lazalde.vercel.app/productos',
    type: 'website',
    locale: 'es_MX',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nuestros Productos - Rafael Jara',
    description: 'Catálogo completo de equipos de gas LP',
    images: ['https://rafael-lazalde.vercel.app/assets/tanque-bg.webp'],
  },
};

export default ProductosCatalogo;
