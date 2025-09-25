import { Link } from 'react-router-dom';
import { useCourses } from '../hooks/useCursos';
import { Button } from '../components/common/Button';

export default function CoursesListPage() {
  const { data: courses, isLoading, isError, error } = useCourses();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center text-error">
        Error loading courses: {error?.message}
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Courses</h1>
        <Button asChild>
          <Link to="/courses/new">Add New Course</Link>
        </Button>
      </div>

      {courses && courses.length > 0 ? (
        <div className="mt-4 overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map(course => (
                <tr key={course.id}>
                  <td>{course.id}</td>
                  <td>{course.name}</td>
                  <td>{course.description}</td>
                  <td className="text-right">
                    <Button asChild variant="ghost" size="sm">
                      <Link to={`/courses/${course.id}`}>Edit</Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-4 text-center text-gray-500">No courses found.</div>
      )}
    </div>
  );
}


