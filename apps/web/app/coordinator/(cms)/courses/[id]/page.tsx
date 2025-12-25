import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/card";
import { Separator } from "@repo/ui/separator";
import { headers } from "next/headers";

import { CourseClassTemplateForm } from "@/components/cms/class-template-form";
import { ClassesList } from "@/components/cms/classes-list";
import { CourseDetailsForm } from "@/components/cms/course-details-form";
import { CourseActions } from "@/components/cms/misc";
import { fetchCourse } from "@/lib/api/product";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cookie = (await headers()).get("cookie") ?? "";

  const courseId = parseInt(id, 10);
  if (isNaN(courseId)) {
    return (
      <div className="flex items-center justify-center h-full">
        <h1 className="text-4xl font-bold">Invalid course ID</h1>
      </div>
    );
  }

  const result = await fetchCourse(courseId, cookie);

  if (result.error) {
    return (
      <div className="flex items-center justify-center h-full flex-col">
        <h1 className="text-4xl font-bold">Problem occurred while fetching course</h1>
        <p className="text-xl">{result.error.message}</p>
      </div>
    );
  }

  const { name, classTemplate } = result.data;

  return (
    <div className="flex h-full p-4 flex-col space-y-4">
      <h1 className="text-4xl font-bold">{name} details</h1>
      <CourseActions course={result.data} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CourseDetailsForm course={result.data} />
        {classTemplate.length > 0 &&
          classTemplate.map((template, index) => (
            <Card className="gap-2" key={index}>
              <CardHeader>
                <CardTitle>Class Template {index + 1}</CardTitle>
                <CardDescription>Edit the class template information</CardDescription>
              </CardHeader>
              <CardContent>
                <CourseClassTemplateForm template={template} courseId={courseId} />
                <Separator className="my-6 h-[2px]!" />
                <ClassesList classTemplate={template} classType="rest" />
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}
