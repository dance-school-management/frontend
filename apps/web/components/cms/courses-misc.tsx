"use client";

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
import { api } from "@/lib/api/axios";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import Link from "next/link";
import { FormEvent } from "react";
import { set } from "date-fns";

async function createCourse(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const data = Object.fromEntries(formData);

  const reqData = {
    name: data.name,
    isConfirmation: data.confirmation === "on",
  };

  // TODO: uncomment and test this code 
  toast.info(JSON.stringify(reqData));
  // try {
  //   const res = await api.post("/cms/course/new", reqData);
  //   if (res.status !== 201) {
  //     toast.error("Failed to create course");
  //   }

  //   const { id } = res.data;
  //   toast.success("Course created successfully! Redirecting...");
  //   setTimeout(() => {
  //     window.location.href = `/admin/courses/${id}`;
  //   }, 2000);
  // } catch (error) {
  //   if (axios.isAxiosError(error)) {
  //     if (error.response && error.response.data) {
  //       const { status, data } = error.response.data;
  //       if (status === 400 || status === 409) {
  //         toast.error(data.message);
  //       } else {
  //         toast.error("An unexpected error occurred");
  //       }
  //     } else {
  //       toast.error("An unexpected error occurred");
  //     }
  //   }
  // }
}

export function NewCourseDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-foreground w-fit text-left cursor-pointer">
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
