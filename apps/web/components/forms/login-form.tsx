"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { redirect, RedirectType } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { authClient } from "@/lib/auth/auth-client";
import { useUserStore } from "@/lib/store";
import { Button } from "@repo/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/form";
import { Input } from "@repo/ui/input";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type FormValues = z.infer<typeof formSchema>;

export function LoginForm() {
  const { setUser } = useUserStore();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  });

  const onSubmit = async (values: FormValues) => {
    await authClient.signIn.email({
      email: values.email,
      password: values.password,
      fetchOptions: {
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
      },
    });

    const { data } = await authClient.getSession({
      fetchOptions: {
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
      },
    });

    if (data) {
      toast.success("Logged in successfully");
      setUser(data.user);

      switch (data.user.role) {
        case "COORDINATOR":
          redirect("/coordinator/classes", RedirectType.replace);
          break;
        case "ADMINISTRATOR":
          redirect("/admin/dashboard", RedirectType.replace);
          break;
        case "INSTRUCTOR":
          redirect("/trainer/classes", RedirectType.replace);
          break;
        default:
          redirect("/user/tickets", RedirectType.replace);
          break;
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Log In</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="m@ecample.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="password" render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="password">
                      Password
                      <Link href="/forgot-password" className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                        Forgot your password?
                      </Link>
                    </FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type="submit" className="w-full">
                  Log In
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="underline underline-offset-4">
                  Sign up
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div >
  );
}
