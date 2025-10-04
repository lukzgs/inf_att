/**
 * Verifica se a data atual está dentro de uma janela de tempo
 * 
 * @param startDate - Data de início da janela
 * @param endDate - Data de fim da janela
 * @param currentDate - Data atual (opcional, usa Date.now() por padrão)
 * @returns true se está dentro da janela, false caso contrário
 * 
 * @example
 * const start = new Date('2025-10-03T10:00:00')
 * const end = new Date('2025-10-03T10:20:00')
 * isWithinTimeWindow(start, end)  // true se entre 10:00 e 10:20
 */
export function isWithinTimeWindow(
  startDate: Date | string | number,
  endDate: Date | string | number,
  currentDate: Date | string | number = new Date()
): boolean {
  const start = typeof startDate === 'string' || typeof startDate === 'number'
    ? new Date(startDate)
    : startDate;

  const end = typeof endDate === 'string' || typeof endDate === 'number'
    ? new Date(endDate)
    : endDate;

  const current = typeof currentDate === 'string' || typeof currentDate === 'number'
    ? new Date(currentDate)
    : currentDate;

  if (isNaN(start.getTime()) || isNaN(end.getTime()) || isNaN(current.getTime())) {
    console.warn('isWithinTimeWindow: data inválida', { start: startDate, end: endDate, current: currentDate });
    return false;
  }

  const currentTime = current.getTime();
  const startTime = start.getTime();
  const endTime = end.getTime();

  return currentTime >= startTime && currentTime <= endTime;
}

/**
 * Verifica se ainda está no período de registro de presença
 * (Ex: aula iniciou há menos de 20 minutos)
 * 
 * @param lessonStartDate - Data de início da aula
 * @param windowMinutes - Janela de tempo em minutos (padrão: 20)
 * @returns true se ainda pode registrar presença
 * 
 * @example
 * const lessonStart = new Date('2025-10-03T10:00:00')
 * // Se agora são 10:15
 * canRegisterAttendance(lessonStart)  // true (dentro de 20 min)
 * // Se agora são 10:25
 * canRegisterAttendance(lessonStart)  // false (passou de 20 min)
 */
export function canRegisterAttendance(
  lessonStartDate: Date | string | number,
  windowMinutes: number = 20
): boolean {
  const start = typeof lessonStartDate === 'string' || typeof lessonStartDate === 'number'
    ? new Date(lessonStartDate)
    : lessonStartDate;

  if (isNaN(start.getTime())) {
    return false;
  }

  const end = new Date(start.getTime() + windowMinutes * 60 * 1000);
  return isWithinTimeWindow(start, end);
}

/**
 * Calcula a data de fim da janela de registro
 * 
 * @param startDate - Data de início
 * @param windowMinutes - Janela de tempo em minutos (padrão: 20)
 * @returns Data de fim da janela
 * 
 * @example
 * const start = new Date('2025-10-03T10:00:00')
 * getWindowEndDate(start, 20)  // 2025-10-03T10:20:00
 */
export function getWindowEndDate(
  startDate: Date | string | number,
  windowMinutes: number = 20
): Date {
  const start = typeof startDate === 'string' || typeof startDate === 'number'
    ? new Date(startDate)
    : startDate;

  if (isNaN(start.getTime())) {
    return new Date(NaN);
  }

  return new Date(start.getTime() + windowMinutes * 60 * 1000);
}

/**
 * Verifica se uma data é futura (ainda não aconteceu)
 * 
 * @param date - Data a verificar
 * @returns true se é futura
 * 
 * @example
 * isFutureDate(new Date('2026-01-01'))  // true
 * isFutureDate(new Date('2020-01-01'))  // false
 */
export function isFutureDate(date: Date | string | number): boolean {
  const targetDate = typeof date === 'string' || typeof date === 'number'
    ? new Date(date)
    : date;

  if (isNaN(targetDate.getTime())) {
    return false;
  }

  return targetDate.getTime() > Date.now();
}

/**
 * Verifica se uma data é passada (já aconteceu)
 * 
 * @param date - Data a verificar
 * @returns true se é passada
 * 
 * @example
 * isPastDate(new Date('2020-01-01'))  // true
 * isPastDate(new Date('2026-01-01'))  // false
 */
export function isPastDate(date: Date | string | number): boolean {
  const targetDate = typeof date === 'string' || typeof date === 'number'
    ? new Date(date)
    : date;

  if (isNaN(targetDate.getTime())) {
    return false;
  }

  return targetDate.getTime() < Date.now();
}

/**
 * Verifica se uma data é hoje
 * 
 * @param date - Data a verificar
 * @returns true se é hoje
 * 
 * @example
 * isToday(new Date())  // true
 * isToday(new Date('2024-01-01'))  // false
 */
export function isToday(date: Date | string | number): boolean {
  const targetDate = typeof date === 'string' || typeof date === 'number'
    ? new Date(date)
    : date;

  if (isNaN(targetDate.getTime())) {
    return false;
  }

  const now = new Date();
  return (
    targetDate.getDate() === now.getDate() &&
    targetDate.getMonth() === now.getMonth() &&
    targetDate.getFullYear() === now.getFullYear()
  );
}

/**
 * Adiciona minutos a uma data
 * 
 * @param date - Data base
 * @param minutes - Minutos a adicionar
 * @returns Nova data
 * 
 * @example
 * addMinutes(new Date('2025-10-03T10:00:00'), 20)  // 2025-10-03T10:20:00
 */
export function addMinutes(date: Date | string | number, minutes: number): Date {
  const baseDate = typeof date === 'string' || typeof date === 'number'
    ? new Date(date)
    : date;

  if (isNaN(baseDate.getTime())) {
    return new Date(NaN);
  }

  return new Date(baseDate.getTime() + minutes * 60 * 1000);
}
