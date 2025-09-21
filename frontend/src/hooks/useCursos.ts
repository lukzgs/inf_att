import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

interface Course {
  id: number;
  name: string;
  description: string;
}

const fetchCourses = async (): Promise<Course[]> => {
  const response = await api.get<Course[]>('/cursos');
  return response.data;
};

export const useCourses = () => {
  return useQuery<Course[], Error>({
    queryKey: ['courses'],
    queryFn: fetchCourses,
  });
};
