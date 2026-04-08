import type { Metadata } from "next";

import { NewsletterForm } from "@/components/ecospark/newsletter-form";
import { PageShell } from "@/components/ecospark/page-shell";

export const metadata: Metadata = {
  title: "Newsletter | EcoSpark Hub",
  description: "Subscribe for EcoSpark Hub updates, top-voted ideas, and important announcements.",
};

export default function NewsletterPage() {
  return (
    <PageShell className="space-y-8 py-14 md:py-16">
      <section className="ui-surface grid gap-6 p-6 lg:grid-cols-[1fr_0.95fr] lg:p-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary">Newsletter</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
            Get platform updates without digging through the dashboard.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
            Subscribe to receive newly approved ideas, notable community traction, and important
            platform announcements.
          </p>
        </div>

        <div className="ui-surface-subtle p-5">
          <NewsletterForm />
        </div>
      </section>
    </PageShell>
  );
}
