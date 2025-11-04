import { NotificationItem } from '@/components/notifications/item';
import { useNotificationsPolling } from '@/lib/api/tanstack';
import { Notification } from '@/lib/model/notification';
import { Button } from '@repo/ui/button';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@repo/ui/dialog';
import { ScrollArea } from '@repo/ui/scroll-area';
import { CheckIcon } from 'lucide-react';


interface NotificationsListProps {
  notifications: Notification[];
}

export function NotificationsList({ notifications }: NotificationsListProps) {
  const { lengthUnread } = useNotificationsPolling();

  return (
    <DialogContent className="flex max-h-[min(680px,90vh)] flex-col gap-0 p-0 sm:max-w-xl">
      <DialogHeader className="contents space-y-0 text-left">
        <DialogTitle className="px-4 pt-2 text-xl">Notifications</DialogTitle>
        <DialogDescription className="px-4 pb-2 text-sm text-muted-foreground border-b">
          You have {lengthUnread} unread notification{lengthUnread === 1 ? '' : 's'}.
        </DialogDescription>
      </DialogHeader>
      <ScrollArea className="flex max-h-full flex-col overflow-hidden">
        <DialogDescription asChild>
          <div className="px-4 py-3">
            <div className="space-y-4">
              {notifications
                .sort((a, b) => new Date(b.sendDate).getTime() - new Date(a.sendDate).getTime())
                .map((notification) => (
                  <NotificationItem key={notification.id} notification={notification} />
                ))}
            </div>
          </div>
        </DialogDescription>
      </ScrollArea>
      {/* TODO: Connect with backend when it's implemented */}
      <DialogFooter className="flex-row items-center justify-end border-t px-6 py-4">
        <Button disabled={lengthUnread === 0} variant="outline" className="w-full">
          <CheckIcon />Mark all as read
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}