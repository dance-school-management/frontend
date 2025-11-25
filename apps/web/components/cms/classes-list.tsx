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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@repo/ui/drawer";
import { format } from "date-fns";
import { EyeIcon, EyeOffIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { updateClassStatus } from "@/lib/api/product";
import { Class, ClassStatus, ClassTemplate } from "@/lib/model/product";

import { NewClassForm } from "./new-class-form";

interface ClassesListProps {
  classTemplate: ClassTemplate;
}

export function ClassesList({ classTemplate }: ClassesListProps) {
  const [isNewClassSheetOpen, setIsNewClassSheetOpen] = useState(false);

  const classes = classTemplate.class.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  return (
    <Card className="gap-2 border-none p-0">
      <CardHeader className="px-0">
        <CardTitle>Classes</CardTitle>
        <CardDescription>List of all classes in this course</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <Drawer open={isNewClassSheetOpen} onOpenChange={setIsNewClassSheetOpen} direction="right">
          <DrawerTrigger asChild>
            <Button
              variant="outline"
              className="w-fit cursor-pointer mb-2"
            >
              <PlusIcon />
              New Class
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="h-full flex flex-col">
              <DrawerHeader>
                <DrawerTitle>Create New Class</DrawerTitle>
                <DrawerDescription>
                  Create a new class for {classTemplate.name}
                </DrawerDescription>
              </DrawerHeader>
              <div className="flex-1 overflow-y-auto">
                <NewClassForm
                  classTemplate={classTemplate}
                  onSuccess={() => setIsNewClassSheetOpen(false)}
                />
              </div>
            </div>
          </DrawerContent>
        </Drawer>
        <div className="space-y-4">
          {classes.length === 0 && (
            <EmptyState />
          )}
          {classes.map((classItem) => (
            <ClassListing
              key={classItem.id}
              classItem={classItem}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface ClassListingProps {
  classItem: Class;
}

function ClassListing({ classItem }: ClassListingProps) {
  const [status, setStatus] = useState<ClassStatus>(classItem.classStatus);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const isHidden = status === "HIDDEN";

  const handleUpdateClassStatus = async () => {
    const payload = {
      classId: classItem.id,
      newStatus: isHidden ? "NORMAL" as ClassStatus : "HIDDEN" as ClassStatus,
      isConfirmation: true,
    };
    const { error } = await updateClassStatus(payload);
    if (error) {
      toast.error(error.message || "Failed to update class status");
      return;
    }
    toast.success("Class status updated successfully");
    setStatus(isHidden ? "NORMAL" : "HIDDEN"); // triggers a rerender!
    setIsConfirmationOpen(false); // Close the dialog
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div>
        <h3 className="font-semibold">Group {classItem.groupNumber}</h3>
        <p className="text-sm text-muted-foreground">
          {formatDates(classItem.startDate, classItem.endDate)}
        </p>
        <p className="text-sm">People limit: {classItem.peopleLimit}</p>
        <p className="text-sm">Status: {status}</p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <AlertDialogWithConfirmation
          isConfirmationOpen={isConfirmationOpen}
          setIsConfirmationOpen={setIsConfirmationOpen}
          title={isHidden ? "Publish Class?" : "Hide Class?"}
          description={isHidden ? "Are you sure you want to publish this class? It will be visible to students and they can enroll." : "Are you sure you want to hide this class? Students won't be able to see or enroll in it."}
          onConfirm={handleUpdateClassStatus}
          cancelText="Cancel"
          confirmText={isHidden ? "Publish" : "Hide"}
        >
          <Button variant="outline" className="w-fit cursor-pointer">
            {isHidden ? <EyeIcon /> : <EyeOffIcon />}
            {isHidden ? "Publish" : "Hide"}
          </Button>
        </AlertDialogWithConfirmation>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <Alert>
      <AlertTitle>No classes found</AlertTitle>
      <AlertDescription>
        No classes have been created for this course yet.
      </AlertDescription>
    </Alert>
  );
}

function formatDates(startDate: string, endDate: string) {
  return format(new Date(startDate), "yyyy-MM-dd, HH:mm") + " - " + format(new Date(endDate), "HH:mm");
}

function AlertDialogWithConfirmation({ children, isConfirmationOpen, setIsConfirmationOpen, title, description, onConfirm, cancelText = "Cancel", confirmText = "Confirm" }: { children: React.ReactNode, isConfirmationOpen: boolean, setIsConfirmationOpen: (open: boolean) => void, title: string, description: string, onConfirm: () => void; cancelText?: string; confirmText?: string; }) {
  return (
    <AlertDialog open={isConfirmationOpen} onOpenChange={setIsConfirmationOpen}>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>{confirmText}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}