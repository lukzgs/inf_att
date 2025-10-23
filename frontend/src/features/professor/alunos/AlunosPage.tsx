import { lazy, Suspense } from 'react';
import { LoadingPage } from '@/components/shared/LoadingPage';

const AlunosListPage = lazy(() => import('@/pages/professor/alunos/AlunosListPage'));

export default function ProfessorAlunosPage() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <AlunosListPage />
    </Suspense>
  );
}
