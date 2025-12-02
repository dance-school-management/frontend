"use client";
import { AspectRatio } from "@repo/ui/aspect-ratio";
import { Button } from "@repo/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@repo/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@repo/ui/dialog";
import { Separator } from "@repo/ui/separator";
import { isSameDay } from "date-fns";
import { QRCodeSVG } from "qrcode.react";

import { Ticket } from "@/lib/model/enroll";
import { fmtDate, fmtTime } from "@/lib/utils/time";

interface TicketPreviewProps {
  ticket: Ticket;
  variant?: "current" | "past";
}

export function TicketPreview({ ticket, variant = "current" }: TicketPreviewProps) {
  const startTime = fmtTime(ticket.startDate);
  const endTime = fmtTime(ticket.endDate);
  const startDate = fmtDate(ticket.startDate);

  const date = `${startDate} (${startTime} - ${endTime})`;

  return (
    <Card className="max-w-xl w-full gap-0">
      <CardHeader>
        <CardTitle className="text-2xl">{ticket.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          <p className="text-lg">Date: {date}</p>
          <p className="text-base">Room: {ticket.classRoomName}</p>
        </CardDescription>
      </CardContent>
      <CardFooter className="mt-2">
        <TicketDialog ticket={ticket} withCode={variant === "current"} />
      </CardFooter>
    </Card>
  );
}

interface TicketDialogProps {
  ticket: Ticket;
  withCode?: boolean;
}

function TicketDialog({ ticket, withCode = true }: TicketDialogProps) {
  const meta = {
    qrCodeUUID: ticket.qrCodeUUID,
  };

  const startTime = fmtTime(ticket.startDate);
  const endTime = fmtTime(ticket.endDate);
  const startDate = fmtDate(ticket.startDate);
  const isToday = isSameDay(new Date(ticket.startDate), new Date());

  const date = `${startDate} (${startTime} - ${endTime})`;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="cursor-pointer ml-auto w-full sm:w-48">Show More</Button>
      </DialogTrigger>
      <DialogContent className="w-full max-h-[90%] overflow-auto">
        <DialogHeader>
          <DialogTitle>{ticket.name}</DialogTitle>
          <DialogDescription>{ticket.description}</DialogDescription>
        </DialogHeader>
        <div className="text-foreground font-semibold text-base">
          <Info caption="Date:" value={date} />
          <Info caption="Room:" value={ticket.classRoomName} />
          <Info caption="Category:" value={ticket.danceCategoryName} />
          <Info caption="Level:" value={ticket.advancementLevelName} />
        </div>
        {withCode && isToday && (
          <>
            <Separator />
            <p className="font-normal text-xs md:text-sm text-muted-foreground">
              This is your ticket for the class. Scan it, please.
            </p>
            <AspectRatio ratio={1 / 1} className="w-full">
              <div className="bg-white rounded-xl w-full h-full flex justify-center items-center">
                <QRCodeSVG className="p-3 w-full h-full" value={JSON.stringify(meta)} bgColor="transparent" level="H" />
              </div>
            </AspectRatio>
            <p className="text-xs text-right">
              <span className="font-semibold">Ticket ID:</span> {ticket.qrCodeUUID}
            </p>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Info({ caption, value }: { caption: string; value: string }) {
  return (
    <p>
      <span className="font-normal text-muted-foreground">{caption}</span>
      <span className="font-semibold"> {value}</span>
    </p>
  );
}
