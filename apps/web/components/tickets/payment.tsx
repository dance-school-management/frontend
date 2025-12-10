"use client";

import { Button } from "@repo/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/card";
import { Separator } from "@repo/ui/separator";
import { useState } from "react";
import { toast } from "sonner";

import { createClassOrder } from "@/lib/api/enroll";
import { Ticket } from "@/lib/model/enroll";
import { moneyLabel } from "@/lib/utils/finance";
import { fmtDate, fmtTime } from "@/lib/utils/time";

interface ClassPaymentCardProps {
  ticket: Ticket;
}

export function ClassPaymentCard({ ticket }: ClassPaymentCardProps) {
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const startTime = fmtTime(ticket.startDate);
  const endTime = fmtTime(ticket.endDate);
  const startDate = fmtDate(ticket.startDate);

  const date = `${startDate} (${startTime} - ${endTime})`;

  const handlePaymentClick = async () => {
    setIsLoadingPayment(true);
    try {
      const result = await createClassOrder(ticket.classId);
      if (result.error) {
        toast.error(result.error.message ?? "Failed to create class order");
        return;
      }
      if (result.data && !result.data.sessionUrl) {
        toast.error("Failed to create class order");
        return;
      }
      window.open(result.data.sessionUrl, "_self");
    } catch {
      toast.error("Failed to create class order");
    }
    setIsLoadingPayment(false);
  };

  return (
    <Card className="max-w-xl w-full gap-0">
      <CardHeader>
        <CardTitle className="text-2xl">{ticket.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">
          <p>{ticket.description}</p>
          <Separator className="my-2" />
          <p>Date: {date}</p>
          <p>Room: {ticket.classRoomName}</p>
          <p>Price: {moneyLabel(ticket.price)}</p>
          <p>Category: {ticket.danceCategoryName}</p>
          <p>Level: {ticket.advancementLevelName}</p>
        </CardDescription>
      </CardContent>
      <div className="mt-4 px-8">
        <Button
          onClick={handlePaymentClick}
          disabled={isLoadingPayment}
          className="w-full bg-green-500 hover:bg-green-600 transition-all duration-250 cursor-pointer"
        >
          {isLoadingPayment ? "Loading..." : "Pay Now"}
        </Button>
      </div>
    </Card>
  );
}
