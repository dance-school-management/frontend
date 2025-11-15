import { Button } from "@repo/ui/button";
import { Sparkles } from "lucide-react";
import Link from "next/link";

export function CallToActionSection() {
  return (
    <section className="flex flex-col items-center justify-center gap-6 py-12 px-4 bg-muted/50 rounded-lg mx-4">
      <div className="flex flex-col gap-4 max-w-2xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold">
          Ready to Start Dancing?
        </h2>
        <p className="text-lg text-muted-foreground">
          Join our dance community today and experience the joy of movement.
          Whether you&apos;re a beginner or advanced dancer, we have something for everyone.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
          <Button asChild size="lg">
            <Link href="/register">
              <Sparkles className="size-5" />
              Register Now
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/contact">
              Contact Us
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
