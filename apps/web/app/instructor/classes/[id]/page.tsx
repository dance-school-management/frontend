import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/card";
import { headers } from "next/headers";

import { PrivateClassTemplateForm } from "@/components/cms/class-template-form";
import { ClassesList } from "@/components/cms/classes-list";
import { PrivateClassTemplateActions } from "@/components/private-classes/actions";
import { EmptyState } from "@/components/private-classes/empty-state";
import { fetchPrivateClassTemplate } from "@/lib/api/product";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cookie = (await headers()).get("cookie") ?? "";

  const templateId = parseInt(id, 10);
  if (isNaN(templateId)) {
    return <EmptyState title="Invalid class template" description="Unfortunately, the template ID is invalid" />;
  }

  const { data, error } = await fetchPrivateClassTemplate(templateId, cookie);
  if (error || !data) {
    return (
      <EmptyState title="Error fetching class template" description={error?.message ?? "An unknown error occurred"} />
    );
  }

  return (
    <div className="flex h-full p-4 flex-col space-y-4">
      <h1 className="text-4xl font-bold">Class Template</h1>
      <PrivateClassTemplateActions classTemplate={data} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="gap-2">
          <CardHeader>
            <CardTitle>Class Template</CardTitle>
            <CardDescription>Edit the class template information</CardDescription>
          </CardHeader>
          <CardContent>
            <PrivateClassTemplateForm mode="edit" template={data} />
          </CardContent>
        </Card>
        <Card className="p-6">
          <ClassesList classTemplate={data} classType="private" />
        </Card>
      </div>
    </div>
  );
}
