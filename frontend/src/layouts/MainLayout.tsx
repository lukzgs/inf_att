import { Outlet, Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiHome, FiBookOpen, FiLogOut, FiUsers, FiMenu, FiX } from 'react-icons/fi';
import { useMemo, useState } from 'react';

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
        flex items-center p-3 rounded-lg transition-colors
        ${isActive ? 'bg-primary text-primary-content' : 'text-base-content hover:bg-base-200'}
      `}
    >
      {icon}
      <span className="ml-3">{label}</span>
    </NavLink>
  </li>
);

export default function MainLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const title = useMemo(() => {
    const path = location.pathname.split('/').pop();
    if (location.pathname.includes('/courses/edit')) return 'Editar Curso';
    if (location.pathname.includes('/courses/new')) return 'Novo Curso';
    if (location.pathname.includes('/courses/')) return 'Detalhes do Curso';
    switch (path) {
      case 'dashboard':
        return 'Dashboard';
      case 'courses':
        return 'Meus Cursos';
      case 'turmas':
        return 'Minhas Turmas';
      default:
        return 'Início';
    }
  }, [location.pathname]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Mobile Header */}
      <header className="lg:hidden bg-base-100 border-b border-base-300 p-4 flex items-center justify-between">
        <Link to="/dashboard" className="text-xl font-bold">INF_ATT</Link>
        <button 
          onClick={toggleSidebar}
          className="btn btn-ghost btn-square"
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
          w-64 bg-base-100 border-r border-base-300
          transform transition-transform duration-300 ease-in-out
          lg:transform-none
          flex flex-col
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          {/* Logo - Only visible on desktop */}
          <div className="hidden lg:block p-6 border-b border-base-300">
            <Link to="/dashboard" className="text-2xl font-bold">INF_ATT</Link>
          </div>

          {/* Mobile close button */}
          <div className="lg:hidden flex items-center justify-between p-4 border-b border-base-300">
            <Link to="/dashboard" className="text-xl font-bold" onClick={closeSidebar}>
              INF_ATT
            </Link>
            <button 
              onClick={closeSidebar}
              className="btn btn-ghost btn-sm btn-square"
              aria-label="Close menu"
            >
              <FiX size={20} />
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
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
          <div className="p-4 border-t border-base-300">
            <div className="flex items-center p-2 rounded-lg mb-2">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-content flex items-center justify-center flex-shrink-0">
                <span className="font-semibold">{user?.name?.charAt(0).toUpperCase()}</span>
              </div>
              <div className="ml-3 overflow-hidden">
                <p className="font-semibold text-sm truncate">{user?.name || 'Usuário'}</p>
                <p className="text-xs text-base-content/70 truncate">{user?.email}</p>
              </div>
            </div>
            <button 
              onClick={() => {
                logout();
                closeSidebar();
              }}
              className="btn btn-ghost w-full justify-start gap-3"
            >
              <FiLogOut size={20} />
              <span>Sair</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">{title}</h1>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
