import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export interface Lesson {
  id: number;
  name?: string;
  description?: string;
  date: string; // ISO date string
  startTime: string; // Time string (HH:mm)
  endTime: string; // Time string (HH:mm)
  classId: number;
  class?: {
    id: number;
    code: string;
    year: number;
    semester: number;
    subject?: {
      code: string;
      name: string;
    };
  };
  isOpen: boolean;
  openedAt?: string;
  closedAt?: string;
  openedBy?: number;
  hasAttendancePassword?: boolean; // Flag indicating if lesson requires password for attendance
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateLessonDto {
  name?: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  classId: number;
  attendancePassword?: string;
}

export interface UpdateLessonDto {
  name?: string;
  description?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  classId?: number;
}

export interface OpenLessonDto {
  openedBy: number;
}

// Função para buscar todas as aulas
const fetchLessons = async (): Promise<Lesson[]> => {
  const response = await api.get<Lesson[]>('/aulas');
  return response.data;
};

// Função para buscar aulas de uma turma específica (por endpoint turma)
const fetchLessonsByClass = async (classId: number): Promise<Lesson[]> => {
  const response = await api.get<Lesson[]>(`/turmas/${classId}/aulas`);
  return response.data;
};

// Função para buscar aulas de uma turma específica (por endpoint aulas)
const fetchClassLessons = async (classId: number): Promise<Lesson[]> => {
  const response = await api.get<Lesson[]>(`/aulas/turma/${classId}`);
  return response.data;
};

// Função para buscar uma aula por ID
const fetchLessonById = async (id: number): Promise<Lesson> => {
  const response = await api.get<Lesson>(`/aulas/${id}`);
  return response.data;
};

// Hook para buscar todas as aulas
export const useLessons = () => {
  return useQuery<Lesson[], Error>({
    queryKey: ['lessons'],
    queryFn: fetchLessons,
  });
};

// Hook para buscar aulas de uma turma específica
export const useLessonsByClass = (classId?: number) => {
  return useQuery<Lesson[], Error>({
    queryKey: ['lessons', 'class', classId],
    queryFn: () => fetchLessonsByClass(classId!),
    enabled: !!classId && classId > 0,
  });
};

// Hook para buscar aulas de uma turma específica (usando endpoint aulas/turma)
export const useClassLessons = (classId?: number) => {
  return useQuery<Lesson[], Error>({
    queryKey: ['aulas', 'turma', classId],
    queryFn: () => fetchClassLessons(classId!),
    enabled: !!classId && classId > 0,
  });
};

// Hook para buscar uma aula específica
export const useLesson = (id?: number) => {
  return useQuery<Lesson, Error>({
    queryKey: ['lessons', id],
    queryFn: () => fetchLessonById(id!),
    enabled: !!id && id > 0,
  });
};
