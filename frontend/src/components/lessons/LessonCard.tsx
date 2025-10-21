import { FiClock, FiEdit2, FiTrash2, FiLock, FiUnlock, FiMoreVertical, FiCalendar, FiCheckCircle, FiX } from 'react-icons/fi';
import { useState } from 'react';
import { formatDateShort } from '@/utils/format';

interface LessonCardProps {
  lesson: {
    id: number;
    name?: string;
    description?: string;
    date: string;
    startTime: string;
    endTime: string;
    isOpen: boolean;
    closedAt?: string | null;
    isCanceled?: boolean;
    class?: {
      code: string;
      subject?: {
        name: string;
      };
    };
  };
  onEdit?: (lessonId: number) => void;
  onDelete?: (lessonId: number) => void;
  onOpen?: (lessonId: number) => void;
  onClose?: (lessonId: number) => void;
  onView?: (lessonId: number) => void;
  isAdmin?: boolean;
  // Props para seleção múltipla
  isSelected?: boolean;
  onToggleSelect?: (lessonId: number) => void;
  showSelectCheckbox?: boolean;
}

export function LessonCard({
  lesson,
  onEdit,
  onDelete,
  onOpen,
  onClose,
  onView,
  isAdmin = false,
  isSelected = false,
  onToggleSelect,
  showSelectCheckbox = false,
}: LessonCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  // Extrair data e hora
  // Formatação de horário - lida com DateTime retornado pelo Prisma como "1970-01-01THH:mm:ss.000Z"
  const formatTime = (timeStr: string) => {
    if (!timeStr) return '00:00';
    
    // Se for ISO datetime (1970-01-01THH:mm:ss.000Z), extrai HH:mm
    if (timeStr.includes('T')) {
      return timeStr.split('T')[1].substring(0, 5);
    }
    
    // Se já for HH:mm, retorna como está
    if (timeStr.length === 5 && timeStr.includes(':')) {
      return timeStr;
    }
    
    // Fallback
    return timeStr.substring(0, 5);
  };

  const startTimeStr = formatTime(lesson.startTime);
  const endTimeStr = formatTime(lesson.endTime);

  // Determinar status da aula
  const getLessonStatus = () => {
    if (lesson.isCanceled) {
      return {
        status: 'canceled',
        icon: <FiX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600 dark:text-red-400" />,
        bgColor: 'bg-red-50 dark:bg-red-500/10 ring-2 ring-red-200 dark:ring-red-500/30',
      };
    }
    
    // Verificar se a aula está em progresso ou já passou
    const now = new Date();
    try {
      // Parse da data sem conversão UTC - extrai componentes localmente
      let year: number, month: number, day: number;
      
      if (lesson.date.includes('T')) {
        // Se for ISO DateTime (ex: 2024-10-16T00:00:00.000Z)
        const dateObj = new Date(lesson.date);
        year = dateObj.getUTCFullYear();
        month = dateObj.getUTCMonth();
        day = dateObj.getUTCDate();
      } else {
        // Se for apenas data YYYY-MM-DD, parse manualmente
        const [y, m, d] = lesson.date.split('-').map(Number);
        year = y;
        month = m - 1; // Month é 0-indexed
        day = d;
      }
      
      // Criar timestamps para início e término usando componentes extraídos localmente
      const [startHours, startMinutes] = startTimeStr.split(':').map(Number);
      const [endHours, endMinutes] = endTimeStr.split(':').map(Number);
      
      const startDateTime = new Date(year, month, day, startHours, startMinutes, 0, 0);
      const endDateTime = new Date(year, month, day, endHours, endMinutes, 0, 0);
      
      // Se a aula já foi fechada manualmente, considerar como concluída
      if (lesson.closedAt) {
        return {
          status: 'completed',
          icon: <FiCheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 dark:text-green-400" />,
          bgColor: 'bg-green-50 dark:bg-green-500/10 ring-2 ring-green-200 dark:ring-green-500/30',
        };
      }
      
      // Se está dentro do horário da aula, é "em progresso"
      if (now >= startDateTime && now <= endDateTime) {
        return {
          status: 'in-progress',
          icon: <FiClock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500 dark:text-orange-400" />,
          bgColor: 'bg-orange-50 dark:bg-orange-500/10 ring-2 ring-orange-200 dark:ring-orange-500/30',
        };
      }
      
      // Se passou o horário de término, é concluída
      const isPast = endDateTime < now;
      if (isPast) {
        return {
          status: 'completed',
          icon: <FiCheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 dark:text-green-400" />,
          bgColor: 'bg-green-50 dark:bg-green-500/10 ring-2 ring-green-200 dark:ring-green-500/30',
        };
      }
    } catch (error) {
      // Fallback se houver erro no parsing
      console.error('Erro ao parsear data da aula:', error, 'lesson.date:', lesson.date);
    }
    
    return {
      status: 'scheduled',
      icon: <FiCalendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />,
      bgColor: 'bg-primary/10 ring-2 ring-primary/20',
    };
  };

  const lessonStatus = getLessonStatus();

  return (
    <div
      className={`card-premium group hover:scale-102 transition-all duration-300 bg-white dark:bg-gray-800 border rounded-lg shadow-md p-4 sm:p-6 ${
        isSelected 
          ? 'border-primary bg-primary/5 dark:bg-primary/10' 
          : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer'
      }`}
      onClick={() => !showSelectCheckbox && onView?.(lesson.id)}
    >
      {/* Card Header */}
      <div className="mb-3 sm:mb-4 flex items-start justify-between gap-3">
        {/* Checkbox para seleção múltipla */}
        {showSelectCheckbox && (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              onToggleSelect?.(lesson.id);
            }}
            className="checkbox checkbox-primary checkbox-sm mt-1 flex-shrink-0"
          />
        )}
        
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1 truncate group-hover:text-primary transition-colors">
            {lesson.name}
          </h3>
          {lesson.description && (
            <p className="text-xs sm:text-sm text-gray-600 dark:text-base-content/70 line-clamp-2 mb-1">
              {lesson.description}
            </p>
          )}
          {lesson.class && (
            <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <p className="text-xs font-semibold text-gray-900 dark:text-white mb-1">
                {(lesson.class.subject as any)?.code || 'DISC'}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                {lesson.class.subject?.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Turma: {lesson.class.code}
              </p>
            </div>
          )}
        </div>

        {/* Menu button */}
        {(isAdmin || onEdit || onDelete) && (
          <div className="relative flex-shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-2 rounded-lg hover:bg-gray-300/50 dark:hover:bg-base-200/50 transition-all opacity-0 group-hover:opacity-100 sm:opacity-100 hover:scale-110"
            >
              <FiMoreVertical className="w-5 h-5" />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 mt-1 w-52 bg-white dark:bg-base-100 rounded-xl shadow-xl border border-gray-200/50 dark:border-base-300/50 z-10 overflow-hidden">
                {onEdit && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(lesson.id);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-base-200 flex items-center gap-3 text-sm transition-colors text-gray-900 dark:text-white font-medium"
                  >
                    <FiEdit2 className="w-4 h-4" />
                    Editar Aula
                  </button>
                )}

                {isAdmin && (
                  <>
                    {lesson.isOpen ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onClose?.(lesson.id);
                          setShowMenu(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-warning/10 dark:hover:bg-warning/10 flex items-center gap-3 text-sm transition-colors text-warning font-medium"
                      >
                        <FiLock className="w-4 h-4" />
                        Fechar Presença
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpen?.(lesson.id);
                          setShowMenu(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-success/10 dark:hover:bg-success/10 flex items-center gap-3 text-sm transition-colors text-success font-medium"
                      >
                        <FiUnlock className="w-4 h-4" />
                        Abrir Presença
                      </button>
                    )}
                  </>
                )}

                {onDelete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(lesson.id);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-3 text-sm transition-colors text-red-500 font-medium border-t border-gray-200/30 dark:border-base-300/30"
                  >
                    <FiTrash2 className="w-4 h-4" />
                    Deletar
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-gray-200 dark:border-base-content/10">
        {/* Data com Status */}
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg ${lessonStatus.bgColor} flex items-center justify-center flex-shrink-0`}>
            {lessonStatus.icon}
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs text-gray-600 dark:text-base-content/70">Data</p>
            <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
              {formatDateShort(lesson.date)}
            </p>
          </div>
        </div>

        {/* Horário */}
        <div className="flex items-center gap-2 justify-end">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 ring-2 ring-blue-200 dark:ring-blue-500/30 flex items-center justify-center flex-shrink-0">
            <FiClock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs text-gray-600 dark:text-base-content/70">Horário</p>
            <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
              {startTimeStr} - {endTimeStr}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
