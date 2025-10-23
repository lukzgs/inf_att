import { useState } from 'react';
import { useProfessorStudents } from '@/hooks/useUsers';
import { ListPageSkeleton } from '@/components/common/Skeleton';
import { EmptyListState, ErrorState } from '@/components/common/EmptyState';

export default function AlunosListPage() {
  const { data: students, isLoading, isError, error, refetch } = useProfessorStudents();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
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

  // Filtro de busca
  const filteredStudents = students?.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.uniqueIdentifier.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  }) || [];

  if (filteredStudents.length === 0) {
    return (
      <EmptyListState
        entityName="aluno"
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Alunos
        </h1>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
          {filteredStudents.length} {filteredStudents.length === 1 ? 'aluno' : 'alunos'} encontrado{filteredStudents.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar por nome, email ou matrícula..."
          value={searchTerm}
          onChange={handleSearch}
          className="input input-bordered w-full bg-white dark:bg-base-100 text-gray-900 dark:text-white border-gray-200 dark:border-base-content/20 focus:border-primary transition-all"
        />
      </div>

      {/* Students List */}
      <div className="space-y-3">
        {filteredStudents.map((student) => (
          <div 
            key={student.id}
            className="bg-white dark:bg-base-100 rounded-lg p-4 border border-gray-200 dark:border-base-content/10 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {student.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {student.uniqueIdentifier}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {student.email}
                </p>
              </div>
              <div className="text-right">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  student.isActive 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    : 'bg-gray-100 dark:bg-gray-700/30 text-gray-700 dark:text-gray-300'
                }`}>
                  {student.isActive ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
