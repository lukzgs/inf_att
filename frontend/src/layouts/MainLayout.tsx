import { Outlet, Link, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiHome, FiBookOpen, FiLogOut, FiUsers, FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';

const NavItem = ({ to, icon, label, onClick }: { 
  to: string; 
  icon: React.ReactElement; 
  label: string;
  onClick?: () => void;
}) => (
  <li>
    <NavLink 
      to={to} 
      onClick={onClick}
      className={({ isActive }) => `
        flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
        font-medium
        ${isActive 
          ? 'bg-primary text-white shadow-lg shadow-primary/30' 
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-base-200'
        }
      `}
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  </li>
);

export default function MainLayout() {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white dark:bg-base-100 border-b border-gray-200 dark:border-base-300 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
            <FiBookOpen className="w-5 h-5 text-white" />
          </div>
          <Link to="/dashboard" className="text-xl font-bold text-gray-900 dark:text-white">
            INF Attendance
          </Link>
        </div>
        <button 
          onClick={toggleSidebar}
          className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-base-200 transition-colors"
          aria-label="Toggle menu"
        >
          {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
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
          w-72 bg-white dark:bg-base-100 border-r border-gray-200 dark:border-base-300
          transform transition-transform duration-300 ease-in-out
          lg:transform-none
          flex flex-col
          shadow-xl lg:shadow-none
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          {/* Logo - Only visible on desktop */}
          <div className="hidden lg:flex items-center gap-3 p-6 border-b border-gray-200 dark:border-base-300">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
              <FiBookOpen className="w-6 h-6 text-white" />
            </div>
            <Link to="/dashboard" className="text-2xl font-bold text-gray-900 dark:text-white">
              INF Attendance
            </Link>
          </div>

          {/* Mobile header inside sidebar */}
          <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-base-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                <FiBookOpen className="w-5 h-5 text-white" />
              </div>
              <Link to="/dashboard" className="text-xl font-bold text-gray-900 dark:text-white" onClick={closeSidebar}>
                INF Attendance
              </Link>
            </div>
            <button 
              onClick={closeSidebar}
              className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-base-200 transition-colors"
              aria-label="Close menu"
            >
              <FiX size={20} />
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              <NavItem 
                to="/dashboard" 
                icon={<FiHome size={20} />} 
                label="Dashboard"
                onClick={closeSidebar}
              />
              
              {user?.roles.includes('ADMIN') && (
                <NavItem 
                  to="/courses" 
                  icon={<FiBookOpen size={20} />} 
                  label="Cursos"
                  onClick={closeSidebar}
                />
              )}

              {user?.roles.includes('PROFESSOR') && (
                <NavItem 
                  to="/turmas" 
                  icon={<FiUsers size={20} />} 
                  label="Turmas"
                  onClick={closeSidebar}
                />
              )}
            </ul>
          </nav>

          {/* User Info e Logout */}
          <div className="p-4 border-t border-gray-200 dark:border-base-300">
            {/* User Card */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-base-200 dark:to-base-300 rounded-2xl p-4 mb-3">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center flex-shrink-0 shadow-lg">
                  <span className="font-bold text-lg">{user?.name?.charAt(0).toUpperCase()}</span>
                </div>
                <div className="overflow-hidden flex-1">
                  <p className="font-bold text-sm text-gray-900 dark:text-white truncate">{user?.name || 'Usuário'}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{user?.email}</p>
                </div>
              </div>
              
              {/* Role Badge */}
              <div className="flex gap-2">
                {user?.roles.includes('ADMIN') && (
                  <span className="inline-flex items-center px-2 py-1 rounded-lg bg-primary/10 text-primary text-xs font-semibold">
                    Admin
                  </span>
                )}
                {user?.roles.includes('PROFESSOR') && (
                  <span className="inline-flex items-center px-2 py-1 rounded-lg bg-info/10 text-info text-xs font-semibold">
                    Professor
                  </span>
                )}
                {user?.roles.includes('STUDENT') && (
                  <span className="inline-flex items-center px-2 py-1 rounded-lg bg-accent/10 text-accent text-xs font-semibold">
                    Aluno
                  </span>
                )}
              </div>
            </div>
            
            {/* Logout Button */}
            <button 
              onClick={() => {
                logout();
                closeSidebar();
              }}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl
                       bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 
                       hover:bg-red-100 dark:hover:bg-red-900/30
                       transition-colors font-semibold"
            >
              <FiLogOut size={20} />
              <span>Sair</span>
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
