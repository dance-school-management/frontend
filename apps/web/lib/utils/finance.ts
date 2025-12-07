import { RevenueTrend } from "@/lib/model/finance";

export function formatCurrency(value: number, currencyCode = "PLN") {
  const formatted = new Intl.NumberFormat("pl-PL", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
  return `${formatted} ${currencyCode}`;
}

export function formatPercent(value: number | null | undefined) {
  if (value == null || Number.isNaN(value)) return "—";
  return `${value.toFixed(1)}%`;
}

export function formatTrendPercent(value: number | null | undefined, trend: RevenueTrend) {
  if (value == null || Number.isNaN(value)) return "—";
  return `${trend === "up" ? "+" : trend === "down" ? "-" : ""}${value.toFixed(1)}%`;
}

export function formatDateShort(iso: string) {
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
    }).format(d);
  } catch {
    return iso;
  }
}

export function toChartData(series: { start: string; end: string; revenue: number; }[]) {
  return series.map((s) => ({
    date: formatDateShort(s.start),
    revenue: Number(s.revenue),
    isoStart: s.start,
  }));
}

export function cumulativeFromSeries(series: { start: string; end: string; revenue: number; }[]) {
  const data = toChartData(series);
  let running = 0;
  return data.map((d) => {
    running += d.revenue;
    return { ...d, cumulative: running };
  });
}
