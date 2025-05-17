import { CoursePreview, NewCourseDialog } from "@/components/cms/courses-misc";

async function getCourses() {
  // TODO: replace with actual API call
  return [
    {
      id: 1,
      name: "Course name",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      status: "hidden",
    },
    {
      id: 2,
      name: "Course name",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      status: "published",
    },
    {
      id: 3,
      name: "Course name",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      status: "published",
    },
    {
      id: 4,
      name: "Course name",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      status: "published",
    },
  ];
}

export default async function Page() {
  const courses = await getCourses();

  const hiddenCourses = courses.filter((course) => course.status === "hidden");
  const publishedCourses = courses.filter(
    (course) => course.status === "published"
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