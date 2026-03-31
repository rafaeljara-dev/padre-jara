"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Eye,
  Share2,
  Mail,
  MessageCircle,
  Download,
  Loader2,
} from "lucide-react";
import { toast } from "@/components/ui/sonner";

const PdfViewer = dynamic(() => import("@/components/pdf-viewer"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
    </div>
  ),
});

const PDF_URL = "/constancia-csf.pdf";
const PDF_FILENAME = "Constancia_Situacion_Fiscal.pdf";
const CORREO_FACTURACION = "jg_despacho@hotmail.com";
const WHATSAPP_TEXT = `Le envío mi Constancia de Situación Fiscal.\n\nFavor de enviar la factura al correo:\n${CORREO_FACTURACION}`;
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
          text: `Constancia de Situación Fiscal - Rafael Lazalde\n\nEnviar factura a: ${CORREO_FACTURACION}`,
          files: [file],
        });
      } else {
        const link = document.createElement("a");
        link.href = PDF_URL;
        link.download = PDF_FILENAME;
        link.click();
        toast.info("PDF descargado. Adjúntalo manualmente.");
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
          text: WHATSAPP_TEXT,
          files: [file],
        });
      } else {
        window.open(
          `https://wa.me/?text=${encodeURIComponent(WHATSAPP_TEXT)}`,
          "_blank"
        );
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
    window.open(`mailto:?subject=${subject}&body=${body}`, "_self");
    toast.info(
      "Escribe el correo del contador y adjunta el PDF antes de enviar.",
      { duration: 6000 }
    );
  };

  const handleDescargar = () => {
    const link = document.createElement("a");
    link.href = PDF_URL;
    link.download = PDF_FILENAME;
    link.click();
    toast.success("PDF descargado");
  };

  // ── Vista: PDF inline ──
  if (viewingPdf) {
    return (
      <PdfViewer
        url={PDF_URL}
        title="Constancia CSF"
        onBack={() => setViewingPdf(false)}
        onDownload={handleDescargar}
        onShare={handleCompartir}
        sharingDisabled={sharing}
      />
    );
  }

  // ── Vista: Menú de acciones ──
  return (
    <div className="p-4 md:p-6 space-y-6 max-w-2xl mx-auto">
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

      <h2 className="text-xl font-semibold text-gray-900">Enviar a alguien</h2>

      <div className="grid gap-4">
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
                <p className="text-lg font-bold text-green-900">
                  Enviar por WhatsApp
                </p>
                <p className="text-base text-green-700">
                  PDF + correo de facturación ({CORREO_FACTURACION})
                </p>
              </div>
            </button>
          </CardContent>
        </Card>

        {/* Correo — rojo */}
        <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-red-100 shadow-md">
          <CardContent className="p-5">
            <button
              onClick={handleEnviarCorreo}
              className="w-full flex items-center gap-4 text-left min-h-[64px] active:scale-[0.98] transition-transform"
            >
              <div className="p-3 bg-red-200 rounded-xl shrink-0">
                <Mail className="h-7 w-7 text-red-800" />
              </div>
              <div>
                <p className="text-lg font-bold text-red-900">
                  Enviar por Correo
                </p>
                <p className="text-base text-red-700">
                  Incluye datos para que facturen a {CORREO_FACTURACION}
                </p>
              </div>
            </button>
          </CardContent>
        </Card>

        {/* Compartir + Descargar juntos al final */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 shadow-md">
            <CardContent className="p-4">
              <button
                onClick={handleCompartir}
                disabled={sharing}
                className="w-full flex flex-col items-center gap-2 text-center min-h-[72px] active:scale-[0.98] transition-transform disabled:opacity-60"
              >
                <div className="p-2.5 bg-blue-200 rounded-xl">
                  <Share2 className="h-6 w-6 text-blue-800" />
                </div>
                <p className="text-base font-bold text-blue-900 leading-tight">
                  Compartir PDF
                </p>
              </button>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 bg-white shadow-sm">
            <CardContent className="p-4">
              <button
                onClick={handleDescargar}
                className="w-full flex flex-col items-center gap-2 text-center min-h-[72px] active:scale-[0.98] transition-transform"
              >
                <div className="p-2.5 bg-gray-100 rounded-xl">
                  <Download className="h-6 w-6 text-gray-600" />
                </div>
                <p className="text-base font-bold text-gray-900 leading-tight">
                  Descargar PDF
                </p>
              </button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 shadow-sm">
        <p className="text-amber-800 text-base">
          <strong>Tip:</strong> En celular, usa &quot;Compartir PDF&quot; para
          enviar con el archivo adjunto automáticamente.
        </p>
      </div>
    </div>
  );
}
