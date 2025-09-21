import { useCourses } from '../hooks/useCursos'; // Corrected path
import Button from '../components/common/Button';

export default function CoursesListPage() {
  const { data: courses, isLoading, isError, error } = useCourses();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-error">
        Error loading courses: {error?.message}
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Courses List</h1>
      
      <div className="flex justify-end mb-4">
        <Button to="/courses/new" className="btn btn-primary">
          Add New Course
        </Button>
      </div>

      {courses && courses.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id}>
                  <td>{course.id}</td>
                  <td>{course.name}</td>
                  <td>{course.description}</td>
                  <td>
                    <Button to={`/courses/${course.id}`} className="btn btn-ghost btn-sm">
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-gray-500">No courses found.</div>
      )}
    </div>
  );
}

