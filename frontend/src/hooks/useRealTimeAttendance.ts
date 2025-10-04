import { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

/**
 * Interface para presença em tempo real
 */
export interface RealtimeAttendance {
  /** ID da presença */
  id: string;
  /** ID do aluno */
  studentId: string;
  /** Nome do aluno */
  studentName: string;
  /** Se está presente */
  isPresent: boolean;
  /** Timestamp da marcação */
  timestamp: Date;
}

/**
 * Interface para estatísticas de aula em tempo real
 */
export interface RealtimeLessonStats {
  /** Total de alunos na disciplina */
  totalStudents: number;
  /** Alunos presentes */
  presentCount: number;
  /** Alunos ausentes */
  absentCount: number;
  /** Porcentagem de presença */
  attendancePercentage: number;
  /** Lista de presenças */
  attendances: RealtimeAttendance[];
  /** Se está carregando */
  isLoading: boolean;
  /** Se houve erro */
  error: Error | null;
  /** Última atualização */
  lastUpdate: Date | null;
}

/**
 * Hook para monitorar presenças em tempo real (para professores)
 * 
 * Faz polling a cada X segundos para buscar novas presenças
 * 
 * @param lessonId - ID da aula
 * @param options - Opções de configuração
 * @returns Estatísticas em tempo real
 * 
 * @example
 * ```tsx
 * function ProfessorLessonView({ lessonId }) {
 *   const { 
 *     presentCount, 
 *     totalStudents, 
 *     attendancePercentage,
 *     attendances 
 *   } = useRealTimeAttendance(lessonId);
 * 
 *   return (
 *     <div>
 *       <h2>Presenças: {presentCount}/{totalStudents} ({attendancePercentage}%)</h2>
 *       <ul>
 *         {attendances.map(att => (
 *           <li key={att.id}>
 *             {att.studentName} - {att.isPresent ? '✅' : '❌'}
 *           </li>
 *         ))}
 *       </ul>
 *     </div>
 *   );
 * }
 * ```
 */
export function useRealTimeAttendance(
  lessonId: string | null,
  options: {
    /** Intervalo de atualização em ms (padrão: 5000 = 5s) */
    pollingInterval?: number;
    /** Se deve fazer polling automático */
    enablePolling?: boolean;
  } = {}
): RealtimeLessonStats {
  const { pollingInterval = 5000, enablePolling = true } = options;
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Query para buscar presenças
  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['attendances', lessonId],
    queryFn: async () => {
      if (!lessonId) return null;
      
      // TODO: Substituir por chamada real à API
      // const response = await api.get(`/lessons/${lessonId}/attendances`);
      // return response.data;
      
      // Mock data para desenvolvimento
      return {
        totalStudents: 30,
        attendances: [
          {
            id: '1',
            studentId: '1',
            studentName: 'João Silva',
            isPresent: true,
            timestamp: new Date(),
          },
          {
            id: '2',
            studentId: '2',
            studentName: 'Maria Santos',
            isPresent: true,
            timestamp: new Date(),
          },
        ],
      };
    },
    enabled: !!lessonId,
    refetchInterval: enablePolling ? pollingInterval : false,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  // Atualiza timestamp quando data muda
  useEffect(() => {
    if (data) {
      setLastUpdate(new Date());
    }
  }, [data]);

  // Calcula estatísticas
  const stats = useMemo(() => {
    if (!data) {
      return {
        totalStudents: 0,
        presentCount: 0,
        absentCount: 0,
        attendancePercentage: 0,
        attendances: [],
      };
    }

    const presentCount = data.attendances.filter((att: RealtimeAttendance) => att.isPresent).length;
    const absentCount = data.totalStudents - presentCount;
    const attendancePercentage = data.totalStudents > 0
      ? Math.round((presentCount / data.totalStudents) * 100)
      : 0;

    return {
      totalStudents: data.totalStudents,
      presentCount,
      absentCount,
      attendancePercentage,
      attendances: data.attendances,
    };
  }, [data]);

  return {
    ...stats,
    isLoading,
    error: error as Error | null,
    lastUpdate,
  };
}

/**
 * Hook para escutar evento de nova presença (via WebSocket)
 * 
 * @param lessonId - ID da aula
 * @param onNewAttendance - Callback quando nova presença é registrada
 * 
 * @example
 * ```tsx
 * function ProfessorLessonView({ lessonId }) {
 *   useAttendanceListener(lessonId, (attendance) => {
 *     toast.success(`${attendance.studentName} marcou presença!`);
 *   });
 * 
 *   return <div>...</div>;
 * }
 * ```
 */
export function useAttendanceListener(
  lessonId: string | null,
  onNewAttendance: (attendance: RealtimeAttendance) => void
) {
  useEffect(() => {
    if (!lessonId) return;

    // TODO: Implementar WebSocket connection
    // const socket = io(`${API_URL}/lessons/${lessonId}`);
    // 
    // socket.on('new-attendance', (attendance: RealtimeAttendance) => {
    //   onNewAttendance(attendance);
    // });
    // 
    // return () => {
    //   socket.disconnect();
    // };

    console.log('WebSocket listener ativado para aula:', lessonId);
    
    // Cleanup
    return () => {
      console.log('WebSocket listener desativado');
    };
  }, [lessonId, onNewAttendance]);
}

/**
 * Hook para gerenciar contador de presença
 * 
 * @param initialCount - Contagem inicial
 * @returns Contador e funções de controle
 * 
 * @example
 * ```tsx
 * function AttendanceCounter() {
 *   const { count, increment, decrement, reset } = useAttendanceCounter(0);
 * 
 *   return (
 *     <div>
 *       <p>Presenças: {count}</p>
 *       <button onClick={increment}>+1</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useAttendanceCounter(initialCount: number = 0) {
  const [count, setCount] = useState(initialCount);

  const increment = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);

  const decrement = useCallback(() => {
    setCount(prev => Math.max(0, prev - 1));
  }, []);

  const reset = useCallback(() => {
    setCount(initialCount);
  }, [initialCount]);

  const setValue = useCallback((value: number) => {
    setCount(Math.max(0, value));
  }, []);

  return {
    count,
    increment,
    decrement,
    reset,
    setValue,
  };
}
