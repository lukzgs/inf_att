import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useClasses, type Class } from './useClasses';
import { useLessons } from './useLessons';

/**
 * Interface estendida de turma com estatísticas para professor
 */
export interface ProfessorClassWithStats extends Class {
  /** Número total de alunos matriculados */
  totalStudents: number;
  /** Número de aulas realizadas */
  totalLessons: number;
  /** Número de aulas abertas (em andamento) */
  openLessons: number;
  /** Aula mais recente */
  lastLesson?: {
    id: number;
    date: string;
    description?: string;
    isOpen: boolean;
  };
}

/**
 * Estatísticas gerais do professor
 */
export interface ProfessorOverallStats {
  /** Total de turmas que leciona */
  totalClasses: number;
  /** Total de alunos (soma de todas as turmas) */
  totalStudents: number;
  /** Total de aulas realizadas */
  totalLessons: number;
  /** Aulas abertas no momento */
  openLessons: number;
}

/**
 * Hook para buscar turmas (disciplinas) do professor logado
 * 
 * Features:
 * - Filtra apenas turmas onde o usuário tem role=TEACHER
 * - Calcula estatísticas básicas para cada turma
 * - Retorna informações sobre alunos e aulas
 * - Ordena por código da turma
 * 
 * @returns Query object com array de ProfessorClassWithStats
 * 
 * @example
 * ```tsx
 * const { data: classes, isLoading } = useProfessorClasses();
 * 
 * classes?.map(cls => (
 *   <div key={cls.id}>
 *     <h3>{cls.subject?.name}</h3>
 *     <p>{cls.totalStudents} alunos</p>
 *     <p>{cls.totalLessons} aulas</p>
 *   </div>
 * ))
 * ```
 */
export const useProfessorClasses = () => {
  const { user } = useAuth();
  const { data: allClasses, isLoading: isLoadingClasses } = useClasses();
  const { data: allLessons, isLoading: isLoadingLessons } = useLessons();

  return useQuery<ProfessorClassWithStats[], Error>({
    queryKey: ['professor-classes', user?.id],
    queryFn: async () => {
      if (!user || !allClasses) {
        return [];
      }

      // Filtrar apenas turmas onde o usuário é professor
      const professorClasses = allClasses.filter(cls => 
        cls.users?.some(uc => uc.userId === user.id && uc.role === 'TEACHER')
      );

      // Mapear turmas com estatísticas
      const classesWithStats: ProfessorClassWithStats[] = professorClasses.map(cls => {
        // Contar alunos (role=STUDENT)
        const totalStudents = cls.users?.filter(uc => uc.role === 'STUDENT').length || 0;

        // Buscar aulas desta turma
        const classLessons = allLessons?.filter(lesson => lesson.classId === cls.id) || [];
        const totalLessons = classLessons.length;
        const openLessons = classLessons.filter(lesson => lesson.isOpen).length;

        // Encontrar aula mais recente
        const sortedLessons = [...classLessons].sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        const lastLesson = sortedLessons[0] ? {
          id: sortedLessons[0].id,
          date: sortedLessons[0].date,
          description: sortedLessons[0].description,
          isOpen: sortedLessons[0].isOpen,
        } : undefined;

        return {
          ...cls,
          totalStudents,
          totalLessons,
          openLessons,
          lastLesson,
        };
      });

      // Ordenar por código da turma
      classesWithStats.sort((a, b) => a.code.localeCompare(b.code));

      return classesWithStats;
    },
    enabled: !!user && !!allClasses && !isLoadingClasses && !isLoadingLessons,
  });
};

/**
 * Hook para obter estatísticas gerais do professor
 * 
 * Calcula totais agregados de todas as turmas do professor
 * 
 * @returns Estatísticas gerais
 * 
 * @example
 * ```tsx
 * const { totalClasses, totalStudents, totalLessons } = useProfessorOverallStats();
 * ```
 */
export const useProfessorOverallStats = (): ProfessorOverallStats => {
  const { data: classes } = useProfessorClasses();

  const stats: ProfessorOverallStats = {
    totalClasses: 0,
    totalStudents: 0,
    totalLessons: 0,
    openLessons: 0,
  };

  if (!classes || classes.length === 0) {
    return stats;
  }

  stats.totalClasses = classes.length;
  stats.totalStudents = classes.reduce((sum, cls) => sum + cls.totalStudents, 0);
  stats.totalLessons = classes.reduce((sum, cls) => sum + cls.totalLessons, 0);
  stats.openLessons = classes.reduce((sum, cls) => sum + cls.openLessons, 0);

  return stats;
};
