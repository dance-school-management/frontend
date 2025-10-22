import Link from "next/link";

import { Instructor } from "@/lib/model/profile";
import { getInitials } from "@/lib/utils/text";
import { Avatar, AvatarImage, AvatarFallback } from "@repo/ui/components/avatar";
import { Item, ItemContent, ItemMedia, ItemTitle, ItemDescription } from "@repo/ui/components/item";


interface InstructorPreviewCardProps {
  instructor: Instructor;
}

export function InstructorPreviewCard({ instructor }: InstructorPreviewCardProps) {
  const favouriteDanceCategories = [...new Set(instructor.favouriteDanceCategories)];

  return (
    <Link href={`/about/instructors/${instructor.id}`}>
      <Item variant="outline" className="max-w-md w-full">
        <ItemMedia>
          <Avatar className="size-10">
            {/* TODO: Use real photo URL */}
            <AvatarImage src={"https://api.dicebear.com/9.x/micah/svg?seed=" + instructor.id} />
            <AvatarFallback>{getInitials(instructor.name, instructor.surname)}</AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{instructor.name} {instructor.surname}</ItemTitle>
          <ItemDescription>Specializations:</ItemDescription>
          <div className="flex flex-wrap gap-2">
            {favouriteDanceCategories.map((category, index) => (
              <DanceCategoryBadge key={index} category={category} />
            ))}
          </div>
        </ItemContent>
      </Item>
    </Link>
  );
}

function DanceCategoryBadge({ category }: { category: string; }) {
  return (
    <span className='px-3 py-1 text-xs font-bold rounded-sm bg-primary/10 text-primary'>
      {category}
    </span>
  );
}