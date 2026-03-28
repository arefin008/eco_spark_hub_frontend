import { NewsletterUnsubscribeCard } from "@/components/ecospark/newsletter-unsubscribe-card";

export default async function NewsletterUnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return <NewsletterUnsubscribeCard initialEmail={email} />;
}
