import { Card, CardDescription, CardHeader, CardTitle } from "@repo/ui/card";

import { CourseCard } from "@/components/dashboard/course-card";
import { CoursesSummary } from "@/components/dashboard/courses-summary";

const data = {
  period: { start: "2025-10-01", end: "2025-10-31" },
  totalCourses: 125,
  items: [
    {
      courseId: 123,
      name: "Bachata",
      revenue: 5000.0,
    },
    {
      courseId: 456,
      name: "Salsa",
      revenue: 3000.0,
    },
  ],
};

export default function CoursesPage() {
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
