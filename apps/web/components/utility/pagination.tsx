import {
  Pagination as UIPagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@repo/ui/pagination";
import { Button, buttonVariants } from "@repo/ui/button";
import { cn } from "@repo/ui/lib/utils";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  getPageUrl: (pageNum: number) => string;
  showResultsCounter?: boolean;
  currentLimit?: number;
  total?: number;
}

export function PaginationControls({
  currentPage,
  totalPages,
  getPageUrl,
  showResultsCounter = false,
  currentLimit,
  total,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const renderPaginationItems = () => {
    const items: React.ReactNode[] = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    if (startPage > 1) {
      items.push(
        <PaginationItem key="1">
          <PaginationLink href={getPageUrl(1)}>1</PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink href={getPageUrl(i)} isActive={i === currentPage}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink href={getPageUrl(totalPages)}>{totalPages}</PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div className="mt-8">
      <UIPagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={currentPage > 1 ? getPageUrl(currentPage - 1) : getPageUrl(currentPage)}
              aria-disabled={currentPage === 1}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          {renderPaginationItems()}
          <PaginationItem>
            <PaginationNext
              href={currentPage < totalPages ? getPageUrl(currentPage + 1) : getPageUrl(currentPage)}
              aria-disabled={currentPage === totalPages}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </UIPagination>
      {showResultsCounter && currentLimit && total && (
        <div className="text-center text-sm text-muted-foreground mt-4">
          Showing {((currentPage - 1) * currentLimit) + 1} to{" "}
          {Math.min(currentPage * currentLimit, total)} of {total} results
        </div>
      )}
    </div>
  );
}


type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<typeof Link>;

export function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  return (
    <Link
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
        }),
        className
      )}
      {...props}
    />
  );
}

type PaginationPreviousProps = {
  className?: string;
} & React.ComponentProps<typeof Link>;

function PaginationPrevious({
  className,
  ...props
}: PaginationPreviousProps) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pl-2.5", className)}
      {...props}
    >
      <ChevronLeftIcon />
      <span className="hidden sm:block">Previous</span>
    </PaginationLink>
  );
}

type PaginationNextProps = {
  className?: string;
} & React.ComponentProps<typeof Link>;

function PaginationNext({
  className,
  ...props
}: PaginationNextProps) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pr-2.5", className)}
      {...props}
    >
      <span className="hidden sm:block">Next</span>
      <ChevronRightIcon />
    </PaginationLink>
  );
}