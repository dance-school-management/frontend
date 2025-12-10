import { TEventColor } from "@/modules/calendar/types";

export const colorSwatchClasses: Record<string, string> = {
  purple: "border-purple-700 bg-purple-400 dark:border-purple-800 dark:bg-purple-950",
  red: "border-red-700 bg-red-400 dark:border-red-800 dark:bg-red-950",
  yellow: "border-yellow-700 bg-yellow-400 dark:border-yellow-800 dark:bg-yellow-950",
  green: "border-green-700 bg-green-400 dark:border-green-800 dark:bg-green-950",
  blue: "border-blue-700 bg-blue-400 dark:border-blue-800 dark:bg-blue-950",
};

export function advancementLevelToColor(advancementLevel: string, owned: boolean): TEventColor {
  if (owned) {
    return 'purple';
  }

  switch (advancementLevel) {
    case 'Beginner':
      return 'green';
    case 'Intermediate':
      return 'yellow';
    case 'Advanced':
      return 'red';
    default:
      return 'blue';
  }
}

export const colorLegend: { color: TEventColor, label: string; }[] = [
  { color: 'purple', label: 'My classes' },
  { color: 'red', label: 'Advanced level' },
  { color: 'yellow', label: 'Intermediate level' },
  { color: 'green', label: 'Beginner level' },
  { color: 'blue', label: 'Other / default' }
];

export const getColorClass = (color: string): string => {
  const colorClasses: Record<TEventColor, string> = {
    red: 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300',
    yellow: 'border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-300',
    green: 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300',
    blue: 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300',
    orange: 'border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-300',
    purple: 'border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300',
  };
  return colorClasses[color as TEventColor] || '';
};

export const getBgColor = (color: string): string => {
  const colorClasses: Record<TEventColor, string> = {
    red: 'bg-red-400 dark:bg-red-600',
    yellow: 'bg-yellow-400 dark:bg-yellow-600',
    green: 'bg-green-400 dark:bg-green-600',
    blue: 'bg-blue-400 dark:bg-blue-600',
    orange: 'bg-orange-400 dark:bg-orange-600',
    purple: 'bg-purple-400 dark:bg-purple-600',
  };
  return colorClasses[color as TEventColor] || '';
};