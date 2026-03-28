import { IdeaBrowser } from "@/components/ecospark/idea-browser";
import { PageShell } from "@/components/ecospark/page-shell";
import { SectionHeading } from "@/components/ecospark/section-heading";

export default function IdeasPage() {
  return (
    <PageShell>
      <SectionHeading
        eyebrow="All ideas"
        title="Browse approved free and paid sustainability ideas"
        description="Search by keyword, filter by category, and sort by recent activity, votes, or discussion volume."
      />
      <IdeaBrowser />
    </PageShell>
  );
}
