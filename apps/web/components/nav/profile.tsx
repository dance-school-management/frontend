"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/avatar";
import { Badge } from "@repo/ui/badge";
import {
  Dialog,
  DialogTrigger
} from "@repo/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@repo/ui/sidebar";
import { useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  ChevronsUpDown,
  LogIn,
  LogOut,
  SettingsIcon,
  UserIcon,
  UserPlus
} from "lucide-react";
import Link from "next/link";
import { redirect, RedirectType, usePathname } from "next/navigation";

import { NotificationsList } from "@/components/notifications/list";
import { useNotificationsPolling } from "@/lib/api/tanstack";
import { signOut, User } from "@/lib/model";
import { useUserStore } from "@/lib/store";

export function NavProfile({ user }: { user: User | null; }) {
  const { notifications, lengthUnread } = useNotificationsPolling();
  const queryClient = useQueryClient();
  const { setUser } = useUserStore();
  const pathname = usePathname();

  if (!user) return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton isActive={pathname === "/login"} asChild >
          <Link href="/login">
            <LogIn />
            <span>Log In</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton isActive={pathname === "/register"} asChild>
          <Link href="/register">
            <UserPlus />
            <span>Sign Up</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="relative">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.image || ""} alt={user.name} />
                  <AvatarFallback className="rounded-lg">{fallbackAvatar(user.name)}</AvatarFallback>
                </Avatar>
                {lengthUnread > 0 && <Badge className='absolute -top-1.5 -right-1.5 h-4 min-w-4 rounded-full bg-indigo-500 px-1 tabular-nums'>{lengthUnread}</Badge>}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side="bottom"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <Link href="/user/settings/profile">
                <DropdownMenuItem>
                  <UserIcon />
                  Profile
                </DropdownMenuItem>
              </Link>
              <Dialog modal={true}>
                <DialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Bell />
                    Notifications
                  </DropdownMenuItem>
                </DialogTrigger>
                <NotificationsList notifications={notifications} />
              </Dialog>
              <Link href="/user/settings/appearance">
                <DropdownMenuItem>
                  <SettingsIcon />
                  Settings
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={async () => {
              setUser(null);
              await queryClient.cancelQueries();
              queryClient.clear();
              signOut();
              redirect("/login", RedirectType.replace);
            }}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function fallbackAvatar(name: string) {
  const firstLetters = name.split(" ").map((n) => n[0]);
  return firstLetters.join("").substring(0, 2).toUpperCase();
}