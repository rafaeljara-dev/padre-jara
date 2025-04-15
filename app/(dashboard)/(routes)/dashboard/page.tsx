import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, FileTextIcon, History } from "lucide-react";
import Link from "next/link";

const DashboardPage = () => {
  // Obtener la fecha actual en español
  const fechaActual = new Date().toLocaleDateString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Capitalizar primera letra del día
  const fechaFormateada = fechaActual.charAt(0).toUpperCase() + fechaActual.slice(1);

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-6xl mx-auto">
      {/* Encabezado con saludo y fecha */}
      <div className="flex flex-col justify-between items-start gap-2 bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl shadow-sm border border-blue-200">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-blue-900">¡Bienvenido!</h1>
          <p className="text-blue-800 flex items-center mt-1 text-sm md:text-base">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {fechaFormateada}
          </p>
        </div>
      </div>

      {/* Tarjetas de acceso rápido */}
      <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mt-4">Accesos rápidos</h2>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
        {/* Card de Cotizaciones */}
        <Link href="/cotizaciones" className="transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-amber-500">
          <Card className="h-full border-amber-500 bg-gradient-to-br from-amber-50 to-amber-100 hover:border-amber-600 hover:bg-gradient-to-br hover:from-amber-100 hover:to-amber-200 hover:shadow-lg shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xl md:text-2xl font-bold text-amber-900">Cotizaciones</CardTitle>
              <div className="p-2 bg-amber-300 rounded-full transform transition-all duration-300 group-hover:bg-amber-400">
                <FileTextIcon className="h-6 w-6 md:h-7 md:w-7 text-amber-800" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-base md:text-lg text-amber-950 font-medium">
                Crea y gestiona cotizaciones para tus clientes
              </p>
            </CardContent>
          </Card>
        </Link>
        
        {/* Card de Historial */}
        <Link href="/historial" className="transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <Card className="h-full border-indigo-500 bg-gradient-to-br from-indigo-50 to-indigo-100 hover:border-indigo-600 hover:bg-gradient-to-br hover:from-indigo-100 hover:to-indigo-200 hover:shadow-lg shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xl md:text-2xl font-bold text-indigo-900">Historial</CardTitle>
              <div className="p-2 bg-indigo-300 rounded-full transform transition-all duration-300 group-hover:bg-indigo-400">
                <History className="h-6 w-6 md:h-7 md:w-7 text-indigo-800" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-base md:text-lg text-indigo-950 font-medium">
                Consulta el historial de tus actividades y operaciones
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
      
      {/* Mensaje de ayuda */}
      <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4 shadow-sm">
        <p className="text-green-800 text-sm md:text-base">
          Selecciona una opción para comenzar a trabajar. Si necesitas ayuda, contacta a soporte.
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;