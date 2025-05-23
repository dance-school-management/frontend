"use client";

import { format } from "date-fns";
import { PlusIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@repo/ui/alert";
import { Button } from "@repo/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { Class } from "@/lib/model/product";

interface ClassesListProps {
  classes: Class[];
  onEditClass?: (classId: number) => void;
}

export function ClassesList({ classes, onEditClass }: ClassesListProps) {
  return (
    <Card className="gap-2">
      <CardHeader>
        <CardTitle>Classes</CardTitle>
        <CardDescription>List of all classes in this course</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          variant="outline"
          className="w-fit cursor-pointer mb-2"
        >
          <PlusIcon />
          New Class
        </Button>
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

function ClassListing({ classItem, onEditClass }: ClassListingProps) {
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
      <Button
        variant="outline"
        className="w-fit cursor-pointer"
        onClick={() => onEditClass?.(classItem.id)}
      >
        Edit Class
      </Button>
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
  return format(startDate, "yyyy-MM-dd, HH:mm") + " - " + format(endDate, "HH:mm");
}
