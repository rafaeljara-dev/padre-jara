"use client";

import Link from "next/link";
import { UserButton, SignInButton, useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const LandingNavbar = () => {
    const { isSignedIn } = useUser();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <nav className="p-4 bg-white border-b w-full">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link href="/" className="font-bold text-xl">
                    Tu Logo
                </Link>

                {/* Navegación desktop */}
                <div className="hidden md:flex items-center gap-x-2">
                    <div className="flex items-center gap-x-4">
                        <Link href="/" className="hover:text-gray-600 transition">
                            Inicio
                        </Link>
                    </div>

                    <div className="flex items-center gap-x-2 ml-4">
                        {isSignedIn ? (
                            <>
                                <Button asChild variant="default" className="ml-4">
                                    <Link href="/dashboard">
                                        Ir a plataforma
                                    </Link>
                                </Button>
                                <UserButton afterSignOutUrl="/" />
                            </>
                        ) : (
                            <SignInButton mode="modal">
                                <Button>
                                    Iniciar sesión
                                </Button>
                            </SignInButton>
                        )}
                    </div>
                </div>

                {/* Navegación móvil */}
                <div className="md:hidden">
                    <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                            <div className="flex flex-col gap-y-4 mt-8">
                                <Link href="/" className="p-2 hover:bg-gray-100 rounded-md" onClick={closeMenu}>
                                    Inicio
                                </Link>
                                <Link href="/about" className="p-2 hover:bg-gray-100 rounded-md" onClick={closeMenu}>
                                    Acerca de
                                </Link>
                                <Link href="/contact" className="p-2 hover:bg-gray-100 rounded-md" onClick={closeMenu}>
                                    Contacto
                                </Link>

                                <div className="flex flex-col gap-y-4 pt-4 border-t">
                                    {isSignedIn ? (
                                        <>
                                            <Button asChild variant="default">
                                                <Link href="/dashboard" onClick={closeMenu}>
                                                    Ir a plataforma
                                                </Link>
                                            </Button>
                                            <div className="flex justify-start pl-2">
                                                <UserButton afterSignOutUrl="/" />
                                            </div>
                                        </>
                                    ) : (
                                        <SignInButton mode="modal">
                                            <Button className="w-full">
                                                Iniciar sesión
                                            </Button>
                                        </SignInButton>
                                    )}
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    );
};
