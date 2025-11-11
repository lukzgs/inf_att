/**
 * Utilitário para comparar e ordenar aulas por data e hora
 * Usa timeZone: 'America/Sao_Paulo' para garantir consistência
 */

/**
 * Formata hora para exibição usando o timezone de Brasília
 * Mesma lógica usada em LessonCard.tsx
 */
const formatTime = (timeStr: string): string => {
  if (!timeStr) return '00:00';
  
  // Se for ISO datetime (1970-01-01THH:mm:ss.000Z), extrai HH:mm diretamente
  if (timeStr.includes('T')) {
    const date = new Date(timeStr);
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: 'America/Sao_Paulo'
    });
  }
  
  // Se já for HH:mm, retorna como está
  if (timeStr.length === 5 && timeStr.includes(':')) {
    return timeStr;
  }
  
  // Fallback
  return timeStr.substring(0, 5);
};

/**
 * Compara duas aulas por data e hora de início
 * @param a - Primeira aula
 * @param b - Segunda aula
 * @param ascending - Se true, ordena crescente (mais antiga primeiro); se false, decrescente
 * @returns Número negativo se a < b, positivo se a > b, 0 se iguais
 */
export function compareLessonsByTime(
  a: { date: string; startTime: string },
  b: { date: string; startTime: string },
  ascending = true
): number {
  // Extrair data com tratamento correto
  const dateA = new Date(a.date);
  const yearA = dateA.getUTCFullYear();
  const monthA = dateA.getUTCMonth();
  const dayA = dateA.getUTCDate();
  
  // Extrair hora usando a função formatTime que usa timeZone correto
  const startTimeA = formatTime(a.startTime);
  const [hourA, minA] = startTimeA.split(':').map(Number);
  const dateTimeA = new Date(yearA, monthA, dayA, hourA, minA, 0, 0);
  
  // Mesma lógica para b
  const dateB = new Date(b.date);
  const yearB = dateB.getUTCFullYear();
  const monthB = dateB.getUTCMonth();
  const dayB = dateB.getUTCDate();
  
  const startTimeB = formatTime(b.startTime);
  const [hourB, minB] = startTimeB.split(':').map(Number);
  const dateTimeB = new Date(yearB, monthB, dayB, hourB, minB, 0, 0);
  
  const timeA = dateTimeA.getTime();
  const timeB = dateTimeB.getTime();
  
  if (ascending) {
    return timeA - timeB;
  } else {
    return timeB - timeA;
  }
}
