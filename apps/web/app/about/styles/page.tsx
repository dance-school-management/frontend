import { DanceCategoryCard } from "@/components/courses/dance-category-card";
import { fetchDanceCategories } from "@/lib/api/product";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@repo/ui/components/empty";
import { headers } from "next/headers";

export default async function Page() {
    const cookie = (await headers()).get('cookie') ?? "";
    const { data, error } = await fetchDanceCategories(cookie);

    if (error || !data || data.length === 0) {
        return (
            <div className="flex flex-col p-4">
                <Headings />
                <EmptyState />
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col p-4">
                <Headings />
            </div>
            <div className="flex h-full p-4 flex-col gap-4 w-full items-center">
                {data.map((category) => (
                    <DanceCategoryCard key={category.id} category={category} />
                ))}
            </div>
        </>
    );
}

function Headings() {
    return (
        <div className="flex flex-col">
            <h1 className="text-4xl font-bold">Dance Styles</h1>
            <h3 className="text-lg text-muted-foreground">
                Explore our diverse range of dance categories and find the perfect style for you
            </h3>
        </div>
    );
}

function EmptyState() {
    return (
        <Empty className="max-w-xl w-full p-4 md:p-4 border border-solid mx-auto mt-4">
            <EmptyHeader>
                <EmptyTitle>No dance categories found</EmptyTitle>
                <EmptyDescription>
                    We weren&apos;t able to find any dance categories. Please try again later.
                </EmptyDescription>
            </EmptyHeader>
        </Empty>
    );
}
