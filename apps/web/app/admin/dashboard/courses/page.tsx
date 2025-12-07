import { Card, CardDescription, CardHeader, CardTitle } from "@repo/ui/card";
import { headers } from "next/headers";

import { CourseCard } from "@/components/dashboard/course-card";
import { CoursesSummary } from "@/components/dashboard/courses-summary";
import { getBestPerformingCourses } from "@/lib/api/finance";

interface CoursesPageProps {
  searchParams: Promise<{ start?: string; end?: string }>;
}

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const { start, end } = await searchParams;

  const cookie = (await headers()).get("cookie") ?? "";
  const { data, error } = await getBestPerformingCourses(start, end, 10, cookie);

  if (error || !data) {
    return <div>Error: {error?.message}</div>;
  }

  const totalRevenue = data.items.reduce((acc, item) => acc + item.revenue, 0);
  const averageRevenue = totalRevenue / data.items.length;
  const highestRevenue = Math.max(...data.items.map((item) => item.revenue));
  const lowestRevenue = Math.min(...data.items.map((item) => item.revenue));

  return (
    <>
      {data.items.length === 0 && <EmptyState />}
      {data.items.length > 0 && (
        <CoursesSummary
          totalRevenue={totalRevenue}
          averageRevenue={averageRevenue}
          highestRevenue={highestRevenue}
          lowestRevenue={lowestRevenue}
          numCourses={data.items.length}
        />
      )}
      {data.items.map((item) => (
        <CourseCard key={item.courseId} courseId={item.courseId} name={item.name} revenue={item.revenue} />
      ))}
    </>
  );
}

function EmptyState() {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>No courses found</CardTitle>
        <CardDescription>No courses found for the selected time period</CardDescription>
      </CardHeader>
    </Card>
  );
}
