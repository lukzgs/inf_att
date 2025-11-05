import { FiX, FiUser, FiCheck } from 'react-icons/fi';
import { useState } from 'react';
import { api } from '@/services/api';
import { toast } from 'sonner';

interface StudentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  email: string;
  matricula: string;
  totalLessons: number;
  attendances: number;
  absences: number;
  attendanceData?: Array<{ date: string; present: boolean; lesson: string; lessonId?: number; userId?: number }>;
  onAttendanceUpdate?: () => void;
}

/**
 * Modal de Detalhes do Aluno
 * 
 * Exibe informações do aluno em um modal similar ao LessonDetailModal
 * com layout de "Informações do Aluno"
 * 
 * @example
 * ```tsx
 * <StudentDetailModal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   name="João Silva"
 *   email="joao@university.com"
 *   matricula="ALU00001"
 *   totalLessons={10}
 *   attendances={9}
 *   absences={1}
 * />
 * ```
 */
export function StudentDetailModal({
  isOpen,
  onClose,
  name,
  email,
  totalLessons,
  attendances,
  absences,
  attendanceData,
  onAttendanceUpdate,
}: StudentDetailModalProps) {
  const [attendanceFilter, setAttendanceFilter] = useState<'all' | 'present' | 'absent'>('all');
  const [localAttendanceChanges, setLocalAttendanceChanges] = useState<Map<string, boolean>>(new Map());

  // Calcular stats dinâmicos baseados em mudanças locais
  const calculateDynamicStats = () => {
    let totalPresent = attendances;
    let totalAbsent = absences;

    // Aplicar mudanças locais aos stats
    localAttendanceChanges.forEach((newStatus, key) => {
      const record = attendanceData?.find(r => `${r.lessonId}-${r.userId}` === key);
      if (record) {
        // Se estava presente e agora está ausente
        if (record.present && !newStatus) {
          totalPresent--;
          totalAbsent++;
        }
        // Se estava ausente e agora está presente
        else if (!record.present && newStatus) {
          totalPresent++;
          totalAbsent--;
        }
      }
    });

    return {
      totalPresent,
      totalAbsent,
      frequency: totalLessons > 0 ? Math.round((totalPresent / totalLessons) * 100) : 0,
    };
  };

  const dynamicStats = calculateDynamicStats();

  const handleToggleAttendance = async (lessonId: number, currentStatus: boolean, userId?: number) => {
    try {
      if (!userId) {
        toast.error('Erro: ID do aluno não disponível');
        return;
      }

      const key = `${lessonId}-${userId}`;
      const newStatus = !currentStatus;

      // Update local state immediately for visual feedback
      setLocalAttendanceChanges(prev => new Map(prev).set(key, newStatus));

      await api.patch(`/presencas/${lessonId}/${userId}`, {
        isPresent: newStatus,
      });

      toast.success(currentStatus ? 'Alterado para Ausente' : 'Alterado para Presente');
      onAttendanceUpdate?.();
    } catch (error) {
      console.error('Erro ao atualizar presença:', error);
      toast.error('Erro ao atualizar presença');
      // Revert local change on error
      setLocalAttendanceChanges(prev => {
        const updated = new Map(prev);
        updated.delete(`${lessonId}-${userId}`);
        return updated;
      });
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop com blur */}
      .3
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" 
        onClick={onClose} 
      />
      
      {/* Modal */}
      <div className="modal modal-open">
        <div className="modal-box max-w-2xl max-h-[90vh] overflow-y-auto relative z-50 bg-white dark:bg-base-100 p-0 rounded-2xl shadow-2xl">
          {/* Header Minimalista */}
          <div className="sticky top-0 bg-white dark:bg-base-100 border-b border-gray-200 dark:border-base-content/10 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary text-white font-bold flex items-center justify-center">
                {name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="font-bold text-xl sm:text-2xl text-gray-900 dark:text-white">
                  {name}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
                  {email}
                </p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="btn btn-sm btn-ghost btn-circle text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-base-200 flex-shrink-0"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-5">
            {/* Informações do Aluno */}
            <div className="bg-white dark:bg-base-100 rounded-xl p-5 border border-gray-200 dark:border-base-content/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-base-200 flex items-center justify-center">
                  <FiUser className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
                <h4 className="font-bold text-lg text-gray-900 dark:text-white">Informações do Aluno</h4>
              </div>
              
              <div className="space-y-4">
                {/* Stats Grid - Filtros de Presença */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* Total */}
                  <button 
                    onClick={() => setAttendanceFilter('all')}
                    className={`p-3 sm:p-4 rounded-xl transition-all duration-200 flex flex-col items-center ${
                      attendanceFilter === 'all'
                        ? 'bg-cyan-50 dark:bg-cyan-500/10 border-2 border-cyan-300 dark:border-cyan-500'
                        : 'bg-gray-100 dark:bg-base-300 border-2 border-transparent hover:border-gray-300 dark:hover:border-base-content/20'
                    }`}
                  >
                    <FiUser className="w-4 h-4 text-cyan-600 dark:text-cyan-400 mb-2" />
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Total</span>
                    <div className="text-2xl sm:text-3xl font-heading font-bold text-gray-900 dark:text-white">
                      {totalLessons}
                    </div>
                  </button>

                  {/* Presenças */}
                  <button 
                    onClick={() => setAttendanceFilter('present')}
                    className={`p-3 sm:p-4 rounded-xl transition-all duration-200 flex flex-col items-center ${
                      attendanceFilter === 'present'
                        ? 'bg-emerald-50 dark:bg-emerald-500/10 border-2 border-emerald-300 dark:border-emerald-500'
                        : 'bg-gray-100 dark:bg-base-300 border-2 border-transparent hover:border-gray-300 dark:hover:border-base-content/20'
                    }`}
                  >
                    <FiCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mb-2" />
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Presentes</span>
                    <div className="text-2xl sm:text-3xl font-heading font-bold text-emerald-600 dark:text-emerald-400">
                      {dynamicStats.totalPresent}
                    </div>
                  </button>

                  {/* Ausentes */}
                  <button 
                    onClick={() => setAttendanceFilter('absent')}
                    className={`p-3 sm:p-4 rounded-xl transition-all duration-200 flex flex-col items-center ${
                      attendanceFilter === 'absent'
                        ? 'bg-red-50 dark:bg-red-500/10 border-2 border-red-300 dark:border-red-500'
                        : 'bg-gray-100 dark:bg-base-300 border-2 border-transparent hover:border-gray-300 dark:hover:border-base-content/20'
                    }`}
                  >
                    <FiX className="w-4 h-4 text-red-600 dark:text-red-400 mb-2" />
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Ausentes</span>
                    <div className="text-2xl sm:text-3xl font-heading font-bold text-red-600 dark:text-red-400">
                      {dynamicStats.totalAbsent}
                    </div>
                  </button>

                  {/* Frequência % */}
                  <div className="p-3 sm:p-4 rounded-xl bg-gray-100 dark:bg-base-300 border-2 border-transparent flex flex-col items-center">
                    <div className="w-4 h-4 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-2 text-xs font-bold">%</div>
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Frequência</span>
                    <div className="text-2xl sm:text-3xl font-heading font-bold text-amber-600 dark:text-amber-400">
                      {dynamicStats.frequency}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Lista de Aulas com Status de Presença - Filtrada */}
              {attendanceData && attendanceData.length > 0 ? (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-base-content/10">
                  <h5 className="font-bold text-base text-gray-900 dark:text-white mb-4">Histórico de Aulas</h5>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {attendanceData
                      .filter((record) => {
                        if (attendanceFilter === 'present') return record.present;
                        if (attendanceFilter === 'absent') return !record.present;
                        return true; // 'all'
                      })
                      .map((record, index) => {
                        const key = `${record.lessonId}-${record.userId}`;
                        const hasLocalChange = localAttendanceChanges.has(key);
                        const displayPresent = hasLocalChange 
                          ? localAttendanceChanges.get(key) 
                          : record.present;

                        return (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-base-200 hover:bg-gray-100 dark:hover:bg-base-300 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                              {record.lesson}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {new Date(record.date).toLocaleDateString('pt-BR', {
                                weekday: 'short',
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                              })}
                            </p>
                          </div>
                          <div className="ml-3 flex-shrink-0">
                            <button
                              onClick={() => record.lessonId && displayPresent !== undefined && handleToggleAttendance(record.lessonId, displayPresent, record.userId)}
                              className="inline-flex items-center gap-2 px-3 py-1 rounded-full transition-all hover:shadow-md active:scale-95"
                            >
                              {displayPresent ? (
                                <div className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 inline-flex items-center gap-2 px-3 py-1 rounded-full">
                                  <FiCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                  <span className="text-xs font-semibold">
                                    Presente
                                  </span>
                                </div>
                              ) : (
                                <div className="bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300 inline-flex items-center gap-2 px-3 py-1 rounded-full">
                                  <FiX className="w-4 h-4 text-red-600 dark:text-red-400" />
                                  <span className="text-xs font-semibold">
                                    Ausente
                                  </span>
                                </div>
                              )}
                            </button>
                          </div>
                        </div>
                        );
                      })}
                    {attendanceData.filter((record) => {
                      if (attendanceFilter === 'present') return record.present;
                      if (attendanceFilter === 'absent') return !record.present;
                      return true;
                    }).length === 0 && (
                      <div className="text-center text-gray-500 dark:text-gray-400 py-6">
                        {attendanceFilter === 'present' && 'Nenhuma aula com presença'}
                        {attendanceFilter === 'absent' && 'Nenhuma aula com ausência'}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-base-content/10 text-center text-gray-500 dark:text-gray-400 py-6">
                  Nenhum histórico de aulas disponível
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
