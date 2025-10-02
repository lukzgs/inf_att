import { Link } from 'react-router-dom';
import { useCourses } from '../hooks/useCursos';
import { Button } from '../components/common/Button';
import { FiEdit2, FiPlus } from 'react-icons/fi';

export default function CoursesListPage() {
  const { data: courses, isLoading, isError, error } = useCourses();

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <p className="text-error text-lg font-semibold">Erro ao carregar cursos</p>
          <p className="text-base-content/70 mt-2">{error?.message}</p>
        </div>
      </div>
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
                      <Button asChild variant="ghost" size="sm">
                        <Link to={`/courses/${course.id}`} className="flex items-center justify-end gap-2">
                          <FiEdit2 size={16} />
                          Editar
                        </Link>
                      </Button>
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
                  <Button asChild variant="ghost" size="sm">
                    <Link 
                      to={`/courses/${course.id}`}
                      className="flex items-center gap-1 flex-shrink-0"
                    >
                      <FiEdit2 size={16} />
                      <span className="text-xs">Editar</span>
                    </Link>
                  </Button>
                </div>
                <p className="text-sm text-base-content/70 line-clamp-2">
                  {course.description}
                </p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className="text-center max-w-sm">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-lg font-semibold mb-2">Nenhum curso encontrado</h3>
            <p className="text-base-content/70 mb-6">
              Comece adicionando seu primeiro curso para gerenciar.
            </p>
            <Button asChild>
              <Link to="/courses/new" className="flex items-center gap-2">
                <FiPlus size={18} />
                Adicionar Primeiro Curso
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}


