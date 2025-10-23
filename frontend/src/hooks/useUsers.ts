import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export interface User {
  id: number;
  uniqueIdentifier: string;
  name: string;
  email: string;
  isActive: boolean;
  curriculumId?: number;
  createdAt: string;
  updatedAt: string;
  roles?: UserRole[];
}

export interface UserRole {
  roleId: number;
  role: {
    id: number;
    name: 'USER' | 'ADMIN' | 'PROFESSOR';
  };
}

export interface CreateUserDto {
  uniqueIdentifier: string;
  name: string;
  email: string;
  password: string;
  isActive?: boolean;
  curriculumId?: number;
  roleIds?: number[]; // IDs dos roles a serem atribuídos
}

export interface UpdateUserDto {
  uniqueIdentifier?: string;
  name?: string;
  email?: string;
  password?: string;
  isActive?: boolean;
  curriculumId?: number;
}

const fetchUsers = async (): Promise<User[]> => {
  const response = await api.get<User[]>('/usuarios');
  return response.data;
};

const fetchUserById = async (id: number): Promise<User> => {
  const response = await api.get<User>(`/usuarios/${id}`);
  return response.data;
};

export const useUsers = () => {
  return useQuery<User[], Error>({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });
};

export const useUser = (id: number) => {
  return useQuery<User, Error>({
    queryKey: ['users', id],
    queryFn: () => fetchUserById(id),
    enabled: !!id, // Só busca se ID existir
  });
};

export const useProfessorStudents = () => {
  return useQuery<User[], Error>({
    queryKey: ['professor-students'],
    queryFn: async () => {
      try {
        // Primeiro busca as turmas do professor
        const classesResponse = await api.get('/turmas');
        const classes = classesResponse.data || [];

        // Extrai todos os alunos únicos de todas as turmas
        const studentsMap = new Map<number, User>();
        
        classes.forEach((classItem: any) => {
          const users = classItem.users || [];
          users.forEach((uc: any) => {
            if (uc.role === 'STUDENT' && uc.user) {
              studentsMap.set(uc.user.id, uc.user);
            }
          });
        });

        return Array.from(studentsMap.values());
      } catch (error) {
        console.error('Erro ao buscar alunos do professor:', error);
        return [];
      }
    },
  });
};
