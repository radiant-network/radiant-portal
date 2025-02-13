import { tv } from "tailwind-variants";
export { default as ActionButton } from "./ActionButton";
export { Button } from "./Button";

export const baseButtonVariants = tv({
  base: "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  variants: {
    variant: {
      default: "bg-default text-default-foreground",
      primary: "bg-primary text-primary-foreground",
      destructive:
        "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      outline:
        "border border-input bg-background hover:bg-accent text-accent-foreground hover:text-accent-foreground/90",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      ghost:
        "bg-accent text-accent-foreground hover:bg-primary hover:text-primary-foreground",
      link: "bg-transparent text-default-foreground underline underline-offset-4 hover:underline",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export const buttonVariants = tv({
  extend: baseButtonVariants,
  variants: {
    size: {
      default: "h-8 px-4 py-2",
      xs: "h-6 px-2",
      sm: "h-7 px-3",
      md: "h-8 px-4 py-2",
      lg: "h-11 px-10",
      icon: "h-10 w-10",
    },
  },
});

export const actionButtonVariants = tv({
  extend: baseButtonVariants,
  slots: {
    defaultButton: "",
    actionsButton: "",
  },
  variants: {
    size: {
      default: {
        defaultButton: "h-8 px-3",
        actionsButton: "h-8 px-2",
      },
      xs: {
        defaultButton: "h-6 px-2",
        actionsButton: "h-6 px-1",
      },
      sm: {
        defaultButton: "h-7 px-3",
        actionsButton: "h-7 px-2",
      },
      md: {
        defaultButton: "h-8 px-3",
        actionsButton: "h-8 px-2",
      },
      lg: {
        defaultButton: "h-10 px-4",
        actionsButton: "h-10 px-3",
      },
    },
  },
});
