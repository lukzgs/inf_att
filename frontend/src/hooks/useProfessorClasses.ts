import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
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

      const response = await api.get('/turmas/professor/minhas-turmas');
      const classes = response.data;

      return classes.map((cls: any) => ({
        ...cls,
        totalStudents: cls._count?.users || 0,
      }));
    },
    enabled: !!user,
  });
};
