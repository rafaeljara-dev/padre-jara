"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Menu, History, Download } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { UserButton } from "@clerk/nextjs";
import { toast } from "@/components/ui/sonner";

// Definir una interfaz para el tipo BeforeInstallPromptEvent
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive: boolean;
  onItemClick?: () => void;
}

const SidebarItem = ({
  icon,
  label,
  href,
  isActive,
  onItemClick,
}: SidebarItemProps) => {
  return (
    <Link
      href={href}
      onClick={onItemClick}
      className={cn(
        "flex items-center gap-x-2 text-muted-foreground text-sm font-medium px-3 py-2 rounded-lg transition-all hover:text-foreground hover:bg-accent",
        isActive && "text-accent-foreground bg-accent font-semibold"
      )}
    >
      <div className="flex items-center gap-x-2">
        {icon}
        {label}
      </div>
    </Link>
  );
};

interface AppSidebarProps {
  variant?: "mobile" | "desktop";
}

export const AppSidebar = ({ variant }: AppSidebarProps) => {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);

  // Manejar el evento beforeinstallprompt para la instalación de PWA
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevenir que Chrome muestre el diálogo de instalación por defecto
      e.preventDefault();
      // Guardar el evento para usarlo después
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    // Verificar si la app ya está instalada
    const checkIfInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      setIsAppInstalled(isStandalone);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', () => {
      setIsAppInstalled(true);
      setDeferredPrompt(null);
      toast.success("¡Aplicación instalada correctamente!");
    });
    
    checkIfInstalled();
    setIsMounted(true);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Función para instalar la PWA
  const installApp = async () => {
    if (!deferredPrompt) {
      toast.error("Tu navegador no soporta la instalación o la app ya está instalada");
      
      // Mostrar instrucciones alternativas según el navegador
      if (navigator.userAgent.includes('Chrome')) {
        toast.info("Usa el menú del navegador y selecciona 'Instalar aplicación'");
      } else if (navigator.userAgent.includes('Safari')) {
        toast.info("Usa el botón 'Compartir' y selecciona 'Añadir a la pantalla de inicio'");
      }
      
      return;
    }

    // Mostrar el prompt de instalación
    try {
      deferredPrompt.prompt();
      
      // Esperar a que el usuario responda al prompt
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        toast.success("¡Instalación en proceso!");
      } else {
        toast.info("Instalación cancelada");
      }
    } catch (_) {
      toast.error("Error al intentar instalar la aplicación");
    }
    
    // Limpiar el prompt guardado
    setDeferredPrompt(null);
  };
  
  // Botón de instalación PWA - Visible solo cuando está disponible y no instalada
  const showInstallButton = deferredPrompt !== null && !isAppInstalled;

  if (!isMounted) {
    return null;
  }

  const routes = [
    {
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: "Inicio",
      href: "/dashboard",
    },
    {
      icon: <FileText className="h-5 w-5" />,
      label: "Cotizaciones",
      href: "/cotizaciones",
    },
    {
      icon: <History className="h-5 w-5" />,
      label: "Historial",
      href: "/historial",
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-x-2 px-3 py-4">
        <Avatar>
          <AvatarImage src="/logo.png" alt="Logo" />
          <AvatarFallback className="bg-primary text-primary-foreground">RJ</AvatarFallback>
        </Avatar>
        <div className="font-semibold text-lg">Bienvenido</div>
      </div>
      <Separator className="bg-sidebar-border" />
      <div className="flex-1 my-4">
        <div className="flex flex-col gap-y-1 px-3">
          {routes.map((route) => (
            <SidebarItem
              key={route.href}
              icon={route.icon}
              label={route.label}
              href={route.href}
              isActive={pathname === route.href}
              onItemClick={() => setIsOpen(false)}
            />
          ))}
        </div>
      </div>
      <Separator className="bg-sidebar-border" />
      
      {/* Botón de instalación PWA - Visible cuando está disponible */}
      {showInstallButton && (
        <div className="px-3 py-3">
          <Button 
            onClick={installApp} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 h-10 transition-colors"
          >
            <Download className="h-5 w-5" />
            <span>Guardar App</span>
          </Button>
        </div>
      )}
      
      <div className="px-3 py-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Mi cuenta</p>
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );

  // Si es la versión desktop, solo muestra el contenido del sidebar
  if (variant === "desktop") {
    return sidebarContent;
  }

  return (
    <>
      {/* Cabecera móvil */}
      <div className="lg:hidden fixed z-50 flex items-center justify-between px-2 h-12 w-full bg-card border-b border-border">
        <div className="flex items-center gap-2">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="lg:hidden bg-gray-100 border border-gray-200"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[250px] p-0">
              {sidebarContent}
            </SheetContent>
          </Sheet>
        </div>

        <UserButton afterSignOutUrl="/" />
      </div>

      {/* Espaciadores para contenido */}
      <div className="lg:hidden" /> {/* Espaciador superior */}
      <div className="lg:hidden pb-12" /> {/* Espaciador inferior */}
    </>
  );
};