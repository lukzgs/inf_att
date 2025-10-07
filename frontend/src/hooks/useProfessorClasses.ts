import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import type { Class } from './useClasses';

export interface ProfessorClassWithStats extends Class {
  totalStudents: number;
  _count?: {
    users: number;
  };
}

export const useProfessorClasses = () => {
  const { user } = useAuth();

  return useQuery<ProfessorClassWithStats[], Error>({
    queryKey: ['professor-classes', user?.id],
    queryFn: async () => {
      if (!user) {
        return [];
      }

      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Token não encontrado');
      }

      const response = await fetch('http://localhost:3000/turmas/professor/minhas-turmas', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar turmas do professor');
      }

      const classes = await response.json();

      return classes.map((cls: any) => ({
        ...cls,
        totalStudents: cls._count?.users || 0,
      }));
    },
    enabled: !!user,
  });
};
