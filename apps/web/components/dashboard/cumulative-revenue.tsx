"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@repo/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import type { RevenueSeries } from "@/lib/model/finance";
import { cumulativeFromSeries, formatCurrency, formatDateShort } from "@/lib/utils/finance";

type CumulativeRevenueChartProps = {
  series: RevenueSeries[];
  currency?: string;
  title?: string;
  description?: string;
};

const chartConfig = {
  cumulative: {
    label: "Cumulative",
    color: "var(--color-financial-primary)",
  },
  revenue: {
    label: "Revenue",
    color: "hsl(var(--muted-foreground))",
  },
} satisfies ChartConfig;

export function CumulativeRevenueChart({
  series,
  currency = "PLN",
  title = "Cumulative revenue",
  description,
}: CumulativeRevenueChartProps) {
  const data = cumulativeFromSeries(series);

  return (
    <Card className="@container/card lg:col-span-2">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && (
          <CardDescription className="text-muted-foreground text-sm max-w-prose">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="fillCumulative" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-cumulative)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-cumulative)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="isoStart"
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
            <Area
              type="natural"
              dataKey="cumulative"
              fill="url(#fillCumulative)"
              stroke="var(--color-cumulative)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
