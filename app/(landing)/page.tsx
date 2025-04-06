import { LandingNavbar } from "@/components/landing-navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const LandingPage = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <LandingNavbar />
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Bienvenido al Sistema de Cotizaciones
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Una herramienta sencilla para crear cotizaciones y gestionar
                        tus necesidades de negocio de manera eficiente.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild size="lg" className="px-8">
                            <Link href="/dashboard">
                                Ir a la plataforma
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="px-8">
                            <Link href="/contact">
                                Contacto
                            </Link>
                        </Button>
                    </div>
                </div>

            </div>
            <footer className="mt-auto p-6 bg-white border-t text-center text-gray-500">
                © {new Date().getFullYear()} Sistema de Cotizaciones - Todos los derechos reservados
            </footer>
        </div>
    );
};

export default LandingPage;