import { CumulativeRevenueChart } from "@/components/dashboard/cumulative-revenue";
import { DailyRevenueChart } from "@/components/dashboard/daily-revenue";
import { TrendCard } from "@/components/dashboard/trend-card";

const sample = {
  period: { start: "2025-12-01", end: "2025-12-14" },
  totalRevenue: 3425.75,
  currency: "PLN",
  series: [
    { start: "2025-12-01T00:00:00Z", end: "2025-12-01T23:59:59Z", revenue: 185.5 },
    { start: "2025-12-02T00:00:00Z", end: "2025-12-02T23:59:59Z", revenue: 220.0 },
    { start: "2025-12-03T00:00:00Z", end: "2025-12-03T23:59:59Z", revenue: 195.25 },
    { start: "2025-12-04T00:00:00Z", end: "2025-12-04T23:59:59Z", revenue: 310.5 },
    { start: "2025-12-05T00:00:00Z", end: "2025-12-05T23:59:59Z", revenue: 275.0 },
    { start: "2025-12-06T00:00:00Z", end: "2025-12-06T23:59:59Z", revenue: 245.75 },
    { start: "2025-12-07T00:00:00Z", end: "2025-12-07T23:59:59Z", revenue: 190.0 },
    { start: "2025-12-08T00:00:00Z", end: "2025-12-08T23:59:59Z", revenue: 265.5 },
    { start: "2025-12-09T00:00:00Z", end: "2025-12-09T23:59:59Z", revenue: 280.25 },
    { start: "2025-12-10T00:00:00Z", end: "2025-12-10T23:59:59Z", revenue: 320.0 },
    { start: "2025-12-11T00:00:00Z", end: "2025-12-11T23:59:59Z", revenue: 295.5 },
    { start: "2025-12-12T00:00:00Z", end: "2025-12-12T23:59:59Z", revenue: 255.75 },
    { start: "2025-12-13T00:00:00Z", end: "2025-12-13T23:59:59Z", revenue: 310.0 },
    { start: "2025-12-14T00:00:00Z", end: "2025-12-14T23:59:59Z", revenue: 337.25 },
  ],
  previousPeriod: {
    period: { start: "2025-11-17", end: "2025-11-30" },
    totalRevenue: 4150.5,
  },
  change: {
    absolute: 724.75,
    percent: 8.7,
    percentUnavailable: false,
    trend: "down" as const,
  },
};

const dailyRevDescription = "Daily revenue breakdown showing income earned per day";
const cumulativeRevDescription = "Running total of revenue over time, showing cumulative growth";

export default function Page() {
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
