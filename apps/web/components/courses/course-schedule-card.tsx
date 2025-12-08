import { Button } from "@repo/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@repo/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/dialog";
import { ScrollArea } from "@repo/ui/scroll-area";
import { Separator } from "@repo/ui/separator";
import { compareAsc } from "date-fns";
import Link from "next/link";

import { MinimalCourseClassItem } from "@/components/courses/course-class-item";
import { ExpandableDescription } from "@/components/utility/expandable";
import { ClassWithTemplate, CourseSummary } from "@/lib/model/product";
import { truncateAtWordBoundary } from "@/lib/utils/text";

interface CourseScheduleCardProps {
  course: CourseSummary;
  classes: ClassWithTemplate[];
}

export function CourseScheduleCard({ course, classes }: CourseScheduleCardProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="max-w-xl w-full gap-0 cursor-pointer">
          <CardHeader>
            <CardTitle className="text-2xl">{course.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              <p className="text-base">{truncateAtWordBoundary(course.description, 150)}</p>
            </CardDescription>
          </CardContent>
          <CardFooter className="mt-2">
            <div className="text-sm">
              <p>Category: {course.danceCategory.name}</p>
              <p>Level: {course.advancementLevel.name}</p>
            </div>
            <Separator className="mx-auto" orientation="vertical" />
            {/* TODO: Discuss if currency should be returned from the API*/}
            <h2 className="text-xl font-bold">{Number(course.price).toFixed(2)} PLN</h2>
          </CardFooter>
        </Card>
      </DialogTrigger>
      <CourseDetailsDialogContent course={course} classes={classes} />
    </Dialog>
  );
}

interface CourseDetailsDialogContentProps {
  course: CourseSummary;
  classes: ClassWithTemplate[];
}

function CourseDetailsDialogContent({ course, classes }: CourseDetailsDialogContentProps) {
  return (
    <DialogContent className="flex max-h-[min(680px,90vh)] flex-col gap-0 p-0 sm:max-w-xl">
      <DialogHeader className="contents space-y-0 text-left">
        <DialogTitle className="border-b py-2 text-center text-xl">{course.name}</DialogTitle>
        <ScrollArea className="flex max-h-full flex-col overflow-hidden">
          <DialogDescription asChild>
            <div className="px-4 py-3">
              <div className="space-y-4">
                <div className="justify-between">
                  <Info caption="Category:" value={course.danceCategory.name} />
                  <Info caption="Level:" value={course.advancementLevel.name} />
                </div>
                <Separator className="my-2" />
                <ExpandableDescription text={course.description} />
                <Separator />
                <div className="space-y-2">
                  <p className="font-semibold text-foreground">Classes in this course:</p>
                  <div className="space-y-4">
                    {classes
                      .sort((a, b) => compareAsc(a.startDate, b.startDate))
                      .map((cls) => (
                        <MinimalCourseClassItem key={cls.id} classData={cls} />
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </DialogDescription>
        </ScrollArea>
      </DialogHeader>
      <DialogFooter className="flex-row items-center justify-end border-t px-6 py-4">
        <Link className="w-full" href={`/payment/details?courseId=${course.id}`}>
          <Button className="w-full bg-green-500 hover:bg-green-600">
            Buy ({Number(course.price).toFixed(2)} PLN)
          </Button>
        </Link>
      </DialogFooter>
    </DialogContent>
  );
}

function Info({ caption, value }: { caption: string; value: string }) {
  return (
    <p className="text-foreground text-base">
      <span className="font-semibold">{caption}</span>
      <span className="font-bold"> {value}</span>
    </p>
  );
}
