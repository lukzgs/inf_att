// Componentes de loading para usar com React.Suspense
/**
 * Full page loading indicator
 */
export function LoadingPage() {
  const messages = [
    'Carregando...',
    'Preparando tudo para você...',
    'Aguarde um momento...',
    'Estamos quase lá...',
  ];
  
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200">
      <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
      <p className="text-base-content/70 animate-pulse">{randomMessage}</p>
    </div>
  );
}

export const LoadingSpinner = () => (
  <div className="flex justify-center py-8">
    <span className="loading loading-spinner loading-md text-primary"></span>
  </div>
);

export const LoadingModal = () => (
  <div className="flex items-center justify-center py-12">
    <div className="text-center">
      <span className="loading loading-spinner loading-lg text-primary"></span>
      <p className="mt-4 text-base-content/60">Carregando...</p>
    </div>
  </div>
);
