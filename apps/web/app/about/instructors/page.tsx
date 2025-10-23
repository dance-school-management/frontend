import { headers } from 'next/headers';

import { fetchInstructors } from "@/lib/api/profile";
import { InstructorPreviewCard } from '@/components/instructors/preview';


export default async function Page() {
    const cookie = (await headers()).get('cookie') ?? "";
    const { data, error } = await fetchInstructors(cookie);

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className='w-full p-2 md:p-4 space-y-6'>
            <div className='space-y-2'>
                <h1 className='text-2xl font-bold tracking-tight'>Our Instructors</h1>
                <p className='text-muted-foreground'>
                    Meet our talented instructors who will guide you through your dance journey
                </p>
            </div>
            <div className="w-full p-4 flex items-center justify-center min-h-screen">
                <div className="max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {data.instructors.map((instructor) => (
                        <InstructorPreviewCard key={instructor.id} instructor={instructor} />
                    ))}
                </div>
            </div>
        </div>
    );
}
