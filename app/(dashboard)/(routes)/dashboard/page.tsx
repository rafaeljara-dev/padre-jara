import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, FileTextIcon } from "lucide-react";
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
    <div className="p-6 space-y-6">
      {/* Encabezado con saludo y fecha */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">¡Bienvenido!</h1>
          <p className="text-muted-foreground flex items-center mt-1">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {fechaFormateada}
          </p>
        </div>
      </div>

      {/* Tarjetas de acceso rápido */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/cotizaciones" className="transition-all duration-300 hover:scale-[1.04] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-amber-400">
          <Card className="h-full border-amber-400 bg-gradient-to-br from-amber-50 to-amber-100 hover:border-amber-500 hover:bg-gradient-to-br hover:from-amber-100 hover:to-amber-200 hover:shadow-lg shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-2xl font-bold text-amber-800">Cotizaciones</CardTitle>
              <div className="p-2 bg-amber-200 rounded-full transform transition-all duration-300 group-hover:bg-amber-300">
                <FileTextIcon className="h-7 w-7 text-amber-700 sm:h-8 sm:w-8" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-amber-900 font-medium">
                Crea y gestiona cotizaciones para tus clientes
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;