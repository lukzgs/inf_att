import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiCheckCircle, 
  FiXCircle, 
  FiAlertCircle,
  FiClock,
  FiUser,
  FiBook
} from 'react-icons/fi';
import { toast } from 'sonner';
import { useAttendances, useDeleteAttendance } from '../../../hooks/useAttendances';
import { useLessons } from '../../../hooks/useLessons';
import { useUsers } from '../../../hooks/useUsers';
import { useConfirmDialog } from '../../../components/common/ConfirmDialog';

export default function PresencasListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLessonId, setFilterLessonId] = useState<number | undefined>();
  const [filterUserId, setFilterUserId] = useState<number | undefined>();
  const [filterStatus, setFilterStatus] = useState<string>('all'); // all, present, absent
  const [filterDate, setFilterDate] = useState<string>('');

  // Build filters object
  const filters = {
    lessonId: filterLessonId,
    userId: filterUserId,
    isPresent: filterStatus === 'present' ? true : filterStatus === 'absent' ? false : undefined,
    startDate: filterDate || undefined,
    endDate: filterDate || undefined,
  };

  const { data: attendances, isLoading } = useAttendances(filters);
  const { data: lessons } = useLessons();
  const { data: users } = useUsers();
  const deleteAttendance = useDeleteAttendance();
  const { confirmDialog, confirm } = useConfirmDialog();

  const handleDelete = async (lessonId: number, userId: number, userName: string, lessonName: string) => {
    const confirmed = await confirm({
      title: 'Excluir Presença',
      description: `Deseja realmente excluir a presença de "${userName}" na aula "${lessonName}"?`,
      variant: 'danger',
      onConfirm: async () => {
        await deleteAttendance.mutateAsync({ lessonId, userId });
      },
    });

    if (confirmed) {
      toast.success('Presença excluída com sucesso!');
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  // Format time
  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5);
  };

  // Format datetime for audit
  const formatDateTime = (dateTimeString: string | null | undefined) => {
    if (!dateTimeString) return '-';
    const date = new Date(dateTimeString);
    return date.toLocaleString('pt-BR');
  };

  // Filter attendances by search term
  const filteredAttendances = attendances?.filter((attendance) => {
    const userName = attendance.user?.name?.toLowerCase() || '';
    const userEmail = attendance.user?.email?.toLowerCase() || '';
    const lessonName = attendance.lesson?.name?.toLowerCase() || '';
    const subjectName = attendance.lesson?.class?.subject?.name?.toLowerCase() || '';
    const classCode = attendance.lesson?.class?.code?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();

    return (
      userName.includes(search) ||
      userEmail.includes(search) ||
      lessonName.includes(search) ||
      subjectName.includes(search) ||
      classCode.includes(search)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Presenças</h1>
          <p className="text-gray-400 mt-1">Gerencie o registro de presença dos alunos</p>
        </div>
        <Link to="/admin/presencas/novo" className="btn btn-primary">
          <FiPlus className="w-5 h-5" />
          Nova Presença
        </Link>
      </div>

      {/* Filters */}
      <div className="card bg-base-200">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Buscar</span>
              </label>
              <input
                type="text"
                placeholder="Nome, email, disciplina..."
                className="input input-bordered"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter by Lesson */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Aula</span>
              </label>
              <select
                className="select select-bordered"
                value={filterLessonId || ''}
                onChange={(e) => setFilterLessonId(e.target.value ? Number(e.target.value) : undefined)}
              >
                <option value="">Todas as aulas</option>
                {lessons?.map((lesson) => (
                  <option key={lesson.id} value={lesson.id}>
                    {lesson.name || `${lesson.class?.code || 'Turma'} - ${formatDate(lesson.date)}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by User */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Aluno</span>
              </label>
              <select
                className="select select-bordered"
                value={filterUserId || ''}
                onChange={(e) => setFilterUserId(e.target.value ? Number(e.target.value) : undefined)}
              >
                <option value="">Todos os alunos</option>
                {users?.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Status */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Status</span>
              </label>
              <select
                className="select select-bordered"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Todos</option>
                <option value="present">Presente</option>
                <option value="absent">Ausente</option>
              </select>
            </div>

            {/* Filter by Date */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Data</span>
              </label>
              <input
                type="date"
                className="input input-bordered"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card bg-base-200">
        <div className="card-body">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : filteredAttendances && filteredAttendances.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Aluno</th>
                    <th>Aula / Disciplina</th>
                    <th>Data</th>
                    <th>Justificativa</th>
                    <th>Auditoria</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttendances.map((attendance) => (
                    <tr key={`${attendance.lessonId}-${attendance.userId}`}>
                      <td>
                        {attendance.isPresent ? (
                          <div className="badge badge-success gap-2">
                            <FiCheckCircle />
                            Presente
                          </div>
                        ) : (
                          <div className="badge badge-error gap-2">
                            <FiXCircle />
                            Ausente
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <FiUser className="text-gray-400" />
                          <div>
                            <div className="font-semibold">{attendance.user?.name}</div>
                            <div className="text-sm text-gray-500">{attendance.user?.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <FiBook className="text-gray-400" />
                          <div>
                            <div className="font-semibold">
                              {attendance.lesson?.name || 'Sem título'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {attendance.lesson?.class?.code} - {attendance.lesson?.class?.subject?.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <FiClock className="text-gray-400" />
                          <div>
                            <div>{formatDate(attendance.lesson?.date || '')}</div>
                            <div className="text-sm text-gray-500">
                              {formatTime(attendance.lesson?.startTime || '')} - {formatTime(attendance.lesson?.endTime || '')}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        {attendance.justification ? (
                          <div className="flex items-start gap-2">
                            <FiAlertCircle className="text-warning flex-shrink-0 mt-1" />
                            <div className="text-sm">{attendance.justification}</div>
                          </div>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                      <td>
                        {attendance.editedBy ? (
                          <div className="text-sm">
                            <div className="font-semibold">{attendance.editedByUser?.name}</div>
                            <div className="text-gray-500">{formatDateTime(attendance.editedAt)}</div>
                            {attendance.editReason && (
                              <div className="text-gray-400 italic mt-1">{attendance.editReason}</div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <Link
                            to={`/admin/presencas/${attendance.lessonId}/${attendance.userId}/editar`}
                            className="btn btn-sm btn-ghost"
                            title="Editar"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() =>
                              handleDelete(
                                attendance.lessonId,
                                attendance.userId,
                                attendance.user?.name || 'Aluno',
                                attendance.lesson?.name || attendance.lesson?.class?.code || 'Aula'
                              )
                            }
                            className="btn btn-sm btn-ghost text-error"
                            title="Excluir"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhuma presença encontrada.</p>
            </div>
          )}
        </div>
      </div>

      {confirmDialog}
    </div>
  );
}
