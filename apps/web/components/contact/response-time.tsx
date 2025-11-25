import { Alert, AlertDescription, AlertTitle } from "@repo/ui/alert";
import { Clock } from "lucide-react";

export function ResponseTime() {
  return (
    <Alert>
      <Clock className="h-4 w-4" />
      <AlertTitle>Response Time</AlertTitle>
      <AlertDescription>
        We typically respond within 24-48 hours during business days. For urgent
        matters, please call us directly.
      </AlertDescription>
    </Alert>
  );
}

