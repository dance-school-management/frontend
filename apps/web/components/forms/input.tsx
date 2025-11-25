import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/form";
import { Input } from "@repo/ui/input";
import { useEffect, useState } from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

const moneyFormatter = (currency: string) => new Intl.NumberFormat("en-US", {
  currency: currency,
  currencyDisplay: "symbol",
  currencySign: "standard",
  style: "currency",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatValue(value: number, currency: string): string {
  return moneyFormatter(currency).format(value);
}

function parseInput(input: string): number {
  const digits = input.replace(/\D/g, "");
  return Number(digits) / 100;
}

type TextInputProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  className?: string;
  currency?: string;
};

export function MoneyInput<T extends FieldValues>({ form, name, label, className, currency = "PLN" }: TextInputProps<T>) {
  const initialNumber = form.getValues()[name] || 0;
  const [formattedValue, setFormattedValue] = useState(formatValue(initialNumber, currency));

  useEffect(() => {
    const newValue = form.getValues()[name] || 0;
    setFormattedValue(formatValue(newValue, currency));
  }, [form, name, currency]);

  const handleChange = (realChangeFn: (value: number) => void, input: string) => {
    setFormattedValue(formatValue(parseInput(input), currency));
    realChangeFn(parseInput(input));
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Input
                className={className}
                type="text"
                {...field}
                value={formattedValue}
                onChange={(e) => {
                  handleChange(field.onChange, e.target.value);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
