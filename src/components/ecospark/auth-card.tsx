"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, CheckCircle2, Eye, EyeOff, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { appConfig } from "@/lib/app-config";
import { cn } from "@/lib/utils";
import {
  authService,
  type LoginInput,
  type RegisterInput,
} from "@/services/auth.service";

const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters."),
    email: z.email("Enter a valid email.").trim(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .regex(/[A-Za-z]/, "Password must include at least one letter.")
      .regex(/\d/, "Password must include at least one number."),
    confirmPassword: z.string().min(1, "Confirm your password."),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

const loginSchema = z.object({
  email: z.email("Enter a valid email.").trim(),
  password: z.string().min(1, "Password is required."),
});

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;
type AuthMode = "login" | "register";
type SocialProvider = "google";

const demoCredentials = {
  email: appConfig.demoUserEmail,
  password: appConfig.demoUserPassword,
};

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4">
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.2 1.3-1.7 3.9-5.5 3.9-3.3 0-6-2.8-6-6.2s2.7-6.2 6-6.2c1.9 0 3.2.8 3.9 1.5l2.7-2.6C17 2.9 14.7 2 12 2 6.9 2 2.8 6.4 2.8 11.8S6.9 21.6 12 21.6c6.1 0 9.1-4.4 9.1-6.7 0-.5-.1-.8-.1-1.1z"
      />
      <path
        fill="#34A853"
        d="M3.8 7.3 7 9.6C7.9 7.8 9.8 6.5 12 6.5c1.9 0 3.2.8 3.9 1.5l2.7-2.6C17 2.9 14.7 2 12 2 8.3 2 5.1 4.2 3.8 7.3z"
      />
      <path
        fill="#FBBC05"
        d="M12 21.6c2.6 0 4.8-.9 6.4-2.5l-3-2.5c-.8.6-1.9 1.1-3.4 1.1-3.8 0-5.2-2.6-5.5-3.8L3.3 16c1.3 3.4 4.6 5.6 8.7 5.6z"
      />
      <path
        fill="#4285F4"
        d="M21.1 14.9c.1-.3.1-.6.1-1.1 0-.4 0-.8-.1-1.1H12v3.9z"
      />
    </svg>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <p className="flex items-center gap-2 text-sm text-destructive">
      <AlertCircle className="size-4" />
      <span>{message}</span>
    </p>
  );
}

function FormNotice({
  message,
  tone = "error",
}: {
  message?: string;
  tone?: "error" | "success";
}) {
  if (!message) return null;

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm",
        tone === "error"
          ? "border-destructive/25 bg-destructive/10 text-destructive dark:border-destructive/35 dark:bg-destructive/16"
          : "border-emerald-600/20 bg-emerald-50 text-emerald-900 dark:border-emerald-500/25 dark:bg-emerald-500/12 dark:text-emerald-200",
      )}
    >
      {tone === "error" ? (
        <AlertCircle className="mt-0.5 size-4 shrink-0" />
      ) : (
        <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
      )}
      <span>{message}</span>
    </div>
  );
}

function PasswordField({
  id,
  label,
  value,
  onBlur,
  onChange,
  placeholder,
  error,
  visible,
  onToggleVisibility,
}: {
  id: string;
  label: string;
  value: string;
  onBlur: () => void;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
  visible: boolean;
  onToggleVisibility: () => void;
}) {
  return (
    <label htmlFor={id} className="block space-y-2">
      <span className="text-sm font-medium">{label}</span>
      <div className="relative">
        <Input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onBlur={onBlur}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={cn("pr-11", error && "border-destructive/50 focus-visible:ring-destructive/30")}
          aria-invalid={Boolean(error)}
        />
        <button
          type="button"
          onClick={onToggleVisibility}
          className="absolute inset-y-0 right-0 inline-flex w-11 items-center justify-center text-muted-foreground transition hover:text-foreground"
          aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
      <FieldError message={error} />
    </label>
  );
}

function SocialButton({
  isLoading,
  onClick,
}: {
  isLoading: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      disabled={isLoading}
      className="h-12 rounded-2xl border border-border/90 bg-background text-sm font-medium text-foreground transition hover:bg-muted"
    >
      {isLoading ? <LoaderCircle className="size-4 animate-spin" /> : <GoogleIcon />}
      <span>{isLoading ? "Opening Google..." : "Google"}</span>
    </Button>
  );
}

function getFieldErrors<T extends Record<string, unknown>>(result: z.ZodSafeParseError<T>) {
  return Object.fromEntries(
    Object.entries(result.error.flatten().fieldErrors).map(([key, messages]) => [key, messages?.[0]]),
  ) as Partial<Record<keyof T, string>>;
}

export function AuthCard({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const requestedNextPath = searchParams.get("next");
  const nextPath =
    requestedNextPath && requestedNextPath.startsWith("/") && !requestedNextPath.startsWith("//")
      ? requestedNextPath
      : "/dashboard";
  const [loginErrors, setLoginErrors] = useState<Partial<Record<keyof LoginValues, string>>>({});
  const [registerErrors, setRegisterErrors] = useState<
    Partial<Record<keyof RegisterValues, string>>
  >({});
  const [formError, setFormError] = useState<string>();
  const [formSuccess, setFormSuccess] = useState<string>();
  const [socialLoading, setSocialLoading] = useState<SocialProvider | null>(null);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const mutation = useMutation({
    mutationFn: (payload: RegisterInput | LoginInput) =>
      mode === "register"
        ? authService.register(payload as RegisterInput)
        : authService.login(payload as LoginInput),
    onSuccess: async () => {
      setFormError(undefined);
      setFormSuccess(mode === "register" ? "Account created. Redirecting..." : "Signed in. Redirecting...");
      await queryClient.invalidateQueries({ queryKey: ["current-user"] });
      toast.success(mode === "register" ? "Account created." : "Logged in successfully.");
      router.push(nextPath);
    },
    onError: (error) => {
      setFormSuccess(undefined);
      setFormError(error.message);
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
        setFormSuccess(undefined);
        setLoginErrors(getFieldErrors(parsed));
        setFormError(parsed.error.issues[0]?.message || "Invalid form values.");
        toast.error(parsed.error.issues[0]?.message || "Invalid form values.");
        return;
      }

      setLoginErrors({});
      setFormError(undefined);
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
        setFormSuccess(undefined);
        setRegisterErrors(getFieldErrors(parsed));
        setFormError(parsed.error.issues[0]?.message || "Invalid form values.");
        toast.error(parsed.error.issues[0]?.message || "Invalid form values.");
        return;
      }

      setRegisterErrors({});
      setFormError(undefined);
      const { confirmPassword, ...payload } = parsed.data;
      void confirmPassword;
      mutation.mutate(payload);
    },
  });

  function clearFeedback() {
    setFormError(undefined);
    setFormSuccess(undefined);
  }

  function handleDemoLogin() {
    clearFeedback();
    setLoginErrors({});
    loginForm.setFieldValue("email", demoCredentials.email);
    loginForm.setFieldValue("password", demoCredentials.password);
    toast.success("Demo credentials filled in.");
  }

  async function handleSocialSignIn(provider: SocialProvider) {
    try {
      setSocialLoading(provider);
      clearFeedback();
      const callbackUrl = new URL(nextPath, window.location.origin).toString();
      const result = await authService.signInWithGoogle(callbackUrl);
      window.location.assign(result.url);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : `${provider} sign-in could not be started.`;
      setFormError(message);
      toast.error(message);
      setSocialLoading(null);
    }
  }

  const isLoginMode = mode === "login";
  const submitLabel = isLoginMode ? "Sign in" : "Create account";

  return (
    <Card className="w-full max-w-xl overflow-hidden border-border/80 bg-card shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
      <CardHeader className="space-y-4 border-b border-border/60 bg-[linear-gradient(135deg,rgba(19,78,74,0.08),rgba(245,158,11,0.08))] p-6 sm:p-8">
        <div className="inline-flex w-fit rounded-full border border-primary/20 bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-foreground shadow-sm dark:bg-background/80 dark:text-foreground">
          <span>{isLoginMode ? "Login" : "Create Account"}</span>
        </div>
        <div className="space-y-2">
          <CardTitle className="text-3xl tracking-tight">
            {isLoginMode ? "Welcome back to EcoSpark Hub" : "Join the sustainability community"}
          </CardTitle>
          <CardDescription className="max-w-lg text-sm leading-6 text-foreground/75">
            {isLoginMode
              ? "Sign in with your email and password, use the demo account, or continue with Google."
              : "Create your account with a strong password or continue with Google to get started faster."}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 px-6 pb-6 pt-6 sm:px-8 sm:pb-8">
        <div className="grid gap-3">
          <SocialButton
            isLoading={socialLoading === "google"}
            onClick={() => void handleSocialSignIn("google")}
          />
        </div>

        {isLoginMode ? (
          <div className="rounded-2xl border border-primary/20 bg-[color-mix(in_srgb,var(--primary)_7%,white)] p-4 dark:bg-[color-mix(in_srgb,var(--primary)_14%,var(--card))]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">Demo access</p>
                <p className="text-sm text-foreground/72">
                  Fill the form instantly with the configured demo account.
                </p>
              </div>
              <Button type="button" variant="outline" className="rounded-2xl" onClick={handleDemoLogin}>
                Use Demo Login
              </Button>
            </div>
            <p className="mt-3 text-xs text-foreground/68">
              Demo email: <span className="font-medium text-foreground">{demoCredentials.email}</span>
            </p>
          </div>
        ) : null}

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/70" />
          </div>
          <div className="relative flex justify-center text-xs font-semibold uppercase tracking-[0.24em] text-foreground/55">
            <span className="bg-card px-3">or use email</span>
          </div>
        </div>

        <FormNotice message={formError} />
        <FormNotice message={formSuccess} tone="success" />

        {isLoginMode ? (
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
                <label htmlFor="login-email" className="block space-y-2">
                  <span className="text-sm font-medium">Email</span>
                  <Input
                    id="login-email"
                    type="email"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => {
                      clearFeedback();
                      setLoginErrors((current) => ({ ...current, email: undefined }));
                      field.handleChange(event.target.value);
                    }}
                    placeholder="member@ecospark.dev"
                    className={cn(
                      loginErrors.email && "border-destructive/50 focus-visible:ring-destructive/30",
                    )}
                    aria-invalid={Boolean(loginErrors.email)}
                  />
                  <FieldError message={loginErrors.email} />
                </label>
              )}
            </loginForm.Field>

            <loginForm.Field name="password">
              {(field) => (
                <PasswordField
                  id="login-password"
                  label="Password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(value) => {
                    clearFeedback();
                    setLoginErrors((current) => ({ ...current, password: undefined }));
                    field.handleChange(value);
                  }}
                  placeholder="Your password"
                  error={loginErrors.password}
                  visible={showLoginPassword}
                  onToggleVisibility={() => setShowLoginPassword((value) => !value)}
                />
              )}
            </loginForm.Field>

            <div className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between sm:gap-3">
              <p className="text-foreground/68">Use your email and password to access your dashboard.</p>
              <Link href="/forgot-password" className="font-semibold text-primary">
                Forgot password?
              </Link>
            </div>

            <Button className="w-full" size="lg" type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? <LoaderCircle className="size-4 animate-spin" /> : null}
              {mutation.isPending ? "Signing in..." : submitLabel}
            </Button>
          </form>
        ) : (
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
                <label htmlFor="register-name" className="block space-y-2">
                  <span className="text-sm font-medium">Full name</span>
                  <Input
                    id="register-name"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => {
                      clearFeedback();
                      setRegisterErrors((current) => ({ ...current, name: undefined }));
                      field.handleChange(event.target.value);
                    }}
                    placeholder="Ariana Rahman"
                    className={cn(
                      registerErrors.name && "border-destructive/50 focus-visible:ring-destructive/30",
                    )}
                    aria-invalid={Boolean(registerErrors.name)}
                  />
                  <FieldError message={registerErrors.name} />
                </label>
              )}
            </registerForm.Field>

            <registerForm.Field name="email">
              {(field) => (
                <label htmlFor="register-email" className="block space-y-2">
                  <span className="text-sm font-medium">Email</span>
                  <Input
                    id="register-email"
                    type="email"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => {
                      clearFeedback();
                      setRegisterErrors((current) => ({ ...current, email: undefined }));
                      field.handleChange(event.target.value);
                    }}
                    placeholder="member@ecospark.dev"
                    className={cn(
                      registerErrors.email && "border-destructive/50 focus-visible:ring-destructive/30",
                    )}
                    aria-invalid={Boolean(registerErrors.email)}
                  />
                  <FieldError message={registerErrors.email} />
                </label>
              )}
            </registerForm.Field>

            <registerForm.Field name="password">
              {(field) => (
                <PasswordField
                  id="register-password"
                  label="Password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(value) => {
                    clearFeedback();
                    setRegisterErrors((current) => ({ ...current, password: undefined }));
                    field.handleChange(value);
                  }}
                  placeholder="Minimum 8 characters with letters and numbers"
                  error={registerErrors.password}
                  visible={showRegisterPassword}
                  onToggleVisibility={() => setShowRegisterPassword((value) => !value)}
                />
              )}
            </registerForm.Field>

            <registerForm.Field name="confirmPassword">
              {(field) => (
                <PasswordField
                  id="register-confirm-password"
                  label="Confirm password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(value) => {
                    clearFeedback();
                    setRegisterErrors((current) => ({ ...current, confirmPassword: undefined }));
                    field.handleChange(value);
                  }}
                  placeholder="Repeat your password"
                  error={registerErrors.confirmPassword}
                  visible={showConfirmPassword}
                  onToggleVisibility={() => setShowConfirmPassword((value) => !value)}
                />
              )}
            </registerForm.Field>

            <p className="text-sm text-foreground/68">
              By creating an account, you can submit ideas, manage purchases, and participate in member discussions.
            </p>

            <Button className="w-full" size="lg" type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? <LoaderCircle className="size-4 animate-spin" /> : null}
              {mutation.isPending ? "Creating account..." : submitLabel}
            </Button>
          </form>
        )}

        <div className="border-t border-border/70 pt-5 text-sm text-foreground/72">
          {isLoginMode ? "Need an account?" : "Already have an account?"}{" "}
          <Link href={isLoginMode ? "/register" : "/login"} className="font-semibold text-primary">
            {isLoginMode ? "Register" : "Sign in"}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
