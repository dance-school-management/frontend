export function fmtTime(time: string) {
  return time.split("T")[1]!.split(".")[0]!.split(":").slice(0, 2).join(":");
}

export function fmtDate(date: string) {
  return date.split("T")[0]!;
}

export function isToday(date: string): boolean {
  const today = new Date().setHours(0, 0, 0, 0);
  return new Date(date).setHours(0, 0, 0, 0) === today;
}