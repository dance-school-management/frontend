import { cn } from "@repo/ui/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs";
import { headers } from "next/headers";

import { PaymentList } from "@/components/tickets/payment-list";
import { TicketList } from "@/components/tickets/ticket-list";
import { fetchTickets } from "@/lib/api/enroll";
import { filterTickets } from "@/lib/utils/filters";

export default async function Page() {
  const cookie = (await headers()).get('cookie') ?? "";
  const { data, error } = await fetchTickets(cookie);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const { tickets } = data;

  const { pastTickets, paymentPendingTickets, restTickets } = filterTickets(tickets);

  const tabs = [
    {
      name: "Current",
      value: "current",
      tickets: restTickets,
    },
    {
      name: "Past",
      value: "past",
      tickets: pastTickets,
    },
    {
      name: "Pending Payment",
      value: "payment",
      tickets: paymentPendingTickets,
      color: "bg-destructive/30 text-destructive",
    },
  ];

  return (
    <div className='w-full p-2 md:p-4 space-y-6'>
      <div className='space-y-2'>
        <h1 className='text-2xl font-bold tracking-tight'>My Tickets</h1>
        <p className='text-muted-foreground'>
          Manage your dance class tickets and payments
        </p>
      </div>

      <Tabs defaultValue={tabs[0]!.value} className='w-full'>
        <TabsList className='grid w-full grid-cols-3 lg:w-fit lg:grid-cols-none lg:inline-flex'>
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className='relative flex flex-col items-center gap-1 md:px-3 md:py-2 px-1 py-1 text-xs md:text-sm font-medium transition-all duration-200 dark:data-[state=active]:bg-background/50'
            >
              <span className='flex items-center gap-2'>
                {tab.name}
                {tab.tickets.length > 0 && (
                  <span className={cn('md:inline-flex hidden items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold rounded-full bg-primary/10 text-primary', tab.color)}>
                    {tab.tickets.length}
                  </span>
                )}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map(tab => (
          <TabsContent key={tab.value} value={tab.value} className='mt-6'>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <h2 className='text-lg font-semibold'>{tab.name} Tickets</h2>
                <span className='text-sm text-muted-foreground'>
                  {tab.tickets.length} {tab.tickets.length === 1 ? 'ticket' : 'tickets'}
                </span>
              </div>
              {tab.value === "payment" ? (
                <PaymentList tickets={tab.tickets} />
              ) : (
                <TicketList tickets={tab.tickets} variant={tab.value as "current" | "past"} />
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
