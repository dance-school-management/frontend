"use client";

import { InstructorExperience } from "@/lib/model/profile";
import { Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@repo/ui/chart";

interface InstructorExperienceChartProps {
  experience: InstructorExperience[];
}

function getChartColor(index: number, total: number): string {
  const t = index / Math.max(1, total - 1);
  const hue = 250 - 250 * t; // blue → red range
  const lightness = 50 + 10 * Math.sin(t * Math.PI);
  return `hsl(${hue}, 70%, ${lightness}%)`;
}

export function InstructorExperienceChart({ experience }: InstructorExperienceChartProps) {
  const chartData = experience.map((item, index) => ({
    name: item.danceCategoryName,
    category: item.danceCategoryName,
    level: item.advancementLevelName,
    value: item.spentHours,
    fill: getChartColor(index, experience.length),
  }));

  const chartConfig: ChartConfig = {
    name: {
      label: "Dance Category",
    },
    value: {
      label: "Spent Hours",
    },
    ...experience.reduce((config, item) => {
      config[item.danceCategoryName] = {
        category: item.danceCategoryName,
        level: item.advancementLevelName,
      };
      return config;
    }, {} as Record<string, { category: string; level: string; }>),
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold">Experience:</h2>
      <p className="text-sm text-muted-foreground">Chart below shows the hours spent teaching each dance category and advancement level.</p>
      <ChartContainer
        config={chartConfig}
        className="aspect-square w-full max-w-[500px]"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel formatter={(value, name) => (
              <div className="text-muted-foreground flex items-center text-xs">
                <div className="flex flex-col items-center mr-4">
                  <span className="font-medium">{chartData.find((item) => item.name === name)?.category || ""}</span>
                  <span className="font-medium">({chartData.find((item) => item.name === name)?.level || ""})</span>
                </div>
                <div className="text-foreground ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-base">
                  {value} h
                </div>
              </div>
            )} />}
          />
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            stroke="var(--border)"
            strokeWidth={2}
          />
        </PieChart>
      </ChartContainer>
    </div>
  );
}
