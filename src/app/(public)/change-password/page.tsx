import { AuthGuard } from "@/components/ecospark/auth-guard";
import { AuthUtilityCard } from "@/components/ecospark/auth-utility-card";
import { PageShell } from "@/components/ecospark/page-shell";

export default function ChangePasswordPage() {
  return (
    <PageShell className="flex min-h-[calc(100vh-12rem)] items-center justify-center">
      <AuthGuard>
        <AuthUtilityCard mode="change-password" />
      </AuthGuard>
    </PageShell>
  );
}
