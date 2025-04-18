import { LandingNavbar } from "@/components/landing-navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const LandingPage = () => {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <LandingNavbar />
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
                        Bienvenido al Sistema
                        <br />
                        Sr. Rafael Jara
                    </h1>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild size="lg" className="btn px-8">
                            <Link href="/dashboard">
                                Ir a la plataforma
                            </Link>
                        </Button>
                    </div>
                </div>

            </div>
            <footer className="mt-auto p-6 bg-card border-t border-border text-center text-muted-foreground">
                © {new Date().getFullYear()} Sistema de Cotizaciones - Todos los derechos reservados
            </footer>
        </div>
    );
};

export default LandingPage;