import { CoursePreview, NewCourseDialog } from "@/components/cms/courses-misc";
// import { fetchCourses } from "@/lib/api/course";
import { fetchCourses } from "./mocks";

export default async function Page() {
  const courses = await fetchCourses();

  if (courses.error) {
    return (
      <div className="flex items-center justify-center h-full">
        <h1 className="text-4xl font-bold">Error: {courses.error.message}</h1>
      </div>
    );
  }
  const { data } = courses;

  const hiddenCourses = data.filter((course) => course.courseStatus === "HIDDEN");
  const publishedCourses = data.filter(
    (course) => course.courseStatus !== "HIDDEN"
  );

  return (
    <div className="flex h-full p-4 flex-col space-y-4">
      <h1 className="text-4xl font-bold">Courses</h1>

      <NewCourseDialog />

      <h3 className="text-lg font-semibold">Hidden (not yet published)</h3>
      <div className="grid grid-cols-2 gap-2">
        {hiddenCourses.map((course) => (
          <CoursePreview
            key={course.id}
            id={course.id}
            name={course.name}
            description={course.description}
          />
        ))}
      </div>

      <h3 className="text-lg font-semibold">Published</h3>
      <div className="grid grid-cols-2 gap-2">
        {publishedCourses.map((course) => (
          <CoursePreview
            key={course.id}
            id={course.id}
            name={course.name}
            description={course.description}
          />
        ))}
      </div>
    </div>
  );
}