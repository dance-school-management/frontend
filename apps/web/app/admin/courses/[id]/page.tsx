import { use } from "react";

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

  // TODO: Show appropriate data
  return (
    <div className="flex items-center justify-center h-full flex-col">
      <h1 className="text-4xl font-bold">Courses information</h1>
      <br />
      <p className="text-lg">Course ID: {courseId}</p>
    </div>
  );
}