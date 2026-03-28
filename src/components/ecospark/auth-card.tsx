"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Globe, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { appConfig } from "@/lib/app-config";
import {
  authService,
  type LoginInput,
  type RegisterInput,
} from "@/services/auth.service";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    email: z.email("Enter a valid email."),
    password: z.string().min(6, "Password must be at least 6 characters."),
    confirmPassword: z.string(),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

const loginSchema = z.object({
  email: z.email("Enter a valid email."),
  password: z.string().min(1, "Password is required."),
});

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return <p className="text-sm text-destructive">{message}</p>;
}

export function AuthCard({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const requestedNextPath = searchParams.get("next");
  const nextPath =
    requestedNextPath && requestedNextPath.startsWith("/") && !requestedNextPath.startsWith("//")
      ? requestedNextPath
      : "/dashboard";
  const googleCallbackUrl = new URL(nextPath, appConfig.appUrl).toString();
  const [loginErrors, setLoginErrors] = useState<Partial<Record<keyof LoginValues, string>>>({});
  const [registerErrors, setRegisterErrors] = useState<
    Partial<Record<keyof RegisterValues, string>>
  >({});
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const mutation = useMutation({
    mutationFn: (payload: RegisterInput | LoginInput) =>
      mode === "register"
        ? authService.register(payload as RegisterInput)
        : authService.login(payload as LoginInput),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["current-user"] });
      toast.success(mode === "register" ? "Account created." : "Logged in successfully.");
      router.push(nextPath);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const loginForm = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      const parsed = loginSchema.safeParse(value);

      if (!parsed.success) {
        setLoginErrors(
          Object.fromEntries(
            Object.entries(parsed.error.flatten().fieldErrors).map(([key, messages]) => [
              key,
              messages?.[0],
            ]),
          ) as Partial<Record<keyof LoginValues, string>>,
        );
        toast.error(parsed.error.issues[0]?.message || "Invalid form values.");
        return;
      }

      setLoginErrors({});
      mutation.mutate(parsed.data);
    },
  });

  const registerForm = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      const parsed = registerSchema.safeParse(value);

      if (!parsed.success) {
        setRegisterErrors(
          Object.fromEntries(
            Object.entries(parsed.error.flatten().fieldErrors).map(([key, messages]) => [
              key,
              messages?.[0],
            ]),
          ) as Partial<Record<keyof RegisterValues, string>>,
        );
        toast.error(parsed.error.issues[0]?.message || "Invalid form values.");
        return;
      }

      setRegisterErrors({});
      const { confirmPassword, ...payload } = parsed.data;
      void confirmPassword;
      mutation.mutate(payload);
    },
  });

  const submitLabel = mode === "register" ? "Create account" : "Sign in";

  async function handleGoogleSignIn() {
    try {
      setIsGoogleLoading(true);
      const result = await authService.signInWithGoogle(googleCallbackUrl);
      window.location.assign(result.url);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Google sign-in could not be started.";
      toast.error(message);
      setIsGoogleLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md border-border/70 bg-card/95 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
      <CardHeader className="space-y-3 p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary">
          {mode === "register" ? "Register" : "Login"}
        </p>
        <CardTitle className="text-3xl tracking-tight">
          {mode === "register" ? "Create your account" : "Welcome back"}
        </CardTitle>
        <CardDescription className="text-sm leading-6">
          {mode === "register"
            ? "Use email and password or continue with Google."
            : "Sign in with your account credentials or continue with Google."}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 px-8 pb-8 pt-0">
        <Button
          type="button"
          variant="outline"
          onClick={() => void handleGoogleSignIn()}
          disabled={isGoogleLoading}
          className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-2xl border border-border bg-background text-sm font-medium transition hover:bg-muted"
        >
          {isGoogleLoading ? <LoaderCircle className="size-4 animate-spin" /> : <Globe className="size-4" />}
          {isGoogleLoading ? "Redirecting to Google..." : "Continue with Google"}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/70" />
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-[0.28em] text-muted-foreground">
            <span className="bg-card px-3">or</span>
          </div>
        </div>

        {mode === "register" ? (
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              event.stopPropagation();
              void registerForm.handleSubmit();
            }}
          >
            <registerForm.Field name="name">
              {(field) => (
                <label className="block space-y-2">
                  <span className="text-sm font-medium">Full name</span>
                  <Input
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder="Ariana Rahman"
                  />
                  <FieldError message={registerErrors.name} />
                </label>
              )}
            </registerForm.Field>

            <registerForm.Field name="email">
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
                  <FieldError message={registerErrors.email} />
                </label>
              )}
            </registerForm.Field>

            <registerForm.Field name="password">
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
                  <FieldError message={registerErrors.password} />
                </label>
              )}
            </registerForm.Field>

            <registerForm.Field name="confirmPassword">
              {(field) => (
                <label className="block space-y-2">
                  <span className="text-sm font-medium">Confirm password</span>
                  <Input
                    type="password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder="Repeat your password"
                  />
                  <FieldError message={registerErrors.confirmPassword} />
                </label>
              )}
            </registerForm.Field>

            <Button className="w-full" size="lg" type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? <LoaderCircle className="size-4 animate-spin" /> : null}
              {mutation.isPending ? "Creating account..." : submitLabel}
            </Button>
          </form>
        ) : (
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              event.stopPropagation();
              void loginForm.handleSubmit();
            }}
          >
            <loginForm.Field name="email">
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
                  <FieldError message={loginErrors.email} />
                </label>
              )}
            </loginForm.Field>

            <loginForm.Field name="password">
              {(field) => (
                <label className="block space-y-2">
                  <span className="text-sm font-medium">Password</span>
                  <Input
                    type="password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder="Your password"
                  />
                  <FieldError message={loginErrors.password} />
                </label>
              )}
            </loginForm.Field>

            <div className="flex items-center justify-end text-sm">
              <Link href="/forgot-password" className="font-medium text-primary">
                Forgot password?
              </Link>
            </div>

            <Button className="w-full" size="lg" type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? <LoaderCircle className="size-4 animate-spin" /> : null}
              {mutation.isPending ? "Signing in..." : submitLabel}
            </Button>
          </form>
        )}

        <div className="border-t border-border/70 pt-5 text-sm text-muted-foreground">
          {mode === "register" ? "Already have an account?" : "Need an account?"}{" "}
          <Link
            href={mode === "register" ? "/login" : "/register"}
            className="font-semibold text-primary"
          >
            {mode === "register" ? "Sign in" : "Register"}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
