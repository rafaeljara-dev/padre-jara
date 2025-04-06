"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Menu } from "lucide-react";

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
        "flex items-center gap-x-2 text-slate-500 text-sm font-medium px-3 py-2 rounded-lg transition-all hover:text-slate-900 hover:bg-slate-100",
        isActive && "text-slate-900 bg-slate-100"
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
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-x-2 px-3 py-4">
        <Avatar>
          <AvatarImage src="/logo.png" alt="Logo" />
          <AvatarFallback>RJ</AvatarFallback>
        </Avatar>
        <div className="font-semibold text-lg">Bienvenido</div>
      </div>
      <Separator />
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
      <Separator />
      <div className="px-3 py-4 flex items-center justify-between">
        <p className="text-sm text-slate-500">Mi cuenta</p>
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
      <div className="lg:hidden fixed z-50 flex items-center justify-between px-2 h-12 w-full bg-white border-b">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[250px] p-0">
            {sidebarContent}
          </SheetContent>
        </Sheet>

        <div className="text-center font-semibold text-sm sm:text-base">
          Bienvenido
        </div>

        <div className="scale-75 sm:scale-100">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>

      {/* Espaciadores para contenido */}
      <div className="h-6 lg:hidden" /> {/* Espaciador superior */}
      <div className="h-8 lg:hidden pb-4" /> {/* Espaciador inferior */}
    </>
  );
};