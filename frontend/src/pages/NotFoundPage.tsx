import { Link } from 'react-router-dom';
import { FiHome, FiArrowLeft } from 'react-icons/fi';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <div className="text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary/20">404</h1>
        </div>

        {/* Message */}
        <h2 className="text-3xl font-bold text-base-content mb-4">
          Página não encontrada
        </h2>
        <p className="text-base-content/70 mb-8 max-w-md mx-auto">
          Desculpe, a página que você está procurando não existe ou foi movida.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/dashboard" className="btn btn-accent">
            <FiHome size={20} />
            Ir para o Início
          </Link>
          <button onClick={() => window.history.back()} className="btn btn-outline">
            <FiArrowLeft size={20} />
            Voltar
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="mt-12 flex justify-center gap-4">
          <div className="w-3 h-3 rounded-full bg-primary animate-bounce"></div>
          <div className="w-3 h-3 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
}
