"use client";

import { OTPInput } from "input-otp";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/hooks/use-current-user";
import { formatDate } from "@/lib/helpers";
import { authService } from "@/services/auth.service";

function OtpSlots({ slots }: { slots: Array<{ char: string | null; isActive: boolean }> }) {
  return (
    <>
      {slots.map((slot, index) => (
        <div
          key={index}
          className="flex size-11 items-center justify-center rounded-2xl border border-border bg-background text-base font-semibold"
        >
          {slot.char}
        </div>
      ))}
    </>
  );
}

export function ProfilePanel() {
  const queryClient = useQueryClient();
  const { data: currentUser, isLoading } = useCurrentUser();
  const changePasswordMutation = useMutation({
    mutationFn: authService.changePassword,
    onSuccess: () => toast.success("Password updated."),
    onError: (error) => toast.error(error.message),
  });
  const verifyMutation = useMutation({
    mutationFn: authService.verifyEmail,
    onSuccess: async () => {
      toast.success("Email verified.");
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
    onSuccess: () => toast.success("Password reset complete."),
    onError: (error) => toast.error(error.message),
  });

  const passwordForm = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
    onSubmit: async ({ value }) => {
      changePasswordMutation.mutate(value);
    },
  });

  const verificationForm = useForm({
    defaultValues: {
      otp: "",
      resetOtp: "",
      newPassword: "",
    },
    onSubmit: async () => {},
  });

  if (isLoading) {
    return <div className="py-10 text-muted-foreground">Loading profile...</div>;
  }

  if (!currentUser) {
    return (
      <div className="rounded-[28px] border border-border bg-card p-8">
        <h1 className="text-3xl font-semibold">My Profile</h1>
        <p className="mt-2 text-muted-foreground">Sign in to view your account details.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
          Account
        </p>
        <h1 className="mt-2 text-4xl font-semibold">{currentUser.name}</h1>
        <div className="mt-5 grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
          <p>Email: {currentUser.email}</p>
          <p>Role: {currentUser.role}</p>
          <p>Status: {currentUser.status}</p>
          <p>Joined: {formatDate(currentUser.createdAt)}</p>
        </div>
        </CardContent>
      </Card>

      <section className="grid gap-8 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Change password</CardTitle>
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
                <Input
                  type="password"
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  placeholder="Current password"
                />
              )}
            </passwordForm.Field>
            <passwordForm.Field name="newPassword">
              {(field) => (
                <Input
                  type="password"
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  placeholder="New password"
                />
              )}
            </passwordForm.Field>
            <Button type="submit" disabled={changePasswordMutation.isPending}>
              Update password
            </Button>
          </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Email verification</CardTitle>
            <CardDescription>
              Enter the verification OTP if your backend auth flow has already sent one.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <verificationForm.Field name="otp">
              {(field) => (
                <div className="space-y-3">
                  <OTPInput
                    maxLength={6}
                    value={field.state.value}
                    onChange={field.handleChange}
                    containerClassName="flex gap-2"
                    render={({ slots }) => <OtpSlots slots={slots} />}
                  />
                  <Button
                    onClick={() =>
                      verifyMutation.mutate({
                        email: currentUser.email,
                        otp: field.state.value,
                      })
                    }
                    disabled={verifyMutation.isPending || field.state.value.length !== 6}
                  >
                    Verify email
                  </Button>
                </div>
              )}
            </verificationForm.Field>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Reset password with OTP</CardTitle>
        </CardHeader>
        <CardContent>
        <Button
          className="mb-5"
          variant="outline"
          onClick={() => forgotPasswordMutation.mutate(currentUser.email)}
          disabled={forgotPasswordMutation.isPending}
        >
          Request password reset OTP
        </Button>
        <div className="mt-5 grid gap-4 md:grid-cols-[auto_1fr_auto]">
          <verificationForm.Field name="resetOtp">
            {(field) => (
              <OTPInput
                maxLength={6}
                value={field.state.value}
                onChange={field.handleChange}
                containerClassName="flex gap-2"
                render={({ slots }) => <OtpSlots slots={slots} />}
              />
            )}
          </verificationForm.Field>
          <verificationForm.Field name="newPassword">
            {(field) => (
              <Input
                type="password"
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
                placeholder="New password"
              />
            )}
          </verificationForm.Field>
          <Button
            onClick={() =>
              resetPasswordMutation.mutate({
                email: currentUser.email,
                otp: verificationForm.getFieldValue("resetOtp"),
                newPassword: verificationForm.getFieldValue("newPassword"),
              })
            }
            disabled={resetPasswordMutation.isPending}
          >
            Reset
          </Button>
        </div>
        </CardContent>
      </Card>
    </div>
  );
}
