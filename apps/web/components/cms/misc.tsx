"use client";

import { CloudUploadIcon, PlusIcon, TrashIcon } from "lucide-react";
import Link from "next/link";

import { NewClassTemplateForm } from "@/components/cms/class-template-form";
import { NewCourseForm } from "@/components/cms/new-course-form";
import { Course } from "@/lib/model/product";
import { Alert, AlertDescription, AlertTitle } from "@repo/ui/alert";
import { Button } from "@repo/ui/button";
import { Card, CardContent, CardHeader } from "@repo/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/dialog";

import { deleteCourse } from "@/lib/api/product";
import { truncateAtWordBoundary } from "@/lib/utils/text";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function CourseActions(course: Course) {
  const router = useRouter();
  
  const handleDelete = async () => {
    const { error } = await deleteCourse(course.id);
    if (error) {
      toast.error(error.message ?? "Failed to delete course");
      return;
    } else {
      toast.success("Course deleted successfully");
      router.replace("/coordinator/courses");
    }
  };
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
          <Button variant="destructive" className="w-fit cursor-pointer" onClick={handleDelete}>
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
        <NewCourseForm />
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
        <NewClassTemplateForm />
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
    <Link href={`/coordinator/courses/${id}`}>
      <Alert variant="default" className="w-full">
        <AlertTitle className="text-lg font-semibold">{name}</AlertTitle>
        <AlertDescription className="text-sm text-muted-foreground">
          {truncateAtWordBoundary(description, 200)}
        </AlertDescription>
      </Alert>
    </Link>
  );
}

export function ClassTemplatePreview({ id, name, description }: PreviewProps) {
  return (
    <Link href={`/coordinator/classes/${id}`}>
      <Alert variant="default" className="w-full">
        <AlertTitle className="text-lg font-semibold">{name}</AlertTitle>
        <AlertDescription className="text-sm text-muted-foreground">
          {truncateAtWordBoundary(description, 200)}
        </AlertDescription>
      </Alert>
    </Link>
  );
}