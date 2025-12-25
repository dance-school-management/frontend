import { headers } from "next/headers";

import { ClassTemplatePreview, NewClassTemplateDialog } from "@/components/cms/misc";
import { fetchClassTemplates } from "@/lib/api/product";

export default async function Page() {
  const cookie = (await headers()).get("cookie") ?? "";
  const classes = await fetchClassTemplates(cookie);

  if (classes.error) {
    return (
      <div className="flex items-center justify-center h-full">
        <h1 className="text-4xl font-bold">Error: {classes.error.message}</h1>
      </div>
    );
  }
  const { data } = classes;

  const groupClasses = data.filter((classTemplate) => classTemplate.classType === "GROUP_CLASS");
  const eventClasses = data.filter((classTemplate) => classTemplate.classType === "THEME_PARTY");

  return (
    <div className="flex h-full p-4 flex-col space-y-4">
      <h1 className="text-4xl font-bold">Class Templates</h1>
      <NewClassTemplateDialog classType="rest" />

      {groupClasses.length > 0 && (
        <>
          <h3 className="text-lg font-semibold">Group classes</h3>
          <div className="grid grid-cols-2 gap-2">
            {groupClasses.map((classTemplate) => (
              <ClassTemplatePreview
                href={`/coordinator/classes/${classTemplate.id}`}
                key={classTemplate.id}
                name={classTemplate.name}
                description={classTemplate.description}
              />
            ))}
          </div>
        </>
      )}

      {eventClasses.length > 0 && (
        <>
          <h3 className="text-lg font-semibold">Events</h3>
          <div className="grid grid-cols-2 gap-2">
            {eventClasses.map((classTemplate) => (
              <ClassTemplatePreview
                key={classTemplate.id}
                href={`/coordinator/classes/${classTemplate.id}`}
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
