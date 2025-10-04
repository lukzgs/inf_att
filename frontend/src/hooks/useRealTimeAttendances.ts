import { useQuery } from '@tanstack/react-query';
import { useAttendancesByLesson } from './useAttendances';

/**
 * Hook para buscar presenças de uma aula em tempo real
 * 
 * Utiliza polling automático a cada 3 segundos para atualizar
 * a lista de alunos que marcaram presença.
 * 
 * Features:
 * - Refetch automático a cada 3 segundos
 * - Filtra apenas presenças da aula específica
 * - Ordena por timestamp (mais recentes primeiro)
 * - Retorna informações do aluno (nome, email)
 * 
 * @param lessonId - ID da aula para monitorar
 * @param enabled - Se o polling está ativo (default: true)
 * 
 * @example
 * ```tsx
 * const { data: attendances, isLoading } = useRealTimeAttendances(123);
 * 
 * attendances?.map(att => (
 *   <div key={att.userId}>
 *     {att.user?.name} - {att.timestamp}
 *   </div>
 * ))
 * ```
 */
export const useRealTimeAttendances = (lessonId: number, enabled: boolean = true) => {
  const { data: attendances } = useAttendancesByLesson(lessonId);

  return useQuery({
    queryKey: ['real-time-attendances', lessonId],
    queryFn: async () => {
      if (!attendances) return [];

      // Filtrar apenas presenças registradas (isPresent = true)
      const presentAttendances = attendances.filter(
        att => att.isPresent === true
      );

      // Ordenar por createdAt (mais recentes primeiro)
      const sorted = [...presentAttendances].sort((a, b) => {
        const timeA = new Date(a.createdAt || 0).getTime();
        const timeB = new Date(b.createdAt || 0).getTime();
        return timeB - timeA;
      });

      return sorted;
    },
    // Polling a cada 3 segundos
    refetchInterval: enabled ? 3000 : false,
    // Refetch quando a janela recebe foco
    refetchOnWindowFocus: true,
    // Manter dados anteriores enquanto busca novos
    placeholderData: (previousData) => previousData,
    enabled: enabled && !!attendances,
  });
};

/**
 * Estatísticas de presença em tempo real
 */
export interface RealTimeAttendanceStats {
  /** Total de alunos presentes */
  totalPresent: number;
  /** Total de alunos matriculados */
  totalStudents: number;
  /** Percentual de presença */
  percentagePresent: number;
  /** Última atualização (timestamp) */
  lastUpdate: Date;
}

/**
 * Hook para obter estatísticas de presença em tempo real
 * 
 * @param lessonId - ID da aula
 * @param totalStudents - Total de alunos matriculados na turma
 * @param enabled - Se o polling está ativo
 * 
 * @example
 * ```tsx
 * const stats = useRealTimeAttendanceStats(123, 45);
 * 
 * console.log(`${stats.totalPresent}/${stats.totalStudents} presentes`);
 * console.log(`${stats.percentagePresent}% da turma`);
 * ```
 */
export const useRealTimeAttendanceStats = (
  lessonId: number,
  totalStudents: number,
  enabled: boolean = true
): RealTimeAttendanceStats => {
  const { data: attendances } = useRealTimeAttendances(lessonId, enabled);

  const totalPresent = attendances?.length || 0;
  const percentagePresent = totalStudents > 0
    ? Math.round((totalPresent / totalStudents) * 100)
    : 0;

  return {
    totalPresent,
    totalStudents,
    percentagePresent,
    lastUpdate: new Date(),
  };
};
