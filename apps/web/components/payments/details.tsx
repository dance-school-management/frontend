import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@repo/ui/card";
import { Separator } from "@repo/ui/separator";
import Link from "next/link";

import { PaymentCTA } from "@/components/payments/cta";
import type { ClassWithTemplate, CourseSummary } from "@/lib/model/product";
import { moneyLabel } from "@/lib/utils/finance";
import { formatDateTime, formatDurationLabel } from "@/lib/utils/time";

interface CourseDetailsProps {
  courseData: CourseSummary;
  classes: ClassWithTemplate[];
}

export function CourseDetails({ courseData, classes }: CourseDetailsProps) {
  const sortedClasses = [...classes].sort((a, b) => Date.parse(a.startDate) - Date.parse(b.startDate));
  const firstClass = sortedClasses[0];
  const coursePrice = courseData.price ?? null;

  const lastClassEndTs = sortedClasses.reduce<number | undefined>((latest, cls) => {
    const ts = Date.parse(cls.endDate ?? "");
    if (Number.isNaN(ts)) return latest;
    return Math.max(latest ?? ts, ts);
  }, undefined);

  const lastClassEndIso = lastClassEndTs ? new Date(lastClassEndTs).toISOString() : undefined;
  const lastClassEnd = lastClassEndIso && formatDateTime(lastClassEndIso);

  const courseSpan =
    firstClass && lastClassEndIso ? formatDurationLabel(firstClass.startDate, lastClassEndIso) : undefined;

  const classCount = sortedClasses.length;
  const scheduleSummary =
    classCount > 0 ?
      `${classCount} class${classCount > 1 ? "es" : ""} starting ${formatDateTime(firstClass?.startDate) ?? "TBD"}`
    : "No classes scheduled";

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-6">
      <Card>
        <CardHeader>
          <CardTitle>Course payment</CardTitle>
          <CardDescription>Review your course order before proceeding.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
            <div className="space-y-1">
              <p className="text-lg font-semibold">{courseData.name}</p>
              <p className="text-sm text-muted-foreground">
                {courseData.danceCategory?.name ?? "Category"} · {courseData.advancementLevel?.name ?? "Level"}
              </p>
              <p className="text-sm text-muted-foreground">{scheduleSummary}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold text-foreground">{moneyLabel(coursePrice)}</p>
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <InfoRow label="Course ID" value={`#${courseData.id}`} />
            <InfoRow label="Classes" value={sortedClasses.length ? String(sortedClasses.length) : "0"} />
            <InfoRow label="First class" value={formatDateTime(firstClass?.startDate)} />
            <InfoRow label="Last class ends" value={lastClassEnd} />
            <InfoRow label="Total span" value={courseSpan} />
          </div>
          {sortedClasses.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <p className="text-sm font-semibold text-foreground">Upcoming classes</p>
                <div className="space-y-1">
                  {sortedClasses.slice(0, 3).map((cls) => (
                    <div key={cls.id} className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{formatDateTime(cls.startDate) ?? "Date TBD"}</span>
                      <span className="text-foreground">{formatDurationLabel(cls.startDate, cls.endDate) ?? ""}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter>
          <PaymentCTA mode="course" courseId={courseData.id} priceLabel={moneyLabel(coursePrice)} />
        </CardFooter>
      </Card>
    </div>
  );
}

interface ClassDetailsProps {
  classData: ClassWithTemplate;
}

export function ClassDetails({ classData }: ClassDetailsProps) {
  const classPrice = classData.classTemplate.price;
  const schedule = `${formatDateTime(classData.startDate) ?? "Start TBD"} – ${formatDateTime(classData.endDate) ?? "End TBD"}`;
  const classDuration = formatDurationLabel(classData.startDate, classData.endDate);
  const courseLinkHref = classData.classTemplate.courseId ? `/courses/${classData.classTemplate.courseId}` : undefined;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-6">
      <Card>
        <CardHeader>
          <CardTitle>Class payment</CardTitle>
          <CardDescription>Review your class booking before proceeding.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
            <div className="space-y-1">
              <p className="text-lg font-semibold">{classData.classTemplate.name}</p>
              <p className="text-sm text-muted-foreground">Group #{classData.groupNumber}</p>
              <p className="text-sm text-muted-foreground">{schedule}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold text-foreground">{moneyLabel(classPrice)}</p>
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <InfoRow label="Class ID" value={`#${classData.id}`} />
            <InfoRow label="Type" value={classData.classTemplate.classType} />
            <InfoRow label="Duration" value={classDuration} />
            <InfoRow
              label="Course link"
              value={classData.classTemplate.courseId ? `#${classData.classTemplate.courseId}` : undefined}
            />
          </div>
          {courseLinkHref && (
            <>
              <Separator />
              <Link className="text-sm font-medium text-primary hover:underline" href={courseLinkHref}>
                View course details
              </Link>
            </>
          )}
        </CardContent>
        <CardFooter>
          <PaymentCTA mode="class" classId={classData.id} priceLabel={moneyLabel(classPrice)} />
        </CardFooter>
      </Card>
    </div>
  );
}

interface InfoRowProps {
  label: string;
  value: string | undefined;
}

export function InfoRow({ label, value }: InfoRowProps) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between text-sm text-muted-foreground">
      <span>{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
