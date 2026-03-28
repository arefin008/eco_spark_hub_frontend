import { cn } from "@/lib/utils";

export function PageShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main className={cn("mx-auto w-full max-w-7xl px-5 py-10 md:px-8 lg:px-10", className)}>
      {children}
    </main>
  );
}
