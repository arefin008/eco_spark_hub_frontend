import { Globe2, Leaf, ShieldCheck } from "lucide-react";

import { PageShell } from "@/components/ecospark/page-shell";
import { SectionHeading } from "@/components/ecospark/section-heading";

const aboutCards = [
  {
    icon: Leaf,
    title: "Community-first",
    description:
      "Members can publish environmental ideas, gather support, and refine proposals before review.",
  },
  {
    icon: ShieldCheck,
    title: "Transparent moderation",
    description:
      "Admins review each idea and keep quality visible through explicit statuses and feedback.",
  },
  {
    icon: Globe2,
    title: "Scalable impact",
    description:
      "Paid idea access supports deeper implementation guides without hiding public-good discovery.",
  },
];

export default function AboutUsPage() {
  return (
    <PageShell className="space-y-10">
      <SectionHeading
        eyebrow="About us"
        title="A civic platform designed to move sustainability ideas from discussion to implementation"
        description="EcoSpark Hub gives members a structured place to publish, validate, moderate, and fund environmental projects."
      />

      <div className="grid gap-4 md:grid-cols-3">
        {aboutCards.map((item) => (
          <article key={item.title} className="rounded-[28px] border border-border/80 bg-card p-6">
            <item.icon className="size-5 text-primary" />
            <h2 className="mt-5 text-2xl font-semibold">{item.title}</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.description}</p>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
