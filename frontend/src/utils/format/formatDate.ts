/**
 * Utilitários para formatação de datas
 * Tratam corretamente o problema de timezone do navegador
 */

/**
 * Formata uma data ISO string para formato local sem conversão de timezone
 * @param dateStr - String com data ISO (ex: "2025-10-20T00:00:00.000Z" ou "2025-10-20")
 * @param options - Opções de formatação (pt-BR por padrão)
 * @returns String formatada (ex: "20 de out")
 */
export const formatDateLocal = (dateStr: string, options?: Intl.DateTimeFormatOptions): string => {
  try {
    if (!dateStr) return '';

    let dateToFormat: Date;

    if (dateStr.includes('T')) {
      // ISO datetime string - extrai apenas a data sem converter timezone
      const datePart = dateStr.split('T')[0]; // "2025-10-20"
      const [year, month, day] = datePart.split('-').map(Number);
      // Cria nova data tratando como LOCAL, não UTC
      dateToFormat = new Date(year, month - 1, day);
    } else if (dateStr.includes('-')) {
      // YYYY-MM-DD format
      const [year, month, day] = dateStr.split('-').map(Number);
      dateToFormat = new Date(year, month - 1, day);
    } else {
      // Fallback para ISO parse padrão
      dateToFormat = new Date(dateStr);
    }

    const defaultOptions: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      ...options,
    };

    return dateToFormat
      .toLocaleDateString('pt-BR', defaultOptions)
      .replace(' de ', ' ');
  } catch (error) {
    console.error('Erro ao formatar data:', dateStr, error);
    return dateStr;
  }
};

/**
 * Formata uma data ISO string para o formato completo pt-BR
 * @param dateStr - String com data ISO
 * @returns String formatada (ex: "20/10/2025")
 */
export const formatDateBR = (dateStr: string): string => {
  try {
    if (!dateStr) return '';

    let dateToFormat: Date;

    if (dateStr.includes('T')) {
      const datePart = dateStr.split('T')[0];
      const [year, month, day] = datePart.split('-').map(Number);
      dateToFormat = new Date(year, month - 1, day);
    } else if (dateStr.includes('-')) {
      const [year, month, day] = dateStr.split('-').map(Number);
      dateToFormat = new Date(year, month - 1, day);
    } else {
      dateToFormat = new Date(dateStr);
    }

    return dateToFormat.toLocaleDateString('pt-BR');
  } catch (error) {
    console.error('Erro ao formatar data:', dateStr, error);
    return dateStr;
  }
};

/**
 * Formata uma data para o formato "20 out" (curto, sem ano)
 * @param dateStr - String com data ISO
 * @returns String formatada (ex: "20 out")
 */
export const formatDateShort = (dateStr: string): string => {
  return formatDateLocal(dateStr, { month: 'short', day: 'numeric' });
};
