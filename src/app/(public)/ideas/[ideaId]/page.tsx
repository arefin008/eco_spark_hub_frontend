import { IdeaDetailsClient } from "@/components/ecospark/idea-details-client";
import { PageShell } from "@/components/ecospark/page-shell";

export default async function IdeaDetailPage({
  params,
}: {
  params: Promise<{ ideaId: string }>;
}) {
  const { ideaId } = await params;

  return (
    <PageShell>
      <IdeaDetailsClient ideaId={ideaId} />
    </PageShell>
  );
}
