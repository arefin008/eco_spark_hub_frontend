import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getCategoryBadgeClass(categoryName?: string) {
  switch (categoryName?.toLowerCase()) {
    case "energy":
      return "bg-accent/18 text-accent-foreground";
    case "waste":
      return "bg-primary/12 text-primary";
    case "transport":
    case "transportation":
      return "bg-secondary/15 text-secondary";
    case "water":
      return "bg-secondary/15 text-secondary";
    case "innovation":
      return "bg-secondary/15 text-secondary";
    default:
      return "bg-muted text-muted-foreground";
  }
}
