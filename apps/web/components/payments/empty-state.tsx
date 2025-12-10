import { Button } from "@repo/ui/components/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@repo/ui/components/card";
import Link from "next/link";

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10">
      <Card>
        <CardHeader className="space-y-2">
          <CardTitle className="text-center text-xl">{title}</CardTitle>
          <CardDescription className="text-center text-base">{description}</CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-wrap justify-center gap-3 px-6 pb-6">
          <Button asChild className="min-w-[200px]">
            <Link href="/courses">Browse courses</Link>
          </Button>
          <Button asChild className="min-w-[200px]" variant="secondary">
            <Link href="/schedule">Check our schedule</Link>
          </Button>
          <Button asChild className="min-w-[200px]" variant="outline">
            <Link href="/">Back to home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
