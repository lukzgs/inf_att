/**
 * Interface para tempo restante estruturado
 */
export interface TimeRemaining {
  /** Horas restantes */
  hours: number;
  /** Minutos restantes */
  minutes: number;
  /** Segundos restantes */
  seconds: number;
  /** Total em milissegundos */
  totalMs: number;
  /** Se o tempo expirou */
  isExpired: boolean;
}

/**
 * Calcula o tempo restante entre agora e uma data futura
 * 
 * @param targetDate - Data alvo (Date object, string ISO, ou timestamp)
 * @returns Objeto com tempo restante estruturado
 * 
 * @example
 * const target = new Date(Date.now() + 1200000) // +20 min
 * const remaining = getTimeRemaining(target)
 * // remaining = { hours: 0, minutes: 20, seconds: 0, totalMs: 1200000, isExpired: false }
 */
export function getTimeRemaining(targetDate: Date | string | number): TimeRemaining {
  const target = typeof targetDate === 'string' || typeof targetDate === 'number'
    ? new Date(targetDate)
    : targetDate;

  if (isNaN(target.getTime())) {
    console.warn('getTimeRemaining: data inválida', targetDate);
    return {
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalMs: 0,
      isExpired: true,
    };
  }

  const now = new Date();
  const totalMs = target.getTime() - now.getTime();

  // Se já expirou
  if (totalMs <= 0) {
    return {
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalMs: 0,
      isExpired: true,
    };
  }

  // Calcula horas, minutos e segundos
  const hours = Math.floor(totalMs / (1000 * 60 * 60));
  const minutes = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((totalMs % (1000 * 60)) / 1000);

  return {
    hours,
    minutes,
    seconds,
    totalMs,
    isExpired: false,
  };
}

/**
 * Formata tempo restante em string legível
 * 
 * @param targetDate - Data alvo (Date object, string ISO, ou timestamp)
 * @param options - Opções de formatação
 * @returns String formatada
 * 
 * @example
 * formatTimeRemaining(futureDate)  // '18:45'
 * formatTimeRemaining(futureDate, { includeSeconds: true })  // '18:45:30'
 * formatTimeRemaining(pastDate)  // 'Expirado'
 */
export function formatTimeRemaining(
  targetDate: Date | string | number,
  options: { includeSeconds?: boolean; expiredText?: string } = {}
): string {
  const { includeSeconds = false, expiredText = 'Expirado' } = options;
  
  const remaining = getTimeRemaining(targetDate);

  if (remaining.isExpired) {
    return expiredText;
  }

  const { hours, minutes, seconds } = remaining;

  // Formata com padding
  const hoursStr = String(hours).padStart(2, '0');
  const minutesStr = String(minutes).padStart(2, '0');
  const secondsStr = String(seconds).padStart(2, '0');

  if (includeSeconds) {
    return `${hoursStr}:${minutesStr}:${secondsStr}`;
  }

  return `${hoursStr}:${minutesStr}`;
}

/**
 * Formata tempo restante de forma legível (por extenso)
 * 
 * @param targetDate - Data alvo
 * @returns String formatada por extenso
 * 
 * @example
 * formatTimeRemainingVerbose(futureDate)  // '18 minutos e 45 segundos'
 * formatTimeRemainingVerbose(pastDate)    // 'Expirado'
 */
export function formatTimeRemainingVerbose(
  targetDate: Date | string | number
): string {
  const remaining = getTimeRemaining(targetDate);

  if (remaining.isExpired) {
    return 'Expirado';
  }

  const { hours, minutes, seconds } = remaining;
  const parts: string[] = [];

  if (hours > 0) {
    parts.push(`${hours} ${hours === 1 ? 'hora' : 'horas'}`);
  }

  if (minutes > 0) {
    parts.push(`${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`);
  }

  if (seconds > 0 && hours === 0) {
    parts.push(`${seconds} ${seconds === 1 ? 'segundo' : 'segundos'}`);
  }

  if (parts.length === 0) {
    return 'Menos de 1 segundo';
  }

  if (parts.length === 1) {
    return parts[0];
  }

  const last = parts.pop();
  return `${parts.join(', ')} e ${last}`;
}

/**
 * Verifica se o tempo expirou
 * 
 * @param targetDate - Data alvo
 * @returns true se expirou, false caso contrário
 * 
 * @example
 * isTimeExpired(pastDate)    // true
 * isTimeExpired(futureDate)  // false
 */
export function isTimeExpired(targetDate: Date | string | number): boolean {
  const remaining = getTimeRemaining(targetDate);
  return remaining.isExpired;
}

/**
 * Calcula porcentagem de tempo decorrido
 * 
 * @param startDate - Data de início
 * @param endDate - Data de fim
 * @returns Porcentagem (0-100)
 * 
 * @example
 * const start = new Date('2025-10-03T10:00:00')
 * const end = new Date('2025-10-03T10:20:00')  // 20 min depois
 * // Após 10 min
 * getTimeElapsedPercentage(start, end)  // 50
 */
export function getTimeElapsedPercentage(
  startDate: Date | string | number,
  endDate: Date | string | number
): number {
  const start = typeof startDate === 'string' || typeof startDate === 'number'
    ? new Date(startDate)
    : startDate;

  const end = typeof endDate === 'string' || typeof endDate === 'number'
    ? new Date(endDate)
    : endDate;

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return 0;
  }

  const now = new Date();
  const totalDuration = end.getTime() - start.getTime();
  const elapsed = now.getTime() - start.getTime();

  if (totalDuration <= 0) {
    return 100;
  }

  const percentage = (elapsed / totalDuration) * 100;
  return Math.min(100, Math.max(0, Math.round(percentage)));
}
