import { use } from "react";

import { fetchCourse, fetchAdditionalProductData } from "@/mocks/product";
// import { fetchCourse, fetchAdditionalProductData } from "@/lib/api/product";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@repo/ui/card";

import { CourseActions } from "@/components/cms/misc";
import { CourseDetailsForm } from "@/components/cms/course-details-form";
import { CourseClassTemplateForm } from "@/components/cms/class-template-form";
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

  const result = use(fetchCourse(courseId));
  const additionalData = use(fetchAdditionalProductData());

  if (additionalData.error) {
    return (
      <div className="flex items-center justify-center h-full flex-col">
        <h1 className="text-4xl font-bold">Problem occurred while fetching additional product data</h1>
        <p className="text-xl">{additionalData.error.message}</p>
      </div>
    );
  }

  if (result.error) {
    return (
      <div className="flex items-center justify-center h-full flex-col">
        <h1 className="text-4xl font-bold">Problem occurred while fetching course</h1>
        <p className="text-xl">{result.error.message}</p>
      </div>
    );
  }

  const { danceCategories, advancementLevels } = additionalData.data;
  const { name, classTemplate } = result.data;

  return (
    <div className="flex h-full p-4 flex-col space-y-4">
      <h1 className="text-4xl font-bold">{name} details</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CourseDetailsForm course={result.data} />
        {classTemplate[0] && (
          <Card className="gap-2">
            <CardHeader>
              <CardTitle>Class Template</CardTitle>
              <CardDescription>Edit the class template information</CardDescription>
            </CardHeader>
            <CardContent>
              <CourseClassTemplateForm
                template={classTemplate[0]}
                courseId={courseId}
                danceCategories={danceCategories}
                advancementLevels={advancementLevels}
              />
            </CardContent>
          </Card>
        )}
        {classTemplate[0]?.class && (
          <ClassesList
            classes={classTemplate[0].class}
          />
        )}
        <CourseActions {...result.data} />
      </div>
    </div>
  );
};