"use client";

import { Button } from "@repo/ui/components/button";
import { Card, CardContent, CardHeader } from "@repo/ui/components/card";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { deletePrivateClassTemplate } from "@/lib/api/product";
import { ClassTemplate } from "@/lib/model/product";

type PrivateClassTemplateActionsProps = {
  classTemplate: ClassTemplate;
};

export function PrivateClassTemplateActions({ classTemplate }: PrivateClassTemplateActionsProps) {
  const router = useRouter();

  const handleDelete = async () => {
    const { error } = await deletePrivateClassTemplate(classTemplate.id);
    if (error) {
      toast.error(error.message ?? "Failed to delete class template");
      return;
    } else {
      toast.success("Private class template deleted successfully");
      router.replace("/instructor/classes");
    }
  };

  return (
    <Card className="gap-2">
      <CardHeader>
        <h3 className="text-lg font-semibold">Actions</h3>
        <p className="text-sm text-muted-foreground">You can perform additional actions here.</p>
      </CardHeader>
      <CardContent>
        <div className="space-x-2">
          <Button variant="destructive" className="w-fit cursor-pointer" onClick={handleDelete}>
            <TrashIcon />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
