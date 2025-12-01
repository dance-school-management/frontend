import { Badge } from "@repo/ui/badge";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@repo/ui/card";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { cva } from "class-variance-authority";

import { RevenueData, RevenueTrend } from "@/lib/model/finance";
import { formatCurrency, formatDateShort, formatPercent } from "@/lib/utils/finance";

type TrendCardProps = Pick<RevenueData, "period" | "totalRevenue" | "currency" | "change" | "previousPeriod">;

export function TrendCard({ period, totalRevenue, currency, change, previousPeriod }: TrendCardProps) {
  const { totalRevenue: previousTotalRevenue } = previousPeriod;
  const trendColor = chooseTrendColor({ trend: change.trend });
  const badgeVariant = chooseBadgeVariant({ trend: change.trend });
  const badgeBgColor = chooseBadgeBgColor({ trend: change.trend });
  const trendIsUp = change.trend === "up";
  const trendIsDown = change.trend === "down";
  const trendIsSame = change.trend === "same";
  const trendCharacter =
    trendIsUp ? "+"
    : trendIsDown ? "-"
    : null;

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>Total Revenue</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {formatCurrency(totalRevenue, currency)}
        </CardTitle>
        <CardTitle className="text-xs tabular-nums text-muted-foreground">
          {formatCurrency(previousTotalRevenue, currency)} (Previous period)
        </CardTitle>
        <CardAction>
          <Badge variant={badgeVariant} className={`${badgeBgColor} ${trendColor} flex items-center gap-1.5`}>
            {trendIsUp ?
              <IconTrendingUp className="size-3.5" />
            : trendIsDown ?
              <IconTrendingDown className="size-3.5" />
            : null}
            {change.percentUnavailable ? "—" : `${trendCharacter}${formatPercent(change.percent)}`}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="flex flex-col gap-1">
          <div className={`line-clamp-1 flex gap-2 font-medium ${trendColor}`}>
            {trendIsUp && (
              <>
                <span>Trending up</span>
                <IconTrendingUp className="size-4" />
              </>
            )}
            {trendIsDown && (
              <>
                <span>Trending down</span>
                <IconTrendingDown className="size-4" />
              </>
            )}
            {trendIsSame && <span>No change</span>}
          </div>
          <div className="flex gap-4 text-muted-foreground">
            <span>
              Abs:{" "}
              <span className={trendColor}>
                {trendCharacter}
                {formatCurrency(change.absolute, currency)}
              </span>
            </span>
            {!change.percentUnavailable && (
              <span>
                Change:{" "}
                <span className={trendColor}>
                  {trendCharacter}
                  {formatPercent(change.percent)}
                </span>
              </span>
            )}
          </div>
        </div>
        <div className="text-muted-foreground">
          Period: {formatDateShort(period.start)} — {formatDateShort(period.end)}
        </div>
      </CardFooter>
    </Card>
  );
}

const chooseTrendColor = cva("text-green-600 dark:text-green-500", {
  variants: {
    trend: {
      up: "text-green-600 dark:text-green-500",
      down: "text-red-600 dark:text-red-500",
      same: "text-muted-foreground",
    },
  },
});

const chooseBadgeBgColor = cva("bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800", {
  variants: {
    trend: {
      up: "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800",
      down: "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800",
      same: "",
    },
  },
});

function chooseBadgeVariant(props: { trend: RevenueTrend }): "default" | "destructive" | "outline" {
  switch (props.trend) {
    case "up":
      return "default";
    case "down":
      return "destructive";
    case "same":
      return "outline";
  }
}
