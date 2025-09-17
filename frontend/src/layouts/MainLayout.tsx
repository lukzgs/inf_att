import { Outlet, Link, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiHome, FiBookOpen, FiLogOut, FiMenu, FiUser } from 'react-icons/fi';

export default function MainLayout() {
  const { user, logout } = useAuth();

  const NavItem = ({ to, icon, label }: { to: string, icon: React.ReactElement, label: string }) => (
    <li>
      <NavLink 
        to={to} 
        className={({ isActive }) => 
          `flex items-center p-2 text-lg rounded-lg transition-colors duration-200 ${
            isActive 
              ? 'bg-primary text-primary-content' 
              : 'hover:bg-base-300'
          }`
        }
      >
        {icon}
        <span className="ml-3">{label}</span>
      </NavLink>
    </li>
  );

  return (
    <div className="drawer lg:drawer-open bg-base-100">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Navbar para mobile */}
        <div className="navbar bg-base-200 lg:hidden sticky top-0 z-30">
          <div className="flex-none">
            <label htmlFor="my-drawer-2" className="btn btn-square btn-ghost">
              <FiMenu size={24} />
            </label>
          </div>
          <div className="flex-1 px-2">
            <Link to="/dashboard" className="text-xl font-bold">INF_ATT</Link>
          </div>
        </div>

        {/* Conteúdo da Página */}
        <main className="flex-grow p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div> 
      <div className="drawer-side z-40">
        <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label> 
        
        <aside className="menu p-4 w-80 min-h-full bg-base-200 text-base-content flex flex-col">
          <div className="p-4 mb-4 border-b border-base-300">
            <Link to="/dashboard" className="text-2xl font-bold">INF_ATT</Link>
          </div>
          
          <ul className="space-y-2 flex-grow">
            <NavItem to="/dashboard" icon={<FiHome size={20} />} label="Dashboard" />
            <NavItem to="/courses" icon={<FiBookOpen size={20} />} label="Cursos" />
          </ul>

          {/* User Info e Logout */}
          <div className="mt-auto p-2 border-t border-base-300">
            <div className="flex items-center p-2 rounded-lg hover:bg-base-300">
              <FiUser size={20} />
              <div className="ml-3">
                <p className="font-semibold text-sm">{user?.name || 'Usuário'}</p>
                <p className="text-xs text-base-content/70">{user?.email}</p>
              </div>
            </div>
            <button 
              onClick={logout} 
              className="w-full flex items-center p-2 mt-2 text-lg rounded-lg transition-colors duration-200 hover:bg-error hover:text-error-content"
            >
              <FiLogOut size={20} />
              <span className="ml-3">Logout</span>
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
