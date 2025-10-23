import { FiUsers, FiCheckCircle, FiClock } from 'react-icons/fi';
import { useRealTimeAttendances, useRealTimeAttendanceStats } from '@/hooks/useRealTimeAttendances';
import { formatNameToInitials } from '@/utils/format';

interface RealTimeAttendanceListProps {
  /** ID da aula sendo monitorada */
  lessonId: number;
  /** Total de alunos matriculados na turma */
  totalStudents: number;
  /** Se o polling está ativo (default: true) */
  enabled?: boolean;
}

/**
 * RealTimeAttendanceList - Lista de presenças em tempo real
 * 
 * Features:
 * - Polling automático a cada 3 segundos
 * - Exibe alunos que já marcaram presença
 * - Avatares com iniciais do nome
 * - Horário de registro de cada presença
 * - Barra de progresso mostrando % da turma presente
 * - Contador de alunos presentes vs total
 * - Animação suave ao adicionar novos alunos
 * - Empty state quando ninguém marcou presença ainda
 * 
 * @example
 * ```tsx
 * <RealTimeAttendanceList
 *   lessonId={123}
 *   totalStudents={45}
 *   enabled={lessonIsOpen}
 * />
 * ```
 */
export default function RealTimeAttendanceList({
  lessonId,
  totalStudents,
  enabled = true,
}: RealTimeAttendanceListProps) {
  const { data: attendances, isLoading } = useRealTimeAttendances(lessonId, enabled);
  const stats = useRealTimeAttendanceStats(lessonId, totalStudents, enabled);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton-premium h-16 w-full" />
        ))}
      </div>
    );
  }

  const hasAttendances = attendances && attendances.length > 0;

  return (
    <div className="space-y-4">
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FiUsers className="w-5 h-5 text-gray-600 dark:text-base-content" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Presenças Registradas
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary">
            {stats.totalPresent}
          </span>
          <span className="text-gray-600 dark:text-base-content/70">
            / {stats.totalStudents}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-base-content">
            Frequência da Aula
          </span>
          <span className="text-sm font-bold text-primary">
            {stats.percentagePresent}%
          </span>
        </div>
        <div className="relative w-full h-3 bg-gray-200 dark:bg-base-300 rounded-full overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-success to-primary transition-all duration-500 ease-out"
            style={{ width: `${stats.percentagePresent}%` }}
          />
        </div>
      </div>

      {/* Attendances List */}
      <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
        {hasAttendances ? (
          <div className="space-y-2">
            {attendances.map((attendance) => {
              const registeredAt = new Date(attendance.createdAt);
              const timeString = registeredAt.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              });

              return (
                <div
                  key={`${attendance.lessonId}-${attendance.userId}`}
                  className="flex items-center gap-3 p-3 bg-white dark:bg-base-200 rounded-xl border border-gray-200 dark:border-base-300 hover:shadow-md transition-all duration-200 animate-fade-in-up"
                >
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-success to-primary text-white font-bold text-sm flex-shrink-0">
                    {formatNameToInitials(attendance.user?.name || 'N/A')}
                  </div>

                  {/* Student Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {attendance.user?.name || 'Nome não disponível'}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-base-content/70">
                      <FiClock className="w-3 h-3" />
                      <span>{timeString}</span>
                    </div>
                  </div>

                  {/* Status Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                      <FiCheckCircle className="w-5 h-5 text-success" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-base-300 flex items-center justify-center">
              <FiUsers className="w-10 h-10 text-gray-400 dark:text-base-content/50" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Aguardando Registros
            </h4>
            <p className="text-sm text-gray-600 dark:text-base-content/70 max-w-xs mx-auto">
              A lista será atualizada automaticamente a cada 3 segundos quando os alunos começarem a marcar presença
            </p>
          </div>
        )}
      </div>

      {/* Polling Indicator */}
      {enabled && (
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-base-content/60 pt-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
          </span>
          <span>Atualizando a cada 3 segundos</span>
        </div>
      )}
    </div>
  );
}
