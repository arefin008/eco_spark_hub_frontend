import { ChatWidget } from "@/components/ecospark/chat-widget";
import { SiteFooter } from "@/components/shared/site-footer";
import { SiteHeader } from "@/components/shared/site-header";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <ChatWidget />
      <SiteFooter />
    </div>
  );
}
