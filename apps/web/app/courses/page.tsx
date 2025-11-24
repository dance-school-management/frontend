import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@repo/ui/empty";
import { headers } from "next/headers";

import { CourseScheduleCard } from "@/components/courses/course-schedule-card";
import { fetchCoursesClasses,fetchScheduleCourses } from "@/lib/api/product";


export default async function Page() {
  const cookie = (await headers()).get('cookie') ?? "";
  const { data, error } = await fetchScheduleCourses(cookie);
  const { data: classes, error: classesError } = await fetchCoursesClasses(data?.map((course) => course.id) ?? [], cookie);

  if (error || !data || data.length === 0 || classesError || !classes || classes.length === 0) {
    return (
      <div className="flex flex-col p-4">
        <Headings />
        <EmptyState />
      </div >
    );
  }

  return (
    <>
      <div className="flex flex-col p-4">
        <Headings />
      </div>
      <div className="flex h-full p-4 flex-col gap-4 w-full items-center">
        {classes.map((course) => (
          <CourseScheduleCard key={course.courseData.id} course={course.courseData} classes={course.classes} />
        ))}
      </div>
    </>
  );
}

function Headings() {
  return (
    <div className="flex flex-col p-4">
      <h1 className="text-4xl font-bold">Available courses</h1>
      <h3 className="text-lg text-muted-foreground">Click on a course to view details, like class schedule, etc.</h3>
    </div>
  );
}

function EmptyState() {
  return (
    <Empty className="max-w-xl w-full p-4 md:p-4 border border-solid mx-auto mt-4">
      <EmptyHeader>
        <EmptyTitle>No courses found</EmptyTitle>
        <EmptyDescription>
          We weren&apos;t able to find any courses. Please try again later.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}