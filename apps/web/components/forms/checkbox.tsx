import { FieldValues, Path, UseFormReturn } from "react-hook-form";

import { Checkbox } from "@repo/ui/checkbox";
import { FormField, FormItem, FormLabel } from "@repo/ui/form";

import { useAdditionalProductData } from "@/lib/api/tanstack";

interface PeopleLimitConfirmationProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  classRoomId: number;
  peopleLimit: number;
  label?: string;
  message?: string;
}

export function PeopleLimitConfirmation<T extends FieldValues>({ classRoomId, peopleLimit, form, name, label = "Confirmation", message = "People limit is greater than the classroom capacity" }: PeopleLimitConfirmationProps<T>) {
  const { data } = useAdditionalProductData();

  const classRoom = data?.classRooms.find((classRoom) => classRoom.id === classRoomId);

  if (!classRoom) {
    return null;
  }

  if (classRoom.peopleLimit >= peopleLimit) {
    return null;
  }

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-destructive">{label}</FormLabel>
          <div className="items-top flex space-x-2">
            <Checkbox id="isConfirmation" name="isConfirmation" checked={field.value} onCheckedChange={field.onChange} />
            <div className="leading-none">
              <p className="text-sm text-muted-foreground">
                {message}
              </p>
            </div>
          </div>
        </ FormItem>
      )}
    />
  );
};

interface IsConfirmationCheckboxProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label?: string;
  message?: string;
}

export function IsConfirmationCheckbox<T extends FieldValues>({ form, name, label = "Ignore conflicting names", message = "If a class template with the same name already exists, it will not cause an error." }: IsConfirmationCheckboxProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <div className="items-top flex space-x-2">
            <Checkbox id="isConfirmation" name="isConfirmation" checked={field.value} onCheckedChange={field.onChange} />
            <div className="leading-none">
              <p className="text-sm text-muted-foreground">
                {message}
              </p>
            </div>
          </div>
        </FormItem>
      )}
    />
  );
}