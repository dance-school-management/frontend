import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle
} from "@repo/ui/item";
import { Separator } from "@repo/ui/separator";

import { ClassWithTemplate } from "@/lib/model/product";
import { fmtDate, fmtTime } from "@/lib/utils/time";



interface CourseClassItemProps {
  classData: ClassWithTemplate;
}

export function CourseClassItem({ classData }: CourseClassItemProps) {
  return (
    <Item variant="muted" className="border-border gap-2">
      <ItemHeader>
        <ItemTitle className="font-bold text-foreground">{classData.classTemplate.name}</ItemTitle>
      </ItemHeader>
      <ItemContent>
        <ItemDescription> {fmtDate(classData.startDate)} ({fmtTime(classData.startDate)} - {fmtTime(classData.endDate)})</ItemDescription>
        <Separator />
        <ItemDescription>{classData.classTemplate.description}</ItemDescription>
      </ItemContent>
    </Item>
  );
}
