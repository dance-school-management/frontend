import { redirect } from "next/navigation";

import { getDateRange } from "@/lib/utils/time";

export default function Page() {
  const { start, end } = getDateRange("30d");
  redirect(`/admin/dashboard/revenue?start=${start}&end=${end}`);
}
