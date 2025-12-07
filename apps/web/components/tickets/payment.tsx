"use client";

import { Button } from "@repo/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/card";
import { Separator } from "@repo/ui/separator";
import { useState } from "react";

import { getPaymentLink } from "@/lib/api/enroll";
import { Ticket } from "@/lib/model/enroll";
import { fmtDate, fmtTime } from "@/lib/utils/time";

interface ClassPaymentCardProps {
  ticket: Ticket;
}

export function ClassPaymentCard({ ticket }: ClassPaymentCardProps) {
  const [paymentLink, setPaymentLink] = useState<string | null>(null);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);

  const startTime = fmtTime(ticket.startDate);
  const endTime = fmtTime(ticket.endDate);
  const startDate = fmtDate(ticket.startDate);

  const date = `${startDate} (${startTime} - ${endTime})`;

  const handlePaymentClick = async () => {
    if (paymentLink) {
      window.open(paymentLink, "_blank");
      return;
    }

    setIsLoadingPayment(true);
    try {
      const result = await getPaymentLink(ticket.classId, undefined, document.cookie);
      if (result.data) {
        setPaymentLink(result.data.url);
        window.open(result.data.url, "_blank");
      } else {
        console.error("Failed to fetch payment link:", result.error);
      }
    } catch (error) {
      console.error("Error fetching payment link:", error);
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
          <p>Price: {ticket.price.toFixed(2)} PLN</p>
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
