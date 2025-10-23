import { headers } from 'next/headers';

import { fetchInstructor } from "@/lib/api/profile";
import { InstructorDetailsBody, InstructorDetailsHeader } from '@/components/instructors/details';
import { InstructorExperienceChart } from '@/components/instructors/chart';

export default async function Page({ params }: { params: Promise<{ id: string; }>; }) {
  const { id } = await params;
  const cookie = (await headers()).get('cookie') ?? "";

  const courseId = parseInt(id, 10);
  if (isNaN(courseId)) {
    return (
      <div className="flex items-center justify-center h-full">
        <h1 className="text-4xl font-bold">Invalid course ID</h1>
      </div>
    );
  }

  const { data: instructor, error } = await fetchInstructor(courseId, cookie);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className='w-full p-2 md:p-4 space-y-6'>
      <div className="w-full p-4 flex items-center justify-center">
        <div className="max-w-3xl space-y-4">
          <InstructorDetailsHeader instructor={instructor} />
          <InstructorDetailsBody instructor={instructor} />
          <InstructorExperienceChart experience={instructor.experience} />
        </div>
      </div>
    </div>
  );

}