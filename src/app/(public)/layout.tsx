import { ChatWidget } from "@/components/ecospark/chat-widget";
import { SiteFooter } from "@/components/shared/site-footer";
import { SiteHeader } from "@/components/shared/site-header";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      {children}
      <ChatWidget />
      <SiteFooter />
    </div>
  );
}
