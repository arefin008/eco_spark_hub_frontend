import type { Metadata } from "next";

import { PageShell } from "@/components/ecospark/page-shell";

export const metadata: Metadata = {
  title: "Terms of Use | EcoSpark Hub",
  description: "Terms governing access and participation on EcoSpark Hub.",
};

export default function TermsOfUsePage() {
  return (
    <PageShell className="space-y-8 py-14 md:py-16">
      <div className="rounded-[32px] border border-border/80 bg-card p-6 shadow-sm md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary">Terms of use</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
          Platform participation terms
        </h1>
        <div className="mt-6 space-y-5 text-sm leading-7 text-muted-foreground">
          <p>
            EcoSpark Hub is intended for responsible idea sharing, constructive discussion, and
            lawful use of premium content and payment features.
          </p>
          <p>
            Members are responsible for the originality, legality, and accuracy of their submitted
            ideas. Admins may review, reject, or remove submissions that violate platform standards.
          </p>
          <p>
            Premium implementation content may require payment before access. Unauthorized copying,
            resale, or misuse of protected content is prohibited.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
