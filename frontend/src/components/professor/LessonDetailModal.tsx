import { useState, useEffect } from 'react';
import { FiX, FiEdit2, FiClock, FiCalendar, FiUsers, FiCheckCircle, FiXCircle, FiSave, FiTrash2 } from 'react-icons/fi';
import { toast } from 'sonner';
import DatePicker from 'react-datepicker';
import { ptBR } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

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
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lessonData, setLessonData] = useState<LessonData | null>(null);
  const [classStudents, setClassStudents] = useState<Student[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: new Date(),
    startTime: new Date(),
    endTime: new Date(),
    attendancePassword: '',
  });

  // Função para verificar se a aula está disponível para registro de presença
  const getLessonStatus = () => {
    if (!lessonData) return { status: 'unknown', label: 'Carregando...', color: 'badge-ghost' };
    
    const now = new Date();
    const lessonDate = new Date(lessonData.date);
    
    // Extrai HH:mm do formato ISO
    const startTimeStr = extractTimeFromISO(lessonData.startTime);
    const endTimeStr = extractTimeFromISO(lessonData.endTime);
    const [startHour, startMin] = startTimeStr.split(':');
    const [endHour, endMin] = endTimeStr.split(':');
    
    const startTime = new Date(lessonDate);
    startTime.setHours(parseInt(startHour), parseInt(startMin));
    
    const endTime = new Date(lessonDate);
    endTime.setHours(parseInt(endHour), parseInt(endMin));

    if (now < startTime) {
      return { 
        status: 'upcoming', 
        label: 'Não iniciada', 
        color: 'badge-warning',
        icon: FiClock 
      };
    }

    if (now > endTime) {
      return { 
        status: 'finished', 
        label: 'Encerrada', 
        color: 'badge-ghost',
        icon: FiXCircle 
      };
    }

    return { 
      status: 'active', 
      label: 'Disponível para presença', 
      color: 'badge-success',
      icon: FiCheckCircle 
    };
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

  const handleSave = async () => {
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

      const response = await fetch(`http://localhost:3000/aulas/${lessonId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name || undefined,
          description: formData.description || undefined,
          date: formatDateToISO(formData.date),
          startTime: formatTimeToISO(formData.startTime),
          endTime: formatTimeToISO(formData.endTime),
          attendancePassword: formData.attendancePassword || undefined,
        }),
      });

      if (!response.ok) throw new Error('Erro ao atualizar aula');

      toast.success('Aula atualizada com sucesso!');
      setIsEditing(false);
      fetchLessonData();
      onUpdate?.();
    } catch (error) {
      console.error('Erro ao atualizar aula:', error);
      toast.error('Erro ao atualizar aula');
    } finally {
      setIsLoading(false);
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
        <div className="modal-box max-w-4xl max-h-[90vh] overflow-y-auto relative z-50 bg-white dark:bg-base-200">
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-gray-200 dark:border-base-content/10 sticky top-0 bg-white dark:bg-base-200 z-10">
            <div className="flex-1">
              {/* Título: Nome da Aula */}
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {lessonData?.name || 'Aula sem título'}
              </h3>
              
              {/* Data e Horário */}
              <div className="flex items-center gap-3 text-base text-gray-600 dark:text-base-content/70">
                <div className="flex items-center gap-1">
                  <FiCalendar className="w-4 h-4" />
                  <span>{new Date(lessonData?.date || '').toLocaleDateString('pt-BR')}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <FiClock className="w-4 h-4" />
                  <span>
                    {lessonData?.startTime ? extractTimeFromISO(lessonData.startTime) : '--:--'} - {lessonData?.endTime ? extractTimeFromISO(lessonData.endTime) : '--:--'}
                  </span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Content wrapper com padding */}
          <div className="p-6 space-y-6">
        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Status Badge */}
          {(() => {
            const status = getLessonStatus();
            const Icon = status.icon || FiClock;
            return (
              <div className={`badge ${status.color} badge-lg gap-2 text-base`}>
                <Icon className="w-4 h-4" /> {status.label}
              </div>
            );
          })()}

          <div className="ml-auto flex gap-2">
            {!isEditing && (
              <>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="btn-premium gap-2 text-base"
                >
                  <FiEdit2 className="w-4 h-4" /> Editar
                </button>
                <button 
                  onClick={() => setShowDeleteConfirm(true)}
                  className="btn-premium-outline gap-2 text-base !bg-error/10 !border-error !text-error hover:!bg-error hover:!text-white"
                  disabled={isLoading}
                >
                  <FiTrash2 className="w-4 h-4" /> Deletar
                </button>
              </>
            )}
            {isEditing && (
              <>
                <button 
                  onClick={handleSave}
                  className="btn-premium gap-2 text-base"
                  disabled={isLoading}
                >
                  <FiSave className="w-4 h-4" /> Salvar
                </button>
                <button 
                  onClick={() => {
                    setIsEditing(false);
                    fetchLessonData();
                  }}
                  className="btn-premium-outline gap-2 text-base"
                >
                  Cancelar
                </button>
              </>
            )}
          </div>
        </div>

        {/* Lesson Details */}
          {/* Basic Info */}
          <div className="border border-gray-200 dark:border-base-content/10 rounded-lg p-4 bg-gray-50 dark:bg-base-300">
              <h4 className="font-bold text-xl mb-4 text-gray-900 dark:text-white">Informações da Aula</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text font-medium text-base text-gray-700 dark:text-gray-200">Título/Tópico</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input input-bordered bg-white dark:bg-base-100 text-base"
                      placeholder="Ex: Introdução a Algoritmos"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white py-2 text-base">
                      {lessonData?.name || 'Sem título'}
                    </p>
                  )}
                </div>

                {/* Date */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-base text-gray-700 dark:text-gray-200 flex items-center gap-2">
                      <FiCalendar className="w-4 h-4" /> Data
                    </span>
                  </label>
                  {isEditing ? (
                    <DatePicker
                      selected={formData.date}
                      onChange={(date) => date && setFormData({ ...formData, date })}
                      dateFormat="dd/MM/yyyy"
                      locale={ptBR}
                      className="input input-bordered w-full bg-white dark:bg-base-100 text-base"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white py-2 text-base">
                      {new Date(lessonData?.date || '').toLocaleDateString('pt-BR')}
                    </p>
                  )}
                </div>

                {/* Start Time */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-base text-gray-700 dark:text-gray-200 flex items-center gap-2">
                      <FiClock className="w-4 h-4" /> Início
                    </span>
                  </label>
                  {isEditing ? (
                    <DatePicker
                      selected={formData.startTime}
                      onChange={(date) => date && setFormData({ ...formData, startTime: date })}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={15}
                      timeCaption="Hora"
                      dateFormat="HH:mm"
                      locale={ptBR}
                      className="input input-bordered w-full bg-white dark:bg-base-100 text-base"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white py-2 text-base">
                      {lessonData?.startTime ? extractTimeFromISO(lessonData.startTime) : '--:--'}
                    </p>
                  )}
                </div>

                {/* End Time */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-base text-gray-700 dark:text-gray-200 flex items-center gap-2">
                      <FiClock className="w-4 h-4" /> Término
                    </span>
                  </label>
                  {isEditing ? (
                    <DatePicker
                      selected={formData.endTime}
                      onChange={(date) => date && setFormData({ ...formData, endTime: date })}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={15}
                      timeCaption="Hora"
                      dateFormat="HH:mm"
                      locale={ptBR}
                      className="input input-bordered w-full bg-white dark:bg-base-100 text-base"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white py-2 text-base">
                      {lessonData?.endTime ? extractTimeFromISO(lessonData.endTime) : '--:--'}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text font-medium text-base text-gray-700 dark:text-gray-200 flex items-center gap-2">
                      <FiCheckCircle className="w-4 h-4" /> Senha de Presença (opcional)
                    </span>
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.attendancePassword}
                      onChange={(e) => setFormData({ ...formData, attendancePassword: e.target.value })}
                      className="input input-bordered bg-white dark:bg-base-100 text-base"
                      placeholder="Senha para registro de presença"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white py-2 text-base">
                      {lessonData?.attendancePassword || 'Sem senha'}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text font-medium text-base text-gray-700 dark:text-gray-200">Descrição</span>
                  </label>
                  {isEditing ? (
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="textarea textarea-bordered h-24 bg-white dark:bg-base-100 text-base"
                      placeholder="Descrição da aula..."
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white py-2 text-base">
                      {lessonData?.description || 'Sem descrição'}
                    </p>
                  )}
                </div>
              </div>
          </div>

          {/* Info Alert sobre Presença Automática */}
          <div className="alert alert-info bg-info/10 border-info/20">
            <FiClock className="w-5 h-5 text-info" />
            <div className="text-base text-gray-700 dark:text-gray-200">
              <strong>Presença Automática:</strong> A aula abre automaticamente no horário de início 
              e fecha no horário de término. Alunos podem registrar presença durante esse período.
            </div>
          </div>

          {/* Attendance Section */}
          <div className="border border-gray-200 dark:border-base-content/10 rounded-lg p-4 bg-gray-50 dark:bg-base-300">
              <h4 className="font-bold text-xl mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                <FiUsers className="w-5 h-5" /> Lista de Presença
              </h4>

              {/* Stats */}
              <div className="stats stats-horizontal shadow mb-4">
                <div className="stat">
                  <div className="stat-title text-base">Presentes</div>
                  <div className="stat-value text-success">{presentCount}</div>
                </div>
                <div className="stat">
                  <div className="stat-title text-base">Ausentes</div>
                  <div className="stat-value text-error">{absentCount}</div>
                </div>
                <div className="stat">
                  <div className="stat-title text-base">Não Registrado</div>
                  <div className="stat-value text-warning">{notRegisteredCount}</div>
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
