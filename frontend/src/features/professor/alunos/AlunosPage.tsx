import { lazy, Suspense } from 'react';
import { LoadingPage } from '@/components/shared/LoadingPage';

const UsuariosListPage = lazy(() => import('@/pages/admin/usuarios/UsuariosListPage'));

export default function ProfessorAlunosPage() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <UsuariosListPage />
    </Suspense>
  );
}
