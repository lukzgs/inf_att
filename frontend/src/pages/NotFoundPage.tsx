import { Link } from 'react-router-dom';
import { FiHome, FiArrowLeft, FiAlertCircle } from 'react-icons/fi';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-base-200 dark:to-base-300 p-4">
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white dark:bg-base-100 rounded-3xl shadow-2xl border border-gray-200 dark:border-base-300 overflow-hidden">
          {/* Header with gradient background */}
          <div className="bg-gradient-to-r from-error/10 to-warning/10 dark:from-error/20 dark:to-warning/20 p-8 text-center border-b border-gray-200 dark:border-base-300">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-error/10 dark:bg-error/20 flex items-center justify-center">
                <FiAlertCircle size={40} className="text-error" />
              </div>
            </div>

            {/* 404 Number */}
            <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-2">404</h1>
            <div className="h-1 w-16 bg-gradient-to-r from-error to-warning rounded-full mx-auto"></div>
          </div>

          {/* Content */}
          <div className="p-8 text-center">
            {/* Title */}
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-3">
              Página não encontrada
            </h2>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed mb-8">
              Desculpe, a página que você está procurando não existe ou foi movida para outro local.
            </p>

            {/* Suggestions */}
            <div className="mb-8 space-y-3">
              <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-base-300/50 rounded-2xl">
                <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                </div>
                <div className="text-left flex-1">
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                    Verifique a URL digitada
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-base-300/50 rounded-2xl">
                <div className="w-6 h-6 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-secondary"></div>
                </div>
                <div className="text-left flex-1">
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                    Contate o suporte se o problema persistir
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <Link 
                to="/dashboard" 
                className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-2xl hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <FiHome size={18} />
                Ir para o Dashboard
              </Link>
              <button 
                onClick={() => window.history.back()}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-base-300 text-gray-900 dark:text-white font-semibold rounded-2xl hover:bg-gray-200 dark:hover:bg-base-200 transition-all duration-200"
              >
                <FiArrowLeft size={18} />
                Voltar
              </button>
            </div>
          </div>

          {/* Footer decoration */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-base-300/50 dark:to-base-300 px-8 py-6 flex justify-center gap-3">
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce"></div>
            <div className="w-2 h-2 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>

        {/* Decorative background elements */}
        <div className="mt-8 space-y-4 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Código de erro: <span className="font-mono font-semibold">404_NOT_FOUND</span>
          </p>
        </div>
      </div>
    </div>
  );
}
