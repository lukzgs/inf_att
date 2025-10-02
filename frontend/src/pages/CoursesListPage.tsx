import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useCourses } from '../hooks/useCursos';
import { api } from '../services/api';
import { Button } from '../components/common/Button';
import { ListPageSkeleton } from '../components/common/Skeleton';
import { EmptyListState, ErrorState } from '../components/common/EmptyState';
import { useConfirmDialog } from '../components/common/ConfirmDialog';
import { FiEdit2, FiPlus, FiTrash2 } from 'react-icons/fi';

export default function CoursesListPage() {
  const { data: courses, isLoading, isError, error, refetch } = useCourses();
  const { confirmDialog, confirm } = useConfirmDialog();

  const handleDelete = async (courseId: number, courseName: string) => {
    const confirmed = await confirm({
      title: 'Deletar curso?',
      description: `Tem certeza que deseja deletar o curso "${courseName}"? Esta ação não pode ser desfeita.`,
      variant: 'danger',
      confirmText: 'Deletar',
      cancelText: 'Cancelar',
      onConfirm: async () => {
        await api.delete(`/cursos/${courseId}`);
      },
    });

    if (confirmed) {
      toast.success('Curso deletado com sucesso!');
      refetch(); // Recarrega a lista
    }
  };

  if (isLoading) {
    return <ListPageSkeleton />;
  }

  if (isError) {
    return (
      <ErrorState 
        message={error?.message} 
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-xl font-semibold">Lista de Cursos</h2>
        <Button asChild size="sm">
          <Link to="/courses/new" className="flex items-center gap-2">
            <FiPlus size={18} />
            <span className="hidden sm:inline">Adicionar Curso</span>
            <span className="sm:hidden">Novo</span>
          </Link>
        </Button>
      </div>

      {courses && courses.length > 0 ? (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto bg-base-100 rounded-lg border border-base-300">
            <table className="table w-full">
              <thead>
                <tr className="border-b border-base-300">
                  <th className="bg-base-200">ID</th>
                  <th className="bg-base-200">Nome</th>
                  <th className="bg-base-200">Descrição</th>
                  <th className="bg-base-200 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {courses.map(course => (
                  <tr key={course.id} className="hover:bg-base-200/50 transition-colors">
                    <td className="font-mono text-sm">{course.id}</td>
                    <td className="font-medium">{course.name}</td>
                    <td className="text-base-content/70">{course.description}</td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button asChild variant="ghost" size="sm">
                          <Link to={`/courses/${course.id}`} className="flex items-center gap-1">
                            <FiEdit2 size={16} />
                            Editar
                          </Link>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDelete(course.id, course.name)}
                          className="text-error hover:bg-error/10"
                        >
                          <FiTrash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden grid gap-4">
            {courses.map(course => (
              <div 
                key={course.id} 
                className="bg-base-100 rounded-lg border border-base-300 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg truncate">{course.name}</h3>
                    <p className="text-xs text-base-content/50 font-mono">ID: {course.id}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button asChild variant="ghost" size="sm">
                      <Link 
                        to={`/courses/${course.id}`}
                        className="flex items-center gap-1"
                      >
                        <FiEdit2 size={16} />
                        <span className="text-xs">Editar</span>
                      </Link>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDelete(course.id, course.name)}
                      className="text-error hover:bg-error/10"
                      aria-label="Deletar curso"
                    >
                      <FiTrash2 size={16} />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-base-content/70 line-clamp-2">
                  {course.description}
                </p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <EmptyListState 
          entityName="curso" 
          onAdd={() => window.location.href = '/courses/new'}
        />
      )}

      {/* Confirm Dialog */}
      {confirmDialog}
    </div>
  );
}
