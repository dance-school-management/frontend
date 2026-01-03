"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@repo/ui/drawer";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui/form";
import { Input } from "@repo/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/select";
import { IconPlus } from "@tabler/icons-react";
import { ControllerRenderProps, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { authClient } from "@/lib/model";
import { EmployeeRole } from "@/lib/model/employee";

const formSchema = z.object({
  name: z.string().min(2),
  surname: z.string().min(2),
  email: z.string().email(),
  role: z.enum(["ADMIN", "COORDINATOR", "INSTRUCTOR"]),
});

type FormValues = z.infer<typeof formSchema>;

function getRole(role: EmployeeRole) {
  switch (role) {
    case EmployeeRole.ADMIN:
      return "admin";
    case EmployeeRole.COORDINATOR:
      return "COORDINATOR";
    case EmployeeRole.INSTRUCTOR:
      return "INSTRUCTOR";
  }
}

export function NewEmployeeDrawer() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      role: EmployeeRole.INSTRUCTOR,
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      const { error, data } = await authClient.admin.createUser({
        email: values.email,
        name: `${values.name} ${values.surname}`,
        first_name: values.name,
        surname: values.surname,
        // @ts-expect-error - handled by the backend
        role: getRole(values.role),
        password: crypto.randomUUID(),
        shouldSendEmail: true,
      });
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("Employee created successfully");
      console.log(data);
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button variant="outline" className="text-foreground w-fit text-left">
          <IconPlus /> New Employee
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>Add new employee</DrawerTitle>
          <DrawerDescription>Fill out the form below to add a new employee.</DrawerDescription>
        </DrawerHeader>
        <Form {...form}>
          <div className="flex flex-col overflow-y-auto px-4 text-sm">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="name" render={({ field }) => <NameField field={field} />} />
              <FormField control={form.control} name="surname" render={({ field }) => <SurnameField field={field} />} />
              <FormField control={form.control} name="email" render={({ field }) => <EmailField field={field} />} />
              <FormField control={form.control} name="role" render={({ field }) => <RoleChooser field={field} />} />
            </form>
          </div>
          <DrawerFooter>
            <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
              Submit
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Done</Button>
            </DrawerClose>
          </DrawerFooter>
        </Form>
      </DrawerContent>
    </Drawer>
  );
}

const roleOptions = Object.values(EmployeeRole);

const RoleChooser = ({ field }: { field: Partial<ControllerRenderProps<{ role: string }, "role">> }) => (
  <FormItem className="flex flex-col gap-3">
    <FormLabel>Role*</FormLabel>
    <Select onValueChange={field.onChange} defaultValue={field.value}>
      <FormControl>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select employee role" />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {roleOptions.map((role) => (
          <SelectItem key={role} value={role}>
            {role.toUpperCase()}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    <FormMessage />
  </FormItem>
);

const EmailField = ({ field }: { field: Partial<ControllerRenderProps<{ email: string }, "email">> }) => (
  <FormItem>
    <FormLabel>Email*</FormLabel>
    <FormControl>
      <Input placeholder="xxxx@xxx.xxx" className="resize-none" {...field} />
    </FormControl>
    <FormMessage />
  </FormItem>
);

const NameField = ({ field }: { field: Partial<ControllerRenderProps<{ name: string }, "name">> }) => (
  <FormItem>
    <FormLabel>Name*</FormLabel>
    <FormControl>
      <Input placeholder="e.g. Anna" type="text" {...field} />
    </FormControl>
    <FormMessage />
  </FormItem>
);

const SurnameField = ({ field }: { field: Partial<ControllerRenderProps<{ surname: string }, "surname">> }) => (
  <FormItem>
    <FormLabel>Surname*</FormLabel>
    <FormControl>
      <Input placeholder="e.g. Smith" type="text" {...field} />
    </FormControl>
    <FormMessage />
  </FormItem>
);
