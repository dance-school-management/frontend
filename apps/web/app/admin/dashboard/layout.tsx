"use client";

import { Tabs, TabsList, TabsTrigger } from "@repo/ui/tabs";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { TimePeriodPicker } from "@/components/dashboard/time-period-picker";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeTab = pathname?.endsWith("/courses") ? "courses" : "revenue";

  const queryString = searchParams.toString();
  const hrefSuffix = queryString ? `?${queryString}` : "";

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2 mt-4 md:mt-6">
        <div className="flex flex-col gap-4 px-4 lg:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
            <div className="flex-1">
              <Tabs value={activeTab}>
                <TabsList className="w-full sm:w-fit">
                  <TabsTrigger value="revenue" asChild>
                    <Link href={`/admin/dashboard/revenue${hrefSuffix}`}>Revenue</Link>
                  </TabsTrigger>
                  <TabsTrigger value="courses" asChild>
                    <Link href={`/admin/dashboard/courses${hrefSuffix}`}>Courses</Link>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <TimePeriodPicker />
          </div>
          <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 lg:grid-cols-2 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
