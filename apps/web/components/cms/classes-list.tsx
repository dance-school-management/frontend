"use client";

import { Alert, AlertDescription, AlertTitle } from "@repo/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@repo/ui/alert-dialog";
import { Button } from "@repo/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/card";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@repo/ui/drawer";
import { Tooltip, TooltipContent, TooltipTrigger } from "@repo/ui/tooltip";
import { compareAsc, format } from "date-fns";
import { EyeIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { NewClassForm } from "@/components/cms/new-class-form";
import { NewPrivateClassForm } from "@/components/private-classes/new";
import { updateClassStatus } from "@/lib/api/product";
import { Class, ClassStatus, ClassTemplate } from "@/lib/model/product";

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
  const isHidden = status === "HIDDEN";

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

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div>
        <p className="text-sm text-muted-foreground">{formatDates(classItem.startDate, classItem.endDate)}</p>
        <p className="text-sm">People limit: {classItem.peopleLimit}</p>
        <p className="text-sm">Status: {status}</p>
      </div>
      <div className="flex flex-col items-center gap-2">
        {canPublish && (
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <AlertDialogWithConfirmation
                  isConfirmationOpen={isConfirmationOpen}
                  setIsConfirmationOpen={setIsConfirmationOpen}
                  title="Publish Class?"
                  description="Are you sure you want to publish this class? It will be visible to students and they can enroll."
                  onConfirm={publishClass}
                  cancelText="Cancel"
                  confirmText="Publish"
                >
                  <Button variant="outline" disabled={!isHidden} className="w-fit cursor-pointer">
                    <EyeIcon />
                    Publish
                  </Button>
                </AlertDialogWithConfirmation>
              </span>
            </TooltipTrigger>
            {!isHidden && (
              <TooltipContent>
                <p>Class is already published</p>
              </TooltipContent>
            )}
          </Tooltip>
        )}
      </div>
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

function formatDates(startDate: string, endDate: string) {
  return format(new Date(startDate), "yyyy-MM-dd, HH:mm") + " - " + format(new Date(endDate), "HH:mm");
}

function AlertDialogWithConfirmation({
  children,
  isConfirmationOpen,
  setIsConfirmationOpen,
  title,
  description,
  onConfirm,
  cancelText = "Cancel",
  confirmText = "Confirm",
}: {
  children: React.ReactNode;
  isConfirmationOpen: boolean;
  setIsConfirmationOpen: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  cancelText?: string;
  confirmText?: string;
}) {
  return (
    <AlertDialog open={isConfirmationOpen} onOpenChange={setIsConfirmationOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>{confirmText}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
