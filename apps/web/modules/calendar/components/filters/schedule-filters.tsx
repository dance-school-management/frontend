"use client";

import { Button } from "@repo/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/select";
import { Slider } from "@repo/ui/slider";
import { FilterX } from "lucide-react";
import { useEffect, useState } from "react";

import { useAdvancementLevels, useDanceCategories, useInstructors } from "@/lib/api/tanstack";
import { useCalendar } from "@/modules/calendar/contexts/calendar-context";
import { IScheduleFilters } from "@/modules/calendar/types";

export function ScheduleFilters() {
  const { filters, setFilters, priceRange: priceRangeContext } = useCalendar();
  const { min: priceMin, max: priceMax } = priceRangeContext;
  const { data: danceCategories, isLoading: isLoadingCategories } = useDanceCategories();
  const { data: instructorsData, isLoading: isLoadingInstructors } = useInstructors();
  const { data: advancementLevels, isLoading: isLoadingAdvancementLevels } = useAdvancementLevels();

  const [priceRangeValues, setPriceRangeValues] = useState<number[]>([priceMin, priceMax]);

  useEffect(() => {
    setPriceRangeValues([filters.priceMin ?? priceMin, filters.priceMax ?? priceMax]);
  }, [filters.priceMin, filters.priceMax, priceMin, priceMax]);

  const handleFilterChange = (key: keyof IScheduleFilters, value: unknown) => {
    setFilters({
      ...filters,
      [key]: value === "all" ? undefined : value,
    });
  };

  const handlePriceRangeChange = (values: number[]) => {
    setPriceRangeValues(values);
  };

  const handlePriceRangeCommit = (values: number[]) => {
    setFilters({
      ...filters,
      priceMin: values[0],
      priceMax: values[1],
    });
  };

  const handleClearFilters = () => {
    setFilters({});
    setPriceRangeValues([priceMin, priceMax]);
  };

  const hasActiveFilters =
    filters.danceCategory ||
    filters.advancementLevel ||
    filters.instructorId ||
    filters.priceMin !== undefined ||
    filters.priceMax !== undefined;

  const instructors = instructorsData?.instructors ?? [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium">Filter</span>
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={handleClearFilters}>
            <FilterX className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {/* Dance Category Filter */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-muted-foreground">Dance Category</label>
          <Select
            value={filters.danceCategory ?? "all"}
            onValueChange={(value) => handleFilterChange("danceCategory", value)}
            disabled={isLoadingCategories}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {danceCategories?.map((category) => (
                <SelectItem key={category.id} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Advancement Level Filter */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-muted-foreground">Advancement Level</label>
          <Select
            value={filters.advancementLevel ?? "all"}
            onValueChange={(value) => handleFilterChange("advancementLevel", value)}
            disabled={isLoadingAdvancementLevels}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              {advancementLevels?.map((level) => (
                <SelectItem key={level.id} value={level.name}>
                  {level.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Instructor Filter */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-muted-foreground">Instructor</label>
          <Select
            value={filters.instructorId ?? "all"}
            onValueChange={(value) => handleFilterChange("instructorId", value)}
            disabled={isLoadingInstructors}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Instructors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Instructors</SelectItem>
              {instructors.map((instructor) => (
                <SelectItem key={instructor.id} value={instructor.id}>
                  {instructor.name} {instructor.surname}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range Filter */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-muted-foreground">Price Range</label>
          <div className="flex flex-col gap-2 pt-2">
            <Slider
              min={priceMin}
              max={priceMax}
              step={1}
              value={priceRangeValues}
              onValueChange={handlePriceRangeChange}
              onValueCommit={handlePriceRangeCommit}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{priceRangeValues[0]}</span>
              <span>{priceRangeValues[1]}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
