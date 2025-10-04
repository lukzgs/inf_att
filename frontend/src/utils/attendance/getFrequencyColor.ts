import { type FrequencyStatus, getFrequencyStatus } from './getFrequencyStatus';

/**
 * Conjunto de classes Tailwind para cada status
 */
export interface FrequencyColorClasses {
  /** Classe de cor de texto */
  text: string;
  /** Classe de cor de fundo */
  bg: string;
  /** Classe de borda */
  border: string;
  /** Classe de badge (DaisyUI) */
  badge: string;
  /** Classe de botão (DaisyUI) */
  button: string;
}

/**
 * Mapeamento de status para classes Tailwind
 */
const COLOR_CLASSES_MAP: Record<FrequencyStatus, FrequencyColorClasses> = {
  success: {
    text: 'text-success',
    bg: 'bg-success/10',
    border: 'border-success',
    badge: 'badge-success',
    button: 'btn-success',
  },
  warning: {
    text: 'text-warning',
    bg: 'bg-warning/10',
    border: 'border-warning',
    badge: 'badge-warning',
    button: 'btn-warning',
  },
  error: {
    text: 'text-error',
    bg: 'bg-error/10',
    border: 'border-error',
    badge: 'badge-error',
    button: 'btn-error',
  },
};

/**
 * Obtém a classe de cor de texto baseada na porcentagem de frequência
 * 
 * @param percentage - Porcentagem de frequência (0-100)
 * @returns Classe Tailwind de cor de texto
 * 
 * @example
 * getFrequencyTextColor(92)  // 'text-success'
 * getFrequencyTextColor(73)  // 'text-warning'
 * getFrequencyTextColor(58)  // 'text-error'
 */
export function getFrequencyTextColor(percentage: number): string {
  const status = getFrequencyStatus(percentage);
  return COLOR_CLASSES_MAP[status].text;
}

/**
 * Obtém a classe de cor de fundo baseada na porcentagem de frequência
 * 
 * @param percentage - Porcentagem de frequência (0-100)
 * @returns Classe Tailwind de cor de fundo
 * 
 * @example
 * getFrequencyBgColor(92)  // 'bg-success/10'
 * getFrequencyBgColor(73)  // 'bg-warning/10'
 * getFrequencyBgColor(58)  // 'bg-error/10'
 */
export function getFrequencyBgColor(percentage: number): string {
  const status = getFrequencyStatus(percentage);
  return COLOR_CLASSES_MAP[status].bg;
}

/**
 * Obtém a classe de cor de borda baseada na porcentagem de frequência
 * 
 * @param percentage - Porcentagem de frequência (0-100)
 * @returns Classe Tailwind de cor de borda
 * 
 * @example
 * getFrequencyBorderColor(92)  // 'border-success'
 */
export function getFrequencyBorderColor(percentage: number): string {
  const status = getFrequencyStatus(percentage);
  return COLOR_CLASSES_MAP[status].border;
}

/**
 * Obtém a classe de badge (DaisyUI) baseada na porcentagem de frequência
 * 
 * @param percentage - Porcentagem de frequência (0-100)
 * @returns Classe DaisyUI de badge
 * 
 * @example
 * getFrequencyBadgeClass(92)  // 'badge-success'
 * getFrequencyBadgeClass(73)  // 'badge-warning'
 * getFrequencyBadgeClass(58)  // 'badge-error'
 */
export function getFrequencyBadgeClass(percentage: number): string {
  const status = getFrequencyStatus(percentage);
  return COLOR_CLASSES_MAP[status].badge;
}

/**
 * Obtém a classe de botão (DaisyUI) baseada na porcentagem de frequência
 * 
 * @param percentage - Porcentagem de frequência (0-100)
 * @returns Classe DaisyUI de botão
 * 
 * @example
 * getFrequencyButtonClass(92)  // 'btn-success'
 */
export function getFrequencyButtonClass(percentage: number): string {
  const status = getFrequencyStatus(percentage);
  return COLOR_CLASSES_MAP[status].button;
}

/**
 * Obtém todas as classes de cor para uma porcentagem
 * 
 * @param percentage - Porcentagem de frequência (0-100)
 * @returns Objeto com todas as classes
 * 
 * @example
 * const classes = getFrequencyColorClasses(92)
 * // classes = { text: 'text-success', bg: 'bg-success/10', ... }
 */
export function getFrequencyColorClasses(percentage: number): FrequencyColorClasses {
  const status = getFrequencyStatus(percentage);
  return COLOR_CLASSES_MAP[status];
}

/**
 * Obtém classe de progresso (barra de frequência)
 * 
 * @param percentage - Porcentagem de frequência (0-100)
 * @returns Classe DaisyUI de progress
 * 
 * @example
 * getFrequencyProgressClass(92)  // 'progress-success'
 */
export function getFrequencyProgressClass(percentage: number): string {
  const status = getFrequencyStatus(percentage);
  return `progress-${status}`;
}
