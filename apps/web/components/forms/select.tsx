import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui/form";
import { MultiSelect } from "@repo/ui/multi-select";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/select";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

import { useAdditionalProductData, useDanceCategories, useInstructors } from "@/lib/api/tanstack";

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

export function AdvancementLevelSelect<T extends FieldValues>({ form, name, label = "Advancement Level", placeholder = "Select advancement level" }: AdvancementLevelSelectProps<T>) {
  const { data } = useAdditionalProductData();

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
              {data?.advancementLevels.map((level) => (
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

export function DanceCategorySelect<T extends FieldValues>({ form, name, label = "Dance Category", placeholder = "Select dance category" }: DanceCategorySelectProps<T>) {
  const { data } = useAdditionalProductData();

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
              {data?.danceCategories.map((category) => (
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
};
interface ClassRoomSelectProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
}

export function ClassRoomSelect<T extends FieldValues>({ form, name, label = "Classroom", placeholder = "Select classroom" }: ClassRoomSelectProps<T>) {
  const { data } = useAdditionalProductData();

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
              {data?.classRooms.map((room) => (
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

export function InstructorsSelect<T extends FieldValues>({ form, name, label = "Instructors", placeholder = "Select instructors" }: InstructorSelectProps<T>) {
  const { data } = useInstructors();

  const options = data?.instructors.map((instructor) => ({
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

export function DanceCategoriesMultiSelect<T extends FieldValues>({ form, name, label = "Favourite Dance Categories", placeholder = "Select dance categories" }: DanceCategoriesMultiSelectProps<T>) {
  const { data } = useDanceCategories();

  const options = data?.map((category) => ({
    label: category.name,
    value: String(category.id),
  })) || [];

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const value = Array.isArray(field.value) 
          ? field.value.map((v: number) => String(v))
          : [];

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