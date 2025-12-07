"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { PredefinedTimePeriod } from "@/lib/model/finance";
import { getDateRange, getPeriodFromDates } from "@/lib/utils/time";

export function TimePeriodPicker() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlStart = searchParams.get("start");
  const urlEnd = searchParams.get("end");
  const initialPeriod = getPeriodFromDates(urlStart, urlEnd);

  const [period, setPeriod] = useState<PredefinedTimePeriod>(initialPeriod);

  useEffect(() => {
    const currentStart = searchParams.get("start");
    const currentEnd = searchParams.get("end");
    const currentPeriod = getPeriodFromDates(currentStart, currentEnd);
    setPeriod(currentPeriod);
  }, [searchParams]);

  const handlePeriodChange = (value: string) => {
    const newPeriod = value as PredefinedTimePeriod;
    setPeriod(newPeriod);

    const { start, end } = getDateRange(newPeriod);

    const params = new URLSearchParams(searchParams.toString());
    params.set("start", start);
    params.set("end", end);

    router.push(`?${params.toString()}`);
  };

  useEffect(() => {
    if (!urlStart || !urlEnd) {
      const { start, end } = getDateRange(period);
      const params = new URLSearchParams(searchParams.toString());
      params.set("start", start);
      params.set("end", end);
      router.replace(`?${params.toString()}`);
    }
  }, [urlStart, urlEnd, period, router, searchParams]);

  return (
    <Select value={period} onValueChange={handlePeriodChange}>
      <SelectTrigger className="w-full sm:w-[180px]">
        <SelectValue placeholder="Select period" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="7d">Last 7 days</SelectItem>
        <SelectItem value="30d">Last 30 days</SelectItem>
        <SelectItem value="90d">Last 90 days</SelectItem>
        <SelectItem value="this-month">This month</SelectItem>
        <SelectItem value="last-month">Last month</SelectItem>
        <SelectItem value="this-year">This year</SelectItem>
      </SelectContent>
    </Select>
  );
}
