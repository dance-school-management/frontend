export type TimePeriod = {
  start: string;
  end: string;
};

export type RevenueSeries = {
  start: string;
  end: string;
  revenue: number;
};

export type RevenueTrend = "up" | "down" | "same";

export type RevenueChange = {
  absolute: number;
  percent: number;
  percentUnavailable: boolean;
  trend: RevenueTrend;
};

export type RevenueData = {
  period: TimePeriod;
  totalRevenue: number;
  currency: string;
  series: RevenueSeries[];
  previousPeriod: {
    period: TimePeriod;
    totalRevenue: number;
  };
  change: RevenueChange;
};

export type PredefinedTimePeriod = "7d" | "30d" | "90d" | "this-month" | "last-month" | "this-year";