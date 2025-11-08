"use client";

import {
  Banknote,
  BookOpen,
  Calendar,
  ChartColumn,
  FileText,
  Home,
  Info,
  LifeBuoy,
  Newspaper,
  Notebook,
  NotebookText,
  PieChart,
  ScanQrCode,
  Tickets,
  User,
} from "lucide-react";

import { useUserStore } from "@/lib/store";
import { Sidebar, SidebarContent, SidebarFooter } from "@repo/ui/sidebar";
import { NavProfile } from "components/nav/profile";
import { NavSecondary } from "components/nav/secondary";
import { NavSection } from "components/nav/section";

const data = {
  general: [
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
    {
      title: "About Us",
      url: "",
      icon: Info,
      items: [
        {
          title: "Our Instructors",
          url: "/about/instructors",
        },
        {
          title: "School Map",
          url: "/about/map",
        },
        {
          title: "Dance Styles",
          url: "/about/styles",
        },
      ],
    },
    {
      title: "News",
      url: "/news",
      icon: Newspaper,
    },
    {
      title: "Pricing",
      url: "/pricing",
      icon: Banknote,
    },
    {
      title: "Schedule",
      url: "/schedule",
      icon: Calendar,
    },
    {
      title: "Courses",
      url: "/courses",
      icon: BookOpen,
    }
  ],
  bottom: [
    {
      title: "Contact Us",
      url: "/contact",
      icon: LifeBuoy,
    },
  ],
  admin: [
    {
      title: "Manage Employees",
      url: "/admin/employees",
      icon: User,
    },
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: PieChart,
    },
  ],
  coordinator: [
    {
      title: "Scan Ticket",
      url: "/coordinator/scan",
      icon: ScanQrCode,
    },
    {
      title: "Manage Classes",
      url: "/coordinator/classes",
      icon: NotebookText,
    },
    {
      title: "Manage Courses",
      url: "/coordinator/courses",
      icon: Notebook,
    },
    {
      title: "Blog Posts",
      url: "/coordinator/blog",
      icon: FileText,
    }
  ],
  user: [
    {
      title: "My Progress",
      url: "/user/progress",
      icon: ChartColumn,
    },
    {
      title: "My Tickets",
      url: "/user/tickets",
      icon: Tickets,
    },
  ],
  trainer: [
    {
      title: "My Classes",
      url: "/trainer/classes",
      icon: NotebookText,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUserStore();

  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarContent>
        <NavSection title="General" items={data.general} />
        {user?.role === "STUDENT" && (
          <NavSection title="User" items={data.user} />
        )}
        {user?.role === "INSTRUCTOR" && (
          <NavSection title="Instructor" items={data.trainer} />
        )}
        {(user?.role === "COORDINATOR") && (
          <NavSection title="Coordinator" items={data.coordinator} />
        )}
        {(user?.role === "ADMINISTRATOR") && (
          <NavSection title="Admin" items={data.admin} />
        )}

        <NavSecondary items={data.bottom} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavProfile user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
