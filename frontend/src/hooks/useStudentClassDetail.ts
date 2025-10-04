import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useClass } from './useClasses';
import { useAttendances } from './useAttendances';
import { useLessonsByClass } from './useLessons';
import { calculateFrequency } from '@/utils/attendance/calculateFrequency';
import { getFrequencyStatus } from '@/utils/attendance/getFrequencyStatus';
import { isApprovedByFrequency } from '@/utils/attendance/calculateFrequency';

/**
 * Interface para aula com status de presença do aluno
 */
export interface LessonWithAttendance {
  id: number;
  classId: number;
  date: string;
  startTime: string;
  endTime: string;
  topic?: string;
  description?: string;
  isOpen: boolean;
  openedAt?: string;
  closedAt?: string;
  presenceCode?: string;
  createdAt?: string;
  updatedAt?: string;
  /** Status da presença do aluno nesta aula */
  attendanceStatus: 'present' | 'absent' | 'justified' | 'pending';
  /** ID composto da presença (lessonId-userId) se existir */
  attendanceId?: string;
}

/**
 * Interface para detalhes completos da disciplina do aluno
 */
export interface StudentClassDetail {
  /** ID da turma */
  id: number;
  /** Código da turma */
  code: string;
  /** Ano */
  year: number;
  /** Semestre */
  semester: number;
  /** Informações da disciplina */
  subject?: {
    id: number;
    code: string;
    name: string;
    type: string;
    credits: number;
    workload: number;
  };
  /** Aulas com status de presença */
  lessons: LessonWithAttendance[];
  /** Total de aulas */
  totalLessons: number;
  /** Total de presenças */
  totalPresent: number;
  /** Total de faltas */
  totalAbsent: number;
  /** Porcentagem de frequência */
  attendancePercentage: number;
  /** Status da frequência */
  frequencyStatus: 'success' | 'warning' | 'error';
  /** Se está aprovado por frequência */
  isApproved: boolean;
}

/**
 * Hook para buscar detalhes completos de uma disciplina (turma) do aluno
 * 
 * Features:
 * - Busca informações da turma e disciplina
 * - Lista todas as aulas da turma
 * - Adiciona status de presença do aluno em cada aula
 * - Calcula estatísticas completas de frequência
 * - Ordena aulas por data (mais recente primeiro)
 * 
 * @param classId - ID da turma/disciplina
 * @returns Detalhes completos da disciplina com presenças
 * 
 * @example
 * ```tsx
 * const { data: classDetail, isLoading } = useStudentClassDetail(123);
 * 
 * if (isLoading) return <Spinner />;
 * 
 * return (
 *   <div>
 *     <h1>{classDetail?.subject?.name}</h1>
 *     <p>Frequência: {classDetail?.attendancePercentage}%</p>
 *     {classDetail?.lessons.map(lesson => (
 *       <div key={lesson.id}>
 *         <span>{lesson.topic}</span>
 *         <span>{lesson.attendanceStatus}</span>
 *       </div>
 *     ))}
 *   </div>
 * );
 * ```
 */
export const useStudentClassDetail = (classId?: number) => {
  const { user } = useAuth();
  const { data: classData, isLoading: isLoadingClass } = useClass(classId);
  const { data: lessons, isLoading: isLoadingLessons } = useLessonsByClass(classId);
  const { data: allAttendances, isLoading: isLoadingAttendances } = useAttendances();

  const isLoading = isLoadingClass || isLoadingLessons || isLoadingAttendances;

  const classDetail = useMemo<StudentClassDetail | undefined>(() => {
    if (!user || !classData || !lessons || !allAttendances) {
      return undefined;
    }

    // Filtrar presenças do aluno para esta turma
    const studentAttendances = allAttendances.filter(
      att => att.userId === user.id && att.lesson?.class.id === classId
    );

    // Mapear aulas com status de presença
    const lessonsWithAttendance: LessonWithAttendance[] = lessons.map(lesson => {
      const attendance = studentAttendances.find(att => att.lessonId === lesson.id);
      
      let attendanceStatus: 'present' | 'absent' | 'justified' | 'pending' = 'pending';
      
      if (attendance) {
        if (attendance.isPresent) {
          attendanceStatus = 'present';
        } else if (attendance.justification) {
          attendanceStatus = 'justified';
        } else {
          attendanceStatus = 'absent';
        }
      } else if (lesson.closedAt) {
        // Aula fechada sem presença = falta
        attendanceStatus = 'absent';
      }

      return {
        ...lesson,
        attendanceStatus,
        attendanceId: attendance ? `${attendance.lessonId}-${attendance.userId}` : undefined,
      };
    });

    // Ordenar por data (mais recente primeiro)
    lessonsWithAttendance.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });

    // Calcular estatísticas
    const totalLessons = lessonsWithAttendance.filter(
      l => l.closedAt || l.attendanceStatus !== 'pending'
    ).length;
    const totalPresent = lessonsWithAttendance.filter(
      l => l.attendanceStatus === 'present'
    ).length;
    const totalAbsent = lessonsWithAttendance.filter(
      l => l.attendanceStatus === 'absent'
    ).length;

    const attendancePercentage = calculateFrequency(totalPresent, totalLessons);
    const frequencyStatus = getFrequencyStatus(attendancePercentage);
    const isApproved = isApprovedByFrequency(totalPresent, totalLessons);

    return {
      id: classData.id,
      code: classData.code,
      year: classData.year,
      semester: classData.semester,
      subject: classData.subject,
      lessons: lessonsWithAttendance,
      totalLessons,
      totalPresent,
      totalAbsent,
      attendancePercentage,
      frequencyStatus,
      isApproved,
    };
  }, [user, classData, lessons, allAttendances, classId]);

  return {
    data: classDetail,
    isLoading,
    classData,
    lessons,
  };
};
