"use client";

import { Alert, AlertDescription, AlertTitle } from "@repo/ui/alert";
import { Button } from "@repo/ui/button";
import { Card, CardContent, CardHeader } from "@repo/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@repo/ui/dialog";
import { CloudUploadIcon, PlusIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { NewClassTemplateForm, PrivateClassTemplateForm } from "@/components/cms/class-template-form";
import { NewCourseForm } from "@/components/cms/new-course-form";
import { deleteClassTemplate, deleteCourse, publishCourse } from "@/lib/api/product";
import { ClassTemplate, Course } from "@/lib/model/product";
import { truncateAtWordBoundary } from "@/lib/utils/text";

type CourseActionsProps = {
  course: Course;
};
export function CourseActions({ course }: CourseActionsProps) {
  const router = useRouter();

  if (course.courseStatus !== "HIDDEN") {
    return null;
  }

  const totalClasses = course.classTemplate.reduce((len, classTemplate) => classTemplate.class.length + len, 0);

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

  const handlePublish = async () => {
    const { data, error } = await publishCourse(course.id);
    if (error) {
      toast.error(error.message ?? "Failed to publish course");
      return;
    }
    toast.success(data.message);
    router.refresh();
  };

  return (
    <Card className="gap-2">
      <CardHeader>
        <h3 className="text-lg font-semibold">Actions</h3>
        <p className="text-sm text-muted-foreground">You can perform additional actions here.</p>
      </CardHeader>
      <CardContent>
        <div className="space-x-2">
          <Button variant="destructive" className="w-fit cursor-pointer" onClick={handleDelete}>
            <TrashIcon />
            Delete
          </Button>
          {totalClasses > 0 && (
            <Button variant="default" className="w-fit cursor-pointer" onClick={handlePublish}>
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

interface NewClassTemplateDialogProps {
  classType: "private" | "rest";
}
export function NewClassTemplateDialog({ classType }: NewClassTemplateDialogProps) {
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
            A class template will be created. After it&apos;s successfully created, you&apos;ll be redirected to its
            details page, so you can add classes to it.
          </DialogDescription>
        </DialogHeader>
        {classType === "private" && <PrivateClassTemplateForm mode="create" />}
        {classType === "rest" && <NewClassTemplateForm />}
      </DialogContent>
    </Dialog>
  );
}

type PreviewProps = {
  href: string;
  name: string;
  description: string;
};

export function CoursePreview({ href, name, description }: PreviewProps) {
  return (
    <Link href={href}>
      <Alert variant="default" className="w-full">
        <AlertTitle className="text-lg font-semibold">{name}</AlertTitle>
        <AlertDescription className="text-sm text-muted-foreground">
          {truncateAtWordBoundary(description, 200)}
        </AlertDescription>
      </Alert>
    </Link>
  );
}

export function ClassTemplatePreview({ href, name, description }: PreviewProps) {
  return (
    <Link href={href}>
      <Alert variant="default" className="w-full">
        <AlertTitle className="text-lg font-semibold">{name}</AlertTitle>
        <AlertDescription className="text-sm text-muted-foreground">
          {truncateAtWordBoundary(description, 200)}
        </AlertDescription>
      </Alert>
    </Link>
  );
}

type ClassTemplateActionsProps = {
  classTemplate: ClassTemplate;
};
export function ClassTemplateActions({ classTemplate }: ClassTemplateActionsProps) {
  const router = useRouter();

  const hasPublishedClasses = classTemplate.class.some((c) => c.classStatus !== "HIDDEN");

  if (hasPublishedClasses) {
    return null;
  }

  const handleDelete = async () => {
    const { error } = await deleteClassTemplate(classTemplate.id);
    if (error) {
      toast.error(error.message ?? "Failed to delete class template");
      return;
    } else {
      toast.success("Class template deleted successfully");
      router.replace("/coordinator/classes");
    }
  };

  return (
    <Card className="gap-2">
      <CardHeader>
        <h3 className="text-lg font-semibold">Actions</h3>
        <p className="text-sm text-muted-foreground">You can perform additional actions here.</p>
      </CardHeader>
      <CardContent>
        <div className="space-x-2">
          <Button variant="destructive" className="w-fit cursor-pointer" onClick={handleDelete}>
            <TrashIcon />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
