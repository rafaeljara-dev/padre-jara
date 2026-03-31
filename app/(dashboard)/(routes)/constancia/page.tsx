"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Eye, Share2, Mail, MessageCircle, Download } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const PDF_URL = "/constancia-csf.pdf";
const PDF_FILENAME = "Constancia_Situacion_Fiscal.pdf";
const CORREO_FACTURACION = "jg_despacho@hotmail.com";
const EMAIL_SUBJECT = "Constancia de Situación Fiscal - Rafael Lazalde";
const EMAIL_BODY = `Buen día, le adjunto mi Constancia de Situación Fiscal para facturación.\n\nFavor de enviar la factura al siguiente correo:\n${CORREO_FACTURACION}\n\nSaludos.`;

export default function ConstanciaPage() {
  const router = useRouter();
  const [sharing, setSharing] = useState(false);
  const [viewingPdf, setViewingPdf] = useState(false);

  const getPdfFile = async (): Promise<File> => {
    const response = await fetch(PDF_URL);
    const blob = await response.blob();
    return new File([blob], PDF_FILENAME, { type: "application/pdf" });
  };

  const handleCompartir = async () => {
    setSharing(true);
    try {
      const file = await getPdfFile();
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: "Constancia de Situación Fiscal",
          text: "Constancia de Situación Fiscal - Rafael Lazalde",
          files: [file],
        });
      } else {
        const link = document.createElement("a");
        link.href = PDF_URL;
        link.download = PDF_FILENAME;
        link.click();
        toast.info("PDF descargado. Adjúntalo manualmente en WhatsApp o correo.");
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        toast.error("Error al compartir el archivo");
      }
    } finally {
      setSharing(false);
    }
  };

  const handleWhatsApp = async () => {
    setSharing(true);
    try {
      const file = await getPdfFile();
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: "Constancia de Situación Fiscal",
          files: [file],
        });
      } else {
        const mensaje = encodeURIComponent(
          "Le envío mi Constancia de Situación Fiscal actualizada."
        );
        window.open(`https://wa.me/?text=${mensaje}`, "_blank");
        toast.info("Adjunta el PDF manualmente en la conversación.");
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        toast.error("Error al compartir");
      }
    } finally {
      setSharing(false);
    }
  };

  const handleEnviarCorreo = () => {
    const subject = encodeURIComponent(EMAIL_SUBJECT);
    const body = encodeURIComponent(EMAIL_BODY);
    window.open(
      `mailto:?subject=${subject}&body=${body}`,
      "_self"
    );
    toast.info("Escribe el correo del contador y adjunta el PDF antes de enviar.", {
      duration: 6000,
    });
  };

  const handleDescargar = () => {
    const link = document.createElement("a");
    link.href = PDF_URL;
    link.download = PDF_FILENAME;
    link.click();
    toast.success("PDF descargado");
  };

  // ── Vista: PDF en pantalla completa dentro de la app ──
  if (viewingPdf) {
    return (
      <div className="flex flex-col h-[calc(100vh-3rem)] lg:h-screen">
        {/* Header del visor */}
        <div className="flex items-center gap-3 p-4 bg-white border-b shrink-0">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewingPdf(false)}
            aria-label="Volver"
            className="h-12 w-12"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 truncate">
            Constancia CSF
          </h1>
          <div className="ml-auto flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleDescargar}
              aria-label="Descargar PDF"
              className="h-12 w-12"
            >
              <Download className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleCompartir}
              disabled={sharing}
              aria-label="Compartir PDF"
              className="h-12 w-12"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* PDF embebido */}
        <div className="flex-1 bg-gray-200">
          <iframe
            src={`${PDF_URL}#toolbar=1&navpanes=0`}
            className="w-full h-full border-0"
            title="Constancia de Situación Fiscal"
          />
        </div>
      </div>
    );
  }

  // ── Vista: Menú de acciones ──
  return (
    <div className="p-4 md:p-6 space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push("/dashboard")}
          aria-label="Volver al inicio"
          className="h-12 w-12"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Constancia CSF
        </h1>
      </div>

      {/* Ver PDF */}
      <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100 shadow-md">
        <CardContent className="p-5">
          <button
            onClick={() => setViewingPdf(true)}
            className="w-full flex items-center gap-4 text-left min-h-[64px] active:scale-[0.98] transition-transform"
          >
            <div className="p-3 bg-emerald-200 rounded-xl shrink-0">
              <Eye className="h-7 w-7 text-emerald-800" />
            </div>
            <div>
              <p className="text-lg font-bold text-emerald-900">Ver PDF</p>
              <p className="text-base text-emerald-700">
                Ver la constancia aquí mismo
              </p>
            </div>
          </button>
        </CardContent>
      </Card>

      {/* Compartir */}
      <h2 className="text-xl font-semibold text-gray-900">Enviar a alguien</h2>

      <div className="grid gap-4">
        {/* Compartir general */}
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 shadow-md">
          <CardContent className="p-5">
            <button
              onClick={handleCompartir}
              disabled={sharing}
              className="w-full flex items-center gap-4 text-left min-h-[64px] active:scale-[0.98] transition-transform disabled:opacity-60"
            >
              <div className="p-3 bg-blue-200 rounded-xl shrink-0">
                <Share2 className="h-7 w-7 text-blue-800" />
              </div>
              <div>
                <p className="text-lg font-bold text-blue-900">Compartir PDF</p>
                <p className="text-base text-blue-700">
                  WhatsApp, correo, Telegram u otra app
                </p>
              </div>
            </button>
          </CardContent>
        </Card>

        {/* WhatsApp */}
        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100 shadow-md">
          <CardContent className="p-5">
            <button
              onClick={handleWhatsApp}
              disabled={sharing}
              className="w-full flex items-center gap-4 text-left min-h-[64px] active:scale-[0.98] transition-transform disabled:opacity-60"
            >
              <div className="p-3 bg-green-200 rounded-xl shrink-0">
                <MessageCircle className="h-7 w-7 text-green-800" />
              </div>
              <div>
                <p className="text-lg font-bold text-green-900">Enviar por WhatsApp</p>
                <p className="text-base text-green-700">
                  Elige el contacto y envía con el PDF adjunto
                </p>
              </div>
            </button>
          </CardContent>
        </Card>

        {/* Contador */}
        <Card className="border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-violet-100 shadow-md">
          <CardContent className="p-5">
            <button
              onClick={handleEnviarCorreo}
              className="w-full flex items-center gap-4 text-left min-h-[64px] active:scale-[0.98] transition-transform"
            >
              <div className="p-3 bg-violet-200 rounded-xl shrink-0">
                <Mail className="h-7 w-7 text-violet-800" />
              </div>
              <div>
                <p className="text-lg font-bold text-violet-900">Enviar por Correo</p>
                <p className="text-base text-violet-700">
                  Incluye datos para que facturen a {CORREO_FACTURACION}
                </p>
              </div>
            </button>
          </CardContent>
        </Card>

        {/* Descargar */}
        <Card className="border border-gray-200 bg-white shadow-sm">
          <CardContent className="p-5">
            <button
              onClick={handleDescargar}
              className="w-full flex items-center gap-4 text-left min-h-[64px] active:scale-[0.98] transition-transform"
            >
              <div className="p-3 bg-gray-100 rounded-xl shrink-0">
                <Download className="h-7 w-7 text-gray-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">Descargar PDF</p>
                <p className="text-base text-gray-600">Guardar en tu dispositivo</p>
              </div>
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Tip */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 shadow-sm">
        <p className="text-amber-800 text-base">
          <strong>Tip:</strong> En celular, usa &quot;Compartir PDF&quot; para enviar con el archivo adjunto automáticamente.
        </p>
      </div>
    </div>
  );
}
