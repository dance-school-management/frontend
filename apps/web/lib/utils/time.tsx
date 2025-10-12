export function fmtTime(time: string) {
  return time.split("T")[1]!.split(".")[0]!.split(":").slice(0, 2).join(":");
}
