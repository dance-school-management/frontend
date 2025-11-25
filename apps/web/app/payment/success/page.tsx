import { CircleCheckBig } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="h-full p-4 flex items-center justify-center">
      <div className="w-full max-w-lg flex flex-col text-center items-center">
        <CircleCheckBig className="size-48 text-green-500 mb-16" />
        <h1 className="text-3xl md:text-4xl font-bold">Payment Successful</h1>
        <p className="text-lg md:text-xl text-muted-foreground">Your payment has been successful. You can now access your tickets in the <Link href="/user/tickets" className="text-blue-500 hover:text-blue-600 underline">My Tickets</Link> page.</p>
      </div>
    </div>
  );
}