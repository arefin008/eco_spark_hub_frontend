import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "group/button relative isolate inline-flex shrink-0 items-center justify-center overflow-hidden rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-[box-shadow,background-color,color,border-color,filter] duration-250 outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 before:absolute before:inset-y-0 before:left-[-140%] before:z-0 before:w-[120%] before:skew-x-[-24deg] before:bg-white/18 before:opacity-0 before:transition-[left,opacity] before:duration-600 hover:before:left-[140%] hover:before:opacity-100 disabled:before:hidden [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_10px_24px_-16px_color-mix(in_srgb,var(--primary)_85%,black)] hover:bg-[color-mix(in_srgb,var(--primary)_90%,black)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_16px_34px_-20px_color-mix(in_srgb,var(--primary)_78%,black)]",
        outline:
          "border-border/90 bg-background/95 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] hover:border-primary/18 hover:bg-[color-mix(in_srgb,var(--background)_82%,var(--secondary)_18%)] hover:text-foreground hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_12px_26px_-22px_rgba(15,23,42,0.45)] aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_10px_24px_-16px_color-mix(in_srgb,var(--secondary)_85%,black)] hover:bg-[color-mix(in_srgb,var(--secondary)_90%,black)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_16px_34px_-20px_color-mix(in_srgb,var(--secondary)_78%,black)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted/80 hover:text-foreground hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] hover:bg-destructive/18 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.24),0_16px_34px_-24px_rgba(220,38,38,0.45)] focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);
