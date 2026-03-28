import { AuthCard } from "@/components/ecospark/auth-card";
import { GuestGuard } from "@/components/ecospark/guest-guard";
import { PageShell } from "@/components/ecospark/page-shell";

export default function LoginPage() {
  return (
    <PageShell className="flex min-h-[calc(100vh-12rem)] items-center justify-center">
      <GuestGuard>
        <AuthCard mode="login" />
      </GuestGuard>
    </PageShell>
  );
}
