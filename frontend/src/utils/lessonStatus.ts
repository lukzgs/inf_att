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

    if (lesson.date.includes('T')) {
      lessonDate = new Date(lesson.date);
    } else {
      lessonDate = new Date(lesson.date + 'T00:00:00');
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
    // Extrair data base (sem hora)
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    
    // Extrair horário limpo
    const timeA = extractTime(a.startTime);
    const timeB = extractTime(b.startTime);
    
    // Combinar data + hora
    const [hourA, minA] = timeA.split(':').map(Number);
    const [hourB, minB] = timeB.split(':').map(Number);
    
    const fullDateA = new Date(dateA);
    fullDateA.setHours(hourA, minA, 0, 0);
    
    const fullDateB = new Date(dateB);
    fullDateB.setHours(hourB, minB, 0, 0);
    
    return fullDateA.getTime() - fullDateB.getTime();
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
