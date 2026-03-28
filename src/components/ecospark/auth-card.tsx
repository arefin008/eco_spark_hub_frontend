"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, KeyRound, ShieldCheck, Sparkles } from "lucide-react";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  authService,
  type LoginInput,
  type RegisterInput,
  type ResetPasswordInput,
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

const forgotPasswordSchema = z.object({
  email: z.email("Enter the email attached to your account."),
});

const resetPasswordSchema = z
  .object({
    email: z.email("Enter a valid email."),
    otp: z.string().length(6, "OTP must be 6 digits."),
    newPassword: z.string().min(6, "Password must be at least 6 characters."),
    confirmPassword: z.string(),
  })
  .refine((value) => value.newPassword === value.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

const cardTransition = {
  duration: 0.45,
  ease: [0.22, 1, 0.36, 1] as const,
};

const featureCopy = [
  {
    icon: Sparkles,
    title: "Build better climate ideas",
    description: "Draft, publish, and refine projects with a cleaner workflow from day one.",
  },
  {
    icon: ShieldCheck,
    title: "Backed by member roles",
    description: "Member and admin experiences stay aligned with the backend authorization model.",
  },
  {
    icon: KeyRound,
    title: "Recovery flow included",
    description: "Request reset OTPs, finish password recovery, and keep momentum without leaving the page.",
  },
];

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;
type ResetValues = z.infer<typeof resetPasswordSchema>;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return <p className="text-sm text-destructive">{message}</p>;
}

export function AuthCard({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/dashboard";
  const [showRecovery, setShowRecovery] = useState(false);
  const [loginErrors, setLoginErrors] = useState<Partial<Record<keyof LoginValues, string>>>({});
  const [registerErrors, setRegisterErrors] = useState<
    Partial<Record<keyof RegisterValues, string>>
  >({});
  const [resetErrors, setResetErrors] = useState<Partial<Record<keyof ResetValues, string>>>({});
  const [requestedOtpFor, setRequestedOtpFor] = useState("");

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
      router.push(nextPath);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: authService.forgotPassword,
    onSuccess: (_, email) => {
      setRequestedOtpFor(email);
      toast.success("Password reset OTP sent.");
    },
    onError: (error) => toast.error(error.message),
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (payload: ResetPasswordInput) => authService.resetPassword(payload),
    onSuccess: async () => {
      toast.success("Password reset complete. Sign in with your new password.");
      setShowRecovery(false);
      setResetErrors({});
      setRequestedOtpFor("");
      await queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },
    onError: (error) => toast.error(error.message),
  });

  const loginForm = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      const parsed = loginSchema.safeParse(value);
      if (!parsed.success) {
        setLoginErrors(parsed.error.flatten().fieldErrors as Partial<Record<keyof LoginValues, string[]>>);
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

  const recoveryForm = useForm({
    defaultValues: {
      email: "",
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      const parsed = resetPasswordSchema.safeParse(value);
      if (!parsed.success) {
        setResetErrors(
          Object.fromEntries(
            Object.entries(parsed.error.flatten().fieldErrors).map(([key, messages]) => [
              key,
              messages?.[0],
            ]),
          ) as Partial<Record<keyof ResetValues, string>>,
        );
        toast.error(parsed.error.issues[0]?.message || "Invalid reset form values.");
        return;
      }

      setResetErrors({});
      const { confirmPassword, ...payload } = parsed.data;
      void confirmPassword;
      resetPasswordMutation.mutate(payload);
    },
  });

  const recoveryEmail = recoveryForm.getFieldValue("email");
  const otpRequestedForCurrentEmail = useMemo(
    () => recoveryEmail.length > 0 && recoveryEmail === requestedOtpFor,
    [recoveryEmail, requestedOtpFor],
  );

  const isBusy =
    mutation.isPending || forgotPasswordMutation.isPending || resetPasswordMutation.isPending;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={cardTransition}
      className="grid w-full gap-6 lg:grid-cols-[1.08fr_0.92fr]"
    >
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ ...cardTransition, delay: 0.08 }}
        className="relative overflow-hidden rounded-[36px] border border-emerald-200/70 bg-[radial-gradient(circle_at_top_left,_rgba(6,95,70,0.16),_transparent_36%),linear-gradient(160deg,rgba(240,253,244,0.96),rgba(220,252,231,0.72)_48%,rgba(255,255,255,0.92))] p-8 shadow-[0_24px_80px_rgba(6,95,70,0.14)] dark:border-emerald-900/60 dark:bg-[radial-gradient(circle_at_top_left,_rgba(52,211,153,0.18),_transparent_35%),linear-gradient(165deg,rgba(6,24,20,0.98),rgba(11,47,39,0.94)_48%,rgba(17,24,39,0.96))]"
      >
        <div className="pointer-events-none absolute inset-x-6 top-6 h-24 rounded-full bg-white/35 blur-3xl dark:bg-emerald-300/12" />
        <div className="relative space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/60 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-emerald-900 dark:border-emerald-700/60 dark:bg-white/8 dark:text-emerald-100">
            <Sparkles className="size-3.5" />
            EcoSpark access
          </div>

          <div className="max-w-xl space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-emerald-950 dark:text-white sm:text-5xl">
              {mode === "register" ? "Launch your member workspace." : "Return to your idea desk."}
            </h1>
            <p className="max-w-lg text-base leading-7 text-emerald-950/75 dark:text-emerald-50/78">
              {mode === "register"
                ? "Create your account, publish sustainability ideas, and move from concept to review with less friction."
                : "Sign in, continue your submissions, manage purchases, and recover access without a separate support step."}
            </p>
          </div>

          <div className="grid gap-4">
            {featureCopy.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...cardTransition, delay: 0.12 + index * 0.08 }}
                className="rounded-[28px] border border-white/60 bg-white/72 p-5 backdrop-blur dark:border-white/10 dark:bg-white/6"
              >
                <item.icon className="size-5 text-primary" />
                <h2 className="mt-4 text-lg font-semibold text-emerald-950 dark:text-white">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-emerald-950/70 dark:text-emerald-50/72">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ ...cardTransition, delay: 0.14 }}
      >
        <Card className="w-full rounded-[36px] border border-border/70 bg-card/92 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur">
          <CardContent className="p-8 sm:p-9">
            <div className="mb-8 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary">
                  {showRecovery ? "Recover access" : mode === "register" ? "Create account" : "Welcome back"}
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                  {showRecovery
                    ? "Reset your password"
                    : mode === "register"
                      ? "Join EcoSpark Hub"
                      : "Sign in to continue"}
                </h2>
                <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
                  {showRecovery
                    ? "Request an OTP for your email, then complete the reset without leaving this screen."
                    : mode === "register"
                      ? "Your member account gives you dashboard access, idea publishing, and project tracking."
                      : "Use the credentials issued by your backend auth system. Session cookies will be reused automatically."}
                </p>
              </div>
              <div className="hidden rounded-3xl bg-secondary px-4 py-3 text-right sm:block">
                <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Auth state</p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {showRecovery ? "Recovery" : mode === "register" ? "New member" : "Existing member"}
                </p>
              </div>
            </div>

            {showRecovery ? (
              <form
                className="space-y-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  void recoveryForm.handleSubmit();
                }}
              >
                <recoveryForm.Field name="email">
                  {(field) => (
                    <label className="block space-y-2">
                      <span className="text-sm font-medium">Account email</span>
                      <Input
                        type="email"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) => field.handleChange(event.target.value)}
                        placeholder="member@ecospark.dev"
                      />
                      <FieldError message={resetErrors.email} />
                    </label>
                  )}
                </recoveryForm.Field>

                <div className="rounded-[28px] border border-border/70 bg-muted/35 p-4">
                  <p className="text-sm font-medium">Step 1: request OTP</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    The backend will send a one-time passcode to the email above.
                  </p>
                  <Button
                    type="button"
                    className="mt-4"
                    variant="outline"
                    disabled={forgotPasswordMutation.isPending || forgotPasswordSchema.safeParse({ email: recoveryEmail }).success === false}
                    onClick={() => {
                      const parsed = forgotPasswordSchema.safeParse({ email: recoveryEmail });
                      if (!parsed.success) {
                        toast.error(parsed.error.issues[0]?.message || "Enter a valid email.");
                        return;
                      }

                      forgotPasswordMutation.mutate(parsed.data.email);
                    }}
                  >
                    {forgotPasswordMutation.isPending ? "Sending OTP..." : "Send reset OTP"}
                  </Button>
                </div>

                <div className="grid gap-4 rounded-[28px] border border-border/70 bg-background/65 p-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="size-4 text-primary" />
                    {otpRequestedForCurrentEmail
                      ? "OTP requested for this email. Complete the reset below."
                      : "Step 2: enter the OTP and your new password."}
                  </div>

                  <recoveryForm.Field name="otp">
                    {(field) => (
                      <label className="block space-y-2">
                        <span className="text-sm font-medium">OTP code</span>
                        <Input
                          inputMode="numeric"
                          maxLength={6}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(event) => field.handleChange(event.target.value.replace(/\D/g, "").slice(0, 6))}
                          placeholder="6-digit code"
                        />
                        <FieldError message={resetErrors.otp} />
                      </label>
                    )}
                  </recoveryForm.Field>

                  <recoveryForm.Field name="newPassword">
                    {(field) => (
                      <label className="block space-y-2">
                        <span className="text-sm font-medium">New password</span>
                        <Input
                          type="password"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(event) => field.handleChange(event.target.value)}
                          placeholder="At least 6 characters"
                        />
                        <FieldError message={resetErrors.newPassword} />
                      </label>
                    )}
                  </recoveryForm.Field>

                  <recoveryForm.Field name="confirmPassword">
                    {(field) => (
                      <label className="block space-y-2">
                        <span className="text-sm font-medium">Confirm password</span>
                        <Input
                          type="password"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(event) => field.handleChange(event.target.value)}
                          placeholder="Repeat your new password"
                        />
                        <FieldError message={resetErrors.confirmPassword} />
                      </label>
                    )}
                  </recoveryForm.Field>
                </div>

                <Button className="w-full" size="lg" type="submit" disabled={isBusy}>
                  {resetPasswordMutation.isPending ? "Resetting password..." : "Reset password"}
                </Button>

                <button
                  type="button"
                  className="w-full text-sm font-medium text-primary transition hover:text-primary/80"
                  onClick={() => {
                    setShowRecovery(false);
                    setResetErrors({});
                  }}
                >
                  Back to sign in
                </button>
              </form>
            ) : mode === "register" ? (
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
                  {mutation.isPending ? "Creating account..." : "Create account"}
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

                <div className="flex items-center justify-between gap-4 text-sm">
                  <button
                    type="button"
                    className="font-medium text-primary transition hover:text-primary/80"
                    onClick={() => setShowRecovery(true)}
                  >
                    Forgot password?
                  </button>
                  <p className="text-muted-foreground">Uses backend cookie-based session refresh.</p>
                </div>

                <Button className="w-full" size="lg" type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? "Signing in..." : "Sign in"}
                </Button>
              </form>
            )}

            <div className="mt-6 flex items-center justify-between gap-4 border-t border-border/70 pt-6 text-sm text-muted-foreground">
              <p>
                {mode === "register" ? "Already have an account?" : "Need an account?"}{" "}
                <Link
                  href={mode === "register" ? "/login" : "/register"}
                  className="font-semibold text-primary"
                >
                  {mode === "register" ? "Sign in" : "Register"}
                </Link>
              </p>
              {mode === "login" && !showRecovery ? (
                <ArrowRight className="size-4 text-primary" />
              ) : null}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
