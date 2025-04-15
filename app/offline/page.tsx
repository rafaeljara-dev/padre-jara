import Link from 'next/link';

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-3xl font-bold mb-4">Sin conexión</h1>
      <p className="mb-8 max-w-md">
        Parece que no tienes conexión a Internet. Algunas funciones pueden no estar disponibles hasta que te vuelvas a conectar.
      </p>
      <Link 
        href="/"
        className="px-4 py-2 bg-black text-white rounded-md transition-colors hover:bg-gray-800"
      >
        Volver al inicio
      </Link>
    </div>
  );
}