'use client';

import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PwaInstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Verificar si la aplicación ya está instalada
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevenir el comportamiento predeterminado
      e.preventDefault();
      // Guardar el evento para usarlo después
      setInstallPrompt(e as BeforeInstallPromptEvent);
      // Mostrar el banner después de 3 segundos
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;

    // Mostrar el prompt de instalación
    await installPrompt.prompt();

    // Esperar a que el usuario responda al prompt
    const choiceResult = await installPrompt.userChoice;
    
    // Ocultar el banner después de la decisión del usuario
    setShowPrompt(false);
    setInstallPrompt(null);

    if (choiceResult.outcome === 'accepted') {
      setIsInstalled(true);
    }
  };

  if (isInstalled || !showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-black text-white z-50 flex justify-between items-center">
      <div>
        <p className="font-medium">Instala esta aplicación</p>
        <p className="text-sm opacity-80">Accede más rápido y trabaja sin conexión</p>
      </div>
      <div className="flex space-x-2">
        <button 
          onClick={() => setShowPrompt(false)}
          className="px-3 py-1 border border-white rounded-md text-sm"
        >
          Ahora no
        </button>
        <button 
          onClick={handleInstallClick}
          className="px-3 py-1 bg-white text-black rounded-md text-sm font-medium"
        >
          Instalar
        </button>
      </div>
    </div>
  );
} 