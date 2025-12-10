import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/card";
import { Skeleton } from "@repo/ui/skeleton";
import { Suspense } from "react";

import { RegisterForm } from "@/components/forms/register-form";

export default function Page() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-full max-w-sm">
        <Suspense fallback={<RegisterFormSkeleton />}>
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  );
}

function RegisterFormSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            <Skeleton className="h-6 w-24" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-64" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-full" />
            <div className="flex justify-center">
              <Skeleton className="h-4 w-44" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
