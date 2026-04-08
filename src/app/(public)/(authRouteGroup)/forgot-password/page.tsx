import { AuthUtilityCard } from "@/components/ecospark/auth-utility-card";
import { GuestGuard } from "@/components/ecospark/guest-guard";
import { PageShell } from "@/components/ecospark/page-shell";

export default function ForgotPasswordPage() {
  return (
    <PageShell className="flex min-h-[calc(100vh-12rem)] items-center justify-center py-16">
      <GuestGuard>
        <AuthUtilityCard mode="forgot-password" />
      </GuestGuard>
    </PageShell>
  );
}
