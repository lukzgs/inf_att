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

/**
 * Formata distância de tempo até agora (ex: "há 5 minutos")
 * 
 * @param date - Data (Date object, string ISO, ou timestamp)
 * @returns String formatada com distância até agora
 * 
 * @example
 * formatDistanceToNow(new Date(Date.now() - 60000))        // 'há 1 minuto'
 * formatDistanceToNow(new Date(Date.now() - 3600000))      // 'há 1 hora'
 * formatDistanceToNow(new Date(Date.now() - 86400000))     // 'há 1 dia'
 */
export function formatDistanceToNow(date: Date | string | number): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date;

  if (isNaN(dateObj.getTime())) {
    return 'Data inválida';
  }

  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'agora mesmo';
  if (diffMins === 1) return 'há 1 minuto';
  if (diffMins < 60) return `há ${diffMins} minutos`;
  if (diffHours === 1) return 'há 1 hora';
  if (diffHours < 24) return `há ${diffHours} horas`;
  if (diffDays === 1) return 'há 1 dia';
  if (diffDays < 7) return `há ${diffDays} dias`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return weeks === 1 ? 'há 1 semana' : `há ${weeks} semanas`;
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return months === 1 ? 'há 1 mês' : `há ${months} meses`;
  }
  
  const years = Math.floor(diffDays / 365);
  return years === 1 ? 'há 1 ano' : `há ${years} anos`;
}
