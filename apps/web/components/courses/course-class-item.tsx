import { Badge } from "@repo/ui/badge";
import { Item, ItemContent, ItemDescription, ItemHeader, ItemTitle } from "@repo/ui/item";
import { Separator } from "@repo/ui/separator";

import { ClassWithTemplate } from "@/lib/model/product";
import { fmtDate, fmtTime } from "@/lib/utils/time";

interface CourseClassItemProps {
  classData: ClassWithTemplate;
}

const classTypeLabels: Record<string, string> = {
  GROUP_CLASS: "Group Class",
  PRIVATE_CLASS: "Private Class",
  THEME_PARTY: "Theme Party",
};

export function CourseClassItem({ classData }: CourseClassItemProps) {
  const { classTemplate } = classData;

  return (
    <Item variant="muted" className="border-border gap-2">
      <ItemHeader>
        <div className="flex justify-between gap-2 w-full">
          <div className="flex-1">
            <ItemTitle className="font-bold text-foreground">{classTemplate.name}</ItemTitle>
            {classData.groupNumber > 0 && (
              <p className="text-sm text-muted-foreground mt-1">Group {classData.groupNumber}</p>
            )}
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge variant="outline" className="text-xs">
              {classTypeLabels[classTemplate.classType] || classTemplate.classType}
            </Badge>
          </div>
        </div>
      </ItemHeader>
      <ItemContent className="space-y-2">
        <ItemDescription>
          {fmtDate(classData.startDate)} ({fmtTime(classData.startDate)} - {fmtTime(classData.endDate)})
        </ItemDescription>
        <span>Capacity: {classData.peopleLimit} people</span>

        {classTemplate.description && (
          <>
            <Separator />
            <ItemDescription>{classTemplate.description}</ItemDescription>
          </>
        )}
      </ItemContent>
    </Item>
  );
}

export function MinimalCourseClassItem({ classData }: CourseClassItemProps) {
  return (
    <Item variant="muted" className="border-border gap-2">
      <ItemHeader>
        <ItemTitle className="font-bold text-foreground">{classData.classTemplate.name}</ItemTitle>
      </ItemHeader>
      <ItemContent>
        <ItemDescription>
          {fmtDate(classData.startDate)} ({fmtTime(classData.startDate)} - {fmtTime(classData.endDate)})
        </ItemDescription>
        <Separator />
        <ItemDescription>{classData.classTemplate.description}</ItemDescription>
      </ItemContent>
    </Item>
  );
}
