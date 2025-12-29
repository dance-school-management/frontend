"use client";

import { Button } from "@repo/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@repo/ui/dropdown-menu";
import { EyeIcon, MoreVerticalIcon } from "lucide-react";

import { DestructiveActionDialog } from "@/components/cms/destructive-action-dialog";
import { ClassStatus } from "@/lib/model/product";

interface ClassActionsProps {
  status: ClassStatus;
  canPublish: boolean;
  isConfirmationOpen: boolean;
  setIsConfirmationOpen: (open: boolean) => void;
  onPublishClick: () => void;
  onCancelClick: () => void;
  onPostponeClick: () => void;
}

export function ClassActions({
  status,
  canPublish,
  isConfirmationOpen,
  setIsConfirmationOpen,
  onPublishClick,
  onCancelClick,
  onPostponeClick,
}: ClassActionsProps) {
  if (!canPublish) {
    return null;
  }

  return (
    <>
      {status === "HIDDEN" && (
        <>
          <Button variant="outline" className="w-fit cursor-pointer" onClick={() => setIsConfirmationOpen(true)}>
            <EyeIcon />
            Publish
          </Button>
          <DestructiveActionDialog
            open={isConfirmationOpen}
            onOpenChange={setIsConfirmationOpen}
            onConfirm={onPublishClick}
            title="Publish Class?"
            description="Are you sure you want to publish this class? It will be visible to students and they can enroll."
          />
        </>
      )}
      {status === "NORMAL" && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="size-8 cursor-pointer">
              <MoreVerticalIcon className="size-4" />
              <span className="sr-only">More actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem variant="destructive" onClick={onCancelClick}>
              Cancel
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onPostponeClick}>Postpone</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
}
