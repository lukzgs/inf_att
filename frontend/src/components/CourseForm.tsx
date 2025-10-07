import { useState, type FormEvent, useEffect } from 'react'; // Fixed FormEvent import
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

interface Course {
  id?: number; // Optional for creation
  name: string;
  description: string;
}

interface CourseFormProps {
  initialData?: Course; // For editing existing courses
  onSuccess?: () => void;
}

const createCourse = async (newCourse: Course): Promise<Course> => {
  const response = await api.post<Course>('/courses', newCourse);
  return response.data;
};

const updateCourse = async (updatedCourse: Course): Promise<Course> => {
  if (!updatedCourse.id) {
    throw new Error('Course ID is required for updating.');
  }
  const response = await api.patch<Course>(`/courses/${updatedCourse.id}`, updatedCourse);
  return response.data;
};

export default function CourseForm({ initialData, onSuccess }: CourseFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description);
    }
  }, [initialData]);

  const mutation = useMutation<Course, Error, Course>({
    mutationFn: initialData ? updateCourse : createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] }); // Invalidate courses list to refetch
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/courses'); // Navigate back to list after success
      }
    },
    onError: (err: Error) => {
      setError(`Failed to ${initialData ? 'update' : 'create'} course: ${err.message}`);
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const courseData: Course = { name, description };
    if (initialData?.id) {
      courseData.id = initialData.id;
    }

    mutation.mutate(courseData);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="card-body p-4 sm:p-6">
        <h2 className="card-title text-xl sm:text-2xl justify-center mb-4 sm:mb-6">
          {initialData ? 'Editar Curso' : 'Criar Novo Curso'}
        </h2>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Nome do Curso</span>
          </label>
          <input
            type="text"
            placeholder="ex: Introdução à Programação"
            className="input input-bordered w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Descrição</span>
          </label>
          <textarea
            placeholder="ex: Aprenda os fundamentos da programação com Python."
            className="textarea textarea-bordered h-24 sm:h-32 w-full resize-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        {error && (
          <div className="alert alert-error py-3 text-sm">
            <span>{error}</span>
          </div>
        )}
        {mutation.isError && (
          <div className="alert alert-error py-3 text-sm">
            <span>{mutation.error.message}</span>
          </div>
        )}

        <div className="form-control mt-6 gap-3">
          <button 
            type="submit" 
            className="btn btn-accent" 
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : initialData ? (
              'Atualizar Curso'
            ) : (
              'Criar Curso'
            )}
          </button>
          
          <button 
            type="button" 
            className="btn btn-ghost"
            onClick={() => navigate('/courses')}
            disabled={mutation.isPending}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}