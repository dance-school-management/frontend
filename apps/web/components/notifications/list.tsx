import { NotificationItem } from '@/components/notifications/item';
import { markNotificationsAsRead } from '@/lib/api/notification';
import { useNotificationsPolling, useNotificationsStatus } from '@/lib/api/tanstack';
import { Notification } from '@/lib/model/notification';
import { Button } from '@repo/ui/button';
import { Empty, EmptyDescription } from '@repo/ui/components/empty';
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@repo/ui/dialog';
import { ScrollArea } from '@repo/ui/scroll-area';
import { BellOffIcon, CheckIcon } from 'lucide-react';
import Link from 'next/link';


interface NotificationsListProps {
  notifications: Notification[];
}

export function NotificationsList({ notifications }: NotificationsListProps) {
  const { data: notificationsStatus } = useNotificationsStatus();
  const { lengthUnread, markAsRead } = useNotificationsPolling();
  const unreadIds = notifications.filter((notification) => !notification.hasBeenRead).map((notification) => notification.id);

  const enabled = notificationsStatus?.hasEnabledNotifications ?? false;

  return (
    <DialogContent className="flex max-h-[min(680px,90vh)] flex-col gap-0 p-0 sm:max-w-xl">
      <DialogHeader className="contents space-y-0 text-left">
        <DialogTitle className="px-4 pt-2 text-xl">Notifications</DialogTitle>
        <DialogDescription className="px-4 pb-2 text-sm text-muted-foreground border-b">
          {enabled && notifications.length > 0 && (
            <span>You have {lengthUnread} unread notification{lengthUnread === 1 ? '' : 's'}.</span>
          )}
        </DialogDescription>
      </DialogHeader>
      <ScrollArea className="flex max-h-full flex-col overflow-hidden">
        <DialogDescription asChild>
          <div className="px-4 py-3">
            <div className="space-y-4">
              {notifications.length === 0 && (
                <Empty className="p-2 md:p-2">
                  <BellOffIcon className="size-24" />
                  <EmptyDescription>
                    {enabled ? 'You currently have no notifications.' : 'Notifications are currently disabled.'}
                    {!enabled && (
                      <p className="text-sm text-muted-foreground">
                        You can enable notifications in the{' '}
                        <DialogClose asChild>
                          <Link href="/user/settings/notifications" className="text-primary underline">
                            settings
                          </Link>
                        </DialogClose>
                        .
                      </p>
                    )}
                  </EmptyDescription>
                </Empty>
              )}
              {notifications.length > 0 && (
                notifications
                  .sort((a, b) => new Date(b.sendDate).getTime() - new Date(a.sendDate).getTime())
                  .map((notification) => (
                    <NotificationItem key={notification.id} notification={notification} />
                  ))
              )}
            </div>
          </div>
        </DialogDescription>
      </ScrollArea>
      <DialogFooter className="flex-row items-center justify-end border-t px-6 py-4">
        <Button disabled={unreadIds.length === 0} variant="outline" className="w-full" onClick={() => {
          markNotificationsAsRead(unreadIds, document.cookie).then(() => {
            markAsRead(unreadIds);
          });
        }}>
          <CheckIcon />Mark all as read
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}