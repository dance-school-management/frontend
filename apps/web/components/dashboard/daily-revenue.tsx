"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@repo/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import type { RevenueSeries } from "@/lib/model/finance";
import { formatCurrency, formatDateShort } from "@/lib/utils/finance";

export const description = "An interactive area chart";

type DailyRevenueChartProps = {
  series: RevenueSeries[];
  title?: string;
  description?: string;
  currency?: string;
};

type ChartDataPoint = {
  date: string;
  dateEnd: string;
  revenue: number;
};

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--color-financial-primary)",
  },
} satisfies ChartConfig;

export function DailyRevenueChart({
  series,
  title = "Revenue",
  description: descriptionText,
  currency = "PLN",
}: DailyRevenueChartProps) {
  const chartData: ChartDataPoint[] = series.map((item) => {
    const dateStart = item.start.split("T")[0] ?? item.start;
    const dateEnd = item.end.split("T")[0] ?? item.end;
    return {
      date: dateStart,
      dateEnd: dateEnd,
      revenue: item.revenue,
    };
  });

  chartData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {descriptionText && (
          <CardDescription className="text-muted-foreground text-sm max-w-prose">{descriptionText}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => formatDateShort(value)}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => formatDateShort(value)}
                  formatter={(value) => formatCurrency(Number(value), currency)}
                  indicator="dot"
                />
              }
            />
            <Area dataKey="revenue" type="natural" fill="url(#fillRevenue)" stroke="var(--color-revenue)" stackId="a" />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
