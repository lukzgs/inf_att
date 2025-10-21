import { useState, useEffect } from 'react';
import { FiX, FiEdit2, FiClock, FiCalendar, FiUsers, FiCheckCircle, FiXCircle, FiSave, FiTrash2 } from 'react-icons/fi';
import { toast } from 'sonner';
import DatePicker from 'react-datepicker';
import { ptBR } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { formatDateBR } from '@/utils/format';

/**
 * Extrai apenas a parte do horário (HH:mm) de uma string ISO datetime
 * Backend retorna Time do Prisma como "1970-01-01THH:mm:ss.000Z"
 */
const extractTimeFromISO = (isoTime: string): string => {
  if (!isoTime) return '--:--';
  try {
    // Se já for HH:mm, retorna direto
    if (isoTime.length === 5 && isoTime.includes(':')) {
      return isoTime;
    }
    // Se for ISO completo, extrai HH:mm
    const date = new Date(isoTime);
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: 'UTC' // Importante: usa UTC porque 1970-01-01 é apenas container
    });
  } catch {
    return '--:--';
  }
};

interface Student {
  id: number;
  name: string;
  email: string;
  isPresent?: boolean;
}

interface LessonDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessonId: number;
  classId: number;
  className: string;
  onUpdate?: () => void;
}

interface LessonData {
  id: number;
  name?: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  isOpen: boolean;
  attendancePassword?: string;
  attendances: Array<{
    id: number;
    userId: number;
    user: {
      id: number;
      name: string;
      email: string;
    };
    isPresent: boolean;
  }>;
}

export function LessonDetailModal({ 
  isOpen, 
  onClose, 
  lessonId, 
  classId,
  onUpdate 
} : LessonDetailModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [lessonData, setLessonData] = useState<LessonData | null>(null);
  const [classStudents, setClassStudents] = useState<Student[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Estado independente de edição para cada campo
  const [editingFields, setEditingFields] = useState<Set<string>>(new Set());
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: new Date(),
    startTime: new Date(),
    endTime: new Date(),
    attendancePassword: '',
  });
  
  // Helper para iniciar edição de um campo específico
  const startEditingField = (fieldName: string) => {
    setEditingFields(new Set([...editingFields, fieldName]));
  };
  
  // Helper para parar de editar um campo
  const stopEditingField = (fieldName: string) => {
    const newSet = new Set(editingFields);
    newSet.delete(fieldName);
    setEditingFields(newSet);
  };
  
  // Helper para verificar se um campo está sendo editado
  const isFieldEditing = (fieldName: string) => {
    return editingFields.has(fieldName);
  };
  
  // Salvar um campo específico
  const saveField = async (fieldName: string) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      
      const formatDateToISO = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}T00:00:00.000Z`;
      };

      const formatTimeToISO = (date: Date): string => {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `1970-01-01T${hours}:${minutes}:00.000Z`;
      };
      
      const payload: any = {};
      
      switch(fieldName) {
        case 'name':
          payload.name = formData.name || undefined;
          break;
        case 'description':
          payload.description = formData.description || undefined;
          break;
        case 'date':
          payload.date = formatDateToISO(formData.date);
          break;
        case 'times':
          payload.startTime = formatTimeToISO(formData.startTime);
          payload.endTime = formatTimeToISO(formData.endTime);
          break;
        case 'password':
          payload.attendancePassword = formData.attendancePassword || undefined;
          break;
      }

      const response = await fetch(`http://localhost:3000/aulas/${lessonId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Erro ao atualizar aula');

      toast.success('Campo atualizado com sucesso!');
      stopEditingField(fieldName);
      fetchLessonData();
      onUpdate?.();
    } catch (error) {
      console.error('Erro ao atualizar aula:', error);
      toast.error('Erro ao atualizar campo');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch lesson data
  useEffect(() => {
    if (isOpen && lessonId) {
      fetchLessonData();
      fetchClassStudents();
    }
  }, [isOpen, lessonId]);

  const fetchLessonData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3000/aulas/${lessonId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          toast.error('Aula não encontrada. Ela pode ter sido deletada.');
          onClose();
          return;
        }
        throw new Error('Erro ao carregar dados da aula');
      }

      const data = await response.json();
      setLessonData(data);

      // Parse dates for form
      const lessonDate = new Date(data.date);
      
      // Parse time strings (format: "HH:mm" or ISO DateTime)
      const parseTime = (timeStr: string): Date => {
        if (!timeStr) return new Date();
        
        // If it's already an ISO date string (from API)
        if (timeStr.includes('T')) {
          return new Date(timeStr);
        }
        
        // If it's just HH:mm format
        const today = new Date();
        const [hours, minutes] = timeStr.split(':').map(Number);
        today.setHours(hours, minutes, 0, 0);
        return today;
      };

      const startTime = parseTime(data.startTime);
      const endTime = parseTime(data.endTime);

      setFormData({
        name: data.name || '',
        description: data.description || '',
        date: lessonDate,
        startTime: startTime,
        endTime: endTime,
        attendancePassword: data.attendancePassword || '',
      });
    } catch (error) {
      console.error('Erro ao carregar aula:', error);
      toast.error('Erro ao carregar dados da aula');
    }
  };

  const fetchClassStudents = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3000/turmas/${classId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Erro ao carregar alunos');

      const data = await response.json();
      const students = data.users
        ?.filter((uc: any) => uc.role === 'STUDENT')
        .map((uc: any) => ({
          id: uc.userId,
          name: uc.user.name,
          email: uc.user.email,
        })) || [];

      setClassStudents(students);
    } catch (error) {
      console.error('Erro ao carregar alunos:', error);
    }
  };

  const handleDeleteLesson = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3000/aulas/${lessonId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Erro ao deletar aula');
      }

      toast.success('Aula deletada com sucesso!');
      setShowDeleteConfirm(false);
      onUpdate?.(); // Invalida as queries
      onClose(); // Fecha o modal
    } catch (error: any) {
      console.error('Erro ao deletar aula:', error);
      toast.error(error.message || 'Erro ao deletar aula');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleAttendance = async (userId: number, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('authToken');
      
      // Find attendance record
      const attendance = lessonData?.attendances.find(a => a.userId === userId);
      
      if (!attendance) {
        // Create new attendance
        const response = await fetch(`http://localhost:3000/presencas`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            lessonId: lessonId,
            userId: userId,
            isPresent: !currentStatus,
          }),
        });

        if (!response.ok) throw new Error('Erro ao registrar presença');
      } else {
        // Update existing attendance
        const response = await fetch(`http://localhost:3000/presencas/${lessonId}/${userId}`, {
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
      }

      toast.success('Presença atualizada!');
      fetchLessonData();
      // Don't call onUpdate here - keep modal open for marking multiple students
    } catch (error) {
      console.error('Erro ao atualizar presença:', error);
      toast.error('Erro ao atualizar presença');
    }
  };

  if (!isOpen) return null;

  // Loading state
  if (!lessonData) {
    return (
      <>
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose} />
        <div className="modal modal-open">
          <div className="modal-box max-w-4xl relative z-50">
            <div className="flex items-center justify-center p-12">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          </div>
        </div>
      </>
    );
  }

  const studentsWithAttendance = classStudents.map(student => {
    const attendance = lessonData?.attendances?.find(a => a.userId === student.id);
    return {
      ...student,
      isPresent: attendance?.isPresent || false,
      hasRecord: !!attendance,
    };
  });

  const presentCount = studentsWithAttendance.filter(s => s.isPresent).length;
  const absentCount = studentsWithAttendance.filter(s => !s.isPresent && s.hasRecord).length;
  const notRegisteredCount = studentsWithAttendance.filter(s => !s.hasRecord).length;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="modal modal-open">
        <div className="modal-box max-w-2xl max-h-[90vh] overflow-y-auto relative z-50 bg-white dark:bg-base-100 p-0 rounded-2xl shadow-2xl">
          {/* Header Minimalista */}
          <div className="sticky top-0 bg-white dark:bg-base-100 border-b border-gray-200 dark:border-base-content/10 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-base-200 flex items-center justify-center">
                <FiCalendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  {lessonData?.name && lessonData.name.trim() !== '' ? lessonData.name : 'Aula'}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDateBR(lessonData?.date || '')} • {lessonData?.startTime ? extractTimeFromISO(lessonData.startTime) : '--:--'} - {lessonData?.endTime ? extractTimeFromISO(lessonData.endTime) : '--:--'}
                </p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="btn btn-sm btn-ghost btn-circle text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-base-200"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-5">
            {/* Actions Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-3 py-1.5 bg-gray-100 dark:bg-base-200 text-red-600 dark:text-red-400 rounded-lg font-medium hover:bg-red-50 dark:hover:bg-red-500/10 transition-all flex items-center gap-1.5 text-sm"
                  disabled={isLoading}
                >
                  <FiTrash2 className="w-4 h-4" /> Deletar
                </button>
              </div>
            </div>

            {/* Lesson Details */}
            <div className="bg-white dark:bg-base-100 rounded-xl p-5 border border-gray-200 dark:border-base-content/10">
              <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-4">Informações da Aula</h4>
              
              <div className="space-y-4">
                {/* Name Field */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-sm text-gray-600 dark:text-gray-400">Título/Tópico</span>
                  </label>
                  <div className="flex items-center gap-2">
                    {isFieldEditing('name') ? (
                      <>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="flex-1 input input-bordered bg-white dark:bg-base-100 border-gray-200 dark:border-base-content/20 focus:border-primary transition-all text-sm h-10 rounded-lg"
                          placeholder="Ex: Introdução a Algoritmos"
                        />
                        <button
                          onClick={() => saveField('name')}
                          className="btn btn-sm btn-primary text-white"
                          disabled={isLoading}
                        >
                          <FiSave className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            stopEditingField('name');
                            setFormData({ ...formData, name: lessonData?.name || '' });
                          }}
                          className="btn btn-sm btn-ghost"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="flex-1 bg-gray-50 dark:bg-base-200 px-3 py-2 rounded-lg border border-gray-200 dark:border-base-content/10">
                          <p className="text-gray-900 dark:text-white text-sm">
                            {lessonData?.name || 'Sem título'}
                          </p>
                        </div>
                        <button
                          onClick={() => startEditingField('name')}
                          className="btn btn-sm btn-ghost text-primary"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Date Field */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <FiCalendar className="w-3.5 h-3.5" /> Data
                    </span>
                  </label>
                  <div className="flex items-center gap-2">
                    {isFieldEditing('date') ? (
                      <>
                        <DatePicker
                          selected={formData.date}
                          onChange={(date) => date && setFormData({ ...formData, date })}
                          dateFormat="dd/MM/yyyy"
                          locale={ptBR}
                          className="flex-1 input input-bordered w-full bg-white dark:bg-base-100 border-gray-200 dark:border-base-content/20 focus:border-primary transition-all text-sm h-10 rounded-lg"
                        />
                        <button
                          onClick={() => saveField('date')}
                          className="btn btn-sm btn-primary text-white"
                          disabled={isLoading}
                        >
                          <FiSave className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            stopEditingField('date');
                            setFormData({ ...formData, date: new Date(lessonData?.date || '') });
                          }}
                          className="btn btn-sm btn-ghost"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="flex-1 bg-gray-50 dark:bg-base-200 px-3 py-2 rounded-lg border border-gray-200 dark:border-base-content/10">
                          <p className="text-gray-900 dark:text-white text-sm">
                            {formatDateBR(lessonData?.date || '')}
                          </p>
                        </div>
                        <button
                          onClick={() => startEditingField('date')}
                          className="btn btn-sm btn-ghost text-primary"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Times Fields - Side by side */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Start Time */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                        <FiClock className="w-3.5 h-3.5" /> Início
                      </span>
                    </label>
                    <div className="flex items-center gap-2">
                      {isFieldEditing('times') ? (
                        <DatePicker
                          selected={formData.startTime}
                          onChange={(date) => date && setFormData({ ...formData, startTime: date })}
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={15}
                          timeCaption="Hora"
                          dateFormat="HH:mm"
                          locale={ptBR}
                          className="flex-1 input input-bordered w-full bg-white dark:bg-base-100 border-gray-200 dark:border-base-content/20 focus:border-primary transition-all text-sm h-10 rounded-lg"
                        />
                      ) : (
                        <div className="flex-1 bg-gray-50 dark:bg-base-200 px-3 py-2 rounded-lg border border-gray-200 dark:border-base-content/10">
                          <p className="text-gray-900 dark:text-white text-sm">
                            {lessonData?.startTime ? extractTimeFromISO(lessonData.startTime) : '--:--'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* End Time */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                        <FiClock className="w-3.5 h-3.5" /> Término
                      </span>
                    </label>
                    <div className="flex items-center gap-2">
                      {isFieldEditing('times') ? (
                        <DatePicker
                          selected={formData.endTime}
                          onChange={(date) => date && setFormData({ ...formData, endTime: date })}
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={15}
                          timeCaption="Hora"
                          dateFormat="HH:mm"
                          locale={ptBR}
                          className="flex-1 input input-bordered w-full bg-white dark:bg-base-100 border-gray-200 dark:border-base-content/20 focus:border-primary transition-all text-sm h-10 rounded-lg"
                        />
                      ) : (
                        <div className="flex-1 bg-gray-50 dark:bg-base-200 px-3 py-2 rounded-lg border border-gray-200 dark:border-base-content/10">
                          <p className="text-gray-900 dark:text-white text-sm">
                            {lessonData?.endTime ? extractTimeFromISO(lessonData.endTime) : '--:--'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Times Action Buttons (appear only when editing times) */}
                {isFieldEditing('times') && (
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => saveField('times')}
                      className="btn btn-sm btn-primary text-white"
                      disabled={isLoading}
                    >
                      <FiSave className="w-4 h-4" /> Salvar
                    </button>
                    <button
                      onClick={() => {
                        stopEditingField('times');
                        setFormData({
                          ...formData,
                          startTime: new Date(lessonData?.startTime || ''),
                          endTime: new Date(lessonData?.endTime || ''),
                        });
                      }}
                      className="btn btn-sm btn-ghost"
                    >
                      Cancelar
                    </button>
                  </div>
                )}

                {/* Edit Times Button (appears only when not editing) */}
                {!isFieldEditing('times') && (
                  <div className="flex justify-end">
                    <button
                      onClick={() => startEditingField('times')}
                      className="btn btn-sm btn-ghost text-primary gap-1"
                    >
                      <FiEdit2 className="w-4 h-4" /> Editar Horários
                    </button>
                  </div>
                )}

                {/* Password Field */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <FiCheckCircle className="w-3.5 h-3.5" />
                      Senha de Presença <span className="text-xs text-gray-500">(opcional)</span>
                    </span>
                  </label>
                  <div className="flex items-center gap-2">
                    {isFieldEditing('password') ? (
                      <>
                        <input
                          type="text"
                          value={formData.attendancePassword}
                          onChange={(e) => setFormData({ ...formData, attendancePassword: e.target.value })}
                          className="flex-1 input input-bordered bg-white dark:bg-base-100 border-gray-200 dark:border-base-content/20 focus:border-primary transition-all text-sm h-10 rounded-lg"
                          placeholder="Senha para registro de presença"
                        />
                        <button
                          onClick={() => saveField('password')}
                          className="btn btn-sm btn-primary text-white"
                          disabled={isLoading}
                        >
                          <FiSave className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            stopEditingField('password');
                            setFormData({ ...formData, attendancePassword: lessonData?.attendancePassword || '' });
                          }}
                          className="btn btn-sm btn-ghost"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="flex-1 bg-gray-50 dark:bg-base-200 px-3 py-2 rounded-lg border border-gray-200 dark:border-base-content/10">
                          <p className="text-gray-900 dark:text-white text-sm">
                            {lessonData?.attendancePassword || 'Sem senha'}
                          </p>
                        </div>
                        <button
                          onClick={() => startEditingField('password')}
                          className="btn btn-sm btn-ghost text-primary"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Description Field */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-sm text-gray-600 dark:text-gray-400">Descrição</span>
                  </label>
                  <div className="flex items-start gap-2">
                    {isFieldEditing('description') ? (
                      <>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          className="flex-1 textarea textarea-bordered h-20 bg-white dark:bg-base-100 border-gray-200 dark:border-base-content/20 focus:border-primary transition-all text-sm rounded-lg resize-none"
                          placeholder="Descrição da aula..."
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => saveField('description')}
                            className="btn btn-sm btn-primary text-white"
                            disabled={isLoading}
                          >
                            <FiSave className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              stopEditingField('description');
                              setFormData({ ...formData, description: lessonData?.description || '' });
                            }}
                            className="btn btn-sm btn-ghost"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex-1 bg-gray-50 dark:bg-base-200 px-3 py-2 rounded-lg border border-gray-200 dark:border-base-content/10 min-h-[60px]">
                          <p className="text-gray-900 dark:text-white text-sm">
                            {lessonData?.description || 'Sem descrição'}
                          </p>
                        </div>
                        <button
                          onClick={() => startEditingField('description')}
                          className="btn btn-sm btn-ghost text-primary mt-2"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Info Alert */}
            <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FiClock className="w-3 h-3 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-blue-900 dark:text-blue-200">
                    <strong>Presença Automática:</strong> A aula abre automaticamente no horário de início e fecha no horário de término. Alunos podem registrar presença durante esse período.
                  </p>
                </div>
              </div>
            </div>

            {/* Attendance Section */}
            <div className="bg-white dark:bg-base-100 rounded-xl p-5 border border-gray-200 dark:border-base-content/10">
              <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FiUsers className="w-5 h-5" /> Lista de Presença
              </h4>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="bg-green-50 dark:bg-green-500/10 rounded-lg p-3 ring-2 ring-green-200 dark:ring-green-500/30">
                  <div className="flex items-center gap-2 mb-1">
                    <FiCheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">Presentes</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{presentCount}</div>
                </div>
                <div className="bg-red-50 dark:bg-red-500/10 rounded-lg p-3 ring-2 ring-red-200 dark:ring-red-500/30">
                  <div className="flex items-center gap-2 mb-1">
                    <FiXCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">Ausentes</span>
                  </div>
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">{absentCount}</div>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-500/10 rounded-lg p-3 ring-2 ring-yellow-200 dark:ring-yellow-500/30">
                  <div className="flex items-center gap-2 mb-1">
                    <FiClock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">Pendente</span>
                  </div>
                  <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{notRegisteredCount}</div>
                </div>
              </div>

              {/* Students List */}
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {studentsWithAttendance.map((student) => (
                  <div 
                    key={student.id}
                    className="flex items-center justify-between p-3 bg-white dark:bg-base-100 rounded-lg hover:bg-gray-100 dark:hover:bg-base-200 transition-colors border border-gray-200 dark:border-base-content/10"
                  >
                    <div className="flex items-center gap-3">
                      <div className="avatar placeholder">
                        <div className="bg-neutral-focus text-neutral-content rounded-full w-10 h-10">
                          <span className="text-sm">
                            {student.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-base text-gray-900 dark:text-white">{student.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{student.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {student.isPresent ? (
                        <span className="badge badge-success gap-1 text-base">
                          <FiCheckCircle className="w-4 h-4" /> Presente
                        </span>
                      ) : student.hasRecord ? (
                        <span className="badge badge-error gap-1 text-base">
                          <FiXCircle className="w-4 h-4" /> Ausente
                        </span>
                      ) : (
                        <span className="badge badge-warning gap-1 text-base">
                          Não Registrado
                        </span>
                      )}

                      <button
                        onClick={() => handleToggleAttendance(student.id, student.isPresent)}
                        className={`btn-premium-outline text-base ${
                          student.isPresent 
                            ? '!bg-error/10 !border-error !text-error hover:!bg-error hover:!text-white' 
                            : '!bg-success/10 !border-success !text-success hover:!bg-success hover:!text-white'
                        }`}
                        disabled={isLoading}
                      >
                        {student.isPresent ? 'Marcar Falta' : 'Marcar Presente'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteLesson}
        title="Deletar Aula"
        message="Tem certeza que deseja deletar esta aula? Esta ação não pode ser desfeita."
        confirmText="Deletar"
        cancelText="Cancelar"
        confirmButtonClass="btn-error"
        isLoading={isLoading}
      />
    </>
  );
}
