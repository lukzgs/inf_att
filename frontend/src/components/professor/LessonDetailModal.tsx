import { useState, useEffect } from 'react';
import { FiX, FiEdit2, FiClock, FiCalendar, FiBook, FiUsers, FiCheckCircle, FiXCircle, FiSave, FiPlay, FiLock, FiTrash2 } from 'react-icons/fi';
import { toast } from 'sonner';
import DatePicker from 'react-datepicker';
import { ptBR } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';

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
  className,
  onUpdate 
}: LessonDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lessonData, setLessonData] = useState<LessonData | null>(null);
  const [classStudents, setClassStudents] = useState<Student[]>([]);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: new Date(),
    startTime: new Date(),
    endTime: new Date(),
    attendancePassword: '',
  });

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

      if (!response.ok) throw new Error('Erro ao carregar dados da aula');

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

  const handleOpenLesson = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3000/aulas/${lessonId}/open`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Erro ao abrir aula');

      toast.success('Aula aberta para registro de presença!');
      fetchLessonData();
      onUpdate?.();
    } catch (error) {
      console.error('Erro ao abrir aula:', error);
      toast.error('Erro ao abrir aula');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseLesson = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3000/aulas/${lessonId}/close`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Erro ao fechar aula');

      toast.success('Aula fechada!');
      fetchLessonData();
      onUpdate?.();
    } catch (error) {
      console.error('Erro ao fechar aula:', error);
      toast.error('Erro ao fechar aula');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLesson = async () => {
    if (!confirm('Tem certeza que deseja deletar esta aula? Esta ação não pode ser desfeita.')) {
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3000/aulas/${lessonId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Erro ao deletar aula');

      toast.success('Aula deletada com sucesso!');
      onUpdate?.(); // Update list and close modal
      onClose();
    } catch (error) {
      console.error('Erro ao deletar aula:', error);
      toast.error('Erro ao deletar aula');
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
      <div className="modal modal-open">
        <div className="modal-box max-w-4xl">
          <div className="flex items-center justify-center p-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        </div>
      </div>
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
    <div className="modal modal-open">
      <div className="modal-box max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <FiBook className="text-primary" />
              Detalhes da Aula
            </h3>
            <p className="text-sm text-gray-500 mt-1">{className}</p>
          </div>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Status and Actions */}
        <div className="flex items-center gap-3 mb-6">
          {lessonData?.isOpen ? (
            <div className="badge badge-success badge-lg gap-2">
              <FiCheckCircle /> Aula Aberta
            </div>
          ) : (
            <div className="badge badge-warning badge-lg gap-2">
              <FiLock /> Aula Fechada
            </div>
          )}

          <div className="ml-auto flex gap-2">
            {!isEditing && (
              <>
                {!lessonData?.isOpen ? (
                  <button 
                    onClick={handleOpenLesson}
                    className="btn-premium-outline btn-sm gap-2 !bg-success/10 !border-success !text-success hover:!bg-success hover:!text-white"
                    disabled={isLoading}
                  >
                    <FiPlay /> Abrir Aula
                  </button>
                ) : (
                  <button 
                    onClick={handleCloseLesson}
                    className="btn-premium-outline btn-sm gap-2 !bg-error/10 !border-error !text-error hover:!bg-error hover:!text-white"
                    disabled={isLoading}
                  >
                    <FiLock /> Fechar Aula
                  </button>
                )}
                <button 
                  onClick={() => setIsEditing(true)}
                  className="btn-premium btn-sm gap-2"
                >
                  <FiEdit2 /> Editar
                </button>
                <button 
                  onClick={handleDeleteLesson}
                  className="btn-premium-outline btn-sm gap-2 !bg-error/10 !border-error !text-error hover:!bg-error hover:!text-white"
                  disabled={isLoading}
                >
                  <FiTrash2 /> Deletar
                </button>
              </>
            )}
            {isEditing && (
              <>
                <button 
                  onClick={handleSave}
                  className="btn-premium btn-sm gap-2"
                  disabled={isLoading}
                >
                  <FiSave /> Salvar
                </button>
                <button 
                  onClick={() => {
                    setIsEditing(false);
                    fetchLessonData();
                  }}
                  className="btn-premium-outline btn-sm"
                >
                  Cancelar
                </button>
              </>
            )}
          </div>
        </div>

        {/* Lesson Details */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="card bg-base-200">
            <div className="card-body">
              <h4 className="font-bold text-lg mb-4">Informações da Aula</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Título/Tópico</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input input-bordered"
                      placeholder="Ex: Introdução a Algoritmos"
                    />
                  ) : (
                    <p className="text-gray-700 dark:text-gray-300">
                      {lessonData?.name || 'Sem título'}
                    </p>
                  )}
                </div>

                {/* Date */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold flex items-center gap-2">
                      <FiCalendar /> Data
                    </span>
                  </label>
                  {isEditing ? (
                    <DatePicker
                      selected={formData.date}
                      onChange={(date) => date && setFormData({ ...formData, date })}
                      dateFormat="dd/MM/yyyy"
                      locale={ptBR}
                      className="input input-bordered w-full"
                    />
                  ) : (
                    <p className="text-gray-700 dark:text-gray-300">
                      {new Date(lessonData?.date || '').toLocaleDateString('pt-BR')}
                    </p>
                  )}
                </div>

                {/* Start Time */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold flex items-center gap-2">
                      <FiClock /> Início
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
                      className="input input-bordered w-full"
                    />
                  ) : (
                    <p className="text-gray-700 dark:text-gray-300">
                      {lessonData?.startTime}
                    </p>
                  )}
                </div>

                {/* End Time */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold flex items-center gap-2">
                      <FiClock /> Término
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
                      className="input input-bordered w-full"
                    />
                  ) : (
                    <p className="text-gray-700 dark:text-gray-300">
                      {lessonData?.endTime}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text font-semibold flex items-center gap-2">
                      <FiLock /> Senha de Presença (opcional)
                    </span>
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.attendancePassword}
                      onChange={(e) => setFormData({ ...formData, attendancePassword: e.target.value })}
                      className="input input-bordered"
                      placeholder="Senha para registro de presença"
                    />
                  ) : (
                    <p className="text-gray-700 dark:text-gray-300">
                      {lessonData?.attendancePassword || 'Sem senha'}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text font-semibold">Descrição</span>
                  </label>
                  {isEditing ? (
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="textarea textarea-bordered h-24"
                      placeholder="Descrição da aula..."
                    />
                  ) : (
                    <p className="text-gray-700 dark:text-gray-300">
                      {lessonData?.description || 'Sem descrição'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Attendance Section */}
          <div className="card bg-base-200">
            <div className="card-body">
              <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                <FiUsers /> Lista de Presença
              </h4>

              {/* Stats */}
              <div className="stats stats-horizontal shadow mb-4">
                <div className="stat">
                  <div className="stat-title">Presentes</div>
                  <div className="stat-value text-success">{presentCount}</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Ausentes</div>
                  <div className="stat-value text-error">{absentCount}</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Não Registrado</div>
                  <div className="stat-value text-warning">{notRegisteredCount}</div>
                </div>
              </div>

              {/* Students List */}
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {studentsWithAttendance.map((student) => (
                  <div 
                    key={student.id}
                    className="flex items-center justify-between p-3 bg-base-100 rounded-lg hover:bg-base-300 transition-colors"
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
                        <p className="font-semibold">{student.name}</p>
                        <p className="text-xs text-gray-500">{student.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {student.isPresent ? (
                        <span className="badge badge-success gap-1">
                          <FiCheckCircle /> Presente
                        </span>
                      ) : student.hasRecord ? (
                        <span className="badge badge-error gap-1">
                          <FiXCircle /> Ausente
                        </span>
                      ) : (
                        <span className="badge badge-warning gap-1">
                          Não Registrado
                        </span>
                      )}

                      <button
                        onClick={() => handleToggleAttendance(student.id, student.isPresent)}
                        className={`btn-premium-outline btn-sm ${
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
    </div>
  );
}
