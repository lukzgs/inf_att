import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
          <div className="premium-card max-w-md w-full p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-6">
              <FiAlertTriangle className="text-error" size={40} />
            </div>
            
            <h1 className="text-2xl font-bold text-base-content mb-2">
              Oops! Algo deu errado
            </h1>
            
            <p className="text-base-content/70 mb-6">
              Ocorreu um erro inesperado. Tente recarregar a página ou voltar para o início.
            </p>

            {this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm text-base-content/50 hover:text-base-content/70">
                  Detalhes técnicos
                </summary>
                <pre className="mt-2 p-3 bg-base-300 rounded-lg text-xs overflow-auto max-h-40">
                  {this.state.error.message}
                  {'\n\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}

            <div className="flex gap-3 justify-center">
              <button onClick={this.handleGoHome} className="btn btn-accent">
                Ir para o Início
              </button>
              <button onClick={this.handleReload} className="btn btn-outline">
                Recarregar Página
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
