import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui/form";
import { Input } from "@repo/ui/input";
import { MultiSelect } from "@repo/ui/multi-select";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/select";
import { X } from "lucide-react";
import { useState } from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

import {
  useAdvancementLevels,
  useClassRooms,
  useDanceCategories,
  useInstructors,
  useUsersSearch,
} from "@/lib/api/tanstack";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { useIdCache } from "@/lib/hooks/use-id-cache";
import { ProfileData } from "@/lib/model/profile";

interface CurrencySelectProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label?: string;
}

export function CurrencySelect<T extends FieldValues>({ form, name, label = "Currency" }: CurrencySelectProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
              <SelectItem value="PLN">PLN</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

interface AdvancementLevelSelectProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
}

export function AdvancementLevelSelect<T extends FieldValues>({
  form,
  name,
  label = "Advancement Level",
  placeholder = "Select advancement level",
}: AdvancementLevelSelectProps<T>) {
  const { data } = useAdvancementLevels();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={String(field.value)}>
            <FormControl>
              <SelectTrigger className="w-full" disabled={!data}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {data?.map((level) => (
                <SelectItem key={level.id} value={String(level.id)}>
                  {level.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

interface DanceCategorySelectProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
}

export function DanceCategorySelect<T extends FieldValues>({
  form,
  name,
  label = "Dance Category",
  placeholder = "Select dance category",
}: DanceCategorySelectProps<T>) {
  const { data } = useDanceCategories();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={String(field.value)}>
            <FormControl>
              <SelectTrigger className="w-full" disabled={!data}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {data?.map((category) => (
                <SelectItem key={category.id} value={String(category.id)}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
interface ClassRoomSelectProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
}

export function ClassRoomSelect<T extends FieldValues>({
  form,
  name,
  label = "Classroom",
  placeholder = "Select classroom",
}: ClassRoomSelectProps<T>) {
  const { data } = useClassRooms();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select onValueChange={(value) => field.onChange(Number(value))}>
            <FormControl>
              <SelectTrigger className="w-full" disabled={!data}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {data?.map((room) => (
                <SelectItem key={room.id} value={String(room.id)}>
                  {room.name} (Limit: {room.peopleLimit})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

interface InstructorSelectProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
}

export function InstructorsSelect<T extends FieldValues>({
  form,
  name,
  label = "Instructors",
  placeholder = "Select instructors",
}: InstructorSelectProps<T>) {
  const { data } = useInstructors();

  const options =
    data?.instructors.map((instructor) => ({
      label: instructor.name + " " + instructor.surname,
      value: instructor.id,
    })) || [];

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <MultiSelect
            onValueChange={field.onChange}
            value={field.value}
            options={options}
            placeholder={placeholder}
            disabled={!data}
          />
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

interface DanceCategoriesMultiSelectProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
}

export function DanceCategoriesMultiSelect<T extends FieldValues>({
  form,
  name,
  label = "Favourite Dance Categories",
  placeholder = "Select dance categories",
}: DanceCategoriesMultiSelectProps<T>) {
  const { data } = useDanceCategories();

  const options =
    data?.map((category) => ({
      label: category.name,
      value: String(category.id),
    })) || [];

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const value = Array.isArray(field.value) ? field.value.map((v: number) => String(v)) : [];

        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <MultiSelect
              onValueChange={(values) => {
                field.onChange(values.map((v) => Number(v)));
              }}
              value={value}
              options={options}
              placeholder={placeholder}
              disabled={!data}
            />
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

interface UserMultiSelectProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
}

export function UserMultiSelect<T extends FieldValues>({
  form,
  name,
  label = "Users",
  placeholder = "Search users...",
}: UserMultiSelectProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 400);
  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading } = useUsersSearch(debouncedQuery, isOpen);
  const usersCache = useIdCache(data);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const selectedUserIds: string[] = Array.isArray(field.value) ? field.value : [];
        const filteredUsers = data ? data.filter((user) => !selectedUserIds.includes(user.id)) : [];
        const selectedUsers = selectedUserIds
          .map((id) => usersCache.get(id))
          .filter((user): user is ProfileData => user !== undefined);

        const handleSelectUser = (userId: string) => {
          const newValue = [...selectedUserIds, userId];
          field.onChange(newValue);
        };

        const handleRemoveUser = (userId: string) => {
          const newValue = selectedUserIds.filter((id) => id !== userId);
          field.onChange(newValue);
        };

        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <div className="space-y-3">
              <Input
                type="text"
                placeholder={placeholder}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsOpen(true);
                }}
                className="w-full"
              />

              {searchQuery && filteredUsers.length > 0 && (
                <div className="rounded-md border bg-background">
                  <div className="max-h-60 overflow-y-auto p-1">
                    {filteredUsers.map((user) => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => handleSelectUser(user.id)}
                        className="flex w-full items-center gap-2 rounded-sm px-2 py-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                      >
                        <div className="flex flex-col items-start">
                          <span className="font-medium">
                            {user.name} {user.surname}
                          </span>
                          {user.email && <span className="text-xs text-muted-foreground">{user.email}</span>}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {searchQuery && !isLoading && filteredUsers.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-6">No users found.</p>
              )}

              {isLoading && searchQuery && (
                <p className="text-sm text-muted-foreground text-center py-6">Searching...</p>
              )}
            </div>

            {selectedUsers.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedUsers.map((user) => (
                  <Badge key={user.id} variant="secondary" className="gap-1 pl-2 pr-1">
                    <span className="text-sm">
                      {user.name} {user.surname}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => handleRemoveUser(user.id)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">
                        Remove {user.name} {user.surname}
                      </span>
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
