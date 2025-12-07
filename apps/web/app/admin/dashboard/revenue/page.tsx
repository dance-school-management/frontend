import { headers } from "next/headers";

import { CumulativeRevenueChart } from "@/components/dashboard/cumulative-revenue";
import { DailyRevenueChart } from "@/components/dashboard/daily-revenue";
import { TrendCard } from "@/components/dashboard/trend-card";
import { getRevenue } from "@/lib/api/finance";

const dailyRevDescription = "Daily revenue breakdown showing income earned per day";
const cumulativeRevDescription = "Running total of revenue over time, showing cumulative growth";

export default async function Page({ searchParams }: { searchParams: { start: string; end: string } }) {
  const { start, end } = await searchParams;

  const cookie = (await headers()).get("cookie") ?? "";
  const { data: sample, error } = await getRevenue(start, end, "day", cookie);

  if (error || !sample) {
    return <div>Error: {error?.message}</div>;
  }

  return (
    <>
      <TrendCard
        period={sample.period}
        previousPeriod={sample.previousPeriod}
        totalRevenue={sample.totalRevenue}
        currency={sample.currency}
        change={sample.change}
      />
      <DailyRevenueChart series={sample.series} currency={sample.currency} description={dailyRevDescription} />
      <CumulativeRevenueChart
        series={sample.series}
        currency={sample.currency}
        description={cumulativeRevDescription}
      />
    </>
  );
}
