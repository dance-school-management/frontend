"use client";

import { PlusIcon, TrashIcon, CloudUploadIcon, SquarePenIcon } from "lucide-react";
import Link from "next/link";

import { createCourse } from "@/lib/api/course";
import { Course } from "@/lib/model/product";
import { Alert, AlertDescription, AlertTitle } from "@repo/ui/alert";
import { Button } from "@repo/ui/button";
import { Checkbox } from "@repo/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/dialog";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";

export function CourseActions(course: Course) {
  return (
    <div className="flex items-center space-x-2">
      {/* TODO: Think how to handle this. Sheet? */}
      <Button variant="outline" className="w-fit cursor-pointer">
        <SquarePenIcon />
        Edit details
      </Button>
      <Button variant="destructive" className="w-fit cursor-pointer">
        <TrashIcon />
        Delete
      </Button>
      {course.courseStatus === "HIDDEN" && (
        <Button variant="default" className="w-fit cursor-pointer">
          <CloudUploadIcon />
          Publish
        </Button>
      )}

    </div>
  );
}

export function NewCourseDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-foreground w-fit cursor-pointer">
          <PlusIcon /> New Course
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={createCourse} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Create new course</DialogTitle>
            <DialogDescription>
              An empty, hidden course will be created. After it&apos;s successfully created, you&apos;ll be redirected to its details page.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="tems-center space-y-8">
              <div>
                <Label htmlFor="name">
                  Name*
                </Label>
                <Input id="name" name="name" defaultValue="" className="mt-2" required />
              </div>
              <div className="items-top flex space-x-2">
                <Checkbox id="confirmation" name="confirmation" />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="confirmation"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Ignore conflicting name
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    If a course with the same name already exists, it will not cause an error.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="cursor-pointer">CREATE</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

type CoursePreviewProps = {
  id: number;
  name: string;
  description: string;
};

export function CoursePreview({ id, name, description }: CoursePreviewProps) {
  return (
    <Link href={`/admin/courses/${id}`}>
      <Alert variant="default" className="w-full">
        <AlertTitle className="text-lg font-semibold">{name}</AlertTitle>
        <AlertDescription className="text-sm text-muted-foreground">
          {description}
        </AlertDescription>
      </Alert>
    </Link>
  );
}
