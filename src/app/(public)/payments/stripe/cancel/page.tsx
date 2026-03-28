import { PaymentReturnCard } from "@/components/ecospark/payment-return-card";

export default async function StripeCancelPage({
  searchParams,
}: {
  searchParams: Promise<{ purchaseId?: string }>;
}) {
  const { purchaseId } = await searchParams;

  return <PaymentReturnCard purchaseId={purchaseId} status="cancel" />;
}
