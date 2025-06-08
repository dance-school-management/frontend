"use client";

import Link from "next/link";

import { Loader } from "@/components/loader";
import { useUserStore } from "@/lib/store";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, hydrated } = useUserStore();

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader />
      </div>
    );
  }

  if (hydrated && !user) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-2xl">
          You must be logged in to access this page.
        </p>
        <p>
          Go to the
          <Link href={"/login"} className="text-blue-600 hover:underline">
            {" "}login page
          </Link> and come back when you are logged in.
        </p>
      </div>
    );
  }

  if (hydrated && user && user.role !== "ADMINISTRATOR") {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-2xl">
          You do not have permission to access this page.
        </p>
        <p>
          Please contact an administrator if you believe this is an error.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}