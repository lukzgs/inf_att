import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export type SubjectType = 'THEORETICAL' | 'PRACTICAL' | 'THEORETICAL_PRACTICAL';

export interface Subject {
  id: number;
  code: string;
  name: string;
  type: SubjectType;
  credits: number;
  workload: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSubjectDto {
  code: string;
  name: string;
  type: SubjectType;
  credits: number;
  workload: number;
}

export interface UpdateSubjectDto {
  code?: string;
  name?: string;
  type?: SubjectType;
  credits?: number;
  workload?: number;
}

// Função para buscar todas as disciplinas
const fetchSubjects = async (): Promise<Subject[]> => {
  const response = await api.get<Subject[]>('/disciplinas');
  return response.data;
};

// Função para buscar uma disciplina por ID
const fetchSubjectById = async (id: number): Promise<Subject> => {
  const response = await api.get<Subject>(`/disciplinas/${id}`);
  return response.data;
};

// Hook para buscar todas as disciplinas
export const useSubjects = () => {
  return useQuery<Subject[], Error>({
    queryKey: ['subjects'],
    queryFn: fetchSubjects,
  });
};

// Hook para buscar uma disciplina específica
export const useSubject = (id?: number) => {
  return useQuery<Subject, Error>({
    queryKey: ['subjects', id],
    queryFn: () => fetchSubjectById(id!),
    enabled: !!id && id > 0,
  });
};
