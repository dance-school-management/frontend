import { Alert, AlertDescription, AlertTitle } from "@repo/ui/alert";
import { Info } from "lucide-react";

function hoursInfoText(hours: number) {
  switch (hours) {
    case 0:
      return "You haven't been to the dance school yet.";
    case 1:
      return "You have spent 1 hour learning in our dance school.";
    default:
      return `You have spent ${hours} hours in our dance school.`;
  }
}

export function TotalHoursInfo({ hours }: { hours: number; }) {

  return (
    <Alert variant="default">
      <Info />
      <AlertTitle>Fun fact!</AlertTitle>
      <AlertDescription>
        {hoursInfoText(hours)}
      </AlertDescription>
    </Alert>
  );
}