"use client";

import { Alert, AlertDescription, AlertTitle } from "@repo/ui/alert";
import { Button } from "@repo/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/card";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@repo/ui/drawer";
import { compareAsc } from "date-fns";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { CancelClassDialog } from "@/components/cms/cancel-class-dialog";
import { ClassActions } from "@/components/cms/class-actions";
import { NewClassForm } from "@/components/cms/new-class-form";
import { PostponeClassDialog } from "@/components/cms/postpone-class-dialog";
import { NewPrivateClassForm } from "@/components/private-classes/new";
import { cancelClass, postponeClass, updateClassStatus } from "@/lib/api/product";
import { Class, ClassStatus, ClassTemplate } from "@/lib/model/product";
import { fmtDateTimes } from "@/lib/utils/time";

interface ClassesListProps {
  classTemplate: ClassTemplate;
  classType: "private" | "rest";
}

export function ClassesList({ classTemplate, classType }: ClassesListProps) {
  const classes = classTemplate.class.sort((a, b) => compareAsc(a.startDate, b.startDate));

  return (
    <Card className="gap-2 border-none shadow-none p-0">
      <CardHeader className="px-0">
        <CardTitle>Classes</CardTitle>
        <CardDescription>List of all classes in this template</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <Drawer direction="right">
          <DrawerTrigger asChild>
            <Button variant="outline" className="w-fit cursor-pointer mb-2">
              <PlusIcon />
              New Class
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="h-full flex flex-col">
              <DrawerHeader>
                <DrawerTitle>Create New Class</DrawerTitle>
                <DrawerDescription>Create a new class for {classTemplate.name}</DrawerDescription>
              </DrawerHeader>
              <div className="flex-1 overflow-y-auto">
                {classType === "rest" && <NewClassForm classTemplate={classTemplate} />}
                {classType === "private" && <NewPrivateClassForm classTemplate={classTemplate} />}
              </div>
            </div>
          </DrawerContent>
        </Drawer>
        <div className="space-y-4">
          {classes.length === 0 && <EmptyState />}
          {classes.map((classItem) => (
            <ClassListing
              key={classItem.id}
              classItem={classItem}
              canPublish={classTemplate.courseId === null && classType === "rest"}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface ClassListingProps {
  classItem: Class;
  canPublish: boolean;
}

export function ClassListing({ classItem, canPublish }: ClassListingProps) {
  const [status, setStatus] = useState<ClassStatus>(classItem.classStatus);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isPostponeDialogOpen, setIsPostponeDialogOpen] = useState(false);
  const isHidden = status === "HIDDEN";

  const startDate = new Date(classItem.startDate);
  const endDate = new Date(classItem.endDate);

  const schedule = fmtDateTimes(startDate, endDate);
  const originalDuration = endDate.getTime() - startDate.getTime();

  const publishClass = async () => {
    const { error } = await updateClassStatus({ classId: classItem.id });
    if (error) {
      toast.error(error.message || "Failed to update class status");
      return;
    }
    toast.success("Class published successfully");
    setStatus(isHidden ? "NORMAL" : "HIDDEN");
    setIsConfirmationOpen(false);
  };

  const handleCancel = async (reason: string) => {
    const { error } = await cancelClass({ classId: classItem.id, reason, isConfirmation: false });
    if (error) {
      toast.error(error.message || "Failed to cancel class");
      return;
    }
    toast.success("Class cancelled successfully");
    setStatus("CANCELLED");
    setIsCancelDialogOpen(false);
  };

  const handlePostponeConfirm = async (date: Date, time: string, reason: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const newStartDate = new Date(date);
    newStartDate.setHours(hours ?? 0, minutes ?? 0, 0, 0);

    const newEndDate = new Date(newStartDate.getTime() + originalDuration);

    const { error } = await postponeClass({
      classId: classItem.id,
      newStartDate: newStartDate.toISOString(),
      newEndDate: newEndDate.toISOString(),
      reason,
      isConfirmation: false,
    });

    if (error) {
      toast.error(error.message || "Failed to postpone class");
      return;
    }

    toast.success("Class postponed successfully");
    setStatus("POSTPONED");
    setIsPostponeDialogOpen(false);
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div>
        <p className="text-sm text-muted-foreground">{schedule}</p>
        <p className="text-sm">People limit: {classItem.peopleLimit}</p>
        <p className="text-sm">Status: {status}</p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <ClassActions
          status={status}
          canPublish={canPublish}
          isConfirmationOpen={isConfirmationOpen}
          setIsConfirmationOpen={setIsConfirmationOpen}
          onPublishClick={publishClass}
          onCancelClick={() => setIsCancelDialogOpen(true)}
          onPostponeClick={() => setIsPostponeDialogOpen(true)}
        />
      </div>

      <CancelClassDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen} onConfirm={handleCancel} />

      <PostponeClassDialog
        open={isPostponeDialogOpen}
        onOpenChange={setIsPostponeDialogOpen}
        onConfirm={handlePostponeConfirm}
        originalDuration={originalDuration}
        currentSchedule={{ startDate: classItem.startDate, endDate: classItem.endDate }}
      />
    </div>
  );
}

function EmptyState() {
  return (
    <Alert>
      <AlertTitle>No classes found</AlertTitle>
      <AlertDescription>No classes have been created for this course yet.</AlertDescription>
    </Alert>
  );
}
