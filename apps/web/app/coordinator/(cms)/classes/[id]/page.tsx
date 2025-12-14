import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/card";
import { headers } from "next/headers";

import { NonCourseClassTemplateForm } from "@/components/cms/class-template-form";
import { ClassesList } from "@/components/cms/classes-list";
import { ClassTemplateActions } from "@/components/cms/misc";
import { fetchClassTemplate } from "@/lib/api/product";

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

  const result = await fetchClassTemplate(courseId, cookie);

  if (result.error) {
    return (
      <div className="flex items-center justify-center h-full">
        <h1 className="text-4xl font-bold">Error: {result.error.message}</h1>
      </div>
    );
  }

  const { data } = result;

  return (
    <div className="flex h-full p-4 flex-col space-y-4">
      <h1 className="text-4xl font-bold">Class Template</h1>
      <ClassTemplateActions classTemplate={data} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="gap-2">
          <CardHeader>
            <CardTitle>Class Template</CardTitle>
            <CardDescription>Edit the class template information</CardDescription>
          </CardHeader>
          <CardContent>
            <NonCourseClassTemplateForm template={data} />
          </CardContent>
        </Card>
        <Card className="p-6">
          <ClassesList classTemplate={data} classType="rest" />
        </Card>
      </div>
    </div>
  );
}
