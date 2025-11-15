import Link from "next/link";
import { Button } from "@repo/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/card";
import { fmtTime } from "@/lib/utils/time";
import { Calendar, Users, ArrowRight } from "lucide-react";
import { IEvent } from "@/modules/calendar/types";

interface TodaysClassesSectionProps {
  classes: IEvent[];
}

export function TodaysClassesSection({ classes }: TodaysClassesSectionProps) {
  return (
    <section className="flex flex-col gap-4 px-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold">
            Today&apos;s Classes
          </h2>
          <p className="text-muted-foreground">
            Check out what&apos;s happening today at our dance school
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/schedule">
            View Full Schedule
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.slice(0, 6).map((classItem) => (
          <Card key={classItem.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl">{classItem.name}</CardTitle>
              <CardDescription>{classItem.danceCategory}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="size-4 text-muted-foreground" />
                  <span>{fmtTime(classItem.startDate)} - {fmtTime(classItem.endDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="size-4 text-muted-foreground" />
                  <span>
                    {classItem.instructors.map((i) => i.name).join(", ")}
                  </span>
                </div>
                <div className="text-muted-foreground">
                  {classItem.classroom}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
