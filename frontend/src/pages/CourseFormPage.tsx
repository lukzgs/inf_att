import { useParams, useNavigate } from 'react-router-dom';
import CourseForm from '../components/CourseForm';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

interface Course {
  id: number;
  name: string;
  description: string;
}

const fetchCourseById = async (id: string): Promise<Course> => {
  const response = await api.get<Course>(`/courses/${id}`);
  return response.data;
};

export default function CourseFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: course, isLoading, isError, error } = useQuery<Course, Error>({
    queryKey: ['course', id],
    queryFn: () => fetchCourseById(id!),
    enabled: !!id, // Only run this query if an ID is present (i.e., in edit mode)
  });

  const handleSuccess = () => {
    navigate('/courses'); // Go back to the courses list after successful submission
  };

  if (id && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (id && isError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-error">
        Error loading course: {error?.message}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-lg shadow-2xl bg-base-100">
        <CourseForm initialData={id ? course : undefined} onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
