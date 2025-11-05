/**
 * Calcula o número da aula baseado na data e na lista de aulas
 * 
 * Funcionamento:
 * - Ordena todas as aulas por data (crescente)
 * - Retorna a posição da aula na lista ordenada
 * - Se aulas forem adicionadas fora de ordem, a numeração é recalculada
 * 
 * @param lessonId - ID da aula
 * @param lessons - Lista de todas as aulas
 * @returns Número da aula (começando de 1)
 * 
 * @example
 * const number = getAulaNumber(5, allLessons);
 * // Retorna 3 se a aula 5 é a terceira por ordem de data
 */
export function getAulaNumber(
  lessonId: number,
  lessons: Array<{ id: number; date: string }> | undefined
): number {
  if (!lessons || lessons.length === 0) return 0;

  // Ordenar aulas por data
  const sortedLessons = [...lessons].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateA - dateB;
  });

  // Encontrar posição da aula (1-indexed)
  const position = sortedLessons.findIndex(lesson => lesson.id === lessonId);
  return position >= 0 ? position + 1 : 0;
}

/**
 * Formata o título de uma aula com o número dinâmico e turma
 * 
 * @param lesson - Objeto da aula
 * @param allLessons - Lista de todas as aulas para cálculo do número
 * @returns Título formatado "Aula X - Turma Y" ou "Aula X" se sem turma
 * 
 * @example
 * const title = formatAulaTitle(lesson, allLessons);
 * // Retorna "Aula 1 - Turma A", "Aula 2 - Turma B", etc.
 */
export function formatAulaTitle(
  lesson: { id: number; name?: string | null; date: string; class?: { code: string } },
  allLessons?: Array<{ id: number; date: string }>
): string {
  const aulaNumber = getAulaNumber(lesson.id, allLessons);
  const turma = lesson.class?.code ? ` - Turma ${lesson.class.code}` : '';

  // Se tiver turma, sempre mostra no formato "Aula X - Turma Y"
  if (turma) {
    return `Aula ${aulaNumber}${turma}`;
  }

  // Se tiver nome explícito e turma vazia, usa o nome
  if (lesson.name && lesson.name.trim()) {
    return lesson.name;
  }

  // Fallback
  return `Aula ${aulaNumber || 1}`;
}
