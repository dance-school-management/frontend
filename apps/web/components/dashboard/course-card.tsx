import { Card, CardDescription, CardHeader, CardTitle } from "@repo/ui/card";

import { CourseItem } from "@/lib/model/finance";
import { formatCurrency } from "@/lib/utils/finance";

type CourseCardProps = CourseItem & {
  currency?: string;
};

export function CourseCard({ name, revenue, currency = "PLN" }: CourseCardProps) {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle className="text-base font-medium">{name}</CardTitle>
        <CardDescription>Course Revenue</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @sm/card:text-3xl">
          {formatCurrency(revenue, currency)}
        </CardTitle>
      </CardHeader>
    </Card>
  );
}
