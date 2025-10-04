/**
 * Formata número como porcentagem
 * 
 * @param value - Valor (0-100 ou 0-1)
 * @param options - Opções de formatação
 * @returns String formatada
 * 
 * @example
 * formatPercentage(92)         // '92%'
 * formatPercentage(0.92)       // '92%'
 * formatPercentage(92.5)       // '92.5%'
 * formatPercentage(92.5, { decimals: 0 })  // '93%'
 */
export function formatPercentage(
  value: number,
  options: {
    decimals?: number;
    isDecimal?: boolean;
  } = {}
): string {
  const { decimals = 1, isDecimal = false } = options;

  if (typeof value !== 'number' || isNaN(value)) {
    return '0%';
  }

  // Se valor é decimal (0-1), multiplica por 100
  const percentage = isDecimal ? value * 100 : value;

  // Garante que está entre 0-100
  const clampedValue = Math.min(100, Math.max(0, percentage));

  // Formata com decimais
  const formatted = clampedValue.toFixed(decimals);

  return `${formatted}%`;
}

/**
 * Formata porcentagem com símbolo e cor
 * 
 * @param value - Valor (0-100)
 * @param showSign - Mostrar sinal + ou -
 * @returns String formatada
 * 
 * @example
 * formatPercentageWithSign(5, true)   // '+5%'
 * formatPercentageWithSign(-3, true)  // '-3%'
 */
export function formatPercentageWithSign(
  value: number,
  showSign: boolean = true
): string {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0%';
  }

  const formatted = formatPercentage(Math.abs(value));
  
  if (!showSign) {
    return formatted;
  }

  if (value > 0) {
    return `+${formatted}`;
  }

  if (value < 0) {
    return `-${formatted}`;
  }

  return formatted;
}

/**
 * Converte decimal para porcentagem
 * 
 * @param decimal - Valor decimal (0-1)
 * @returns Porcentagem (0-100)
 * 
 * @example
 * decimalToPercentage(0.92)  // 92
 * decimalToPercentage(1)     // 100
 */
export function decimalToPercentage(decimal: number): number {
  if (typeof decimal !== 'number' || isNaN(decimal)) {
    return 0;
  }

  return Math.min(100, Math.max(0, decimal * 100));
}

/**
 * Converte porcentagem para decimal
 * 
 * @param percentage - Porcentagem (0-100)
 * @returns Decimal (0-1)
 * 
 * @example
 * percentageToDecimal(92)  // 0.92
 * percentageToDecimal(100) // 1
 */
export function percentageToDecimal(percentage: number): number {
  if (typeof percentage !== 'number' || isNaN(percentage)) {
    return 0;
  }

  return Math.min(1, Math.max(0, percentage / 100));
}

/**
 * Formata porcentagem para progressbar
 * 
 * @param value - Valor (0-100)
 * @returns String no formato esperado por progressbar
 * 
 * @example
 * formatPercentageForProgress(92)  // '92'
 */
export function formatPercentageForProgress(value: number): string {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0';
  }

  const clampedValue = Math.min(100, Math.max(0, value));
  return Math.round(clampedValue).toString();
}
