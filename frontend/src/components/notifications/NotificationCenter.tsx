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
        return <FiCalendar className="text-info dark:text-info/90" size={18} />;
      case 'low_frequency':
        return <FiAlertCircle className="text-warning dark:text-warning/90" size={18} />;
      case 'new_class':
      case 'class_updated':
        return <FiUsers className="text-success dark:text-success/90" size={18} />;
      default:
        return <FiBookOpen className="text-primary dark:text-primary/90" size={18} />;
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
  };

  const handleClickOutside = (e: MouseEvent) => {
    const dropdownDesktop = document.getElementById('notification-dropdown');
    const dropdownMobile = document.getElementById('notification-dropdown-mobile');
    const button = document.getElementById('notification-button');
    
    if (
      (dropdownDesktop || dropdownMobile) &&
      button &&
      !dropdownDesktop?.contains(e.target as Node) &&
      !dropdownMobile?.contains(e.target as Node) &&
      !button.contains(e.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [isOpen]);

  return (
    <div className={`relative ${className}`}>
      {/* Bell Button */}
      <button
        id="notification-button"
        onClick={handleToggle}
        className="p-2 rounded-2xl hover:bg-gray-100 dark:hover:bg-base-200 transition-colors relative text-gray-700 dark:text-gray-300"
        aria-label={`Notificações${unreadCount > 0 ? ` - ${unreadCount} não lida${unreadCount > 1 ? 's' : ''}` : ''}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <FiBell size={22} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
            <span className="relative inline-flex rounded-full h-5 w-5 bg-error text-white text-xs font-bold items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </span>
        )}
      </button>

      {/* Overlay for mobile - closes on click */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[99] bg-black/40 md:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Dropdown Mobile */}
      {isOpen && (
        <div
          id="notification-dropdown-mobile"
          className="fixed left-4 right-4 top-1/2 -translate-y-1/2 z-[100] bg-white dark:bg-base-100 rounded-2xl w-auto max-h-[85vh] flex flex-col shadow-2xl border border-gray-200 dark:border-base-300 md:hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-base-300 bg-gradient-to-r from-white to-gray-50 dark:from-base-100 dark:to-gray-800/50 rounded-t-2xl flex-shrink-0">
            <h3 className="text-base font-extrabold flex items-center gap-2 text-gray-900 dark:text-white">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <FiBell className="text-primary" size={18} />
              </div>
              <span className="truncate">Notificações</span>
              {unreadCount > 0 && (
                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-error text-white text-xs font-bold flex-shrink-0">{unreadCount}</span>
              )}
            </h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-primary hover:bg-primary/10 transition-colors text-xs font-semibold flex-shrink-0"
                  title="Marcar todas como lidas"
                >
                  <FiCheck size={16} />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-200 dark:hover:text-gray-300 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
                title="Fechar"
              >
                <FiX size={18} />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                  <FiBell size={32} className="text-gray-400 dark:text-gray-500" />
                </div>
                <p className="text-gray-900 dark:text-white font-semibold">Nenhuma notificação</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  Você está em dia!
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleMarkAsRead(notification.id)}
                    className={`
                      px-4 py-3 transition-all duration-200 cursor-pointer group
                      ${notification.read 
                        ? 'bg-white dark:bg-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-700/50' 
                        : 'bg-gradient-to-r from-primary/5 to-primary/2 dark:from-primary/15 dark:to-primary/5 hover:from-primary/10 hover:to-primary/5 dark:hover:from-primary/20 dark:hover:to-primary/10'
                      }
                    `}
                  >
                    <div className="flex gap-3">
                      {/* Icon Container */}
                      <div className={`flex-shrink-0 mt-0.5 p-2 rounded-lg transition-colors ${
                        !notification.read 
                          ? 'bg-primary/15 dark:bg-primary/25' 
                          : 'bg-gray-100 dark:bg-gray-700/50'
                      }`}>
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex-1">
                            <p className={`text-sm font-bold transition-colors ${
                              !notification.read 
                                ? 'text-gray-900 dark:text-white' 
                                : 'text-gray-800 dark:text-gray-300'
                            }`}>
                              {notification.title}
                            </p>
                          </div>

                          {/* Delete Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(notification.id);
                            }}
                            className="p-1.5 rounded-lg text-gray-400 dark:text-gray-500 hover:text-error hover:bg-error/10 dark:hover:bg-error/20 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                            title="Remover"
                          >
                            <FiX size={16} />
                          </button>
                        </div>

                        {/* Message */}
                        <p className={`text-xs line-clamp-2 transition-colors ${
                          !notification.read
                            ? 'text-gray-700 dark:text-gray-200'
                            : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          {notification.message}
                        </p>

                        {/* Footer */}
                        <div className="flex items-center justify-between mt-2 gap-2">
                          <span className={`text-xs transition-colors ${
                            !notification.read
                              ? 'text-gray-600 dark:text-gray-400'
                              : 'text-gray-500 dark:text-gray-500'
                          }`}>
                            {formatDistanceToNow(new Date(notification.createdAt))}
                          </span>
                          
                          {!notification.read && (
                            <div className="flex items-center gap-1.5">
                              <div className="w-2 h-2 rounded-full bg-primary/60 dark:bg-primary/80"></div>
                              <span className="text-xs font-medium text-primary dark:text-primary">Novo</span>
                            </div>
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
            <div className="border-t border-gray-100 dark:border-gray-700/50 bg-gradient-to-r from-gray-50/50 to-gray-50/30 dark:from-gray-800/30 dark:to-gray-800/20 p-3 rounded-b-2xl">
              <button className="w-full px-4 py-2.5 text-sm font-semibold text-primary bg-primary/5 hover:bg-primary/10 dark:bg-primary/10 dark:hover:bg-primary/15 rounded-lg transition-all duration-200">
                Ver todas as notificações
              </button>
            </div>
          )}
        </div>
      )}

      {/* Dropdown Desktop */}
      {isOpen && (
        <div
          id="notification-dropdown"
          className="fixed right-4 top-20 w-96 z-[100] bg-white dark:bg-base-100 rounded-2xl max-h-[600px] flex flex-col shadow-2xl border border-gray-200 dark:border-base-300 hidden md:flex"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-200 dark:border-base-300 bg-gradient-to-r from-white to-gray-50 dark:from-base-100 dark:to-gray-800/50 rounded-t-2xl flex-shrink-0">
            <h3 className="text-base sm:text-lg font-extrabold flex items-center gap-2 text-gray-900 dark:text-white">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <FiBell className="text-primary" size={18} />
              </div>
              <span className="truncate">Notificações</span>
              {unreadCount > 0 && (
                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-error text-white text-xs font-bold flex-shrink-0">{unreadCount}</span>
              )}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-primary hover:bg-primary/10 transition-colors text-xs font-semibold flex-shrink-0"
                title="Marcar todas como lidas"
              >
                <FiCheck size={16} />
                <span className="hidden sm:inline">Marcar</span>
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                  <FiBell size={32} className="text-gray-400 dark:text-gray-500" />
                </div>
                <p className="text-gray-900 dark:text-white font-semibold">Nenhuma notificação</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  Você está em dia!
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleMarkAsRead(notification.id)}
                    className={`
                      px-4 sm:px-5 py-3 sm:py-4 transition-all duration-200 cursor-pointer group
                      ${notification.read 
                        ? 'bg-white dark:bg-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-700/50' 
                        : 'bg-gradient-to-r from-primary/5 to-primary/2 dark:from-primary/15 dark:to-primary/5 hover:from-primary/10 hover:to-primary/5 dark:hover:from-primary/20 dark:hover:to-primary/10'
                      }
                    `}
                  >
                    <div className="flex gap-3 sm:gap-4">
                      {/* Icon Container */}
                      <div className={`flex-shrink-0 mt-0.5 p-2 rounded-lg transition-colors ${
                        !notification.read 
                          ? 'bg-primary/15 dark:bg-primary/25' 
                          : 'bg-gray-100 dark:bg-gray-700/50'
                      }`}>
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex-1">
                            <p className={`text-sm font-bold transition-colors ${
                              !notification.read 
                                ? 'text-gray-900 dark:text-white' 
                                : 'text-gray-800 dark:text-gray-300'
                            }`}>
                              {notification.title}
                            </p>
                          </div>

                          {/* Delete Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(notification.id);
                            }}
                            className="p-1.5 rounded-lg text-gray-400 dark:text-gray-500 hover:text-error hover:bg-error/10 dark:hover:bg-error/20 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                            title="Remover"
                          >
                            <FiX size={16} />
                          </button>
                        </div>

                        {/* Message */}
                        <p className={`text-xs sm:text-sm line-clamp-2 transition-colors ${
                          !notification.read
                            ? 'text-gray-700 dark:text-gray-200'
                            : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          {notification.message}
                        </p>

                        {/* Footer */}
                        <div className="flex items-center justify-between mt-2 gap-2">
                          <span className={`text-xs transition-colors ${
                            !notification.read
                              ? 'text-gray-600 dark:text-gray-400'
                              : 'text-gray-500 dark:text-gray-500'
                          }`}>
                            {formatDistanceToNow(new Date(notification.createdAt))}
                          </span>
                          
                          {!notification.read && (
                            <div className="flex items-center gap-1.5">
                              <div className="w-2 h-2 rounded-full bg-primary/60 dark:bg-primary/80"></div>
                              <span className="text-xs font-medium text-primary dark:text-primary">Novo</span>
                            </div>
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
            <div className="border-t border-gray-100 dark:border-gray-700/50 bg-gradient-to-r from-gray-50/50 to-gray-50/30 dark:from-gray-800/30 dark:to-gray-800/20 p-3 sm:p-4 rounded-b-2xl">
              <button className="w-full px-4 py-2.5 text-sm font-semibold text-primary bg-primary/5 hover:bg-primary/10 dark:bg-primary/10 dark:hover:bg-primary/15 rounded-lg transition-all duration-200">
                Ver todas as notificações
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
