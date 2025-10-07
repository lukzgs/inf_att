import { useState, useEffect } from 'react';
import { FiBell, FiCheck, FiX, FiCalendar, FiUsers, FiBookOpen, FiAlertCircle } from 'react-icons/fi';
import { formatDistanceToNow } from '@/utils/date';

export interface Notification {
  id: number;
  type: 'lesson_opened' | 'lesson_closed' | 'low_frequency' | 'new_class' | 'class_updated' | 'info';
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  metadata?: {
    classId?: number;
    lessonId?: number;
    userId?: number;
    [key: string]: any;
  };
}

interface NotificationCenterProps {
  className?: string;
}

export function NotificationCenter({ className = '' }: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Mock notifications para demonstração
  useEffect(() => {
    // TODO: Substituir por chamada real à API
    const mockNotifications: Notification[] = [
      {
        id: 1,
        type: 'lesson_opened',
        title: 'Aula Iniciada',
        message: 'Professor João iniciou a aula de Algoritmos I',
        createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 min atrás
        read: false,
        metadata: { lessonId: 123, classId: 45 },
      },
      {
        id: 2,
        type: 'low_frequency',
        title: 'Frequência Baixa',
        message: 'Sua frequência em Estruturas de Dados está em 72%',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2h atrás
        read: false,
        metadata: { classId: 67 },
      },
      {
        id: 3,
        type: 'new_class',
        title: 'Nova Turma',
        message: 'Você foi adicionado à turma INF202-2024-1',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 dia atrás
        read: true,
        metadata: { classId: 89 },
      },
      {
        id: 4,
        type: 'lesson_closed',
        title: 'Aula Encerrada',
        message: 'A aula de Banco de Dados foi encerrada',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 dias atrás
        read: true,
        metadata: { lessonId: 456, classId: 34 },
      },
    ];

    setNotifications(mockNotifications);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'lesson_opened':
      case 'lesson_closed':
        return <FiCalendar className="text-info" size={20} />;
      case 'low_frequency':
        return <FiAlertCircle className="text-warning" size={20} />;
      case 'new_class':
      case 'class_updated':
        return <FiUsers className="text-success" size={20} />;
      default:
        return <FiBookOpen className="text-primary" size={20} />;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'lesson_opened':
      case 'lesson_closed':
        return 'border-l-info';
      case 'low_frequency':
        return 'border-l-warning';
      case 'new_class':
      case 'class_updated':
        return 'border-l-success';
      default:
        return 'border-l-primary';
    }
  };

  const handleMarkAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
    // TODO: Chamar API para marcar como lida
    // await api.patch(`/notifications/${id}/read`);
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    // TODO: Chamar API para marcar todas como lidas
    // await api.patch('/notifications/read-all');
  };

  const handleDelete = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    // TODO: Chamar API para deletar notificação
    // await api.delete(`/notifications/${id}`);
  };

  const handleToggle = () => {
    setIsOpen(prev => !prev);
    // Fechar dropdown ao clicar fora
    if (!isOpen) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    const dropdown = document.getElementById('notification-dropdown');
    const button = document.getElementById('notification-button');
    
    if (
      dropdown &&
      button &&
      !dropdown.contains(e.target as Node) &&
      !button.contains(e.target as Node)
    ) {
      setIsOpen(false);
      document.removeEventListener('click', handleClickOutside);
    }
  };

  useEffect(() => {
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className={`dropdown dropdown-end ${className}`}>
      {/* Bell Button */}
      <button
        id="notification-button"
        onClick={handleToggle}
        className="btn btn-ghost btn-circle relative"
        aria-label={`Notificações${unreadCount > 0 ? ` - ${unreadCount} não lida${unreadCount > 1 ? 's' : ''}` : ''}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <FiBell size={22} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
            <span className="relative inline-flex rounded-full h-5 w-5 bg-error text-white text-xs font-bold items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          id="notification-dropdown"
          className="dropdown-content mt-3 z-[100] premium-card w-[calc(100vw-2rem)] sm:w-96 max-h-[600px] flex flex-col shadow-2xl"
          style={{ transform: 'translateX(0)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-base-300">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <FiBell className="text-primary" />
              Notificações
              {unreadCount > 0 && (
                <span className="badge badge-error badge-sm">{unreadCount}</span>
              )}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="btn btn-ghost btn-xs"
                title="Marcar todas como lidas"
              >
                <FiCheck size={16} />
                Marcar todas
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <FiBell size={48} className="text-base-content/20 mb-3" />
                <p className="text-base-content/70 font-medium">Nenhuma notificação</p>
                <p className="text-base-content/50 text-sm mt-1">
                  Você está em dia!
                </p>
              </div>
            ) : (
              <div className="divide-y divide-base-300">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`
                      p-4 transition-colors border-l-4 
                      ${getNotificationColor(notification.type)}
                      ${notification.read ? 'bg-base-100' : 'bg-primary/5 hover:bg-primary/10'}
                    `}
                  >
                    <div className="flex gap-3">
                      {/* Icon */}
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className={`font-semibold text-sm ${!notification.read ? 'text-base-content' : 'text-base-content/80'}`}>
                              {notification.title}
                            </p>
                            <p className="text-sm text-base-content/70 mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                          </div>

                          {/* Delete Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(notification.id);
                            }}
                            className="btn btn-ghost btn-xs btn-circle opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remover"
                          >
                            <FiX size={14} />
                          </button>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-base-content/50">
                            {formatDistanceToNow(new Date(notification.createdAt))}
                          </span>
                          
                          {!notification.read && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(notification.id);
                              }}
                              className="text-xs text-primary hover:underline font-medium"
                            >
                              Marcar como lida
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-base-300 p-3 text-center">
              <button className="btn btn-ghost btn-sm w-full">
                Ver todas as notificações
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
