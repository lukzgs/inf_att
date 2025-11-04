import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FiCalendar, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { api } from '@/services/api';
import { useFrequency } from '@/hooks/useFrequency';
import { ListPageSkeleton } from '@/components/common/Skeleton';
import { ErrorState } from '@/components/common/EmptyState';
import { StudentInfoPanel } from '@/components/professor/StudentInfoPanel';
import { toast } from 'sonner';

interface StudentData {
  id: number;
  name: string;
  email: string;
  uniqueIdentifier: string;
  isActive: boolean;
}

interface AttendanceRecord {
  lessonId: number;
  userId: number;
  isPresent: boolean;
  justification?: string | null;
  lesson: {
    id: number;
    date: string;
    startTime: string;
    endTime: string;
    name?: string;
    class: {
      id: number;
      code: string;
      subject: {
        id: number;
        code: string;
        name: string;
      };
    };
  };
}

export default function AlunoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { student?: StudentData; classId?: number | null };

  const [student, setStudent] = useState<StudentData | undefined>(state?.student);
  const [attendances, setAttendances] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(!student);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const studentId = Number(id);

  // Buscar dados do aluno se não vieram do state
  useEffect(() => {
    if (!student && studentId) {
      const fetchStudent = async () => {
        try {
          setIsLoading(true);
          const response = await api.get(`/usuarios/professor/student/${studentId}`);
          setStudent(response.data);
        } catch (err) {
          setIsError(true);
          setError(err instanceof Error ? err : new Error('Erro ao buscar aluno'));
          toast.error('Erro ao carregar dados do aluno');
        } finally {
          setIsLoading(false);
        }
      };

      fetchStudent();
    }
  }, [student, studentId]);

  // Buscar presenças do aluno
  useEffect(() => {
    if (studentId) {
      const fetchAttendances = async () => {
        try {
          const response = await api.get(`/presencas?userId=${studentId}`);
          setAttendances(response.data || []);
        } catch (err) {
          console.error('Erro ao buscar pressenças:', err);
          setAttendances([]);
        }
      };

      fetchAttendances();
    }
  }, [studentId]);

  // Calcular estatísticas
  const total = attendances.length;
  const present = attendances.filter(a => a.isPresent).length;
  const absent = total - present;
  const frequency = useFrequency(present, total);

  const stats = useMemo(() => {
    return {
      total,
      present,
      absent,
      frequency,
    };
  }, [total, present, absent, frequency]);

  // Preparar dados por turma
  const attendancesByClass = useMemo(() => {
    const classMap = new Map<number, { present: number; total: number; className: string; classCode: string; subjectCode: string }>();

    attendances.forEach(attendance => {
      const classId = attendance.lesson.class.id;
      const classCode = attendance.lesson.class.code;
      const subjectCode = attendance.lesson.class.subject.code;
      const className = attendance.lesson.class.subject.name;

      if (!classMap.has(classId)) {
        classMap.set(classId, {
          present: 0,
          total: 0,
          className,
          classCode,
          subjectCode,
        });
      }

      const classData = classMap.get(classId)!;
      classData.total++;
      if (attendance.isPresent) {
        classData.present++;
      }
    });

    return Array.from(classMap.entries()).map(([classId, data]) => ({
      classId,
      ...data,
      frequency: data.total > 0 ? Math.round((data.present / data.total) * 100) : 0,
    }));
  }, [attendances]);

  // Preparar dados para gráfico de linha (por data)
  const chartDataTimeline = useMemo(() => {
    const sorted = [...attendances].sort((a, b) => 
      new Date(a.lesson.date).getTime() - new Date(b.lesson.date).getTime()
    );

    return sorted.map((attendance, index) => ({
      date: new Date(attendance.lesson.date).toLocaleDateString('pt-BR'),
      present: attendance.isPresent ? 1 : 0,
      isPresent: attendance.isPresent,
      lesson: attendance.lesson.name || `Aula ${index + 1}`,
    }));
  }, [attendances]);

  // Preparar dados para gráfico de barras (frequência por turma)
  const chartDataByClass = useMemo(() => {
    return attendancesByClass.map(cls => ({
      name: `${cls.subjectCode} (${cls.classCode})`,
      frequency: cls.frequency,
      present: cls.present,
      total: cls.total,
    }));
  }, [attendancesByClass]);

  if (isLoading) {
    return <ListPageSkeleton />;
  }

  if (isError || !student) {
    return (
      <ErrorState 
        message={error?.message || 'Aluno não encontrado'} 
        onRetry={() => navigate('/professor/alunos')}
      />
    );
  }

  return (
    <div className="animate-fade-in-up">
      {/* Student Info Panel */}
      <StudentInfoPanel
        name={student.name}
        email={student.email}
        matricula={student.uniqueIdentifier}
        totalLessons={stats.total}
        attendances={stats.present}
        absences={stats.absent}
        onBack={() => navigate('/professor/alunos')}
      />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Frequência por Turma */}
        {chartDataByClass.length > 0 && (
          <div className="bg-white dark:bg-base-100 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-base-300">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Frequência por Turma
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartDataByClass}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  formatter={(value) => `${value}%`}
                />
                <Bar dataKey="frequency" fill="#3b82f6" radius={[8, 8, 0, 0]}>
                  {chartDataByClass.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.frequency >= 75 ? '#10b981' : entry.frequency >= 50 ? '#f59e0b' : '#ef4444'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2 text-sm">
              {chartDataByClass.map((cls) => (
                <div key={cls.name} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <span className="text-gray-700 dark:text-gray-300">{cls.name}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {cls.present}/{cls.total} ({cls.frequency}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timeline de Presença */}
        {chartDataTimeline.length > 0 && (
          <div className="bg-white dark:bg-base-100 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-base-300">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Histórico de Presença
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartDataTimeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={12} angle={-45} textAnchor="end" height={80} />
                <YAxis stroke="#6b7280" domain={[0, 1]} ticks={[0, 1]} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  formatter={(value) => value === 1 ? 'Presente' : 'Ausente'}
                />
                <Line 
                  type="stepAfter" 
                  dataKey="present" 
                  stroke="#3b82f6" 
                  dot={{ fill: '#3b82f6', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Attendance List */}
      {attendances.length > 0 && (
        <div className="bg-white dark:bg-base-100 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-base-300">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Histórico Completo
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-base-300">
                  <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Data</th>
                  <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Turma</th>
                  <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Aula</th>
                  <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Justificativa</th>
                </tr>
              </thead>
              <tbody>
                {attendances
                  .sort((a, b) => new Date(b.lesson.date).getTime() - new Date(a.lesson.date).getTime())
                  .map((attendance, index) => (
                    <tr 
                      key={`${attendance.lessonId}-${index}`}
                      className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="py-3 px-4 text-gray-900 dark:text-white">
                        {new Date(attendance.lesson.date).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                        {attendance.lesson.class.subject.code} ({attendance.lesson.class.code})
                      </td>
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                        {attendance.lesson.name || 'Aula'}
                      </td>
                      <td className="py-3 px-4">
                        {attendance.isPresent ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300 ring-1 ring-green-200 dark:ring-green-500/30">
                            <FiCheckCircle className="w-4 h-4" />
                            Presente
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300 ring-1 ring-red-200 dark:ring-red-500/30">
                            <FiXCircle className="w-4 h-4" />
                            Ausente
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                        {attendance.justification || '-'}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {attendances.length === 0 && (
        <div className="bg-white dark:bg-base-100 rounded-2xl p-12 text-center border border-gray-200 dark:border-base-300 shadow-md">
          <FiCalendar size={40} className="text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <p className="text-gray-900 dark:text-white font-semibold">Nenhum registro de presença</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Este aluno ainda não possui registros de presença
          </p>
        </div>
      )}
    </div>
  );
}
