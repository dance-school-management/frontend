import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";

interface ContactMapProps {
  address: string;
}

export function ContactMap({ address }: ContactMapProps) {
  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Find Us</CardTitle>
        <CardDescription>
          Visit us at our location in the heart of Kraków.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[400px] rounded-lg overflow-hidden border">
          <iframe
            src={mapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Dance School Location"
            className="w-full h-full"
          />
        </div>
        <p className="text-muted-foreground mt-4 text-sm text-center">
          {address}
        </p>
      </CardContent>
    </Card>
  );
}

