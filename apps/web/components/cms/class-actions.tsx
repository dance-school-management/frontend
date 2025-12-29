"use client";

import { AlertDialog, AlertDialogTrigger } from "@repo/ui/alert-dialog";
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
        <AlertDialog open={isConfirmationOpen} onOpenChange={setIsConfirmationOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="w-fit cursor-pointer">
              <EyeIcon />
              Publish
            </Button>
          </AlertDialogTrigger>
          <DestructiveActionDialog
            open={isConfirmationOpen}
            onOpenChange={setIsConfirmationOpen}
            onConfirm={onPublishClick}
            title="Publish Class?"
            description="Are you sure you want to publish this class? It will be visible to students and they can enroll."
          />
        </AlertDialog>
      )}
      {status === "NORMAL" && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="size-8 cursor-pointer">
              <MoreVerticalIcon />
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
