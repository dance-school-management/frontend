"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "@repo/ui/card";
import { SkeletonThemeToggle } from "@/components/theme-toggle";

export default function AppearancePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>Choose your preferred theme.</CardDescription>
        <SkeletonThemeToggle />
      </CardHeader>
    </Card>
  );
}


