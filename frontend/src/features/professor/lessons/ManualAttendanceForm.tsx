import { useState, useEffect } from 'react';
import { FiSave, FiX, FiCheckSquare, FiSquare, FiAlertCircle } from 'react-icons/fi';
import { useManualAttendance, type ManualAttendanceEntry } from '@/hooks/useManualAttendance';
import { useClass } from '@/hooks/useClasses';
import { useAttendancesByLesson } from '@/hooks/useAttendances';
import { formatNameToInitials } from '@/utils/format';
import { toast } from 'sonner';

interface ManualAttendanceFormProps {
  /** ID da aula */
  lessonId: number;
  /** ID da turma */
  classId: number;
  /** Nome da turma (para exibição) */
  className: string;
  /** Data da aula (para exibição) */
  lessonDate: string;
  /** Callback ao fechar modal */
  onClose: () => void;
  /** Callback ao salvar com sucesso */
  onSaved?: () => void;
}

interface StudentAttendance {
  userId: number;
  userName: string;
  userEmail: string;
  isPresent: boolean;
  justification: string;
  wasEdited: boolean; // Se já havia registro anterior
}

/**
 * ManualAttendanceForm - Formulário para registro manual de presenças
 * 
 * Features:
 * - Lista todos os alunos da turma
 * - Checkbox para marcar presente/ausente
 * - Campo de justificativa por aluno
 * - Campo obrigatório de motivo da edição manual
 * - Exibe status anterior (se existir)
 * - Contador de presentes/ausentes
 * - Validação antes de salvar
 * - Salva em lote (bulk update)
 * 
 * Casos de uso:
 * - Sistema offline durante a aula
 * - Correção de erros de registro
 * - Alunos que chegaram atrasados
 * - Registro de faltas justificadas
 * 
 * @example
 * ```tsx
 * <ManualAttendanceForm
 *   lessonId={123}
 *   classId={45}
 *   className="CC0001 - Programação I"
 *   lessonDate="2025-10-04"
 *   onClose={() => setShowForm(false)}
 *   onSaved={() => console.log('Salvo!')}
 * />
 * ```
 */
export default function ManualAttendanceForm({
  lessonId,
  classId,
  className,
  lessonDate,
  onClose,
  onSaved,
}: ManualAttendanceFormProps) {
  const [attendances, setAttendances] = useState<StudentAttendance[]>([]);
  const [editReason, setEditReason] = useState('');
  const [showJustificationFor, setShowJustificationFor] = useState<number | null>(null);

  const { data: classData, isLoading: isLoadingClass } = useClass(classId);
  const { data: existingAttendances, isLoading: isLoadingAttendances } = useAttendancesByLesson(lessonId);
  const { mutate: saveAttendances, isPending: isSaving } = useManualAttendance();

  // Initialize attendances from class students
  useEffect(() => {
    if (!classData || !existingAttendances) return;

    const students = classData.users?.filter(uc => uc.role === 'STUDENT') || [];

    const initialAttendances: StudentAttendance[] = students.map(student => {
      const existingRecord = existingAttendances.find(att => att.userId === student.userId);

      return {
        userId: student.userId,
        userName: student.user?.name || 'Nome não disponível',
        userEmail: student.user?.email || '',
        isPresent: existingRecord?.isPresent ?? false,
        justification: existingRecord?.justification || '',
        wasEdited: !!existingRecord,
      };
    });

    // Sort alphabetically
    initialAttendances.sort((a, b) => a.userName.localeCompare(b.userName));

    setAttendances(initialAttendances);
  }, [classData, existingAttendances]);

  const handleTogglePresence = (userId: number) => {
    setAttendances(prev =>
      prev.map(att =>
        att.userId === userId
          ? { ...att, isPresent: !att.isPresent }
          : att
      )
    );
  };

  const handleJustificationChange = (userId: number, value: string) => {
    setAttendances(prev =>
      prev.map(att =>
        att.userId === userId
          ? { ...att, justification: value }
          : att
      )
    );
  };

  const handleSelectAll = () => {
    setAttendances(prev => prev.map(att => ({ ...att, isPresent: true })));
  };

  const handleDeselectAll = () => {
    setAttendances(prev => prev.map(att => ({ ...att, isPresent: false })));
  };

  const handleSave = () => {
    if (!editReason.trim()) {
      toast.error('Motivo obrigatório', {
        description: 'Informe o motivo da edição manual de presenças',
      });
      return;
    }

    const entries: ManualAttendanceEntry[] = attendances.map(att => ({
      userId: att.userId,
      isPresent: att.isPresent,
      justification: att.justification || undefined,
    }));

    saveAttendances(
      {
        lessonId,
        attendances: entries,
        editReason: editReason.trim(),
      },
      {
        onSuccess: () => {
          onSaved?.();
          onClose();
        },
      }
    );
  };

  const presentCount = attendances.filter(att => att.isPresent).length;
  const absentCount = attendances.length - presentCount;

  const isLoading = isLoadingClass || isLoadingAttendances;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-4xl p-0 overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-info to-primary p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 btn btn-sm btn-circle btn-ghost hover:bg-white/20"
            disabled={isSaving}
          >
            <FiX className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <FiCheckSquare className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Registro Manual de Presença</h2>
              <p className="text-white/80">{className}</p>
            </div>
          </div>

          <p className="text-sm text-white/70">
            {new Date(lessonDate).toLocaleDateString('pt-BR', {
              weekday: 'long',
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="skeleton-premium h-16 w-full" />
              ))}
            </div>
          ) : (
            <>
              {/* Stats and Bulk Actions */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-base-200 rounded-xl">
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success">{presentCount}</div>
                    <div className="text-xs text-gray-600 dark:text-base-content/70">Presentes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-error">{absentCount}</div>
                    <div className="text-xs text-gray-600 dark:text-base-content/70">Ausentes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{attendances.length}</div>
                    <div className="text-xs text-gray-600 dark:text-base-content/70">Total</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleSelectAll}
                    className="btn btn-sm btn-success"
                    disabled={isSaving}
                  >
                    Marcar Todos
                  </button>
                  <button
                    onClick={handleDeselectAll}
                    className="btn btn-sm btn-outline"
                    disabled={isSaving}
                  >
                    Desmarcar Todos
                  </button>
                </div>
              </div>

              {/* Alert */}
              <div className="alert alert-warning">
                <FiAlertCircle className="w-5 h-5" />
                <div className="text-sm">
                  <strong>Atenção:</strong> Esta é uma edição manual. Todas as alterações serão registradas com auditoria (quem editou, quando e porquê).
                </div>
              </div>

              {/* Students List */}
              <div className="space-y-2">
                {attendances.map((student) => (
                  <div
                    key={student.userId}
                    className="p-4 bg-white dark:bg-base-200 rounded-xl border border-gray-200 dark:border-base-300"
                  >
                    <div className="flex items-start gap-3">
                      {/* Checkbox */}
                      <button
                        onClick={() => handleTogglePresence(student.userId)}
                        className="flex-shrink-0 mt-1"
                        disabled={isSaving}
                      >
                        {student.isPresent ? (
                          <FiCheckSquare className="w-6 h-6 text-success" />
                        ) : (
                          <FiSquare className="w-6 h-6 text-gray-400" />
                        )}
                      </button>

                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-primary to-secondary text-white font-bold text-sm flex-shrink-0">
                        {formatNameToInitials(student.userName)}
                      </div>

                      {/* Student Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {student.userName}
                          </p>
                          {student.wasEdited && (
                            <span className="badge badge-sm badge-info">Editado</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 dark:text-base-content/70 truncate">
                          {student.userEmail}
                        </p>

                        {/* Justification Field (only for absences) */}
                        {!student.isPresent && (
                          <div className="mt-2">
                            {showJustificationFor === student.userId ? (
                              <textarea
                                value={student.justification}
                                onChange={(e) => handleJustificationChange(student.userId, e.target.value)}
                                placeholder="Justificativa da falta (opcional)"
                                className="textarea textarea-sm textarea-bordered w-full"
                                rows={2}
                                disabled={isSaving}
                              />
                            ) : (
                              <button
                                onClick={() => setShowJustificationFor(student.userId)}
                                className="text-xs text-info hover:underline"
                              >
                                {student.justification ? 'Editar justificativa' : '+ Adicionar justificativa'}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Edit Reason */}
              <div>
                <label className="label">
                  <span className="label-text font-semibold">
                    Motivo da Edição Manual <span className="text-error">*</span>
                  </span>
                </label>
                <textarea
                  value={editReason}
                  onChange={(e) => setEditReason(e.target.value)}
                  placeholder="Ex: Sistema offline durante a aula, correção de erro, aluno chegou atrasado, etc."
                  className="textarea textarea-bordered w-full"
                  rows={3}
                  disabled={isSaving}
                  required
                />
                <label className="label">
                  <span className="label-text-alt text-gray-500">
                    Este motivo será registrado para auditoria
                  </span>
                </label>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-gray-50 dark:bg-base-300 flex gap-3">
          <button
            onClick={onClose}
            className="btn btn-outline flex-1"
            disabled={isSaving}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="btn btn-primary flex-1"
            disabled={isSaving || !editReason.trim()}
          >
            {isSaving ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Salvando...
              </>
            ) : (
              <>
                <FiSave className="w-4 h-4" />
                Salvar Presenças
              </>
            )}
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}
