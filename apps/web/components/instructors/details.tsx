import { InstructorWithDetails } from "@/lib/model/profile";
import { getInitials } from "@/lib/utils/text";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/avatar";
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@repo/ui/item";
import { DanceCategoryBadge } from "@/components/instructors/badge";

import { Mail, Phone } from "lucide-react";

export function InstructorDetailsHeader({ instructor }: { instructor: InstructorWithDetails; }) {
  const name = `${instructor.name} ${instructor.surname}`;
  const initials = getInitials(instructor.name, instructor.surname);

  return (
    <>
      <Avatar className="size-48 mx-auto block lg:hidden">
        <AvatarImage src={"https://api.dicebear.com/9.x/micah/svg?seed=" + instructor.id} />
        <AvatarFallback className="text-7xl">{initials}</AvatarFallback>
      </Avatar>
      <Item variant="default" className="w-full mt-4">
        <ItemMedia className="hidden lg:block">
          <Avatar className="size-48">
            {/* TODO: Use real photo URL */}
            <AvatarImage src={"https://api.dicebear.com/9.x/micah/svg?seed=" + instructor.id} />
            <AvatarFallback className="text-7xl">{initials}</AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent className="flex flex-col items-center">
          <ItemTitle className="text-3xl lg:text-4xl font-bold">{name}</ItemTitle>
          <ItemDescription>
            <span className="flex items-center gap-2 font-semibold text-foreground text-base lg:text-lg">
              <Phone className="size-4" /> {instructor.phone}
            </span>
            <span className="flex items-center gap-2 font-semibold text-foreground text-base lg:text-lg">
              <Mail className="size-4" /> {instructor.email}
            </span>
          </ItemDescription>
        </ItemContent>
      </Item>
    </>
  );
}


export function InstructorDetailsBody({ instructor }: { instructor: InstructorWithDetails; }) {
  const favouriteDanceCategories = [...new Set(instructor.favouriteDanceCategories)];

  return (
    <div className="rounded-md mt-8">
      <h2 className="text-2xl font-bold">Specializations:</h2>
      <div className="flex flex-wrap gap-2 mb-4 mt-2">
        {favouriteDanceCategories.map((category, index) => (
          <DanceCategoryBadge key={index} category={category} />
        ))}
      </div>
      <h2 className="text-2xl font-bold">About me:</h2>
      <p className="text-base">{instructor.description}</p>
    </div>
  );
}
