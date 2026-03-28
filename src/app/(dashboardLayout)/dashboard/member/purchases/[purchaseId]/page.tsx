import { PurchaseStatusCard } from "@/components/ecospark/purchase-status-card";

export default async function PurchaseStatusPage({
  params,
}: {
  params: Promise<{ purchaseId: string }>;
}) {
  const { purchaseId } = await params;

  return <PurchaseStatusCard purchaseId={purchaseId} />;
}
