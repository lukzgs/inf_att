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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-100 via-base-200 to-base-300 p-4">
          <div className="card bg-base-100 shadow-2xl border-2 border-base-300 max-w-2xl w-full">
            <div className="card-body p-6 sm:p-8">
              {/* Icon Header */}
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-error/10 flex items-center justify-center ring-4 ring-error/20">
                  <FiAlertTriangle className="text-error w-8 h-8 sm:w-10 sm:h-10" />
                </div>
              </div>
              
              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 dark:text-white mb-3">
                Oops! Algo deu errado
              </h1>
              
              {/* Description */}
              <p className="text-center text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6">
                Ocorreu um erro inesperado. Tente recarregar a página ou voltar para o início.
              </p>

              {/* Technical Details */}
              {this.state.error && (
                <details className="mb-6">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary transition-colors mb-2 flex items-center gap-2">
                    <span>▼ Detalhes técnicos</span>
                  </summary>
                  <div className="mt-3 p-4 bg-gray-900 dark:bg-gray-950 rounded-xl border-2 border-gray-800 dark:border-gray-700">
                    <pre className="text-xs sm:text-sm text-gray-100 dark:text-gray-300 overflow-auto max-h-64 font-mono leading-relaxed whitespace-pre-wrap break-words">
                      <div className="text-red-400 font-semibold mb-2">Erro:</div>
                      {this.state.error.message}
                      {this.state.error.stack && (
                        <>
                          {'\n\n'}
                          <div className="text-yellow-400 font-semibold mb-2">Stack Trace:</div>
                          {this.state.error.stack}
                        </>
                      )}
                    </pre>
                  </div>
                </details>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-2">
                <button 
                  onClick={this.handleGoHome} 
                  className="btn-premium btn-premium-primary flex-1 sm:flex-initial"
                >
                  Ir para o Início
                </button>
                <button 
                  onClick={this.handleReload} 
                  className="btn-premium btn-premium-secondary flex-1 sm:flex-initial"
                >
                  Recarregar Página
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
