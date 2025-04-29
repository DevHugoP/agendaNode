import { pdfjs } from 'react-pdf';
import pdfWorker from 'pdfjs-dist/build/pdf.worker?url';
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

import { useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import { useState } from 'react';

interface PdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl?: string;
}

export function PdfModal({ isOpen, onClose, pdfUrl = '/mocks/fake-client.pdf' }: PdfModalProps) {
  const [numPages, setNumPages] = useState<number>();
  const [pdfError, setPdfError] = useState(false);

  // Réinitialise l’erreur à chaque ouverture ou changement de PDF
  useEffect(() => {
    setPdfError(false);
  }, [isOpen, pdfUrl]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full relative overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-agenda-purple">Visualisation PDF</h3>
          <button
            className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-agenda-purple"
            onClick={onClose}
            aria-label="Fermer la modale"
            type="button"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="w-full h-[500px] bg-gray-100 flex items-center justify-center">
          <Document
            file={pdfUrl}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            onLoadError={err => {
              console.error('Erreur de chargement PDF:', err);
              setPdfError(true);
            }}
            loading={<span>Chargement du PDF…</span>}
          >
            {pdfError ? (
              <div className="text-red-500 text-center">
                Impossible d'afficher ce document PDF.<br />
                Vérifiez que le fichier est bien un PDF valide.
              </div>
            ) : (
              Array.from(new Array(numPages || 0), (el, index) => (
                <Page key={`page_${index + 1}`} pageNumber={index + 1} width={700} />
              ))
            )}
          </Document>
        </div>
      </div>
      {/* Overlay click pour fermer */}
      <div className="fixed inset-0 z-40" onClick={onClose} />
    </div>
  );
}
