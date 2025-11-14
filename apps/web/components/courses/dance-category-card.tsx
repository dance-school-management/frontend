import Image from "next/image";
import { DanceCategory } from "@/lib/model/product";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";

interface DanceCategoryCardProps {
  category: DanceCategory;
}

export function DanceCategoryCard({ category }: DanceCategoryCardProps) {
  // TODO: Use real image URL from the API
  // const imageUrl = category.photoPath
  //   ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/${category.photoPath}`
  //   : null;
  const imageUrl = "https://picsum.photos/seed/dance-category-" + category.name.toLowerCase().replace(/ /g, "-") + "/500";

  return (
    <Card className="w-full p-0">
      <div className="flex flex-col md:flex-row gap-4">
        {imageUrl && (
          <div className="relative w-full md:w-48 h-48 md:h-auto flex-shrink-0">
            <Image
              src={imageUrl}
              alt={category.name}
              fill
              className="object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
              sizes="(max-width: 768px) 100vw, 192px"
            />
          </div>
        )}
        <div className="flex-1 flex flex-col py-12 md:py-24">
          <CardHeader>
            <CardTitle className="text-2xl">{category.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-base">
              {category.description}
            </CardDescription>
          </CardContent>
        </div>
      </div>
    </Card>
  );
}



