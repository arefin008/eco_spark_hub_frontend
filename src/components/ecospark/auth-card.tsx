"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  authService,
  type LoginInput,
  type RegisterInput,
} from "@/services/auth.service";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.email("Enter a valid email."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

const loginSchema = registerSchema.omit({ name: true });

export function AuthCard({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (payload: RegisterInput | LoginInput) => {
      if (mode === "register") {
        return authService.register(payload as RegisterInput);
      }

      return authService.login(payload as LoginInput);
    },
    onSuccess: async () => {
      toast.success(mode === "register" ? "Account created." : "Logged in successfully.");
      await queryClient.invalidateQueries({ queryKey: ["current-user"] });
      router.push("/dashboard");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const form = useForm({
    defaultValues:
      mode === "register"
        ? { name: "", email: "", password: "" }
        : { email: "", password: "" },
    onSubmit: async ({ value }) => {
      const parsed =
        mode === "register"
          ? registerSchema.safeParse(value)
          : loginSchema.safeParse(value);

      if (!parsed.success) {
        toast.error(parsed.error.issues[0]?.message || "Invalid form values.");
        return;
      }

      mutation.mutate(parsed.data);
    },
  });

  return (
    <Card className="w-full max-w-lg rounded-[32px] bg-card/95 shadow-xl shadow-emerald-950/8">
      <CardHeader className="space-y-3 p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary">
          {mode === "register" ? "Create account" : "Welcome back"}
        </p>
        <CardTitle className="text-4xl tracking-tight">
          {mode === "register" ? "Join EcoSpark Hub" : "Sign in to continue"}
        </CardTitle>
        <CardDescription className="text-sm leading-6">
          {mode === "register"
            ? "Publish ideas, collect votes, and submit your sustainability projects for review."
            : "Access your dashboard, idea drafts, purchases, and moderation tools."}
        </CardDescription>
      </CardHeader>

      <CardContent className="px-8 pb-8 pt-0">
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void form.handleSubmit();
        }}
      >
        {mode === "register" ? (
          <form.Field name="name">
            {(field) => (
              <label className="block space-y-2">
                <span className="text-sm font-medium">Full name</span>
                <Input
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  placeholder="Nadia Rahman"
                />
              </label>
            )}
          </form.Field>
        ) : null}

        <form.Field name="email">
          {(field) => (
            <label className="block space-y-2">
              <span className="text-sm font-medium">Email</span>
              <Input
                type="email"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                placeholder="member@ecospark.dev"
              />
            </label>
          )}
        </form.Field>

        <form.Field name="password">
          {(field) => (
            <label className="block space-y-2">
              <span className="text-sm font-medium">Password</span>
              <Input
                type="password"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                placeholder="At least 6 characters"
              />
            </label>
          )}
        </form.Field>

        <Button className="w-full" size="lg" type="submit" disabled={mutation.isPending}>
          {mutation.isPending
            ? mode === "register"
              ? "Creating account..."
              : "Signing in..."
            : mode === "register"
              ? "Create account"
              : "Sign in"}
        </Button>
      </form>

      <p className="mt-6 text-sm text-muted-foreground">
        {mode === "register" ? "Already have an account?" : "Need an account?"}{" "}
        <Link
          href={mode === "register" ? "/login" : "/register"}
          className="font-semibold text-primary"
        >
          {mode === "register" ? "Sign in" : "Register"}
        </Link>
      </p>
      </CardContent>
    </Card>
  );
}
