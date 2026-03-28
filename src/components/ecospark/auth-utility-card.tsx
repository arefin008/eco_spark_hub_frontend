"use client";

import { motion } from "framer-motion";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/hooks/use-current-user";
import { cn } from "@/lib/utils";
import { authService } from "@/services/auth.service";

const verifySchema = z.object({
  email: z.email("Enter a valid email."),
  otp: z.string().length(6, "OTP must be 6 digits."),
});

const forgotPasswordSchema = z.object({
  email: z.email("Enter a valid email."),
  otp: z.string().length(6, "OTP must be 6 digits."),
  newPassword: z.string().min(6, "Password must be at least 6 characters."),
  confirmPassword: z.string(),
}).refine((value) => value.newPassword === value.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required."),
  newPassword: z.string().min(6, "Password must be at least 6 characters."),
  confirmPassword: z.string(),
}).refine((value) => value.newPassword === value.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

type UtilityMode = "verify-email" | "forgot-password" | "change-password";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return <p className="text-sm text-destructive">{message}</p>;
}

const content: Record<
  UtilityMode,
  {
    eyebrow: string;
    title: string;
    description: string;
    footerHref: string;
    footerLabel: string;
    footerText: string;
  }
> = {
  "verify-email": {
    eyebrow: "Email verification",
    title: "Confirm your email",
    description: "Use the one-time passcode issued by the backend verification flow.",
    footerHref: "/login",
    footerLabel: "Back to sign in",
    footerText: "Already finished verification?",
  },
  "forgot-password": {
    eyebrow: "Password recovery",
    title: "Reset your password",
    description: "Request a reset OTP, then complete the password reset from the same screen.",
    footerHref: "/login",
    footerLabel: "Back to sign in",
    footerText: "Remembered your password?",
  },
  "change-password": {
    eyebrow: "Account security",
    title: "Change your password",
    description: "This route uses the authenticated backend password-rotation endpoint.",
    footerHref: "/my-profile",
    footerLabel: "Back to profile",
    footerText: "Need the rest of your account settings?",
  },
};

export function AuthUtilityCard({ mode }: { mode: UtilityMode }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUser();
  const [sentOtp, setSentOtp] = useState("");
  const [verifyErrors, setVerifyErrors] = useState<Partial<Record<"email" | "otp", string>>>({});
  const [resetErrors, setResetErrors] = useState<
    Partial<Record<"email" | "otp" | "newPassword" | "confirmPassword", string>>
  >({});
  const [changeErrors, setChangeErrors] = useState<
    Partial<Record<"currentPassword" | "newPassword" | "confirmPassword", string>>
  >({});

  const verifyForm = useForm({
    defaultValues: {
      email: currentUser?.email ?? "",
      otp: "",
    },
    onSubmit: async ({ value }) => {
      const parsed = verifySchema.safeParse(value);
      if (!parsed.success) {
        setVerifyErrors(
          Object.fromEntries(
            Object.entries(parsed.error.flatten().fieldErrors).map(([key, messages]) => [
              key,
              messages?.[0],
            ]),
          ) as Partial<Record<"email" | "otp", string>>,
        );
        toast.error(parsed.error.issues[0]?.message || "Invalid verification values.");
        return;
      }

      setVerifyErrors({});
      verifyMutation.mutate(parsed.data);
    },
  });

  const resetForm = useForm({
    defaultValues: {
      email: currentUser?.email ?? "",
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      const parsed = forgotPasswordSchema.safeParse(value);
      if (!parsed.success) {
        setResetErrors(
          Object.fromEntries(
            Object.entries(parsed.error.flatten().fieldErrors).map(([key, messages]) => [
              key,
              messages?.[0],
            ]),
          ) as Partial<Record<"email" | "otp" | "newPassword" | "confirmPassword", string>>,
        );
        toast.error(parsed.error.issues[0]?.message || "Invalid reset values.");
        return;
      }

      setResetErrors({});
      const { confirmPassword, ...payload } = parsed.data;
      void confirmPassword;
      resetMutation.mutate(payload);
    },
  });

  const changeForm = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      const parsed = changePasswordSchema.safeParse(value);
      if (!parsed.success) {
        setChangeErrors(
          Object.fromEntries(
            Object.entries(parsed.error.flatten().fieldErrors).map(([key, messages]) => [
              key,
              messages?.[0],
            ]),
          ) as Partial<Record<"currentPassword" | "newPassword" | "confirmPassword", string>>,
        );
        toast.error(parsed.error.issues[0]?.message || "Invalid password values.");
        return;
      }

      setChangeErrors({});
      const { confirmPassword, ...payload } = parsed.data;
      void confirmPassword;
      changePasswordMutation.mutate(payload);
    },
  });

  const verifyMutation = useMutation({
    mutationFn: authService.verifyEmail,
    onSuccess: async () => {
      toast.success("Email verified.");
      await queryClient.invalidateQueries({ queryKey: ["current-user"] });
      router.push("/login");
    },
    onError: (error) => toast.error(error.message),
  });

  const forgotMutation = useMutation({
    mutationFn: authService.forgotPassword,
    onSuccess: (_, email) => {
      setSentOtp(email);
      toast.success("OTP sent to your email.");
    },
    onError: (error) => toast.error(error.message),
  });

  const resetMutation = useMutation({
    mutationFn: authService.resetPassword,
    onSuccess: () => {
      toast.success("Password reset complete.");
      router.push("/login");
    },
    onError: (error) => toast.error(error.message),
  });

  const changePasswordMutation = useMutation({
    mutationFn: authService.changePassword,
    onSuccess: async () => {
      toast.success("Password changed.");
      await queryClient.invalidateQueries({ queryKey: ["current-user"] });
      router.push("/my-profile");
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-2xl"
    >
      <Card className="rounded-[34px] border-border/70 bg-card/94 shadow-[0_22px_60px_rgba(15,23,42,0.08)]">
        <CardHeader className="p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary">
            {content[mode].eyebrow}
          </p>
          <CardTitle className="text-4xl tracking-tight">{content[mode].title}</CardTitle>
          <CardDescription className="max-w-xl text-sm leading-6">
            {content[mode].description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5 px-8 pb-8 pt-0">
          {mode === "verify-email" ? (
            <form
              className="space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                event.stopPropagation();
                void verifyForm.handleSubmit();
              }}
            >
              <verifyForm.Field name="email">
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
                    <FieldError message={verifyErrors.email} />
                  </label>
                )}
              </verifyForm.Field>

              <verifyForm.Field name="otp">
                {(field) => (
                  <label className="block space-y-2">
                    <span className="text-sm font-medium">OTP</span>
                    <Input
                      inputMode="numeric"
                      maxLength={6}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value.replace(/\D/g, "").slice(0, 6))
                      }
                      placeholder="6-digit code"
                    />
                    <FieldError message={verifyErrors.otp} />
                  </label>
                )}
              </verifyForm.Field>

              <Button className="w-full" size="lg" type="submit" disabled={verifyMutation.isPending}>
                {verifyMutation.isPending ? "Verifying..." : "Verify email"}
              </Button>
            </form>
          ) : null}

          {mode === "forgot-password" ? (
            <>
              <div className="rounded-[28px] border border-border/70 bg-muted/25 p-5">
                <p className="text-sm font-semibold">Step 1: request OTP</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  The backend will send a reset code to your email before you submit the new password.
                </p>
                <div className="mt-4 space-y-4">
                  <resetForm.Field name="email">
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
                        <FieldError message={resetErrors.email} />
                      </label>
                    )}
                  </resetForm.Field>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const email = resetForm.getFieldValue("email");
                      const parsed = z.email("Enter a valid email.").safeParse(email);
                      if (!parsed.success) {
                        toast.error(parsed.error.issues[0]?.message || "Enter a valid email.");
                        return;
                      }

                      forgotMutation.mutate(parsed.data);
                    }}
                    disabled={forgotMutation.isPending}
                  >
                    {forgotMutation.isPending ? "Sending OTP..." : "Send reset OTP"}
                  </Button>
                </div>
              </div>

              <form
                className="space-y-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  void resetForm.handleSubmit();
                }}
              >
                <div className="rounded-[28px] border border-border/70 bg-background/65 p-5 text-sm text-muted-foreground">
                  {sentOtp
                    ? `OTP requested for ${sentOtp}.`
                    : "Step 2: enter the OTP and choose your new password."}
                </div>

                <resetForm.Field name="otp">
                  {(field) => (
                    <label className="block space-y-2">
                      <span className="text-sm font-medium">OTP</span>
                      <Input
                        inputMode="numeric"
                        maxLength={6}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(event.target.value.replace(/\D/g, "").slice(0, 6))
                        }
                        placeholder="6-digit code"
                      />
                      <FieldError message={resetErrors.otp} />
                    </label>
                  )}
                </resetForm.Field>

                <resetForm.Field name="newPassword">
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
                </resetForm.Field>

                <resetForm.Field name="confirmPassword">
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
                      <FieldError message={resetErrors.confirmPassword} />
                    </label>
                  )}
                </resetForm.Field>

                <Button className="w-full" size="lg" type="submit" disabled={resetMutation.isPending}>
                  {resetMutation.isPending ? "Resetting..." : "Reset password"}
                </Button>
              </form>
            </>
          ) : null}

          {mode === "change-password" ? (
            <form
              className="space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                event.stopPropagation();
                void changeForm.handleSubmit();
              }}
            >
              <changeForm.Field name="currentPassword">
                {(field) => (
                  <label className="block space-y-2">
                    <span className="text-sm font-medium">Current password</span>
                    <Input
                      type="password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) => field.handleChange(event.target.value)}
                      placeholder="Current password"
                    />
                    <FieldError message={changeErrors.currentPassword} />
                  </label>
                )}
              </changeForm.Field>

              <changeForm.Field name="newPassword">
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
                    <FieldError message={changeErrors.newPassword} />
                  </label>
                )}
              </changeForm.Field>

              <changeForm.Field name="confirmPassword">
                {(field) => (
                  <label className="block space-y-2">
                    <span className="text-sm font-medium">Confirm new password</span>
                    <Input
                      type="password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) => field.handleChange(event.target.value)}
                      placeholder="Repeat your password"
                    />
                    <FieldError message={changeErrors.confirmPassword} />
                  </label>
                )}
              </changeForm.Field>

              <Button
                className="w-full"
                size="lg"
                type="submit"
                disabled={changePasswordMutation.isPending}
              >
                {changePasswordMutation.isPending ? "Updating..." : "Change password"}
              </Button>
            </form>
          ) : null}

          <div
            className={cn(
              "border-t border-border/70 pt-5 text-sm text-muted-foreground",
              mode === "change-password" ? "flex items-center justify-between gap-4" : "",
            )}
          >
            <span>{content[mode].footerText}</span>{" "}
            <Link href={content[mode].footerHref} className="font-semibold text-primary">
              {content[mode].footerLabel}
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
