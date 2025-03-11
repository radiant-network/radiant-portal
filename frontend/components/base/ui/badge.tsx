import * as React from "react";
import { tv, VariantProps } from "tailwind-variants";

const badgeVariants = tv({
  base: "inline-flex items-center rounded-sm border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring",
  variants: {
    variant: {
      default:
        "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
      secondary:
        "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
      destructive:
        "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
      outline: "text-foreground",
    },
    size: {
      default: "text-xs py-1 px-2",
      xs: "text-xs py-1 px-2",
      sm: "text-sm py-1 px-2",
      md: "text-sm py-1 px-3",
      lg: "text-base py-1 px-4",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={badgeVariants({ variant, size, className })} {...props} />
  );
}

export { Badge, badgeVariants };
