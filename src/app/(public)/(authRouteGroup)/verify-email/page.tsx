import { AuthUtilityCard } from "@/components/ecospark/auth-utility-card";
import { PageShell } from "@/components/ecospark/page-shell";

export default function VerifyEmailPage() {
  return (
    <PageShell className="flex min-h-[calc(100vh-12rem)] items-center justify-center">
      <AuthUtilityCard mode="verify-email" />
    </PageShell>
  );
}
