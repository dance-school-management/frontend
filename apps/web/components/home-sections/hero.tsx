import { Button } from "@repo/ui/button";
import { BookOpen, Calendar, Sparkles } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="flex flex-col gap-10 max-w-3xl">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
          Welcome to Our Dance School
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground">
          Discover your passion for dance with our expert instructors and diverse range of styles.
          Join us and let your journey begin!
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 mt-4">
          <Button asChild size="lg">
            <Link href="/courses">
              <BookOpen className="size-5" />
              View Courses
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/schedule">
              <Calendar className="size-5" />
              View Schedule
            </Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/register">
              <Sparkles className="size-5" />
              Register Now
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
