import { InstructorPreviewCard } from "@/components/instructors/preview";
import { Instructor } from "@/lib/model/profile";
import { Button } from "@repo/ui/components/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface FeaturedInstructorsSectionProps {
  instructors: Instructor[];
}

export function FeaturedInstructorsSection({ instructors }: FeaturedInstructorsSectionProps) {
  return (
    <section className="flex flex-col gap-4 px-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold">
            Meet Our Instructors
          </h2>
          <p className="text-muted-foreground">
            Learn from our talented and experienced dance instructors
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/about/instructors">
            View All Instructors
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {instructors.map((instructor) => (
          <InstructorPreviewCard key={instructor.id} instructor={instructor} />
        ))}
      </div>
    </section>
  );
}
