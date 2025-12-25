import { headers } from "next/headers";

import { CoursePreview, NewCourseDialog } from "@/components/cms/misc";
import { fetchCourses } from "@/lib/api/product";
// import { fetchCourses } from "@/mocks/product";

export default async function Page() {
  const cookie = (await headers()).get("cookie") ?? "";
  const courses = await fetchCourses(cookie);

  if (courses.error) {
    return (
      <div className="flex items-center justify-center h-full">
        <h1 className="text-4xl font-bold">Error: {courses.error.message}</h1>
      </div>
    );
  }
  const { data } = courses;

  const hiddenCourses = data.filter((course) => course.courseStatus === "HIDDEN");
  const publishedCourses = data.filter((course) => course.courseStatus !== "HIDDEN");

  return (
    <div className="flex h-full p-4 flex-col space-y-4">
      <h1 className="text-4xl font-bold">Courses</h1>

      <NewCourseDialog />

      <h3 className="text-lg font-semibold">Hidden (not yet published)</h3>
      <div className="grid grid-cols-2 gap-2">
        {hiddenCourses.map((course) => (
          <CoursePreview
            key={course.id}
            href={`/coordinator/courses/${course.id}`}
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
            href={`/coordinator/courses/${course.id}`}
            name={course.name}
            description={course.description}
          />
        ))}
      </div>
    </div>
  );
}
