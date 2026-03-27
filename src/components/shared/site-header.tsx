import Link from "next/link";

import { publicNavLinks } from "@/lib/routes";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-4 lg:px-10">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          EcoSpark Hub
        </Link>
        <nav className="hidden items-center gap-5 text-sm text-muted-foreground md:flex">
          {publicNavLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
