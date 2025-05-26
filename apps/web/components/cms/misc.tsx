"use client";

import { PlusIcon, TrashIcon, CloudUploadIcon } from "lucide-react";
import Link from "next/link";

import { createCourse } from "@/lib/api/product";
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
import { Card, CardContent, CardHeader } from "@repo/ui/card";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import { NonCourseClassTemplateForm } from "./class-template-form";

export function CourseActions(course: Course) {
  return (
    <Card className="gap-2">
      <CardHeader>
        <h3 className="text-lg font-semibold">Actions</h3>
        <p className="text-sm text-muted-foreground">
          You can perform additional actions here.
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-x-2">
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
      </CardContent>
    </Card>
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
            <div className="space-y-8">
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

export function NewClassTemplateDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-foreground w-fit cursor-pointer">
          <PlusIcon /> New Class Template
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create new class template</DialogTitle>
          <DialogDescription>
            A class template will be created. After it&apos;s successfully created, you&apos;ll be redirected to its details page, so you can add classes to it.
          </DialogDescription>
        </DialogHeader>
        <NonCourseClassTemplateForm
          template={null}
          onSuccess={() => {
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

type PreviewProps = {
  id: number;
  name: string;
  description: string;
};

export function CoursePreview({ id, name, description }: PreviewProps) {
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

export function ClassTemplatePreview({ id, name, description }: PreviewProps) {
  return (
    <Link href={`/admin/classes/${id}`}>
      <Alert variant="default" className="w-full">
        <AlertTitle className="text-lg font-semibold">{name}</AlertTitle>
        <AlertDescription className="text-sm text-muted-foreground">
          {description}
        </AlertDescription>
      </Alert>
    </Link>
  );
}

