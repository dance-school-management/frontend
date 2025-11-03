"use client";

import { Card, CardContent } from "@repo/ui/card";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  NotificationsForm,
  type NotificationsFormValues,
} from "@/components/forms/notifications-form";
import { registerForNotifications, toggleNotifications } from "@/lib/api/notification";
import { useNotificationsStatus } from "@/lib/api/tanstack";

export default function NotificationsPage() {
  const queryClient = useQueryClient();
  const { data: notificationsStatus } = useNotificationsStatus();

  const handleUpdateNotifications = async (
    values: NotificationsFormValues,
  ) => {
    let errorMessage = "";
    try {
      const registerResult = await registerForNotifications(document.cookie);
      if (registerResult.error) {
        errorMessage = registerResult.error.message;
        return;
      }

      const toggleResult = await toggleNotifications(values.enableNotifications, document.cookie);
      if (toggleResult.error) {
        errorMessage = toggleResult.error.message;
        return;
      }

      if (errorMessage !== "") {
        toast.error(errorMessage);
        return;
      }
      await queryClient.invalidateQueries({ queryKey: ["notifications:status"] });
      toast.success("Notification settings updated successfully");
    } catch {
      toast.error("An unexpected error occurred while updating notification settings");
    }
  };

  const initialValues = notificationsStatus
    ? {
      enableNotifications: notificationsStatus.hasEnabledNotifications ?? false,
    }
    : undefined;

  return (
    <Card>
      <CardContent>
        <NotificationsForm
          initialValues={initialValues}
          onSubmit={handleUpdateNotifications}
        />
      </CardContent>
    </Card>
  );
}

