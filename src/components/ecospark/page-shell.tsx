import { cn } from "@/lib/utils";

export function PageShell({
  children,
  className,
  ...props
}: React.ComponentProps<"main">) {
  return (
    <main
      {...props}
      className={cn(
        "ui-shell",
        className,
      )}
    >
      {children}
    </main>
  );
}
