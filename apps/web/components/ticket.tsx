"use client";
import { QRCodeSVG } from "qrcode.react";

import { Ticket } from "@/lib/model/enroll";
import { fmtTime } from "@/lib/utils/time";
import { useUserStore } from "@/lib/store";

import { AspectRatio } from "@repo/ui/aspect-ratio";
import { Button } from "@repo/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/dialog";
import { Separator } from "@repo/ui/separator";

export function TicketPreview({ ticket }: { ticket: Ticket; }) {

  const startTime = fmtTime(ticket.startDate);
  const endTime = fmtTime(ticket.endDate);
  const startDate = ticket.startDate.split("T")[0]!;

  const date = `${startDate} (${startTime} - ${endTime})`;

  return (
    <Card className="max-w-xl w-full gap-0">
      <CardHeader>
        <CardTitle className="text-2xl">{ticket.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription >
          <p className="text-lg">Date: {date}</p>
          <p className="text-base">Room: {ticket.classRoomName}</p>
        </CardDescription>
      </CardContent>
      <CardFooter className="mt-2">
        <TicketDialog ticket={ticket} />
      </CardFooter>
    </Card>
  );
}

function TicketDialog({ ticket }: { ticket: Ticket; }) {
  const { user } = useUserStore();

  const meta = {
    qrCodeUUID: ticket.qrCodeUUID,
    user_id: user?.id,
    class_id: ticket.classid,
  };

  const startTime = fmtTime(ticket.startDate);
  const endTime = fmtTime(ticket.endDate);
  const startDate = ticket.startDate.split("T")[0]!;

  const date = `${startDate} (${startTime} - ${endTime})`;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="cursor-pointer ml-auto w-full sm:w-48">Show Code</Button>
      </DialogTrigger>
      <DialogContent className="w-full max-h-[90%] overflow-auto">
        <DialogHeader>
          <DialogTitle>{ticket.name}</DialogTitle>
          <DialogDescription>
            {ticket.description}
          </DialogDescription>
        </DialogHeader>
        <div className="text-foreground font-semibold text-base">
          <Info caption="Date:" value={date} />
          <Info caption="Room:" value={ticket.classRoomName} />
          <Info caption="Category:" value={ticket.danceCategoryName} />
          <Info caption="Level:" value={ticket.advancementLevelName} />
          <Separator className="mt-2" />
        </div>
        <p className="font-normal text-xs md:text-sm text-muted-foreground">This is your ticket for the class. Scan it, please.</p>
        <AspectRatio ratio={1 / 1} className="w-full">
          <div className="bg-white rounded-xl w-full h-full flex justify-center items-center">
            <QRCodeSVG
              className="p-3 w-full h-full"
              value={JSON.stringify(meta)}
              bgColor="transparent"
              level="H"
            />
          </div>
        </AspectRatio>
        <p className="text-xs text-right">
          <span className="font-semibold">Ticket ID:</span> {ticket.qrCodeUUID}
        </p>
      </DialogContent>
    </Dialog>
  );
}

function Info({ caption, value }: { caption: string; value: string; }) {
  return (
    <p>
      <span className="font-normal text-muted-foreground">{caption}</span>
      <span className="font-semibold"> {value}</span>
    </p>
  );
}
