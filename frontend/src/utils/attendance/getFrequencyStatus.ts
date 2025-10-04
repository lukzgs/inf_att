/**
 * Tipo de status de frequência
 */
export type FrequencyStatus = 'success' | 'warning' | 'error';

/**
 * Configuração de thresholds para status de frequência
 */
export interface FrequencyThresholds {
  /** Porcentagem mínima para status 'success' (padrão: 75) */
  success: number;
  /** Porcentagem mínima para status 'warning' (padrão: 60) */
  warning: number;
  /** Abaixo de warning é 'error' */
}

/**
 * Thresholds padrão
 */
const DEFAULT_THRESHOLDS: FrequencyThresholds = {
  success: 75,
  warning: 60,
};

/**
 * Determina o status da frequência baseado em porcentagem
 * 
 * @param percentage - Porcentagem de frequência (0-100)
 * @param thresholds - Configuração de thresholds (opcional)
 * @returns Status: 'success' (verde), 'warning' (amarelo), 'error' (vermelho)
 * 
 * @example
 * getFrequencyStatus(92)  // 'success' (verde)
 * getFrequencyStatus(73)  // 'warning' (amarelo)
 * getFrequencyStatus(58)  // 'error' (vermelho)
 * 
 * // Com thresholds customizados
 * getFrequencyStatus(85, { success: 90, warning: 75 }) // 'warning'
 */
export function getFrequencyStatus(
  percentage: number,
  thresholds: FrequencyThresholds = DEFAULT_THRESHOLDS
): FrequencyStatus {
  if (percentage >= thresholds.success) {
    return 'success';
  }

  if (percentage >= thresholds.warning) {
    return 'warning';
  }

  return 'error';
}

/**
 * Verifica se a frequência está em situação crítica
 * 
 * @param percentage - Porcentagem de frequência (0-100)
 * @param criticalThreshold - Limite crítico (padrão: 75)
 * @returns true se está em situação crítica
 * 
 * @example
 * isCriticalFrequency(72)  // true (abaixo de 75%)
 * isCriticalFrequency(78)  // false (acima de 75%)
 * isCriticalFrequency(70, 65) // false (acima de 65%)
 */
export function isCriticalFrequency(
  percentage: number,
  criticalThreshold: number = 75
): boolean {
  return percentage < criticalThreshold;
}

/**
 * Verifica se o aluno precisa receber alerta de baixa frequência
 * 
 * @param percentage - Porcentagem de frequência (0-100)
 * @param alertThreshold - Limite para alerta (padrão: 80)
 * @returns true se precisa de alerta
 * 
 * @example
 * needsFrequencyAlert(78)  // true (abaixo de 80%)
 * needsFrequencyAlert(85)  // false (acima de 80%)
 */
export function needsFrequencyAlert(
  percentage: number,
  alertThreshold: number = 80
): boolean {
  return percentage < alertThreshold;
}

/**
 * Obtém mensagem descritiva do status
 * 
 * @param status - Status da frequência
 * @returns Mensagem descritiva
 * 
 * @example
 * getStatusMessage('success') // 'Frequência adequada'
 * getStatusMessage('warning') // 'Atenção: Frequência baixa'
 * getStatusMessage('error')   // 'Crítico: Risco de reprovação'
 */
export function getStatusMessage(status: FrequencyStatus): string {
  const messages: Record<FrequencyStatus, string> = {
    success: 'Frequência adequada',
    warning: 'Atenção: Frequência baixa',
    error: 'Crítico: Risco de reprovação',
  };

  return messages[status];
}

/**
 * Obtém emoji representativo do status
 * 
 * @param status - Status da frequência
 * @returns Emoji
 * 
 * @example
 * getStatusEmoji('success') // '✅'
 * getStatusEmoji('warning') // '⚠️'
 * getStatusEmoji('error')   // '❌'
 */
export function getStatusEmoji(status: FrequencyStatus): string {
  const emojis: Record<FrequencyStatus, string> = {
    success: '✅',
    warning: '⚠️',
    error: '❌',
  };

  return emojis[status];
}
