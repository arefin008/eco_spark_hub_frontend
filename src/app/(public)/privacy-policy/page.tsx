import type { Metadata } from "next";

import { PageShell } from "@/components/ecospark/page-shell";

export const metadata: Metadata = {
  title: "Privacy Policy | EcoSpark Hub",
  description: "Privacy policy for account, session, and newsletter data on EcoSpark Hub.",
};

export default function PrivacyPolicyPage() {
  return (
    <PageShell className="space-y-8 py-14 md:py-16">
      <div className="rounded-[32px] border border-border/80 bg-card p-6 shadow-sm md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary">Privacy policy</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
          How account and platform data are used
        </h1>
        <div className="mt-6 space-y-5 text-sm leading-7 text-muted-foreground">
          <p>
            EcoSpark Hub stores account details, session data, and platform activity required to
            deliver authentication, moderation, purchases, and community features.
          </p>
          <p>
            Newsletter subscriptions are used only for platform updates, top-voted ideas, and
            relevant announcements. Members may unsubscribe where supported.
          </p>
          <p>
            Payment and verification flows may involve trusted third-party providers, but only the
            minimum operational data necessary is exchanged.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
