"use client";

import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Share2,
  Download,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

interface PdfViewerProps {
  url: string;
  title: string;
  onBack: () => void;
  onDownload: () => void;
  onShare: () => void;
  sharingDisabled?: boolean;
}

export default function PdfViewer({
  url,
  title,
  onBack,
  onDownload,
  onShare,
  sharingDisabled,
}: PdfViewerProps) {
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageWidth, setPageWidth] = useState(600);

  useEffect(() => {
    const update = () => setPageWidth(Math.min(window.innerWidth - 8, 800));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-3rem)] lg:h-screen">
      <div className="flex items-center gap-2 p-2 bg-white border-b shrink-0">
        <Button variant="outline" size="icon" onClick={onBack} aria-label="Volver" className="h-11 w-11">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <span className="text-base font-bold text-gray-900 truncate">{title}</span>
        <div className="ml-auto flex gap-1.5">
          <Button variant="outline" size="icon" onClick={onDownload} aria-label="Descargar" className="h-11 w-11">
            <Download className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" onClick={onShare} disabled={sharingDisabled} aria-label="Compartir" className="h-11 w-11">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div
        className="flex-1 overflow-auto bg-gray-200 flex flex-col items-center py-2 px-1 touch-pan-x touch-pan-y"
        style={{ touchAction: "pan-x pan-y pinch-zoom" }}
      >
        <Document
          file={url}
          onLoadSuccess={({ numPages: n }) => setNumPages(n)}
          loading={
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
              <p className="text-lg text-gray-600">Cargando...</p>
            </div>
          }
          error={
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <p className="text-lg text-red-600 font-medium">No se pudo cargar el PDF</p>
              <Button variant="outline" onClick={onBack}>Volver</Button>
            </div>
          }
        >
          <Page pageNumber={currentPage} width={pageWidth} />
        </Document>
      </div>

      {numPages > 1 && (
        <div className="flex items-center justify-center gap-4 p-2 bg-white border-t shrink-0">
          <Button variant="outline" size="icon" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage <= 1} aria-label="Anterior" className="h-12 w-12">
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <span className="text-lg font-medium text-gray-700">{currentPage} / {numPages}</span>
          <Button variant="outline" size="icon" onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))} disabled={currentPage >= numPages} aria-label="Siguiente" className="h-12 w-12">
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      )}
    </div>
  );
}
