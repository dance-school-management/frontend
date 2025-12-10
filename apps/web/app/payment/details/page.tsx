import { ClassDetails, CourseDetails } from "@/components/payments/details";
import { EmptyState } from "@/components/payments/empty-state";
import { fetchCoursesClasses, fetchPublicClass } from "@/lib/api/product";

interface PageProps {
  searchParams: Promise<{ classId?: string; courseId?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const { classId, courseId } = await searchParams;

  if (!classId && !courseId) {
    return (
      <EmptyState
        title="Nothing picked yet"
        description="Choose a class or course to see the payment details we’ve prepared for you."
      />
    );
  }

  const classIdInt = parseInt(classId ?? "", 10);
  const courseIdInt = parseInt(courseId ?? "", 10);

  if (isNaN(classIdInt) && isNaN(courseIdInt)) {
    return (
      <EmptyState
        title="That link looks off"
        description="We couldn’t read this link. Please pick a class or course from the schedule and try again."
      />
    );
  }

  if (!isNaN(courseIdInt)) {
    const { data, error } = await fetchCoursesClasses([courseIdInt]);
    if (error || !data || data.length === 0) {
      return (
        <EmptyState
          title="Course not available right now"
          description="We couldn’t load this course. Please choose a different course or try again shortly."
        />
      );
    }
    const { courseData, classes } = data[0]!;
    if (!courseData) {
      return (
        <EmptyState
          title="Course not available right now"
          description="We couldn’t load this course. Please choose a different course or try again shortly."
        />
      );
    }

    return <CourseDetails courseData={courseData} classes={classes} />;
  }

  if (!isNaN(classIdInt)) {
    const { data: classData, error } = await fetchPublicClass(classIdInt);
    if (error || !classData) {
      return (
        <EmptyState
          title="Class unavailable"
          description="We couldn’t load this class. Please pick another class or try again shortly."
        />
      );
    }

    return <ClassDetails classData={classData} />;
  }
}
