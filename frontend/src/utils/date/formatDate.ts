/**
 * Formata uma data para string legível
 * 
 * @param date - Data (Date object, string ISO, ou timestamp)
 * @param options - Opções de formatação Intl.DateTimeFormat
 * @returns String formatada
 * 
 * @example
 * formatDate(new Date('2025-10-03'))  // '03/10/2025'
 * formatDate('2025-10-03T10:30:00')   // '03/10/2025'
 * formatDate(1727952600000)           // '03/10/2025'
 */
export function formatDate(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }
): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date;

  if (isNaN(dateObj.getTime())) {
    console.warn('formatDate: data inválida', date);
    return 'Data inválida';
  }

  return new Intl.DateTimeFormat('pt-BR', options).format(dateObj);
}

/**
 * Formata data e hora
 * 
 * @param date - Data (Date object, string ISO, ou timestamp)
 * @returns String formatada com data e hora
 * 
 * @example
 * formatDateTime(new Date('2025-10-03T10:30:00'))  // '03/10/2025 às 10:30'
 */
export function formatDateTime(date: Date | string | number): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date;

  if (isNaN(dateObj.getTime())) {
    return 'Data inválida';
  }

  const dateStr = formatDate(dateObj);
  const time = dateObj.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return `${dateStr} às ${time}`;
}

/**
 * Formata apenas a hora
 * 
 * @param date - Data (Date object, string ISO, ou timestamp)
 * @returns String formatada apenas com hora
 * 
 * @example
 * formatTime(new Date('2025-10-03T10:30:00'))  // '10:30'
 */
export function formatTime(date: Date | string | number): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date;

  if (isNaN(dateObj.getTime())) {
    return 'Hora inválida';
  }

  return dateObj.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Formata data de forma relativa (hoje, ontem, etc)
 * 
 * @param date - Data (Date object, string ISO, ou timestamp)
 * @returns String formatada de forma relativa
 * 
 * @example
 * formatRelativeDate(new Date())                    // 'Hoje'
 * formatRelativeDate(new Date() - 86400000)         // 'Ontem'
 * formatRelativeDate(new Date('2025-10-01'))        // '01/10/2025'
 */
export function formatRelativeDate(date: Date | string | number): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date;

  if (isNaN(dateObj.getTime())) {
    return 'Data inválida';
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDate = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
  
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Hoje';
  if (diffDays === 1) return 'Amanhã';
  if (diffDays === -1) return 'Ontem';
  if (diffDays > 1 && diffDays <= 7) return `Em ${diffDays} dias`;
  if (diffDays < -1 && diffDays >= -7) return `Há ${Math.abs(diffDays)} dias`;

  return formatDate(dateObj);
}

/**
 * Formata data de forma completa para exibição
 * 
 * @param date - Data (Date object, string ISO, ou timestamp)
 * @returns String formatada completa
 * 
 * @example
 * formatFullDate(new Date('2025-10-03'))  // 'Quinta-feira, 3 de outubro de 2025'
 */
export function formatFullDate(date: Date | string | number): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date;

  if (isNaN(dateObj.getTime())) {
    return 'Data inválida';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(dateObj);
}

/**
 * Formata data para formato ISO (YYYY-MM-DD)
 * 
 * @param date - Data (Date object)
 * @returns String no formato ISO
 * 
 * @example
 * formatISODate(new Date('2025-10-03T10:30:00'))  // '2025-10-03'
 */
export function formatISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

/**
 * Formata dia da semana abreviado
 * 
 * @param date - Data (Date object, string ISO, ou timestamp)
 * @returns Dia da semana abreviado
 * 
 * @example
 * formatWeekday(new Date('2025-10-03'))  // 'Qui'
 */
export function formatWeekday(date: Date | string | number): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date;

  if (isNaN(dateObj.getTime())) {
    return 'Inválido';
  }

  return new Intl.DateTimeFormat('pt-BR', { weekday: 'short' }).format(dateObj);
}
