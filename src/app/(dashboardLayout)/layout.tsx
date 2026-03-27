import Link from "next/link";

import { dashboardSidebarLinks } from "@/lib/routes";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[270px_1fr]">
      <aside className="border-b border-border bg-sidebar px-6 py-8 lg:border-r lg:border-b-0">
        <div className="space-y-8">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
              EcoSpark Hub
            </p>
            <h2 className="mt-2 text-2xl font-semibold">Dashboard</h2>
          </div>
          <nav className="flex flex-col gap-3 text-sm">
            {dashboardSidebarLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl px-3 py-2 text-muted-foreground transition hover:bg-secondary hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>
      <div className="min-w-0 bg-background">{children}</div>
    </div>
  );
}
