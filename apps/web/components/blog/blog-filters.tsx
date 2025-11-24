"use client";

import { Input } from "@repo/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface BlogFiltersProps {
  initialStatus?: "draft" | "published";
  initialQuery?: string;
}

export function BlogFilters({ initialStatus, initialQuery }: BlogFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(initialQuery || "");
  const [status, setStatus] = useState<string>(initialStatus || "all");

  useEffect(() => {
    const urlStatus = searchParams.get("status");
    const urlQuery = searchParams.get("q");
    setStatus(urlStatus || "all");
    setSearchQuery(urlQuery || "");
  }, [searchParams]);

  const updateFilters = (newStatus: string, newQuery: string) => {
    const params = new URLSearchParams();

    const limit = searchParams.get("limit");
    if (limit) params.set("limit", limit);

    if (newQuery.trim()) {
      params.set("q", newQuery.trim());
    }
    if (newStatus !== "all") {
      params.set("status", newStatus);
    }

    params.set("page", "1");

    router.push(`?${params.toString()}`);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    updateFilters(value, searchQuery);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters(status, searchQuery);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      updateFilters(status, searchQuery);
    }
  };

  return (
    <>
      <form onSubmit={handleSearchSubmit} className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="pl-9"
          />
        </div>
      </form>
      <Select value={status} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Posts</SelectItem>
          <SelectItem value="draft">Draft</SelectItem>
          <SelectItem value="published">Published</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
}
