import { Outlet, Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiHome, FiBookOpen, FiLogOut, FiUsers } from 'react-icons/fi';
import { useMemo } from 'react';

const NavItem = ({ to, icon, label }: { to: string, icon: React.ReactElement, label: string }) => (
  <li>
    <NavLink 
      to={to} 
      className={({ isActive }) => `
        flex items-center p-2 rounded-lg 
        ${isActive ? 'bg-primary text-primary-content' : 'text-base-content'}
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

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1">
        <aside className="w-64 bg-base-100 p-4">
          <div className="p-4 mb-4">
            <Link to="/dashboard" className="text-2xl font-bold">INF_ATT</Link>
          </div>
          
          <ul className="space-y-2 flex-grow">
            <NavItem to="/dashboard" icon={<FiHome size={20} />} label="Dashboard" />
            
            {user?.roles.includes('ADMIN') && (
              <NavItem to="/courses" icon={<FiBookOpen size={20} />} label="Cursos" />
            )}

            {user?.roles.includes('PROFESSOR') && (
              <NavItem to="/turmas" icon={<FiUsers size={20} />} label="Turmas" />
            )}
          </ul>

          {/* User Info e Logout */}
          <div className="mt-auto p-2 border-t border-base-300">
            <div className="flex items-center p-2 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-neutral-focus text-neutral-content flex items-center justify-center">
                <span>{user?.name?.charAt(0).toUpperCase()}</span>
              </div>
              <div className="ml-3">
                <p className="font-semibold text-sm">{user?.name || 'Usuário'}</p>
                <p className="text-xs text-base-content/70">{user?.email}</p>
              </div>
            </div>
            <button 
              onClick={logout}
              className="btn btn-ghost w-full justify-start text-lg"
            >
              <FiLogOut size={20} />
              <span className="ml-3">Sair</span>
            </button>
          </div>
        </aside>

        <div className="flex-1 p-6">
          <h1 className="text-3xl font-bold mb-4">{title}</h1>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
