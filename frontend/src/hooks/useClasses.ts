import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export type ClassRole = 'STUDENT' | 'TEACHER' | 'ASSISTANT';
export type EnrollmentStatus = 'ENROLLED' | 'APPROVED' | 'FAILED' | 'DROPPED';

export interface UserClass {
  userId: number;
  classId: number;
  role: ClassRole;
  status?: EnrollmentStatus;
  user?: {
    id: number;
    name: string;
    email: string;
    uniqueIdentifier: string;
  };
}

export interface Class {
  id: number;
  code: string;
  year: number;
  semester: number;
  subjectId: number;
  subject?: {
    id: number;
    code: string;
    name: string;
    type: string;
    credits: number;
    workload: number;
  };
  users?: UserClass[];
  lessons?: {
    id: number;
    name?: string;
    description?: string;
    date: string;
    startTime: string;
    endTime: string;
    classId: number;
    isOpen: boolean;
    openedAt?: string;
    closedAt?: string;
    openedBy?: number;
    hasAttendancePassword?: boolean;
    createdAt?: string;
    updatedAt?: string;
  }[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateClassDto {
  code: string;
  year: number;
  semester: number;
  subjectId: number;
}

export interface UpdateClassDto {
  code?: string;
  year?: number;
  semester?: number;
  subjectId?: number;
}

export interface AddUserToClassDto {
  userId: number;
  role: ClassRole;
  status?: EnrollmentStatus;
}

// Função para buscar todas as turmas
const fetchClasses = async (): Promise<Class[]> => {
  const response = await api.get<Class[]>('/turmas');
  return response.data;
};

// Função para buscar uma turma por ID
const fetchClassById = async (id: number): Promise<Class> => {
  const response = await api.get<Class>(`/turmas/${id}`);
  return response.data;
};

// Hook para buscar todas as turmas
export const useClasses = () => {
  return useQuery<Class[], Error>({
    queryKey: ['classes'],
    queryFn: fetchClasses,
  });
};

// Hook para buscar uma turma específica
export const useClass = (id?: number) => {
  return useQuery<Class, Error>({
    queryKey: ['classes', id],
    queryFn: () => fetchClassById(id!),
    enabled: !!id && id > 0,
  });
};
