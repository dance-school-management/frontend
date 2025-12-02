import { Card, CardDescription, CardHeader, CardTitle } from "@repo/ui/card";

import { formatCurrency } from "@/lib/utils/finance";

type CoursesSummaryProps = {
  totalRevenue: number;
  averageRevenue: number;
  highestRevenue: number;
  lowestRevenue: number;
  numCourses: number;
  currency?: string;
};

export function CoursesSummary({
  totalRevenue,
  averageRevenue,
  highestRevenue,
  lowestRevenue,
  numCourses,
  currency = "PLN",
}: CoursesSummaryProps) {
  return (
    <Card className="@container/card lg:col-span-2">
      <CardHeader className="space-y-4 @md/card:space-y-6">
        <div className="space-y-1.5">
          <CardDescription>Total Revenue across {numCourses} top Courses</CardDescription>
          <CardTitle className="text-3xl font-semibold tabular-nums @sm/card:text-4xl @md/card:text-5xl">
            {formatCurrency(totalRevenue, currency)}
          </CardTitle>
        </div>

        <div className="grid grid-cols-1 gap-4 pt-2 @md/card:grid-cols-3 @md/card:gap-6">
          <div className="space-y-1">
            <CardDescription className="text-xs @md/card:text-sm">Average per Course</CardDescription>
            <CardTitle className="text-xl font-semibold tabular-nums @md/card:text-2xl">
              {formatCurrency(averageRevenue, currency)}
            </CardTitle>
          </div>

          <div className="space-y-1">
            <CardDescription className="text-xs @md/card:text-sm">Highest Revenue</CardDescription>
            <CardTitle className="text-xl font-semibold tabular-nums @md/card:text-2xl">
              {formatCurrency(highestRevenue, currency)}
            </CardTitle>
          </div>

          <div className="space-y-1">
            <CardDescription className="text-xs @md/card:text-sm">Lowest Revenue</CardDescription>
            <CardTitle className="text-xl font-semibold tabular-nums @md/card:text-2xl">
              {formatCurrency(lowestRevenue, currency)}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
