import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { Clock, Mail, MapPin, Phone } from "lucide-react";



interface ContactInfoProps {
  address: string;
  phone: string;
  email: string;
  hours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
}

export function ContactInfo({ address, phone, email, hours }: ContactInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Contact Information</CardTitle>
        <CardDescription>
          Get in touch with us through any of these channels.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="rounded-lg bg-primary/10 p-2">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-1">Address</h3>
            <p className="text-muted-foreground text-sm">{address}</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="rounded-lg bg-primary/10 p-2">
            <Phone className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-1">Phone</h3>
            <a
              href={`tel:${phone.replace(/\s/g, "")}`}
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              {phone}
            </a>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="rounded-lg bg-primary/10 p-2">
            <Mail className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-1">Email</h3>
            <a
              href={`mailto:${email}`}
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              {email}
            </a>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="rounded-lg bg-primary/10 p-2">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-1">Business Hours</h3>
            <div className="text-muted-foreground space-y-1 text-sm">
              <p>{hours.weekdays}</p>
              <p>{hours.saturday}</p>
              <p>{hours.sunday}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

