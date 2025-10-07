import { useMemo } from 'react';
import {
  calculateFrequency,
  calculateFrequencyPrecise,
  isApprovedByFrequency,
  calculateRemainingAbsences,
  getFrequencyStatus,
  isCriticalFrequency,
  needsFrequencyAlert,
  getFrequencyBadgeClass,
  getFrequencyTextColor,
  type FrequencyStatus,
} from '@/utils/attendance';

/**
 * Interface para estatísticas de frequência
 */
export interface FrequencyStats {
  /** Porcentagem de frequência (0-100) */
  percentage: number;
  /** Porcentagem com precisão decimal */
  percentagePrecise: number;
  /** Status da frequência */
  status: FrequencyStatus;
  /** Se está aprovado (>= 75%) */
  isApproved: boolean;
  /** Se está em situação crítica (< 75%) */
  isCritical: boolean;
  /** Se precisa de alerta (< 80%) */
  needsAlert: boolean;
  /** Faltas restantes permitidas */
  remainingAbsences: number;
  /** Classe CSS para badge */
  badgeClass: string;
  /** Classe CSS para cor do texto */
  textColor: string;
  /** Total de aulas */
  total: number;
  /** Presenças */
  present: number;
  /** Faltas */
  absent: number;
}

/**
 * Hook para calcular e gerenciar estatísticas de frequência
 * 
 * @param present - Número de presenças
 * @param total - Total de aulas
 * @param minimumPercentage - Porcentagem mínima para aprovação (padrão: 75)
 * @returns Objeto com todas as estatísticas de frequência
 * 
 * @example
 * ```tsx
 * function StudentFrequency({ present, total }) {
 *   const frequency = useFrequency(present, total);
 * 
 *   return (
 *     <div>
 *       <span className={frequency.badgeClass}>
 *         {frequency.percentage}%
 *       </span>
 *       {frequency.needsAlert && (
 *         <p>⚠️ Você tem apenas {frequency.remainingAbsences} faltas restantes!</p>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export function useFrequency(
  present: number,
  total: number,
  minimumPercentage: number = 75
): FrequencyStats {
  return useMemo(() => {
    const percentage = calculateFrequency(present, total);
    const percentagePrecise = calculateFrequencyPrecise(present, total, 2);
    const status = getFrequencyStatus(percentage);
    const isApproved = isApprovedByFrequency(present, total, minimumPercentage);
    const isCritical = isCriticalFrequency(percentage, minimumPercentage);
    const needsAlert = needsFrequencyAlert(percentage);
    const remainingAbsences = calculateRemainingAbsences(present, total, minimumPercentage);
    const badgeClass = getFrequencyBadgeClass(percentage);
    const textColor = getFrequencyTextColor(percentage);
    const absent = total - present;

    return {
      percentage,
      percentagePrecise,
      status,
      isApproved,
      isCritical,
      needsAlert,
      remainingAbsences,
      badgeClass,
      textColor,
      total,
      present,
      absent,
    };
  }, [present, total, minimumPercentage]);
}

/**
 * Hook simplificado que retorna apenas a porcentagem
 * 
 * @param present - Número de presenças
 * @param total - Total de aulas
 * @returns Porcentagem de frequência
 * 
 * @example
 * ```tsx
 * const percentage = useFrequencyPercentage(23, 25); // 92
 * ```
 */
export function useFrequencyPercentage(present: number, total: number): number {
  return useMemo(() => calculateFrequency(present, total), [present, total]);
}

/**
 * Hook que retorna se o aluno está aprovado
 * 
 * @param present - Número de presenças
 * @param total - Total de aulas
 * @param minimumPercentage - Porcentagem mínima (padrão: 75)
 * @returns true se aprovado
 * 
 * @example
 * ```tsx
 * const isApproved = useIsApproved(23, 25); // true (92% >= 75%)
 * ```
 */

export function useIsApproved(
  present: number,
  total: number,
  minimumPercentage: number = 75
): boolean {
  return useMemo(
    () => isApprovedByFrequency(present, total, minimumPercentage),
    [present, total, minimumPercentage]
  );
}
