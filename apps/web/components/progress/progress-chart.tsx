"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@repo/ui/chart";

interface ProgressChartData {
  name: string;
  value: number;
}

interface ProgressChartProps {
  title?: string;
  description?: string;
  data: ProgressChartData[];
}

export function ProgressChart({ data, title, description }: ProgressChartProps) {
  const processedData = data.map((item, index) => ({
    ...item,
    fill: getChartColor(index),
  }));

  const chartConfig: ChartConfig = {
    value: {
      label: "Hours spent",
    },
    ...data.reduce((config, item) => {
      config[item.name] = {
        label: toTitleCase(item.name),
      };
      return config;
    }, {} as Record<string, { label: string; }>),
  };

  return (
    <Card>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      )}
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-1 w-full min-h-[250px]">
          <BarChart
            accessibilityLayer
            data={processedData}
            layout="vertical"
            margin={{
              left: 40,
              right: 20,
              top: 20,
              bottom: 20,
            }}
          >
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={20}
              axisLine={false}
              width={70}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label || value
              }
            />
            <XAxis
              dataKey="value"
              type="number"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value) => `${value}h`}
              label={{ value: "Hours spent", position: "insideBottom", offset: -10 }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideIndicator />}
            />
            <Bar dataKey="value" layout="vertical" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

const toTitleCase = (str: string): string => {
  return str.replace(/\w\S*/g, (txt) =>
    txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
  );
};

const getChartColor = (index: number): string => {
  const colorIndex = (index % 5) + 1;
  return `var(--chart-${colorIndex})`;
};
