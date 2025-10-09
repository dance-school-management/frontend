import { Alert, AlertDescription, AlertTitle } from "@repo/ui/components/alert";
import { Info } from "lucide-react";

export function TotalHoursInfo({ hours }: { hours: number; }) {
  return (
    <Alert variant="default">
      <Info />
      <AlertTitle>Fun fact!</AlertTitle>
      <AlertDescription>
        You have spent {hours} hours in our dance school.
      </AlertDescription>
    </Alert>
  );
}