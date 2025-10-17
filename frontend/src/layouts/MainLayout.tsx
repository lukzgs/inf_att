import { Outlet, Link, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiHome, FiBookOpen, FiLogOut, FiUsers, FiMenu, FiX, FiBarChart2, FiChevronLeft, FiClipboard, FiAward } from 'react-icons/fi';
import { useState } from 'react';
import { NotificationCenter } from '../components/notifications/NotificationCenter';

const NavItem = ({ to, icon, label, onClick, collapsed }: { 
  to: string; 
  icon: React.ReactElement; 
  label: string;
  onClick?: () => void;
  collapsed?: boolean;
}) => (
  <li>
    <NavLink 
      to={to} 
      onClick={onClick}
      title={collapsed ? label : ''}
      className={({ isActive }) => `
        flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-2xl transition-all duration-200
        font-medium relative group
        ${isActive 
          ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-base-300' 
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-base-200'
        }
      `}
    >
      <span className="flex-shrink-0">{icon}</span>
      {!collapsed && <span>{label}</span>}
      
      {/* Tooltip para versão colapsada */}
      {collapsed && (
        <div className="absolute left-full ml-2 px-3 py-1 bg-gray-900 dark:bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap 
                        opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 font-medium">
          {label}
        </div>
      )}
    </NavLink>
  </li>
);

export default function MainLayout() {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Mobile & Tablet Header */}
      <header className="lg:hidden bg-white dark:bg-base-100 border-b border-gray-200 dark:border-base-300 px-4 py-3 flex items-center justify-between shadow-sm rounded-b-3xl">
        <div className="flex items-center gap-3">
        <button 
            onClick={toggleSidebar}
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-base-200 transition-colors"
            aria-label="Toggle menu"
          >
            {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
          <span className="font-bold text-lg text-gray-900 dark:text-white">INF</span>
        </div>
        <div className="flex items-center gap-2">
          <NotificationCenter />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={closeSidebar}
            aria-hidden="true"
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-50
          bg-white dark:bg-base-100 border-r border-gray-200 dark:border-base-300
          transform transition-all duration-300 ease-in-out
          lg:transform-none
          flex flex-col
          shadow-xl lg:shadow-none
          rounded-r-3xl lg:rounded-r-3xl
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'w-20 lg:w-20' : 'w-72 lg:w-72'}
        `}>
          {/* User Profile Header - Desktop */}
          <div className={`hidden lg:flex items-center justify-between p-4 lg:p-6 border-b border-gray-200 dark:border-base-300 ${isCollapsed ? 'lg:flex-col lg:gap-4' : ''}`}>
            <Link 
              to="/profile"
              className={`flex items-center ${isCollapsed ? 'lg:flex-col lg:w-full lg:justify-center' : 'gap-3 flex-1'}`}
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-white flex items-center justify-center flex-shrink-0 shadow-lg">
                <span className="font-bold text-lg">{user?.name?.charAt(0).toUpperCase()}</span>
              </div>
              {!isCollapsed && (
                <div className="overflow-hidden flex-1">
                  <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{user?.name || 'Usuário'}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{user?.email}</p>
                </div>
              )}
            </Link>
            
            {/* Collapse Button */}
            <button 
              onClick={toggleCollapse}
              className="flex items-center justify-center w-8 h-8 rounded-xl hover:bg-gray-100 dark:hover:bg-base-200 transition-colors text-gray-600 dark:text-gray-400"
              title={isCollapsed ? 'Expandir sidebar' : 'Recolher sidebar'}
            >
              <FiChevronLeft size={20} className={`transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Mobile Header - Only on mobile/tablet */}
          <div className="lg:hidden flex items-center justify-between p-3 border-b border-gray-200 dark:border-base-300">
            <Link 
              to="/profile"
              onClick={closeSidebar}
              className="flex items-center gap-3 flex-1"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-white flex items-center justify-center shadow-lg">
                <span className="font-bold">{user?.name?.charAt(0).toUpperCase()}</span>
              </div>
              <div className="overflow-hidden flex-1">
                <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{user?.name || 'Usuário'}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{user?.email}</p>
              </div>
            </Link>
            <button 
              onClick={closeSidebar}
              className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-base-200 transition-colors"
            >
              <FiX size={20} />
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-2 lg:p-4">
            <ul className="space-y-1">
              {/* Navigation Section Label */}
              {!isCollapsed && (
                <li className="hidden lg:block px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Navegação
                </li>
              )}
              <NavItem 
                to="/dashboard" 
                icon={<FiHome size={20} />} 
                label="Dashboard"
                onClick={closeSidebar}
                collapsed={isCollapsed}
              />
              
              {/* Notifications Item - Desktop only */}
              <li className="hidden lg:block">
                <NotificationCenter variant="nav-item" collapsed={isCollapsed} />
              </li>
              
              {/* Admin Section */}
              {user?.roles?.includes('ADMIN') && (
                <>
                  {!isCollapsed && (
                    <li className="hidden lg:block px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-4">
                      Administração
                    </li>
                  )}
                  <NavItem 
                    to="/courses" 
                    icon={<FiBookOpen size={20} />} 
                    label="Cursos"
                    onClick={closeSidebar}
                    collapsed={isCollapsed}
                  />
                  <NavItem 
                    to="/statistics" 
                    icon={<FiBarChart2 size={20} />} 
                    label="Estatísticas"
                    onClick={closeSidebar}
                    collapsed={isCollapsed}
                  />
                </>
              )}

              {/* Professor Section */}
              {user?.roles?.includes('PROFESSOR') && (
                <>
                  {!isCollapsed && (
                    <li className="hidden lg:block px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-4">
                      Docência
                    </li>
                  )}
                  <NavItem 
                    to="/turmas" 
                    icon={<FiUsers size={20} />} 
                    label="Turmas"
                    onClick={closeSidebar}
                    collapsed={isCollapsed}
                  />
                  <NavItem 
                    to="/professor/aulas" 
                    icon={<FiClipboard size={20} />} 
                    label="Aulas"
                    onClick={closeSidebar}
                    collapsed={isCollapsed}
                  />
                  <NavItem 
                    to="/professor/alunos" 
                    icon={<FiAward size={20} />} 
                    label="Alunos"
                    onClick={closeSidebar}
                    collapsed={isCollapsed}
                  />
                </>
              )}
            </ul>
          </nav>

          {/* Logout Section */}
          <div className={`p-2 lg:p-4 border-t border-gray-200 dark:border-base-300`}>
            {/* Logout Button */}
            <button 
              onClick={() => {
                logout();
                closeSidebar();
              }}
              title="Desconectar"
              className={`w-full flex items-center ${isCollapsed ? 'lg:justify-center' : 'justify-center lg:justify-start gap-3'} px-3 py-2 lg:py-2.5 rounded-2xl
                       bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 
                       hover:bg-red-100 dark:hover:bg-red-900/30
                       transition-colors font-semibold text-sm`}
            >
              <FiLogOut size={18} className="flex-shrink-0" />
              {!isCollapsed && <span className="hidden lg:inline">Desconectar</span>}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-base-200">
          <div className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
