/**
 * EmptyState Component
 * 
 * Componente para estados vazios com ilustrações, mensagens e CTAs.
 * Proporciona melhor UX quando não há dados para exibir.
 */

import type { ReactNode } from 'react';
import { FiInbox, FiSearch, FiAlertCircle } from 'react-icons/fi';
import { Button } from './Button';

export type EmptyStateVariant = 'default' | 'search' | 'error';

interface EmptyStateProps {
  /** Variante do estado vazio */
  variant?: EmptyStateVariant;
  /** Ícone customizado (sobrescreve o ícone da variante) */
  icon?: ReactNode;
  /** Título principal */
  title: string;
  /** Descrição/mensagem secundária */
  description?: string;
  /** Texto do botão de ação */
  actionText?: string;
  /** Callback do botão de ação */
  onAction?: () => void;
  /** Texto do botão secundário */
  secondaryActionText?: string;
  /** Callback do botão secundário */
  onSecondaryAction?: () => void;
  /** Conteúdo adicional */
  children?: ReactNode;
}

const variantConfig = {
  default: {
    icon: FiInbox,
    iconColor: 'text-base-content/30',
  },
  search: {
    icon: FiSearch,
    iconColor: 'text-info/50',
  },
  error: {
    icon: FiAlertCircle,
    iconColor: 'text-error/50',
  },
};

export default function EmptyState({
  variant = 'default',
  icon,
  title,
  description,
  actionText,
  onAction,
  secondaryActionText,
  onSecondaryAction,
  children,
}: EmptyStateProps) {
  const config = variantConfig[variant];
  const IconComponent = icon || <config.icon className="w-full h-full" />;

  return (
    <section 
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
      role="status"
      aria-live="polite"
    >
      {/* Icon */}
      <div className={`w-16 h-16 sm:w-20 sm:h-20 mb-4 sm:mb-6 ${config.iconColor}`}>
        {IconComponent}
      </div>

      {/* Title */}
      <h2 className="text-xl sm:text-2xl font-semibold text-base-content mb-2">
        {title}
      </h2>

      {/* Description */}
      {description && (
        <p className="text-base-content/70 text-sm sm:text-base max-w-md mb-6">
          {description}
        </p>
      )}

      {/* Actions */}
      {(actionText || secondaryActionText) && (
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          {actionText && onAction && (
            <Button
              variant="default"
              size="md"
              onClick={onAction}
            >
              {actionText}
            </Button>
          )}
          {secondaryActionText && onSecondaryAction && (
            <Button
              variant="outline"
              size="md"
              onClick={onSecondaryAction}
            >
              {secondaryActionText}
            </Button>
          )}
        </div>
      )}

      {/* Custom Content */}
      {children && (
        <div className="mt-6 w-full max-w-md">
          {children}
        </div>
      )}
    </section>
  );
}

// Preset EmptyStates para casos comuns

/** Estado vazio para listas vazias */
export function EmptyListState({ 
  entityName, 
  onAdd 
}: { 
  entityName: string; 
  onAdd?: () => void;
}) {
  return (
    <EmptyState
      variant="default"
      title={`Nenhum ${entityName} encontrado`}
      description={`Você ainda não cadastrou nenhum ${entityName}. Comece adicionando um novo.`}
      actionText={`Adicionar ${entityName}`}
      onAction={onAdd}
    />
  );
}

/** Estado vazio para resultados de busca */
export function EmptySearchState({ 
  searchTerm, 
  onClear 
}: { 
  searchTerm?: string; 
  onClear?: () => void;
}) {
  return (
    <EmptyState
      variant="search"
      title="Nenhum resultado encontrado"
      description={
        searchTerm 
          ? `Não encontramos resultados para "${searchTerm}". Tente ajustar sua busca.`
          : "Não encontramos resultados para sua busca."
      }
      actionText="Limpar busca"
      onAction={onClear}
    />
  );
}

/** Estado de erro */
export function ErrorState({ 
  message, 
  onRetry 
}: { 
  message?: string; 
  onRetry?: () => void;
}) {
  return (
    <EmptyState
      variant="error"
      title="Erro ao carregar dados"
      description={message || "Ocorreu um erro ao carregar os dados. Tente novamente."}
      actionText="Tentar novamente"
      onAction={onRetry}
    />
  );
}
