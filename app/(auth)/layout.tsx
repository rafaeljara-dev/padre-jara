"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Shield, Lock, User, Info } from "lucide-react";

// Tipos para facilitar la personalización
type SecurityFeature = {
  icon: React.ElementType;
  text: string;
  description: string;
};

type AuthLayoutProps = {
  children: React.ReactNode;
  // Props opcionales para personalización
  appName?: string;
  appDescription?: string;
  securityFeatures?: SecurityFeature[];
  // Textos personalizables
  signUpTitle?: string;
  signUpSubtitle?: string;
  loginTitle?: string;
  loginSubtitle?: string;
  signUpFooterText?: string;
  loginFooterText?: string;
};

const AuthLayout = ({
  children,
  appName = "App Name",
  appDescription = "Descripción de la aplicación",
  securityFeatures = [
    {
      icon: Shield,
      text: "Seguridad",
      description: "Protocolos de seguridad avanzados"
    },
    {
      icon: Lock,
      text: "Datos protegidos",
      description: "Encriptación de extremo a extremo"
    },
    {
      icon: User,
      text: "Privacidad",
      description: "Control sobre tu información"
    },
    {
      icon: Info,
      text: "Soporte",
      description: "Asistencia técnica"
    }
  ],
  signUpTitle = "Registrarse",
  signUpSubtitle = "Crea tu cuenta",
  loginTitle = "Iniciar Sesión",
  loginSubtitle = "Accede a tu cuenta",
  signUpFooterText = "Al registrarte, aceptas nuestros términos y condiciones.",
  loginFooterText = "Tu información está protegida."
}: AuthLayoutProps) => {
  const pathname = usePathname();
  const isSignUp = pathname.includes("sign-up");
  
  const pageTitle = isSignUp ? signUpTitle : loginTitle;
  const pageSubtitle = isSignUp ? signUpSubtitle : loginSubtitle;
  const footerText = isSignUp ? signUpFooterText : loginFooterText;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Versión Desktop/Tablet */}
      <div className="hidden md:grid min-h-screen bg-gray-100 place-items-center p-4">
        <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
          {/* Columna Izquierda - Información */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-8 relative">
            <div className="relative z-10 space-y-6">
              <div>
                <h1 className="text-2xl font-bold mb-2">{appName}</h1>
                <p className="text-white/80">{appDescription}</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6 mt-6">
                <h2 className="text-xl font-semibold mb-4">
                  {isSignUp ? "Bienvenido" : "Bienvenido de nuevo"}
                </h2>
                
                <div className="space-y-4">
                  {securityFeatures.map((feature) => (
                    <div key={feature.text} className="flex items-center">
                      <feature.icon className="h-5 w-5 mr-3 text-blue-300" />
                      <div>
                        <span className="font-medium">{feature.text}</span>
                        <p className="text-xs text-white/60 mt-1">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Columna Derecha - Formulario */}
          <div className="flex items-center justify-center p-8">
            <div className="w-full max-w-md">
              <div className="mb-6">
                <h2 className="text-center text-2xl font-bold text-gray-800">
                  {pageTitle}
                </h2>
                <p className="text-center text-gray-600 mt-2">{pageSubtitle}</p>
              </div>

              <div>
                {children}
              </div>

              <div className="mt-6 text-center text-sm text-gray-500">
                <p>{footerText}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Versión Móvil */}
      <div className="md:hidden min-h-screen bg-gradient-to-br from-blue-600 to-indigo-700 flex flex-col justify-center p-4">
        <div className="w-full max-w-md mx-auto">
          <div className="text-center text-white mb-6">
            <h1 className="text-2xl font-bold mb-2">{appName}</h1>
            <p className="text-sm opacity-80">{appDescription}</p>
          </div>
          <h2 className="text-xl font-bold text-white text-center mb-3">
            {pageTitle}
          </h2>
          <p className="text-sm text-white/80 text-center mb-4">{pageSubtitle}</p>
          <div>
            {children}
          </div>
          <p className="text-xs text-white/60 text-center mt-4">
            {footerText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;