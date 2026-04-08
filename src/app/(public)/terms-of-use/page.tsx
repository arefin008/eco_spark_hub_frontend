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
        <div className="mt-10 grid gap-8 pb-4 md:grid-cols-2">
          <section className="space-y-3">
            <h2 className="text-lg font-medium text-foreground">Community Standards</h2>
            <p className="text-sm leading-7 text-muted-foreground">
              EcoSpark Hub is designed to be a constructive space for responsible idea sharing and discussion. Members are expected to participate respectfully and adhere to all applicable laws regarding intellectual property and digital conduct.
            </p>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-lg font-medium text-foreground">Content Ownership & Accuracy</h2>
            <p className="text-sm leading-7 text-muted-foreground">
              Members are solely responsible for the originality, legality, and factual accuracy of their submitted sustainability ideas. Our administrative team reserves the right to review, reject, or permanently remove submissions that violate platform standards.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-medium text-foreground">Premium Implementation Data</h2>
            <p className="text-sm leading-7 text-muted-foreground">
              Premium implementation resources and high-tier content may require payment prior to access. The unauthorized copying, automated scraping, resale, or mass distributions of our protected premium content is strictly prohibited.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-medium text-foreground">Account Termination</h2>
            <p className="text-sm leading-7 text-muted-foreground">
              EcoSpark Hub reserves the right to suspend or terminate accounts that repeatedly violate these terms, engage in fraudulent transactions, or deliberately undermine the integrity of our community voting and moderation systems.
            </p>
          </section>
        </div>
      </div>
    </PageShell>
  );
}
