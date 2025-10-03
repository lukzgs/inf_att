import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

// Interfaces
export interface Attendance {
  lessonId: number;
  userId: number;
  isPresent: boolean;
  justification?: string | null;
  editedBy?: number | null;
  editReason?: string | null;
  editedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  lesson?: {
    id: number;
    name?: string | null;
    description?: string | null;
    date: string;
    startTime: string;
    endTime: string;
    class: {
      id: number;
      code: string;
      subject: {
        id: number;
        code: string;
        name: string;
      };
    };
  };
  user?: {
    id: number;
    name: string;
    email: string;
  };
  editedByUser?: {
    id: number;
    name: string;
  } | null;
}

export interface CreateAttendanceDto {
  lessonId: number;
  userId: number;
  isPresent: boolean;
  justification?: string;
}

export interface UpdateAttendanceDto {
  isPresent?: boolean;
  justification?: string;
  editedBy?: number;
  editReason?: string;
}

export interface AttendanceFilters {
  lessonId?: number;
  userId?: number;
  isPresent?: boolean;
  startDate?: string;
  endDate?: string;
}

// API functions
const fetchAttendances = async (filters?: AttendanceFilters): Promise<Attendance[]> => {
  const params = new URLSearchParams();
  
  if (filters?.lessonId) params.append('lessonId', filters.lessonId.toString());
  if (filters?.userId) params.append('userId', filters.userId.toString());
  if (filters?.isPresent !== undefined) params.append('isPresent', filters.isPresent.toString());
  if (filters?.startDate) params.append('startDate', filters.startDate);
  if (filters?.endDate) params.append('endDate', filters.endDate);
  
  const queryString = params.toString();
  const url = `/presencas${queryString ? `?${queryString}` : ''}`;
  
  const response = await api.get<Attendance[]>(url);
  return response.data;
};

const fetchAttendancesByLesson = async (lessonId: number): Promise<Attendance[]> => {
  const response = await api.get<Attendance[]>(`/presencas?lessonId=${lessonId}`);
  return response.data;
};

const fetchAttendancesByUser = async (userId: number): Promise<Attendance[]> => {
  const response = await api.get<Attendance[]>(`/presencas?userId=${userId}`);
  return response.data;
};

const fetchAttendance = async (lessonId: number, userId: number): Promise<Attendance> => {
  const response = await api.get<Attendance>(`/presencas/${lessonId}/${userId}`);
  return response.data;
};

const createAttendance = async (data: CreateAttendanceDto): Promise<Attendance> => {
  const response = await api.post<Attendance>('/presencas', data);
  return response.data;
};

const updateAttendance = async (
  lessonId: number,
  userId: number,
  data: UpdateAttendanceDto
): Promise<Attendance> => {
  const response = await api.patch<Attendance>(`/presencas/${lessonId}/${userId}`, data);
  return response.data;
};

const deleteAttendance = async (lessonId: number, userId: number): Promise<void> => {
  await api.delete(`/presencas/${lessonId}/${userId}`);
};

// React Query hooks
export const useAttendances = (filters?: AttendanceFilters) => {
  return useQuery({
    queryKey: ['attendances', filters],
    queryFn: () => fetchAttendances(filters),
  });
};

export const useAttendancesByLesson = (lessonId: number) => {
  return useQuery({
    queryKey: ['attendances', 'lesson', lessonId],
    queryFn: () => fetchAttendancesByLesson(lessonId),
    enabled: !!lessonId,
  });
};

export const useAttendancesByUser = (userId: number) => {
  return useQuery({
    queryKey: ['attendances', 'user', userId],
    queryFn: () => fetchAttendancesByUser(userId),
    enabled: !!userId,
  });
};

export const useAttendance = (lessonId: number, userId: number) => {
  return useQuery({
    queryKey: ['attendance', lessonId, userId],
    queryFn: () => fetchAttendance(lessonId, userId),
    enabled: !!lessonId && !!userId,
  });
};

export const useCreateAttendance = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createAttendance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendances'] });
    },
  });
};

export const useUpdateAttendance = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ lessonId, userId, data }: { 
      lessonId: number; 
      userId: number; 
      data: UpdateAttendanceDto 
    }) => updateAttendance(lessonId, userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendances'] });
    },
  });
};

export const useDeleteAttendance = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ lessonId, userId }: { lessonId: number; userId: number }) => 
      deleteAttendance(lessonId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendances'] });
    },
  });
};
