import { use } from "react";

import { fetchClassTemplate } from "@/mocks/product";
// import { fetchClassTemplate } from "@/lib/api/product";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/card";
import { NonCourseClassTemplateForm } from "@/components/cms/class-template-form";
import { ClassesList } from "@/components/cms/classes-list";

export default function Page({ params }: { params: Promise<{ id: string; }>; }) {
  const { id } = use(params);

  const courseId = parseInt(id, 10);
  if (isNaN(courseId)) {
    return (
      <div className="flex items-center justify-center h-full">
        <h1 className="text-4xl font-bold">Invalid course ID</h1>
      </div>
    );
  }

  const result = use(fetchClassTemplate(courseId));

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="gap-2">
          <CardHeader>
            <CardTitle>Class Template</CardTitle>
            <CardDescription>Edit the class template information</CardDescription>
          </CardHeader>
          <CardContent>
            <NonCourseClassTemplateForm
              template={data}
            />
          </CardContent>
        </Card>
        <ClassesList classTemplate={data} />
      </div>
    </div>
  );
}