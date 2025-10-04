import { getFrequencyBadgeClass } from '@/utils/attendance/getFrequencyColor';
import { formatPercentage } from '@/utils/format/formatPercentage';

/**
 * Tamanhos disponíveis para o badge
 */
export type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';

/**
 * Props do componente FrequencyBadge
 */
export interface FrequencyBadgeProps {
  /** Porcentagem de frequência (0-100) */
  percentage: number;
  /** Se deve exibir o rótulo "Frequência:" */
  showLabel?: boolean;
  /** Tamanho do badge */
  size?: BadgeSize;
  /** Classe CSS adicional */
  className?: string;
}

/**
 * Mapa de tamanhos para classes DaisyUI
 */
const sizeClasses: Record<BadgeSize, string> = {
  xs: 'badge-xs text-xs',
  sm: 'badge-sm text-sm',
  md: 'badge-md text-base',
  lg: 'badge-lg text-lg',
};

/**
 * Componente Badge para exibir frequência com cores semânticas
 * 
 * Features:
 * - Cores automáticas baseadas em porcentagem:
 *   - Verde (≥75%): success
 *   - Amarelo (60-74%): warning
 *   - Vermelho (<60%): error
 * - Múltiplos tamanhos (xs, sm, md, lg)
 * - Formatação brasileira de porcentagem (92%)
 * - Rótulo opcional
 * - Totalmente reutilizável
 * 
 * @example
 * ```tsx
 * // Badge simples
 * <FrequencyBadge percentage={92} />
 * // Output: [92%] (verde)
 * 
 * // Com rótulo
 * <FrequencyBadge percentage={73} showLabel />
 * // Output: Frequência: [73%] (amarelo)
 * 
 * // Grande
 * <FrequencyBadge percentage={58} size="lg" />
 * // Output: [58%] (vermelho, grande)
 * ```
 */
export function FrequencyBadge({
  percentage,
  showLabel = false,
  size = 'md',
  className = '',
}: FrequencyBadgeProps) {
  // Obter classes DaisyUI baseadas na porcentagem
  const badgeClass = getFrequencyBadgeClass(percentage);
  const sizeClass = sizeClasses[size];

  // Formatar porcentagem (92%)
  const formattedPercentage = formatPercentage(percentage);

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {showLabel && (
        <span className="text-sm text-base-content/70 font-medium">
          Frequência:
        </span>
      )}
      
      <span className={`badge font-semibold ${badgeClass} ${sizeClass}`}>
        {formattedPercentage}
      </span>
    </div>
  );
}

/**
 * Variante compacta do FrequencyBadge (sem rótulo, tamanho pequeno)
 * 
 * @example
 * ```tsx
 * <CompactFrequencyBadge percentage={85} />
 * ```
 */
export function CompactFrequencyBadge({
  percentage,
  className = '',
}: Pick<FrequencyBadgeProps, 'percentage' | 'className'>) {
  return (
    <FrequencyBadge
      percentage={percentage}
      showLabel={false}
      size="sm"
      className={className}
    />
  );
}

/**
 * Variante com rótulo do FrequencyBadge
 * 
 * @example
 * ```tsx
 * <LabeledFrequencyBadge percentage={92} />
 * // Output: Frequência: [92%]
 * ```
 */
export function LabeledFrequencyBadge({
  percentage,
  size = 'md',
  className = '',
}: Pick<FrequencyBadgeProps, 'percentage' | 'size' | 'className'>) {
  return (
    <FrequencyBadge
      percentage={percentage}
      showLabel={true}
      size={size}
      className={className}
    />
  );
}
