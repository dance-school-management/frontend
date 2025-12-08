"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

import { Loader } from "@/components/loader";
import { useUserStore } from "@/lib/store";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-full">
          <Loader />
        </div>
      }
    >
      <ProtectedContent>{children}</ProtectedContent>
    </Suspense>
  );
}

function ProtectedContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, hydrated } = useUserStore();

  useEffect(() => {
    if (hydrated && !user) {
      const searchString = searchParams.toString();
      const redirectUrl = searchString ? `${pathname}?${searchString}` : pathname;
      router.replace(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
    }
  }, [hydrated, user, pathname, searchParams, router]);

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader />
      </div>
    );
  }

  if (hydrated && !user) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader />
      </div>
    );
  }

  return <>{children}</>;
}
