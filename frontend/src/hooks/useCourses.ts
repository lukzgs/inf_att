import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

interface Course {
  id: number;
  name: string;
  description: string;
  // Add other course properties as they are defined in the backend
}

const fetchCourses = async (): Promise<Course[]> => {
  const response = await api.get<Course[]>('/courses');
  return response.data;
};

export const useCourses = () => {
  return useQuery<Course[], Error>({
    queryKey: ['courses'],
    queryFn: fetchCourses,
  });
};
