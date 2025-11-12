import { markNotificationsAsRead } from "@/lib/api/notification";
import { useNotificationsPolling } from "@/lib/api/tanstack";
import { Notification } from "@/lib/model/notification";
import { Button } from "@repo/ui/components/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@repo/ui/item';
import { formatDistanceToNow } from "date-fns";
import { Mail, MailOpen } from "lucide-react";

interface NotificationItemProps {
  notification: Notification;
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const { markAsRead } = useNotificationsPolling();

  return (
    <Item className="group" data-read={notification.hasBeenRead} variant={notification.hasBeenRead ? "outline" : "muted"}>
      <ItemContent>
        <span className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(notification.sendDate), { addSuffix: true })}
        </span>
        <ItemTitle className="text-lg text-foreground font-bold group-data-[read=true]:text-muted-foreground">{notification.title}</ItemTitle>
        <ItemDescription className="text-sm text-foreground font-bold group-data-[read=true]:text-muted-foreground">{notification.body}</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button variant="ghost" size="lg" disabled={notification.hasBeenRead} onClick={() => {
          markNotificationsAsRead([notification.id], document.cookie).then(() => {
            markAsRead([notification.id]);
          });
        }}>
          {notification.hasBeenRead ? <MailOpen /> : <Mail />}
        </Button>
      </ItemActions>
    </Item>
  );
}
