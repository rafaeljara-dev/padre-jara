import React from "react";
import { Shield, Lock, User, Info } from "lucide-react";
import AuthLayoutClient from "./layout-client";

// Tipos para facilitar la personalización
type SecurityFeature = {
  icon: React.ElementType;
  text: string;
  description: string;
};

const securityFeaturesDefault: SecurityFeature[] = [
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
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <AuthLayoutClient
      securityFeatures={securityFeaturesDefault}
    >
      {children}
    </AuthLayoutClient>
  );
}