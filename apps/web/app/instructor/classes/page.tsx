import { Card, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/card";
import { headers } from "next/headers";

import { ClassTemplatePreview, NewClassTemplateDialog } from "@/components/cms/misc";
import { fetchPrivateClassTemplates } from "@/lib/api/product";

export default async function Page() {
  const cookie = (await headers()).get("cookie") ?? "";
  const { data, error } = await fetchPrivateClassTemplates(cookie);

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-full">
        <h1 className="text-4xl font-bold">Error: {error?.message}</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-4 space-y-4 h-full">
      <h1 className="text-4xl font-bold">Private Classes</h1>
      <NewClassTemplateDialog classType="private" />

      {data.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>No private classes found</CardTitle>
            <CardDescription>Create a new private class to get started</CardDescription>
          </CardHeader>
        </Card>
      )}

      {data.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-2">
            {data.map((classTemplate) => (
              <ClassTemplatePreview
                key={classTemplate.id}
                href={`/instructor/classes/${classTemplate.id}`}
                name={classTemplate.name}
                description={classTemplate.description}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
