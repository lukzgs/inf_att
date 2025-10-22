import { useState, useEffect } from 'react';
import { FiX, FiEdit2, FiClock, FiCalendar, FiUsers, FiCheckCircle, FiXCircle, FiSave, FiTrash2, FiFileText } from 'react-icons/fi';
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
  
  // Estado para filtro de presença na lista de estudantes
  const [attendanceFilter, setAttendanceFilter] = useState<'all' | 'present' | 'absent' | 'pending'>('all');
  
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
        case 'startTime':
          payload.startTime = formatTimeToISO(formData.startTime);
          break;
        case 'endTime':
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
                <h2 className="font-bold text-xl sm:text-2xl text-gray-900 dark:text-white">
                  {lessonData?.name && lessonData.name.trim() !== '' ? lessonData.name : 'Aula'}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {formatDateBR(lessonData?.date || '')} • {lessonData?.startTime ? extractTimeFromISO(lessonData.startTime) : '--:--'} - {lessonData?.endTime ? extractTimeFromISO(lessonData.endTime) : '--:--'}
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
            {/* Lesson Details */}
            <div className="bg-white dark:bg-base-100 rounded-xl p-5 border border-gray-200 dark:border-base-content/10">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-base-200 flex items-center justify-center">
                    <FiCalendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <h4 className="font-bold text-lg text-gray-900 dark:text-white">Informações da Aula</h4>
                </div>
                <button 
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-3 py-1.5 bg-gray-100 dark:bg-base-200 text-red-600 dark:text-red-400 rounded-lg font-medium hover:bg-red-50 dark:hover:bg-red-500/10 transition-all flex items-center gap-1.5 text-sm flex-shrink-0"
                  disabled={isLoading}
                  title="Deletar aula"
                >
                  <FiTrash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Deletar</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Name Field */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <FiEdit2 className="w-4 h-4" />
                      Título/Tópico
                    </span>
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
                          className="btn btn-sm bg-cyan-500 hover:bg-cyan-600 text-white border-0"
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
                          className="btn btn-sm bg-cyan-500 hover:bg-cyan-600 text-white border-0"
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

                {/* Times Fields - Responsive: 1 col mobile, 2 cols tablet+ */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Start Time */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                        <FiClock className="w-3.5 h-3.5" /> Início
                      </span>
                    </label>
                    <div className="flex items-center gap-2">
                      {isFieldEditing('startTime') ? (
                        <>
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
                          <button
                            onClick={() => saveField('startTime')}
                            className="btn btn-sm bg-cyan-500 hover:bg-cyan-600 text-white border-0"
                            disabled={isLoading}
                          >
                            <FiSave className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              stopEditingField('startTime');
                              setFormData({ ...formData, startTime: new Date(lessonData?.startTime || '') });
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
                              {lessonData?.startTime ? extractTimeFromISO(lessonData.startTime) : '--:--'}
                            </p>
                          </div>
                          <button
                            onClick={() => startEditingField('startTime')}
                            className="btn btn-sm btn-ghost text-primary"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                        </>
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
                      {isFieldEditing('endTime') ? (
                        <>
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
                          <button
                            onClick={() => saveField('endTime')}
                            className="btn btn-sm bg-cyan-500 hover:bg-cyan-600 text-white border-0"
                            disabled={isLoading}
                          >
                            <FiSave className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              stopEditingField('endTime');
                              setFormData({ ...formData, endTime: new Date(lessonData?.endTime || '') });
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
                              {lessonData?.endTime ? extractTimeFromISO(lessonData.endTime) : '--:--'}
                            </p>
                          </div>
                          <button
                            onClick={() => startEditingField('endTime')}
                            className="btn btn-sm btn-ghost text-primary"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

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
                          className="btn btn-sm bg-cyan-500 hover:bg-cyan-600 text-white border-0"
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
                    <span className="label-text font-medium text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <FiFileText className="w-4 h-4" />
                      Descrição
                    </span>
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
                            className="btn btn-sm bg-cyan-500 hover:bg-cyan-600 text-white border-0"
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
            {/* Attendance Section */}
            <div className="rounded-xl p-5 border border-gray-200 dark:border-base-content/10 bg-white dark:bg-base-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-base-200 flex items-center justify-center">
                  <FiUsers className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
                <h4 className="font-bold text-lg text-gray-900 dark:text-white">Lista de Presença</h4>
              </div>

              {/* Filter Tabs - Coloridas */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-6">
                <button
                  onClick={() => setAttendanceFilter('all')}
                  className={`group p-3 sm:p-4 rounded-xl transition-all duration-200 flex flex-col items-center ${
                    attendanceFilter === 'all'
                      ? 'bg-cyan-50 dark:bg-cyan-500/10 border-2 border-cyan-300 dark:border-cyan-500'
                      : 'bg-gray-100 dark:bg-base-300 border-2 border-transparent hover:border-gray-300 dark:hover:border-base-content/20'
                  }`}
                  title="Total"
                >
                  <FiUsers className="w-4 h-4 text-gray-600 dark:text-gray-400 mb-2" />
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Total</span>
                  <div className="text-2xl sm:text-3xl font-heading font-bold text-gray-900 dark:text-white">
                    {classStudents.length}
                  </div>
                </button>

                <button
                  onClick={() => setAttendanceFilter('present')}
                  className={`group p-3 sm:p-4 rounded-xl transition-all duration-200 flex flex-col items-center ${
                    attendanceFilter === 'present'
                      ? 'bg-green-50 dark:bg-green-500/10 border-2 border-green-300 dark:border-green-500'
                      : 'bg-gray-100 dark:bg-base-300 border-2 border-transparent hover:border-gray-300 dark:hover:border-base-content/20'
                  }`}
                  title="Presentes"
                >
                  <FiCheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mb-2" />
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Presentes</span>
                  <div className="text-2xl sm:text-3xl font-heading font-bold text-green-600 dark:text-green-400">
                    {presentCount}
                  </div>
                </button>

                <button
                  onClick={() => setAttendanceFilter('absent')}
                  className={`group p-3 sm:p-4 rounded-xl transition-all duration-200 flex flex-col items-center ${
                    attendanceFilter === 'absent'
                      ? 'bg-red-50 dark:bg-red-500/10 border-2 border-red-300 dark:border-red-500'
                      : 'bg-gray-100 dark:bg-base-300 border-2 border-transparent hover:border-gray-300 dark:hover:border-base-content/20'
                  }`}
                  title="Ausentes"
                >
                  <FiXCircle className="w-4 h-4 text-red-600 dark:text-red-400 mb-2" />
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Ausentes</span>
                  <div className="text-2xl sm:text-3xl font-heading font-bold text-red-600 dark:text-red-400">
                    {absentCount}
                  </div>
                </button>

                <button
                  onClick={() => setAttendanceFilter('pending')}
                  className={`group p-3 sm:p-4 rounded-xl transition-all duration-200 flex flex-col items-center ${
                    attendanceFilter === 'pending'
                      ? 'bg-yellow-50 dark:bg-yellow-500/10 border-2 border-yellow-300 dark:border-yellow-500'
                      : 'bg-gray-100 dark:bg-base-300 border-2 border-transparent hover:border-gray-300 dark:hover:border-base-content/20'
                  }`}
                  title="Pendentes"
                >
                  <FiClock className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mb-2" />
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Pendentes</span>
                  <div className="text-2xl sm:text-3xl font-heading font-bold text-yellow-600 dark:text-yellow-400">
                    {notRegisteredCount}
                  </div>
                </button>
              </div>

              {/* Students List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {(() => {
                  let filteredStudents = studentsWithAttendance;
                  
                  if (attendanceFilter === 'present') {
                    filteredStudents = filteredStudents.filter(s => s.isPresent);
                  } else if (attendanceFilter === 'absent') {
                    filteredStudents = filteredStudents.filter(s => !s.isPresent && s.hasRecord);
                  } else if (attendanceFilter === 'pending') {
                    filteredStudents = filteredStudents.filter(s => !s.hasRecord);
                  }
                  
                  return filteredStudents.length === 0 ? (
                    <div className="text-center py-12">
                      <FiUsers className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                      <p className="text-gray-500 dark:text-gray-400 font-medium">
                        {attendanceFilter === 'all' && 'Nenhum estudante nesta turma'}
                        {attendanceFilter === 'present' && 'Nenhum estudante marcado como presente'}
                        {attendanceFilter === 'absent' && 'Nenhum estudante marcado como ausente'}
                        {attendanceFilter === 'pending' && 'Todos os estudantes já foram registrados'}
                      </p>
                    </div>
                  ) : (
                    filteredStudents.map((student) => (
                      <div 
                        key={student.id}
                        className="p-3 bg-white dark:bg-base-100 rounded-lg border border-gray-200 dark:border-base-content/20 hover:border-gray-300 dark:hover:border-base-content/40 transition-all"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="avatar placeholder flex-shrink-0">
                              <div className="bg-gray-300 dark:bg-base-300 text-gray-700 dark:text-gray-300 rounded-full w-9 h-9 text-xs font-bold">
                                {student.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
                                {student.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {student.email}
                              </p>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => handleToggleAttendance(student.id, student.isPresent)}
                            className={`px-3 py-1.5 rounded-lg font-medium text-xs whitespace-nowrap transition-all flex-shrink-0 ${
                              student.isPresent 
                                ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-500/30' 
                                : 'bg-gray-100 dark:bg-base-200 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-base-300'
                            }`}
                            disabled={isLoading}
                            title={student.isPresent ? 'Marcar como ausente' : 'Marcar como presente'}
                          >
                            {student.isPresent ? 'Presente' : 'Marcar'}
                          </button>
                        </div>
                      </div>
                    ))
                  );
                })()}
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
        isLoading={isLoading}
      />
    </>
  );
}
