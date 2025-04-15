'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator && typeof window !== 'undefined' && window.workbox === undefined) {
      // Registra el service worker solo una vez y en producción
      if (process.env.NODE_ENV === 'production') {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('Service Worker registrado correctamente:', registration);
          })
          .catch((error) => {
            console.error('Error al registrar el Service Worker:', error);
          });
      }
    }
  }, []);

  return null;
} 