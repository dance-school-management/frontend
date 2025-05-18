import { use } from "react";
// import { fetchCourse } from "@/lib/api/course";
import { fetchCourse } from "../mocks";
import { CourseActions } from "@/components/cms/courses-misc";

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

  if (result.error) {
    return (
      <div className="flex items-center justify-center h-full flex-col">
        <h1 className="text-4xl font-bold">Problem occurred while fetching course</h1>
        <p className="text-xl">{result.error.message}</p>
      </div>
    );
  }

  const {
    name,
    courseStatus,
    customPrice,
    classTemplate,
    description,
    danceCategory,
    advancementLevel,
  } = result.data;

  return (
    <div className="flex h-full p-4 flex-col space-y-4">
      <h1 className="text-4xl font-bold">{name} details</h1>
      <div>
        <h2 className="text-2xl font-semibold">Classes:</h2>
        {/* TODO: Show classes (probably using Collapsible?) */}
        <p>TBA</p>
      </div>
      <p>Status: {courseStatus}</p>
      <p>Price: {customPrice || "Empty"} {classTemplate[0]?.currency}</p>
      <p>Description: {description}</p>
      <p>Dance category: {danceCategory?.name || "Empty"}</p>
      <p>Advancement level: {advancementLevel?.name || "Empty"}</p>
      <CourseActions {...result.data} />
    </div >
  );
}