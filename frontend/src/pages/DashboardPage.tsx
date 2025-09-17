import { useAuth } from '../contexts/AuthContext';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-2">
        Bem-vindo, {user?.name || 'Usuário'}!
      </p>
      
      <div className="mt-6">
        <button onClick={logout} className="btn btn-secondary">
          Logout
        </button>
      </div>
    </div>
  );
}
