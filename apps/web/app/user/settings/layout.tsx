"use client";

import { Bell, type LucideIcon, Palette, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type SettingsTab = "profile" | "account" | "payments" | "appearance" | "notifications";

interface NavigationItem {
  id: SettingsTab;
  label: string;
  icon: LucideIcon;
  href: string;
}

const navigationItems: NavigationItem[] = [
  { id: "profile", label: "Profile", icon: User, href: "/user/settings/profile" },
  // { id: "account", label: "Account", icon: Shield, href: "/user/settings/account" },
  { id: "appearance", label: "Appearance", icon: Palette, href: "/user/settings/appearance" },
  { id: "notifications", label: "Notifications", icon: Bell, href: "/user/settings/notifications" },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-64 shrink-0 order-1 lg:order-1">
          <nav className="border rounded-lg p-1 space-y-1 bg-card">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors duration-250
                    ${
                      isActive ? "bg-muted text-foreground" : (
                        "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      )
                    }
                  `}
                >
                  <Icon className="size-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="flex-1 order-2 lg:order-2">{children}</div>
      </div>
    </div>
  );
}
