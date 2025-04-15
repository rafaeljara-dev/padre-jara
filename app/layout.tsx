import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import PwaInstallPrompt from "@/components/PwaInstallPrompt";
import NetworkStatus from "@/components/NetworkStatus";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rafael Lazalde App",
  description: "Sistema de Administracion",
  manifest: "/manifest.json",
  icons: {
    apple: '/icons/icon-192x192.png',
  },
  themeColor: "#000000",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Padre Jara App",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <meta name="application-name" content="Padre Jara App" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="Padre Jara App" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="msapplication-TileColor" content="#000000" />
          <meta name="msapplication-tap-highlight" content="no" />
          <meta name="theme-color" content="#000000" />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <ServiceWorkerRegistration />
          <NetworkStatus />
          {children}
          <PwaInstallPrompt />
          <Toaster position="top-right" />
        </body>
      </html>
    </ClerkProvider>
  );
}
