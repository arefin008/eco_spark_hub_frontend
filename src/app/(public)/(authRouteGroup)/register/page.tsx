import type { Metadata } from "next";

import { AuthCard } from "@/components/ecospark/auth-card";
import { GuestGuard } from "@/components/ecospark/guest-guard";
import { PageShell } from "@/components/ecospark/page-shell";

export const metadata: Metadata = {
  title: "Register | EcoSpark Hub",
  description: "Create an EcoSpark Hub account to publish sustainability ideas and access member features.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RegisterPage() {
  return (
    <PageShell className="flex min-h-[calc(100vh-12rem)] items-center justify-center py-16">
      <GuestGuard>
        <AuthCard mode="register" />
      </GuestGuard>
    </PageShell>
  );
}
