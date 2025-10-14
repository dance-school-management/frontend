"use client";

import { format } from "date-fns";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@repo/ui/alert";
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
import { Class, ClassTemplate } from "@/lib/model/product";
import { NewClassForm } from "./new-class-form";

interface ClassesListProps {
  onEditClass?: (classId: number) => void;
  classTemplate: ClassTemplate;
}

export function ClassesList({ classTemplate, onEditClass }: ClassesListProps) {
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
              onEditClass={onEditClass}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface ClassListingProps {
  classItem: Class;
  onEditClass?: (classId: number) => void;
}

function ClassListing({ classItem }: ClassListingProps) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div>
        <h3 className="font-semibold">Group {classItem.groupNumber}</h3>
        <p className="text-sm text-muted-foreground">
          {formatDates(classItem.startDate, classItem.endDate)}
        </p>
        <p className="text-sm">People limit: {classItem.peopleLimit}</p>
        <p className="text-sm">Status: {classItem.classStatus}</p>
      </div>
      <div className="flex flex-col items-center gap-2">
        {/* TODO: Add ability to edit class */}
        {/* <Button
          variant="outline"
          className="w-fit cursor-pointer"
          onClick={() => onEditClass?.(classItem.id)}
        >
          Edit
        </Button> */}
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
