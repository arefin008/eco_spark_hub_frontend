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
        <div className="mt-10 grid gap-8 pb-4 md:grid-cols-2">
          <section className="space-y-3">
            <h2 className="text-lg font-medium text-foreground">Account & Session Data</h2>
            <p className="text-sm leading-7 text-muted-foreground">
              EcoSpark Hub responsibly stores account details, session data, and platform activity. This information is strictly utilized to securely deliver authentication, ensure fair moderation, process purchases, and power our interactive community features.
            </p>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-lg font-medium text-foreground">Platform Communications</h2>
            <p className="text-sm leading-7 text-muted-foreground">
              Newsletter subscriptions and email lists are used exclusively for vital platform updates, highlighting top-voted ideas, and sharing relevant announcements. Members retain full control and may unsubscribe from non-critical emails at any time.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-medium text-foreground">Third-Party Processing</h2>
            <p className="text-sm leading-7 text-muted-foreground">
              Essential payment processing and identity verification flows may involve trusted, industry-standard third-party providers. We ensure that only the absolute minimum operational data necessary is ever exchanged.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-medium text-foreground">Data Rights & Export</h2>
            <p className="text-sm leading-7 text-muted-foreground">
              As an EcoSpark Hub member, you are entitled to request an export of your personal platform data. You may also request the permanent deletion of your account and associated identifying information by contacting support.
            </p>
          </section>
        </div>
      </div>
    </PageShell>
  );
}
