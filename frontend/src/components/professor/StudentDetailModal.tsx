import { FiX, FiUser, FiCheck } from 'react-icons/fi';
import { useState } from 'react';

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

  const handleToggleAttendance = async (lessonId: number, currentStatus: boolean, userId?: number) => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!userId) {
        console.error('userId não disponível');
        return;
      }

      const response = await fetch(`http://localhost:3000/api/presencas/${lessonId}/${userId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isPresent: !currentStatus,
        }),
      });

      if (!response.ok) throw new Error('Erro ao atualizar presença');

      onAttendanceUpdate?.();
    } catch (error) {
      console.error('Erro ao atualizar presença:', error);
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
                      {attendances}
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
                      {absences}
                    </div>
                  </button>

                  {/* Frequência % */}
                  <div className="p-3 sm:p-4 rounded-xl bg-gray-100 dark:bg-base-300 border-2 border-transparent flex flex-col items-center">
                    <div className="w-4 h-4 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-2 text-xs font-bold">%</div>
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Frequência</span>
                    <div className="text-2xl sm:text-3xl font-heading font-bold text-amber-600 dark:text-amber-400">
                      {totalLessons > 0 ? Math.round((attendances / totalLessons) * 100) : 0}%
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
                      .map((record, index) => (
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
                              onClick={() => record.lessonId && handleToggleAttendance(record.lessonId, record.present, record.userId)}
                              className="inline-flex items-center gap-2 px-3 py-1 rounded-full transition-all hover:shadow-md active:scale-95"
                            >
                              {record.present ? (
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
                      ))}
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
