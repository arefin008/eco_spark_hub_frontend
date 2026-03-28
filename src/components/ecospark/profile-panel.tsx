"use client";

import { motion } from "framer-motion";
import { OTPInput } from "input-otp";
import {
  CheckCircle2,
  KeyRound,
  LogOut,
  MailCheck,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/hooks/use-current-user";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/helpers";
import { authService } from "@/services/auth.service";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: z.string().min(6, "New password must be at least 6 characters."),
    confirmPassword: z.string(),
  })
  .refine((value) => value.newPassword === value.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

const resetSchema = z
  .object({
    otp: z.string().length(6, "OTP must be 6 digits."),
    newPassword: z.string().min(6, "New password must be at least 6 characters."),
    confirmPassword: z.string(),
  })
  .refine((value) => value.newPassword === value.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

function OtpSlots({ slots }: { slots: Array<{ char: string | null; isActive: boolean }> }) {
  return (
    <>
      {slots.map((slot, index) => (
        <div
          key={index}
          className={cn(
            "flex size-11 items-center justify-center rounded-2xl border bg-background text-base font-semibold transition",
            slot.isActive ? "border-primary shadow-[0_0_0_3px_rgba(16,185,129,0.12)]" : "border-border",
          )}
        >
          {slot.char}
        </div>
      ))}
    </>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return <p className="text-sm text-destructive">{message}</p>;
}

const sectionTransition = {
  duration: 0.4,
  ease: [0.22, 1, 0.36, 1] as const,
};

export function ProfilePanel() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: currentUser, isLoading } = useCurrentUser();
  const [passwordErrors, setPasswordErrors] = useState<
    Partial<Record<"currentPassword" | "newPassword" | "confirmPassword", string>>
  >({});
  const [verificationOtp, setVerificationOtp] = useState("");
  const [resetErrors, setResetErrors] = useState<
    Partial<Record<"otp" | "newPassword" | "confirmPassword", string>>
  >({});

  const changePasswordMutation = useMutation({
    mutationFn: authService.changePassword,
    onSuccess: async () => {
      toast.success("Password updated.");
      setPasswordErrors({});
      await queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },
    onError: (error) => toast.error(error.message),
  });

  const verifyMutation = useMutation({
    mutationFn: authService.verifyEmail,
    onSuccess: async () => {
      toast.success("Email verified.");
      setVerificationOtp("");
      await queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },
    onError: (error) => toast.error(error.message),
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: authService.forgotPassword,
    onSuccess: () => toast.success("OTP sent to your email."),
    onError: (error) => toast.error(error.message),
  });

  const resetPasswordMutation = useMutation({
    mutationFn: authService.resetPassword,
    onSuccess: async () => {
      toast.success("Password reset complete.");
      setResetErrors({});
      await queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },
    onError: (error) => toast.error(error.message),
  });

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["current-user"] });
      toast.success("Logged out.");
      router.push("/");
    },
    onError: (error) => toast.error(error.message),
  });

  const passwordForm = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      const parsed = passwordSchema.safeParse(value);
      if (!parsed.success) {
        setPasswordErrors(
          Object.fromEntries(
            Object.entries(parsed.error.flatten().fieldErrors).map(([key, messages]) => [
              key,
              messages?.[0],
            ]),
          ) as Partial<Record<"currentPassword" | "newPassword" | "confirmPassword", string>>,
        );
        toast.error(parsed.error.issues[0]?.message || "Invalid password form values.");
        return;
      }

      setPasswordErrors({});
      const { confirmPassword, ...payload } = parsed.data;
      void confirmPassword;
      changePasswordMutation.mutate(payload);
    },
  });

  const resetForm = useForm({
    defaultValues: {
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      const parsed = resetSchema.safeParse(value);
      if (!parsed.success) {
        setResetErrors(
          Object.fromEntries(
            Object.entries(parsed.error.flatten().fieldErrors).map(([key, messages]) => [
              key,
              messages?.[0],
            ]),
          ) as Partial<Record<"otp" | "newPassword" | "confirmPassword", string>>,
        );
        toast.error(parsed.error.issues[0]?.message || "Invalid reset form values.");
        return;
      }

      if (!currentUser) return;

      setResetErrors({});
      const { confirmPassword, ...payload } = parsed.data;
      void confirmPassword;
      resetPasswordMutation.mutate({
        email: currentUser.email,
        ...payload,
      });
    },
  });

  if (isLoading) {
    return <div className="py-10 text-muted-foreground">Loading profile...</div>;
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={sectionTransition}
      >
        <Card className="overflow-hidden border-border/70 bg-[radial-gradient(circle_at_top_left,_rgba(0,173,181,0.12),_transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.98),rgba(238,238,238,0.92))] shadow-[0_20px_60px_rgba(15,23,42,0.08)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(0,173,181,0.14),_transparent_35%),linear-gradient(140deg,rgba(34,40,49,0.98),rgba(57,62,70,0.96))]">
          <CardContent className="grid gap-6 p-7 lg:grid-cols-[1.25fr_0.75fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-foreground dark:border-white/10 dark:bg-white/8 dark:text-foreground">
                <Sparkles className="size-3.5" />
                Account center
              </div>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight">{currentUser.name}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                Keep your account secure, confirm email ownership, rotate passwords, and recover
                access through the same backend OTP flow exposed by the API.
              </p>
              <div className="mt-6 grid gap-3 text-sm md:grid-cols-2">
                <div className="rounded-2xl border border-border/70 bg-background/75 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Email</p>
                  <p className="mt-2 font-medium">{currentUser.email}</p>
                </div>
                <div className="rounded-2xl border border-border/70 bg-background/75 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Role</p>
                  <p className="mt-2 font-medium">{currentUser.role}</p>
                </div>
                <div className="rounded-2xl border border-border/70 bg-background/75 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Status</p>
                  <p className="mt-2 font-medium">{currentUser.status}</p>
                </div>
                <div className="rounded-2xl border border-border/70 bg-background/75 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Joined</p>
                  <p className="mt-2 font-medium">{formatDate(currentUser.createdAt)}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 self-start">
              <div className="rounded-[28px] border border-border/70 bg-background/82 p-5">
                <div className="flex items-center gap-3">
                  {currentUser.emailVerified ? (
                    <CheckCircle2 className="size-5 text-primary" />
                  ) : (
                    <ShieldAlert className="size-5 text-accent" />
                  )}
                  <div>
                    <p className="text-sm font-semibold">Email status</p>
                    <p className="text-sm text-muted-foreground">
                      {currentUser.emailVerified ? "Verified" : "Pending verification"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 rounded-[28px] border border-border/70 bg-background/82 p-5">
                <p className="text-sm font-semibold">Security routes</p>
                <Link href="/change-password" className="text-sm text-primary transition hover:text-primary/80">
                  Open dedicated change-password page
                </Link>
                {!currentUser.emailVerified ? (
                  <Link href="/verify-email" className="text-sm text-primary transition hover:text-primary/80">
                    Open dedicated verify-email page
                  </Link>
                ) : null}
              </div>

              <Button
                variant="outline"
                className="justify-between"
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
              >
                {logoutMutation.isPending ? "Logging out..." : "Log out"}
                <LogOut className="size-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <section className="grid gap-8 xl:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...sectionTransition, delay: 0.06 }}
        >
          <Card className="h-full border-border/70">
            <CardHeader>
              <CardTitle>Change password</CardTitle>
              <CardDescription>
                Update your password while signed in. Backend authorization is required for this action.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                className="space-y-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  void passwordForm.handleSubmit();
                }}
              >
                <passwordForm.Field name="currentPassword">
                  {(field) => (
                    <label className="block space-y-2">
                      <span className="text-sm font-medium">Current password</span>
                      <Input
                        type="password"
                        value={field.state.value}
                        onChange={(event) => field.handleChange(event.target.value)}
                        placeholder="Current password"
                      />
                      <FieldError message={passwordErrors.currentPassword} />
                    </label>
                  )}
                </passwordForm.Field>

                <passwordForm.Field name="newPassword">
                  {(field) => (
                    <label className="block space-y-2">
                      <span className="text-sm font-medium">New password</span>
                      <Input
                        type="password"
                        value={field.state.value}
                        onChange={(event) => field.handleChange(event.target.value)}
                        placeholder="At least 6 characters"
                      />
                      <FieldError message={passwordErrors.newPassword} />
                    </label>
                  )}
                </passwordForm.Field>

                <passwordForm.Field name="confirmPassword">
                  {(field) => (
                    <label className="block space-y-2">
                      <span className="text-sm font-medium">Confirm new password</span>
                      <Input
                        type="password"
                        value={field.state.value}
                        onChange={(event) => field.handleChange(event.target.value)}
                        placeholder="Repeat your new password"
                      />
                      <FieldError message={passwordErrors.confirmPassword} />
                    </label>
                  )}
                </passwordForm.Field>

                <Button type="submit" disabled={changePasswordMutation.isPending}>
                  {changePasswordMutation.isPending ? "Updating..." : "Update password"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...sectionTransition, delay: 0.12 }}
        >
          <Card className="h-full border-border/70">
            <CardHeader>
              <CardTitle>Email verification</CardTitle>
              <CardDescription>
                Use the OTP sent by your backend flow. There is no separate resend endpoint in the current API contract.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentUser.emailVerified ? (
                <div className="rounded-[28px] border border-primary/20 bg-primary/10 p-5 text-foreground dark:text-foreground">
                  <div className="flex items-center gap-3">
                    <MailCheck className="size-5" />
                    <div>
                      <p className="font-semibold">Email already verified</p>
                      <p className="mt-1 text-sm opacity-80">
                        No further action is needed for your account.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 rounded-[28px] border border-border/70 bg-muted/25 p-5">
                  <OTPInput
                    maxLength={6}
                    value={verificationOtp}
                    onChange={(value) => setVerificationOtp(value.replace(/\D/g, "").slice(0, 6))}
                    containerClassName="flex flex-wrap gap-2"
                    render={({ slots }) => <OtpSlots slots={slots} />}
                  />
                  <Button
                    onClick={() =>
                      verifyMutation.mutate({
                        email: currentUser.email,
                        otp: verificationOtp,
                      })
                    }
                    disabled={verifyMutation.isPending || verificationOtp.length !== 6}
                  >
                    {verifyMutation.isPending ? "Verifying..." : "Verify email"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </section>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...sectionTransition, delay: 0.18 }}
      >
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Reset password with OTP</CardTitle>
            <CardDescription>
              This uses the same public auth endpoints as the login recovery flow, but keeps it available inside the account area.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex flex-col gap-4 rounded-[28px] border border-border/70 bg-muted/20 p-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold">Request a password reset OTP</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  The OTP will be sent to {currentUser.email}.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => forgotPasswordMutation.mutate(currentUser.email)}
                disabled={forgotPasswordMutation.isPending}
              >
                {forgotPasswordMutation.isPending ? "Sending..." : "Request OTP"}
                <KeyRound className="size-4" />
              </Button>
            </div>

            <form
              className="grid gap-4 lg:grid-cols-[1fr_1fr_1fr_auto]"
              onSubmit={(event) => {
                event.preventDefault();
                event.stopPropagation();
                void resetForm.handleSubmit();
              }}
            >
              <resetForm.Field name="otp">
                {(field) => (
                  <label className="block space-y-2">
                    <span className="text-sm font-medium">OTP</span>
                    <Input
                      inputMode="numeric"
                      maxLength={6}
                      value={field.state.value}
                      onChange={(event) => field.handleChange(event.target.value.replace(/\D/g, "").slice(0, 6))}
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
                      onChange={(event) => field.handleChange(event.target.value)}
                      placeholder="New password"
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
                      onChange={(event) => field.handleChange(event.target.value)}
                      placeholder="Confirm password"
                    />
                    <FieldError message={resetErrors.confirmPassword} />
                  </label>
                )}
              </resetForm.Field>

              <div className="flex items-end">
                <Button type="submit" disabled={resetPasswordMutation.isPending}>
                  {resetPasswordMutation.isPending ? "Resetting..." : "Reset"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
