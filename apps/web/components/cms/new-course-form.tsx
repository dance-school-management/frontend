
import { Button } from "@repo/ui/button";
import { Checkbox } from "@repo/ui/checkbox";
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@repo/ui/dialog";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { toast } from "sonner";

import { createCourse } from "@/lib/api/product";

export function NewCourseForm() {
  const router = useRouter();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = Object.fromEntries(new FormData(event.currentTarget));

    const payload = {
      name: formData.name as string,
      isConfirmation: formData.confirmation === "on",
    };

    const { data, error } = await createCourse(payload);

    if (error) {
      toast.error(error.message ?? "Failed to create course");
      return;
    }

    const { id } = data;
    toast.success("Course created successfully! Redirecting...");
    setTimeout(() => {
      router.push(`/coordinator/courses/${id}`);
    }, 2000);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
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
  );
}