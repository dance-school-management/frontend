import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/card";
import { Skeleton } from "@repo/ui/skeleton";
import { Suspense } from "react";

import { LoginForm } from "@/components/forms/login-form";

export default function Page() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-full max-w-sm">
        <Suspense fallback={<LoginFormSkeleton />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}

function LoginFormSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            <Skeleton className="h-6 w-24" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-60" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-4 w-28" />
            </div>
            <Skeleton className="h-10 w-full" />
            <div className="flex justify-center">
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
