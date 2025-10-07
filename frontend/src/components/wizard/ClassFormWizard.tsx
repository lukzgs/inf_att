import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { FiCheck, FiChevronLeft, FiChevronRight, FiBook, FiUser, FiUsers, FiCalendar } from 'react-icons/fi';
import { useSubjects } from '@/hooks/useSubjects';
import { useUsers } from '@/hooks/useUsers';
import { api } from '@/services/api';
import { useQueryClient } from '@tanstack/react-query';
import type { ClassRole } from '@/hooks/useClasses';

interface ClassFormData {
  // Step 1: Basic Info
  code: string;
  year: number;
  semester: number;
  subjectId: number;
  
  // Step 2: Teacher
  teacherId: number | null;
  
  // Step 3: Students
  studentIds: number[];
  
  // Step 4: Schedule (opcional para MVP)
  notes?: string;
}

interface WizardStep {
  id: number;
  title: string;
  icon: React.ReactNode;
  description: string;
}

const WIZARD_STEPS: WizardStep[] = [
  {
    id: 1,
    title: 'Informações Básicas',
    icon: <FiBook size={20} />,
    description: 'Código, disciplina, ano e semestre',
  },
  {
    id: 2,
    title: 'Atribuir Professor',
    icon: <FiUser size={20} />,
    description: 'Selecione o professor da turma',
  },
  {
    id: 3,
    title: 'Adicionar Alunos',
    icon: <FiUsers size={20} />,
    description: 'Busque e adicione alunos à turma',
  },
  {
    id: 4,
    title: 'Finalizar',
    icon: <FiCalendar size={20} />,
    description: 'Revisar e criar a turma',
  },
];

export function ClassFormWizard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data
  const [formData, setFormData] = useState<ClassFormData>({
    code: '',
    year: new Date().getFullYear(),
    semester: 1,
    subjectId: 0,
    teacherId: null,
    studentIds: [],
    notes: '',
  });

  // Search state
  const [studentSearch, setStudentSearch] = useState('');

  // Fetch data
  const { data: subjects, isLoading: isLoadingSubjects } = useSubjects();
  const { data: users, isLoading: isLoadingUsers } = useUsers();

  // Filter users by role
  const teachers = users?.filter(u => u.roles?.some(r => r.role.name === 'PROFESSOR')) || [];
  const students = users?.filter(u => u.roles?.some(r => r.role.name === 'USER')) || [];

  // Filter students by search
  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.email.toLowerCase().includes(studentSearch.toLowerCase())
  );

  // Selected students
  const selectedStudents = students.filter(s => formData.studentIds.includes(s.id));

  // Validation
  const canGoToStep2 = formData.code && formData.subjectId > 0;
  const canGoToStep3 = canGoToStep2 && formData.teacherId !== null;
  const canGoToStep4 = canGoToStep3 && formData.studentIds.length > 0;
  const canSubmit = canGoToStep4;

  const handleNext = () => {
    if (currentStep === 1 && !canGoToStep2) {
      toast.error('Preencha código e disciplina');
      return;
    }
    if (currentStep === 2 && !canGoToStep3) {
      toast.error('Selecione um professor');
      return;
    }
    if (currentStep === 3 && !canGoToStep4) {
      toast.error('Adicione pelo menos um aluno');
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!canSubmit) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create class
      const classResponse = await api.post('/turmas', {
        code: formData.code,
        year: formData.year,
        semester: formData.semester,
        subjectId: formData.subjectId,
      });

      const classId = classResponse.data.id;

      // Add teacher
      if (formData.teacherId) {
        await api.post(`/turmas/${classId}/usuarios`, {
          userId: formData.teacherId,
          role: 'TEACHER' as ClassRole,
        });
      }

      // Add students
      for (const studentId of formData.studentIds) {
        await api.post(`/turmas/${classId}/usuarios`, {
          userId: studentId,
          role: 'STUDENT' as ClassRole,
        });
      }

      queryClient.invalidateQueries({ queryKey: ['classes'] });
      toast.success('Turma criada com sucesso!');
      navigate('/admin/turmas');
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Erro ao criar turma';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStudent = (studentId: number) => {
    setFormData(prev => ({
      ...prev,
      studentIds: prev.studentIds.includes(studentId)
        ? prev.studentIds.filter(id => id !== studentId)
        : [...prev.studentIds, studentId],
    }));
  };

  const selectAllFiltered = () => {
    const newIds = [...new Set([...formData.studentIds, ...filteredStudents.map(s => s.id)])];
    setFormData(prev => ({ ...prev, studentIds: newIds }));
    toast.success(`${filteredStudents.length} alunos selecionados`);
  };

  const deselectAll = () => {
    setFormData(prev => ({ ...prev, studentIds: [] }));
    toast.success('Seleção limpa');
  };

  if (isLoadingSubjects || isLoadingUsers) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-base-content">Criar Nova Turma</h1>
        <p className="text-base-content/70 mt-2">
          Siga os passos para criar uma turma completa
        </p>
      </div>

      {/* Steps Progress */}
      <div className="mb-8">
        <ul className="steps w-full">
          {WIZARD_STEPS.map((step) => (
            <li
              key={step.id}
              className={`step ${currentStep >= step.id ? 'step-primary' : ''} text-xs sm:text-sm`}
              data-content={currentStep > step.id ? '✓' : step.id}
            >
              <span className="hidden md:inline">{step.title}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Step Content */}
      <div className="premium-card p-6 md:p-8 min-h-[400px]">
        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <FiBook className="text-primary" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Informações Básicas</h2>
                <p className="text-base-content/70">Defina o código, disciplina, ano e semestre</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Código */}
              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text font-medium">Código da Turma *</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex: INF101-2024-1"
                  className="input input-bordered"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                />
                <label className="label">
                  <span className="label-text-alt">Código único para identificar a turma</span>
                </label>
              </div>

              {/* Disciplina */}
              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text font-medium">Disciplina *</span>
                </label>
                <select
                  className="select select-bordered"
                  value={formData.subjectId}
                  onChange={(e) => setFormData({ ...formData, subjectId: parseInt(e.target.value) })}
                >
                  <option value={0}>Selecione uma disciplina</option>
                  {subjects?.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.code} - {subject.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ano */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Ano *</span>
                </label>
                <input
                  type="number"
                  className="input input-bordered"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  min={2020}
                  max={2030}
                />
              </div>

              {/* Semestre */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Semestre *</span>
                </label>
                <select
                  className="select select-bordered"
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) })}
                >
                  <option value={1}>1º Semestre</option>
                  <option value={2}>2º Semestre</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Teacher */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center">
                <FiUser className="text-info" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Atribuir Professor</h2>
                <p className="text-base-content/70">Selecione o professor responsável pela turma</p>
              </div>
            </div>

            <div className="space-y-3">
              {teachers.length === 0 ? (
                <div className="alert alert-warning">
                  <span>Nenhum professor cadastrado no sistema</span>
                </div>
              ) : (
                teachers.map((teacher) => (
                  <label
                    key={teacher.id}
                    className={`
                      flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
                      ${formData.teacherId === teacher.id
                        ? 'border-info bg-info/5'
                        : 'border-base-300 hover:border-info/50'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="teacher"
                      className="radio radio-info"
                      checked={formData.teacherId === teacher.id}
                      onChange={() => setFormData({ ...formData, teacherId: teacher.id })}
                    />
                    <div className="avatar placeholder">
                      <div className="bg-info text-info-content rounded-full w-12 h-12">
                        <span className="text-lg font-bold">
                          {teacher.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{teacher.name}</p>
                      <p className="text-sm text-base-content/70">{teacher.email}</p>
                    </div>
                  </label>
                ))
              )}
            </div>
          </div>
        )}

        {/* Step 3: Students */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <FiUsers className="text-success" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Adicionar Alunos</h2>
                <p className="text-base-content/70">
                  Busque e selecione os alunos da turma ({formData.studentIds.length} selecionado
                  {formData.studentIds.length !== 1 ? 's' : ''})
                </p>
              </div>
            </div>

            {/* Search and actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Buscar por nome ou email..."
                className="input input-bordered flex-1"
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={selectAllFiltered}
                  className="btn btn-outline btn-sm"
                  disabled={filteredStudents.length === 0}
                >
                  Selecionar Todos
                </button>
                <button
                  type="button"
                  onClick={deselectAll}
                  className="btn btn-outline btn-error btn-sm"
                  disabled={formData.studentIds.length === 0}
                >
                  Limpar
                </button>
              </div>
            </div>

            {/* Students list */}
            <div className="max-h-[400px] overflow-y-auto space-y-2">
              {filteredStudents.length === 0 ? (
                <div className="alert">
                  <span>
                    {studentSearch
                      ? 'Nenhum aluno encontrado com esse critério'
                      : 'Nenhum aluno cadastrado no sistema'}
                  </span>
                </div>
              ) : (
                filteredStudents.map((student) => (
                  <label
                    key={student.id}
                    className={`
                      flex items-center gap-4 p-3 rounded-lg border cursor-pointer transition-all
                      ${formData.studentIds.includes(student.id)
                        ? 'border-success bg-success/5'
                        : 'border-base-300 hover:border-success/50'
                      }
                    `}
                  >
                    <input
                      type="checkbox"
                      className="checkbox checkbox-success"
                      checked={formData.studentIds.includes(student.id)}
                      onChange={() => toggleStudent(student.id)}
                    />
                    <div className="avatar placeholder">
                      <div className="bg-neutral text-neutral-content rounded-full w-10 h-10">
                        <span className="text-sm font-bold">
                          {student.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{student.name}</p>
                      <p className="text-sm text-base-content/70 truncate">{student.email}</p>
                    </div>
                  </label>
                ))
              )}
            </div>
          </div>
        )}

        {/* Step 4: Review and Submit */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <FiCheck className="text-accent" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Revisar e Criar</h2>
                <p className="text-base-content/70">Confira os dados antes de criar a turma</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Basic Info */}
              <div className="premium-card p-4 bg-base-200">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <FiBook className="text-primary" />
                  Informações Básicas
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-base-content/70">Código:</span>
                    <p className="font-semibold">{formData.code}</p>
                  </div>
                  <div>
                    <span className="text-base-content/70">Disciplina:</span>
                    <p className="font-semibold">
                      {subjects?.find(s => s.id === formData.subjectId)?.name}
                    </p>
                  </div>
                  <div>
                    <span className="text-base-content/70">Ano:</span>
                    <p className="font-semibold">{formData.year}</p>
                  </div>
                  <div>
                    <span className="text-base-content/70">Semestre:</span>
                    <p className="font-semibold">{formData.semester}º Semestre</p>
                  </div>
                </div>
              </div>

              {/* Teacher */}
              <div className="premium-card p-4 bg-base-200">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <FiUser className="text-info" />
                  Professor
                </h3>
                <div className="flex items-center gap-3">
                  <div className="avatar placeholder">
                    <div className="bg-info text-info-content rounded-full w-12 h-12">
                      <span className="text-lg font-bold">
                        {teachers.find(t => t.id === formData.teacherId)?.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold">
                      {teachers.find(t => t.id === formData.teacherId)?.name}
                    </p>
                    <p className="text-sm text-base-content/70">
                      {teachers.find(t => t.id === formData.teacherId)?.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Students */}
              <div className="premium-card p-4 bg-base-200">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <FiUsers className="text-success" />
                  Alunos ({formData.studentIds.length})
                </h3>
                <div className="max-h-[200px] overflow-y-auto space-y-2">
                  {selectedStudents.map((student) => (
                    <div key={student.id} className="flex items-center gap-3 p-2 rounded bg-base-100">
                      <div className="avatar placeholder">
                        <div className="bg-neutral text-neutral-content rounded-full w-8 h-8">
                          <span className="text-xs font-bold">
                            {student.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{student.name}</p>
                        <p className="text-xs text-base-content/70 truncate">{student.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Optional Notes */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Observações (Opcional)</span>
                </label>
                <textarea
                  className="textarea textarea-bordered"
                  placeholder="Adicione observações sobre a turma..."
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={() => currentStep === 1 ? navigate('/admin/turmas') : handleBack()}
          className="btn btn-ghost"
          disabled={isSubmitting}
        >
          <FiChevronLeft />
          {currentStep === 1 ? 'Cancelar' : 'Voltar'}
        </button>

        <div className="flex gap-2">
          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="btn btn-accent"
            >
              Próximo
              <FiChevronRight />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="btn btn-success"
              disabled={!canSubmit || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Criando...
                </>
              ) : (
                <>
                  <FiCheck />
                  Criar Turma
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
