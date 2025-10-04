import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useClasses, type Class } from './useClasses';
import { useAttendances } from './useAttendances';
import { calculateFrequency } from '@/utils/attendance/calculateFrequency';
import { getFrequencyStatus } from '@/utils/attendance/getFrequencyStatus';
import { isApprovedByFrequency } from '@/utils/attendance/calculateFrequency';

/**
 * Interface estendida de turma com estatísticas de frequência
 */
export interface StudentClassWithStats extends Class {
  /** Número total de aulas */
  totalLessons: number;
  /** Número de presenças */
  totalPresent: number;
  /** Porcentagem de frequência (0-100) */
  attendancePercentage: number;
  /** Status da frequência: success | warning | error */
  frequencyStatus: 'success' | 'warning' | 'error';
  /** Se está aprovado por frequência (≥75%) */
  isApproved: boolean;
}

/**
 * Hook para buscar turmas (disciplinas) do aluno logado
 * 
 * Features:
 * - Filtra apenas turmas onde o usuário tem role=STUDENT
 * - Calcula estatísticas de frequência para cada disciplina
 * - Ordena por frequência (menor primeiro) para destacar disciplinas críticas
 * - Retorna dados prontos para uso no dashboard
 * 
 * @returns Query object com array de StudentClassWithStats
 * 
 * @example
 * ```tsx
 * const { data: classes, isLoading } = useStudentClasses();
 * 
 * classes?.map(cls => (
 *   <div key={cls.id}>
 *     <h3>{cls.subject?.name}</h3>
 *     <p>Frequência: {cls.attendancePercentage}%</p>
 *     <Badge type={cls.frequencyStatus} />
 *   </div>
 * ))
 * ```
 */
export const useStudentClasses = () => {
  const { user } = useAuth();
  const { data: allClasses, isLoading: isLoadingClasses } = useClasses();
  const { data: allAttendances, isLoading: isLoadingAttendances } = useAttendances();

  return useQuery<StudentClassWithStats[], Error>({
    queryKey: ['student-classes', user?.id],
    queryFn: async () => {
      if (!user || !allClasses) {
        return [];
      }

      // Filtrar apenas turmas onde o usuário é aluno
      const studentClasses = allClasses.filter(cls => 
        cls.users?.some(u => u.userId === user.id && u.role === 'STUDENT')
      );

      // Calcular estatísticas de frequência para cada turma
      const classesWithStats: StudentClassWithStats[] = studentClasses.map(cls => {
        // Filtrar presenças desta turma
        const classAttendances = allAttendances?.filter(att => 
          att.lesson?.class.id === cls.id && att.userId === user.id
        ) || [];

        // Contar total de aulas da turma
        const totalLessons = classAttendances.length;
        const totalPresent = classAttendances.filter(att => att.isPresent === true).length;

        // Calcular porcentagem e status
        const percentage = calculateFrequency(totalPresent, totalLessons);
        const status = getFrequencyStatus(percentage);
        const isApproved = isApprovedByFrequency(totalPresent, totalLessons);

        return {
          ...cls,
          totalLessons,
          totalPresent,
          attendancePercentage: percentage,
          frequencyStatus: status,
          isApproved,
        };
      });

      // Ordenar por frequência (menor primeiro) - disciplinas críticas no topo
      return classesWithStats.sort((a, b) => 
        a.attendancePercentage - b.attendancePercentage
      );
    },
    enabled: !!user && !!allClasses && !isLoadingClasses && !isLoadingAttendances,
    staleTime: 1000 * 60 * 5, // Cache por 5 minutos
  });
};

/**
 * Hook para buscar estatísticas gerais de frequência do aluno
 * 
 * Calcula a frequência média de todas as disciplinas
 * 
 * @returns Objeto com estatísticas gerais
 * 
 * @example
 * ```tsx
 * const { overallPercentage, totalClasses } = useStudentOverallStats();
 * ```
 */
export const useStudentOverallStats = () => {
  const { data: classes } = useStudentClasses();

  const stats = {
    totalClasses: classes?.length || 0,
    overallPercentage: 0,
    totalPresent: 0,
    totalLessons: 0,
  };

  if (!classes || classes.length === 0) {
    return stats;
  }

  // Somar todas as presenças e aulas
  stats.totalPresent = classes.reduce((sum, cls) => sum + cls.totalPresent, 0);
  stats.totalLessons = classes.reduce((sum, cls) => sum + cls.totalLessons, 0);

  // Calcular porcentagem geral
  if (stats.totalLessons > 0) {
    stats.overallPercentage = Math.round((stats.totalPresent / stats.totalLessons) * 100);
  }

  return stats;
};
