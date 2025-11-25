"use client";

import { Input } from "@repo/ui/input";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface NewsSearchProps {
  initialQuery?: string;
}

export function NewsSearch({ initialQuery }: NewsSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(initialQuery || "");

  useEffect(() => {
    const urlQuery = searchParams.get("q");
    setSearchQuery(urlQuery || "");
  }, [searchParams]);

  const updateSearch = (query: string) => {
    const params = new URLSearchParams();

    const limit = searchParams.get("limit");
    if (limit) params.set("limit", limit);

    if (query.trim()) {
      params.set("q", query.trim());
    }

    params.set("page", "1");

    router.push(`?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSearch(searchQuery);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      updateSearch(searchQuery);
    }
  };

  return (
    <form onSubmit={handleSearchSubmit} className="w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search news..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          className="pl-9"
        />
      </div>
    </form>
  );
}

