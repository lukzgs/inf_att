/**
 * Funções de utilidade para manipular timezones consistentemente
 * Sistema usa sempre UTC no backend/database
 * Frontend exibe em horário de Brasília (America/Sao_Paulo)
 */

const TIMEZONE = 'America/Sao_Paulo'; // Brasília
const TIMEZONE_OFFSET = -3 * 60 * 60 * 1000; // -03:00

/**
 * Converte uma data/hora local (Brasília) para UTC
 * @param date Data/hora no horário local (Brasília)
 * @returns Data/hora em UTC
 */
export function toUTC(date: Date): Date {
  // Pega a diferença entre o horário local do navegador e o horário que deveria ser em Brasília
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const brasíliaDate = new Date(
    parseInt(parts.find(p => p.type === 'year')?.value || '0', 10),
    parseInt(parts.find(p => p.type === 'month')?.value || '1', 10) - 1,
    parseInt(parts.find(p => p.type === 'day')?.value || '1', 10),
    parseInt(parts.find(p => p.type === 'hour')?.value || '0', 10),
    parseInt(parts.find(p => p.type === 'minute')?.value || '0', 10),
    parseInt(parts.find(p => p.type === 'second')?.value || '0', 10)
  );

  // Calcula a diferença e ajusta para UTC
  const localDate = new Date(date);
  const timezoneOffset = localDate.getTimezoneOffset() * 60 * 1000;
  const brasíliaOffset = -3 * 60 * 60 * 1000; // -03:00
  
  return new Date(brasíliaDate.getTime() - brasíliaOffset + timezoneOffset);
}

/**
 * Converte UTC para horário local de Brasília
 * @param utcDate Data/hora em UTC
 * @returns Data/hora formatada em Brasília
 */
export function fromUTC(utcDate: Date): Date {
  return new Date(utcDate.getTime() + TIMEZONE_OFFSET);
}

/**
 * Extrai hora HH:mm:ss de uma data local (Brasília) convertendo para UTC
 */
export function formatTimeToUTC(date: Date): string {
  const utcDate = toUTC(date);
  const hours = String(utcDate.getUTCHours()).padStart(2, '0');
  const minutes = String(utcDate.getUTCMinutes()).padStart(2, '0');
  const seconds = String(utcDate.getUTCSeconds()).padStart(2, '0');
  
  return `${hours}:${minutes}:${seconds}`;
}

/**
 * Formata data local para YYYY-MM-DD em UTC
 */
export function formatDateToUTC(date: Date): string {
  const utcDate = toUTC(date);
  const year = utcDate.getUTCFullYear();
  const month = String(utcDate.getUTCMonth() + 1).padStart(2, '0');
  const day = String(utcDate.getUTCDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}T00:00:00.000Z`;
}

/**
 * Extrai HH:mm de uma data em formato local para exibição
 */
export function formatTimeForDisplay(date: Date | string | undefined): string {
  if (!date) return '00:00';
  
  if (typeof date === 'string') {
    const timeMatch = date.match(/(\d{2}):(\d{2})/);
    return timeMatch ? `${timeMatch[1]}:${timeMatch[2]}` : '00:00';
  }
  
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${hours}:${minutes}`;
}
