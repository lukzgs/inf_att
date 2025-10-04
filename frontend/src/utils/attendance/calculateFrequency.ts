/**
 * Calcula a porcentagem de frequência baseada em presenças e total de aulas
 * 
 * @param present - Número de presenças
 * @param total - Total de aulas realizadas
 * @returns Porcentagem de frequência (0-100)
 * 
 * @example
 * calculateFrequency(23, 25) // 92
 * calculateFrequency(0, 0)   // 0 (evita divisão por zero)
 * calculateFrequency(25, 25) // 100
 */
export function calculateFrequency(present: number, total: number): number {
  // Evita divisão por zero
  if (total === 0) {
    return 0;
  }

  // Valida inputs negativos
  if (present < 0 || total < 0) {
    console.warn('calculateFrequency: valores negativos detectados', { present, total });
    return 0;
  }

  // Valida se presente é maior que total
  if (present > total) {
    console.warn('calculateFrequency: presenças maior que total', { present, total });
    return 100;
  }

  // Calcula e arredonda para inteiro
  const percentage = (present / total) * 100;
  return Math.round(percentage);
}

/**
 * Calcula a porcentagem de frequência com precisão decimal
 * 
 * @param present - Número de presenças
 * @param total - Total de aulas realizadas
 * @param decimals - Número de casas decimais (padrão: 2)
 * @returns Porcentagem de frequência com decimais
 * 
 * @example
 * calculateFrequencyPrecise(23, 25)    // 92.00
 * calculateFrequencyPrecise(23, 25, 1) // 92.0
 */
export function calculateFrequencyPrecise(
  present: number,
  total: number,
  decimals: number = 2
): number {
  if (total === 0) {
    return 0;
  }

  if (present < 0 || total < 0) {
    return 0;
  }

  if (present > total) {
    return 100;
  }

  const percentage = (present / total) * 100;
  return Number(percentage.toFixed(decimals));
}

/**
 * Verifica se o aluno está aprovado baseado na frequência mínima
 * 
 * @param present - Número de presenças
 * @param total - Total de aulas realizadas
 * @param minimumPercentage - Porcentagem mínima para aprovação (padrão: 75)
 * @returns true se aprovado, false se reprovado
 * 
 * @example
 * isApprovedByFrequency(23, 25)     // true (92% >= 75%)
 * isApprovedByFrequency(18, 25)     // false (72% < 75%)
 * isApprovedByFrequency(19, 25, 80) // false (76% < 80%)
 */
export function isApprovedByFrequency(
  present: number,
  total: number,
  minimumPercentage: number = 75
): boolean {
  const frequency = calculateFrequency(present, total);
  return frequency >= minimumPercentage;
}

/**
 * Calcula quantas faltas faltam para reprovar
 * 
 * @param present - Número de presenças
 * @param total - Total de aulas realizadas
 * @param minimumPercentage - Porcentagem mínima para aprovação (padrão: 75)
 * @returns Número de faltas permitidas (0 se já reprovou)
 * 
 * @example
 * calculateRemainingAbsences(23, 25)      // 2 (pode faltar mais 2 vezes)
 * calculateRemainingAbsences(18, 25)      // 0 (já reprovou)
 * calculateRemainingAbsences(24, 25, 90)  // 1 (limite mais rigoroso)
 */
export function calculateRemainingAbsences(
  present: number,
  total: number,
  minimumPercentage: number = 75
): number {
  if (total === 0) {
    return 0;
  }

  // Calcula o mínimo de presenças necessárias
  const minimumPresences = Math.ceil((minimumPercentage / 100) * total);

  // Se já reprovou, retorna 0
  if (present < minimumPresences) {
    return 0;
  }

  // Calcula quantas faltas ainda pode ter
  const currentAbsences = total - present;
  const maximumAbsences = total - minimumPresences;
  const remainingAbsences = maximumAbsences - currentAbsences;

  return Math.max(0, remainingAbsences);
}

/**
 * Calcula estatísticas de frequência para uma lista de presenças
 * 
 * @param attendances - Array de { present: boolean } ou similar
 * @returns Objeto com estatísticas
 * 
 * @example
 * const stats = calculateFrequencyStats([
 *   { present: true },
 *   { present: true },
 *   { present: false }
 * ])
 * // stats = { total: 3, present: 2, absent: 1, percentage: 67 }
 */
export function calculateFrequencyStats(attendances: { present: boolean }[]): {
  total: number;
  present: number;
  absent: number;
  percentage: number;
} {
  const total = attendances.length;
  const present = attendances.filter((a) => a.present).length;
  const absent = total - present;
  const percentage = calculateFrequency(present, total);

  return {
    total,
    present,
    absent,
    percentage,
  };
}
