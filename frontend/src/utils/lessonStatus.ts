/**
 * Utilitários para determinar o status de uma aula
 * Usado em múltiplos componentes para manter consistência
 */

export type LessonStatusType = 'scheduled' | 'completed' | 'canceled';

/**
 * Determina o status de uma aula baseado em suas propriedades
 * Espelha a lógica visual do LessonCard
 * 
 * @param lesson - Objeto da aula
 * @returns 'scheduled' | 'completed' | 'canceled'
 */
export const getLessonStatus = (lesson: any): LessonStatusType => {
  if (lesson.isCanceled) {
    return 'canceled';
  }

  // Verificar se a aula já passou (data + endTime < agora)
  const now = new Date();
  try {
    let lessonDate: Date;

    // Extrair componentes da data (YYYY-MM-DD)
    if (lesson.date.includes('T')) {
      // Se for ISO completo, extrair apenas a data
      lessonDate = new Date(lesson.date.split('T')[0] + 'T00:00:00');
    } else {
      // Se for apenas YYYY-MM-DD, parsear manualmente para evitar UTC
      const [year, month, day] = lesson.date.split('-').map(Number);
      lessonDate = new Date(year, month - 1, day, 0, 0, 0, 0);
    }

    // Extrair horário de término
    const endTimeStr = lesson.endTime?.includes('T')
      ? lesson.endTime.split('T')[1].substring(0, 5)
      : lesson.endTime || '00:00';

    const [hours, minutes] = endTimeStr.split(':').map(Number);
    lessonDate.setHours(hours, minutes, 0, 0);

    const isPast = lessonDate < now;

    if (isPast || lesson.closedAt) {
      return 'completed';
    }
  } catch (error) {
    console.error('Erro ao parsear data da aula:', error);
  }

  return 'scheduled';
};

/**
 * Calcula o número sequencial permanente de uma aula dentro de sua turma
 * baseado na ordem cronológica de todas as aulas da turma
 * 
 * @param lesson - A aula em questão
 * @param allLessonsInClass - Todas as aulas da turma (não filtradas)
 * @returns Número sequencial da aula (1-indexed)
 */
export const getLessonNumber = (lesson: any, allLessonsInClass: any[]): number => {
  // Helper para extrair apenas HH:mm do horário
  const extractTime = (timeStr: string): string => {
    if (!timeStr) return '00:00';
    // Se for ISO datetime (1970-01-01THH:mm:ss.000Z), extrai HH:mm
    if (timeStr.includes('T')) {
      return timeStr.split('T')[1].substring(0, 5);
    }
    // Se já for HH:mm, retorna como está
    if (timeStr.length === 5 && timeStr.includes(':')) {
      return timeStr;
    }
    return timeStr.substring(0, 5);
  };

  // Ordenar todas as aulas da turma por data cronológica
  const sortedByDate = [...allLessonsInClass].sort((a, b) => {
    // Extrair data base (sem hora) - parseando manualmente para evitar UTC
    let dateA: Date, dateB: Date;
    
    if (a.date.includes('T')) {
      const [year, month, day] = a.date.split('T')[0].split('-').map(Number);
      dateA = new Date(year, month - 1, day, 0, 0, 0, 0);
    } else {
      const [year, month, day] = a.date.split('-').map(Number);
      dateA = new Date(year, month - 1, day, 0, 0, 0, 0);
    }
    
    if (b.date.includes('T')) {
      const [year, month, day] = b.date.split('T')[0].split('-').map(Number);
      dateB = new Date(year, month - 1, day, 0, 0, 0, 0);
    } else {
      const [year, month, day] = b.date.split('-').map(Number);
      dateB = new Date(year, month - 1, day, 0, 0, 0, 0);
    }
    
    // Extrair horário limpo
    const timeA = extractTime(a.startTime);
    const timeB = extractTime(b.startTime);
    
    // Combinar data + hora
    const [hourA, minA] = timeA.split(':').map(Number);
    const [hourB, minB] = timeB.split(':').map(Number);
    
    dateA.setHours(hourA, minA, 0, 0);
    dateB.setHours(hourB, minB, 0, 0);
    
    return dateA.getTime() - dateB.getTime();
  });

  // Encontrar o índice da aula e retornar como número (1-indexed)
  const index = sortedByDate.findIndex(l => l.id === lesson.id);
  return index >= 0 ? index + 1 : 1;
};

/**
 * Filtra aulas baseado no status desejado
 * 
 * @param lessons - Array de aulas
 * @param filter - Tipo de filtro: 'all' | 'scheduled' | 'completed'
 * @returns Array filtrado de aulas
 */
export const filterLessonsByStatus = (
  lessons: any[],
  filter: 'all' | 'scheduled' | 'completed'
): any[] => {
  if (filter === 'all') {
    return lessons;
  }

  return lessons.filter(lesson => {
    const status = getLessonStatus(lesson);

    if (filter === 'scheduled') {
      return status === 'scheduled';
    } else if (filter === 'completed') {
      return status === 'completed';
    }

    return true;
  });
};
