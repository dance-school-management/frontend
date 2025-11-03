"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@repo/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@repo/ui/field";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@repo/ui/form";
import { Switch } from "@repo/ui/switch";

export interface NotificationsFormValues {
  enableNotifications: boolean;
}

export interface NotificationsFormProps {
  initialValues?: Partial<NotificationsFormValues>;
  onSubmit: (values: NotificationsFormValues) => void | Promise<void>;
}

const defaultValues: NotificationsFormValues = {
  enableNotifications: false,
};

export function NotificationsForm({
  initialValues,
  onSubmit,
}: NotificationsFormProps) {
  const form = useForm<NotificationsFormValues>({
    defaultValues: {
      ...defaultValues,
      ...initialValues,
    },
  });

  useEffect(() => {
    if (initialValues !== undefined) {
      form.reset({
        ...defaultValues,
        ...initialValues,
      });
    }
  }, [initialValues, form]);

  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* In-app Notifications section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">In-app Notifications</h3>
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="enableNotifications"
              render={({ field }) => (
                <FormItem>
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldLabel>Enable notifications</FieldLabel>
                      <FieldDescription>
                        Receive notifications for your account (new classes, bookings, etc.).
                      </FieldDescription>
                    </FieldContent>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </Field>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Update button */}
        <div>
          <Button
            type="submit"
            disabled={!form.formState.isDirty}
            className="bg-foreground text-background hover:bg-foreground/90"
          >
            Update notifications
          </Button>
        </div>
      </form>
    </Form>
  );
}

