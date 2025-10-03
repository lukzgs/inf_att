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
