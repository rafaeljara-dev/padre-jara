"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Menu, ArrowLeft } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { UserButton } from "@clerk/nextjs";

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

  // Evita el error de hidratación
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const routes = [
    {
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      icon: <FileText className="h-5 w-5" />,
      label: "Cotizaciones",
      href: "/cotizaciones",
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
          <Button 
            variant="secondary" 
            size="icon" 
            className="lg:hidden bg-gray-100 border border-gray-200" 
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
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