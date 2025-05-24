import { ClassTemplatePreview, NewClassTemplateDialog } from "@/components/cms/misc";

// import { fetchClassTemplates, fetchAdditionalProductData } from "@/lib/api/product";
import { fetchClassTemplates, fetchAdditionalProductData } from "@/mocks/product";

export default async function Page() {
  const [classes, additionalData] = await Promise.all([
    fetchClassTemplates(),
    fetchAdditionalProductData(),
  ]);

  if (classes.error || additionalData.error) {
    return (
      <div className="flex items-center justify-center h-full">
        <h1 className="text-4xl font-bold">Error: {classes.error?.message || additionalData.error?.message}</h1>
      </div>
    );
  }
  const { data } = classes;
  const { danceCategories, advancementLevels } = additionalData.data;

  const privateClasses = data.filter((classTemplate) => classTemplate.classType === "PRIVATE_CLASS");
  const eventClasses = data.filter((classTemplate) => classTemplate.classType === "THEME_PARTY");

  return (
    <div className="flex h-full p-4 flex-col space-y-4">
      <h1 className="text-4xl font-bold">Classes</h1>

      <NewClassTemplateDialog
        danceCategories={danceCategories}
        advancementLevels={advancementLevels}
      />

      <h3 className="text-lg font-semibold">Private classes</h3>
      <div className="grid grid-cols-2 gap-2">
        {privateClasses.map((classTemplate) => (
          <ClassTemplatePreview
            key={classTemplate.id}
            id={classTemplate.id}
            name={classTemplate.name}
            description={classTemplate.description}
          />
        ))}
      </div>

      <h3 className="text-lg font-semibold">Event classes</h3>
      <div className="grid grid-cols-2 gap-2">
        {eventClasses.map((classTemplate) => (
          <ClassTemplatePreview
            key={classTemplate.id}
            id={classTemplate.id}
            name={classTemplate.name}
            description={classTemplate.description}
          />
        ))}
      </div>
    </div>
  );
}