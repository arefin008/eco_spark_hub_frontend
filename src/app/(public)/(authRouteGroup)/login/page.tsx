import { AuthCard } from "@/components/ecospark/auth-card";
import { PageShell } from "@/components/ecospark/page-shell";

export default function LoginPage() {
  return (
    <PageShell className="flex min-h-[calc(100vh-12rem)] items-center justify-center">
      <AuthCard mode="login" />
    </PageShell>
  );
}
