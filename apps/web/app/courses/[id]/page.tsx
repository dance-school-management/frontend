import { Badge } from "@repo/ui/badge";
import { Separator } from "@repo/ui/separator";
import { compareAsc } from "date-fns";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CourseClassItem } from "@/components/courses/course-class-item";
import { fetchCoursesClasses } from "@/lib/api/product";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const courseId = parseInt(id, 10);

  if (isNaN(courseId)) {
    notFound();
  }

  const { data, error } = await fetchCoursesClasses([courseId]);
  if (error || !data || data.length === 0) {
    notFound();
  }

  const courseData = data[0];
  if (!courseData) {
    notFound();
  }

  const { courseData: course, classes } = courseData;
  const sortedClasses = [...classes].sort((a, b) => compareAsc(a.startDate, b.startDate));

  return (
    <div className="w-full p-2 md:p-4 space-y-8">
      <div className="w-full p-4 flex items-center justify-center">
        <div className="max-w-4xl w-full space-y-8">
          <section className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-3xl lg:text-4xl font-bold">{course.name}</h1>

              <div className="flex flex-wrap gap-2">
                <Link href="/about/styles">
                  <Badge
                    variant="outline"
                    className="text-sm px-3 py-1 hover:bg-accent transition-colors cursor-pointer"
                  >
                    {course.danceCategory.name}
                  </Badge>
                </Link>
                <Badge variant="outline" className="text-sm px-3 py-1">
                  {course.advancementLevel.name}
                </Badge>
                <Badge variant={course.courseStatus === "SALE" ? "default" : "secondary"} className="text-sm px-3 py-1">
                  {course.courseStatus}
                </Badge>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h2 className="text-xl font-semibold">About this course</h2>
              <p className="text-muted-foreground">{course.description}</p>
            </div>

            {(course.advancementLevel.description || course.danceCategory.description) && (
              <>
                <Separator />
                <div className="space-y-3 text-sm">
                  {course.danceCategory.description && (
                    <div>
                      <p className="font-semibold text-foreground mb-1">About {course.danceCategory.name}:</p>
                      <p className="text-muted-foreground">{course.danceCategory.description}</p>
                    </div>
                  )}
                  {course.advancementLevel.description && (
                    <div>
                      <p className="font-semibold text-foreground mb-1">About {course.advancementLevel.name} level:</p>
                      <p className="text-muted-foreground">{course.advancementLevel.description}</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </section>

          <Separator />

          {sortedClasses.length > 0 && (
            <section className="space-y-4">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold">Classes in this course</h2>
                <p className="text-muted-foreground">
                  {sortedClasses.length} {sortedClasses.length === 1 ? "class" : "classes"} available
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sortedClasses.map((cls) => (
                  <CourseClassItem key={cls.id} classData={cls} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
