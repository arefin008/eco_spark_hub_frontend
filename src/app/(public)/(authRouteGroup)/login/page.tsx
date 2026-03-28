import type { Metadata } from "next";

import { AuthCard } from "@/components/ecospark/auth-card";
import { GuestGuard } from "@/components/ecospark/guest-guard";
import { PageShell } from "@/components/ecospark/page-shell";

export const metadata: Metadata = {
  title: "Login | EcoSpark Hub",
  description: "Sign in to EcoSpark Hub to manage ideas, votes, purchases, and your profile.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return (
    <PageShell className="flex min-h-[calc(100vh-12rem)] items-center justify-center py-16">
      <GuestGuard>
        <AuthCard mode="login" />
      </GuestGuard>
    </PageShell>
  );
}
