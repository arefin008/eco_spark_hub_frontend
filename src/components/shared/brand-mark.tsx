import { Leaf } from "lucide-react";

import { cn } from "@/lib/utils";

export function BrandMark({
  className,
  glyphClassName,
}: {
  className?: string;
  glyphClassName?: string;
}) {
  return (
    <span
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--primary),var(--secondary))] text-white shadow-sm",
        className,
      )}
      aria-hidden="true"
    >
      <Leaf className={cn("size-5", glyphClassName)} />
    </span>
  );
}
