"use client";

import { format, parseISO } from "date-fns";
import { Building, Calendar, ChevronsUp, SquareChartGantt, Text, User } from "lucide-react";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@repo/ui/dialog";
import { ScrollArea } from "@repo/ui/scroll-area";

import type { IEvent } from "@/modules/calendar/types";
import { Button } from "@repo/ui/components/button";
import { ReactNode } from "react";
import { formatTime } from "../../helpers";

interface IProps {
    event: IEvent;
    children: ReactNode;
}

export function EventDetailsDialog({ event, children }: IProps) {
    const startDate = parseISO(event.startDate);
    const names = event.instructors.map((instructor) => instructor.name).join(", ");
    const formattedDate = `${format(startDate, "EEEE dd MMMM")}, ${formatTime(parseISO(event.startDate))} - ${formatTime(parseISO(event.endDate))}`;

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{event.name}</DialogTitle>
                </DialogHeader>

                <ScrollArea className="max-h-[80vh]">
                    <div className="space-y-3 px-4">
                        <div className="flex items-start gap-2">
                            <User className="mt-1 size-4 shrink-0 text-muted-foreground" />
                            <Section title="Instructor(s)" text={names} />
                        </div>

                        <div className="flex items-start gap-2">
                            <Calendar className="mt-1 size-4 shrink-0 text-muted-foreground" />
                            <Section title="Date & Time" text={formattedDate} />
                        </div>

                        <div className="flex items-start gap-2">
                            <Building className="mt-1 size-4 shrink-0 text-muted-foreground" />
                            <Section title="Location" text={event.classroom} />
                        </div>

                        <div className="flex items-start gap-2">
                            <SquareChartGantt className="mt-1 size-4 shrink-0 text-muted-foreground" />
                            <Section title="Dance Category" text={event.danceCategory} />
                        </div>

                        <div className="flex items-start gap-2">
                            <ChevronsUp className="mt-1 size-4 shrink-0 text-muted-foreground" />
                            <Section title="Advancement Level" text={event.advancementLevel} />
                        </div>

                        <div className="flex items-start gap-2">
                            <Text className="mt-1 size-4 shrink-0 text-muted-foreground" />
                            <Section title="Description" text={event.description} />
                        </div>

                        <div className="w-full flex md:justify-end">
                            <Button className="w-full md:w-50 mt-4 bg-green-500 hover:bg-green-600">
                                Buy ({event.price} {event.currency})
                            </Button>
                        </div>
                    </div>
                </ScrollArea>
                <DialogClose />
            </DialogContent>
        </Dialog>
    );
}

function Section({
    title,
    text,
}: {
    title: string;
    text: string;
}) {
    return (
        <div>
            <p className="text-sm font-medium">{title}</p>
            <p className="text-sm text-muted-foreground">{text}</p>
        </div>
    );
}