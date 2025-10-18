/**
 * LessonStatusFilter - Componente reutilizável para filtrar aulas por status
 * 
 * Oferece opções:
 * - Todas: todas as aulas
 * - Agendadas: aulas com data/hora no futuro
 * - Realizadas: aulas que já passaram ou foram fechadas
 */

interface LessonStatusFilterProps {
  /**
   * Valor do filtro atual
   */
  value: 'all' | 'scheduled' | 'completed';
  /**
   * Função chamada quando o filtro muda
   */
  onChange: (value: 'all' | 'scheduled' | 'completed') => void;
  /**
   * Classes CSS adicionais para o container
   */
  className?: string;
}

export function LessonStatusFilter({
  value,
  onChange,
  className = '',
}: LessonStatusFilterProps) {
  return (
    <div className={`flex gap-1.5 bg-gray-100 dark:bg-base-300 rounded-lg p-1 ${className}`}>
      <button
        onClick={() => onChange('all')}
        className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${
          value === 'all'
            ? 'bg-white dark:bg-base-100 text-primary shadow-sm'
            : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
        }`}
        title="Mostrar todas as aulas"
      >
        Todas
      </button>
      <button
        onClick={() => onChange('scheduled')}
        className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${
          value === 'scheduled'
            ? 'bg-white dark:bg-base-100 text-primary shadow-sm'
            : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
        }`}
        title="Mostrar apenas aulas agendadas"
      >
        Agendadas
      </button>
      <button
        onClick={() => onChange('completed')}
        className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${
          value === 'completed'
            ? 'bg-white dark:bg-base-100 text-primary shadow-sm'
            : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
        }`}
        title="Mostrar apenas aulas realizadas"
      >
        Realizadas
      </button>
    </div>
  );
}
