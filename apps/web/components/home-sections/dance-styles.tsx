import { DanceCategoryCard } from "@/components/courses/dance-category-card";
import { DanceCategory } from "@/lib/model/product";
import { Button } from "@repo/ui/components/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface FeaturedDanceStylesSectionProps {
  categories: DanceCategory[];
}

export function FeaturedDanceStylesSection({ categories }: FeaturedDanceStylesSectionProps) {
  return (
    <section className="flex flex-col gap-4 px-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold">
            Featured Dance Styles
          </h2>
          <p className="text-muted-foreground">
            Explore our diverse range of dance categories
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/about/styles">
            View All Styles
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category) => (
          <DanceCategoryCard key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
}
