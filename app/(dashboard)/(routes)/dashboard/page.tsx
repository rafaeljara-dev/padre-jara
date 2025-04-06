import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, FileTextIcon, TrendingUpIcon, BarChart3Icon } from "lucide-react";
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
        <Link href="/cotizaciones" className="transition-all duration-200 hover:scale-[1.02]">
          <Card className="h-full border-amber-200 hover:border-amber-500 hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-lg font-medium">Cotizaciones</CardTitle>
              <FileTextIcon className="h-5 w-5 text-amber-500" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
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