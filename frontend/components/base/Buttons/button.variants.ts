import { tv } from "tailwind-variants";

export const baseButtonVariants = tv({
  slots: {
    base: "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  },
  variants: {
    variant: {
      default: "bg-transparent text-default-foreground hover:bg-gray/90",
      primary: "bg-primary text-primary-foreground hover:bg-primary/90",
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
  },
});

export const buttonVariants = tv({
  extend: baseButtonVariants,
  variants: {
    size: {
      default: "h-8 px-4 py-2 [&_svg]:size-4",
      xs: "h-6 px-2 text-sm [&_svg]:size-3",
      sm: "h-7 px-3 [&_svg]:size-4",
      md: "h-8 px-4 py-2 [&_svg]:size-4",
      lg: "h-9 px-5 text-lg [&_svg]:size-5",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export const actionButtonVariants = tv({
  extend: baseButtonVariants,
  slots: {
    base: "",
    actionsButton: "rounded-l-none",
  },
  variants: {
    size: {
      default: {
        base: "h-8 px-3 [&_svg]:size-5",
        actionsButton: "h-8 px-2 [&_svg]:size-5",
      },
      xs: {
        base: "h-6 px-2 text-sm [&_svg]:size-3",
        actionsButton: "h-6 px-1.5 [&_svg]:size-3",
      },
      sm: {
        base: "h-7 px-3 [&_svg]:size-4",
        actionsButton: "h-7 px-2 [&_svg]:size-4",
      },
      md: {
        base: "h-8 px-3 [&_svg]:size-5",
        actionsButton: "h-8 px-2 [&_svg]:size-5",
      },
      lg: {
        base: "h-9 px-4 text-lg [&_svg]:size-6",
        actionsButton: "h-9 px-2 [&_svg]:size-6",
      },
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export const iconButtonVariants = tv({
  extend: baseButtonVariants,
  slots: {
    base: "px-0",
    icon: "",
  },
  variants: {
    size: {
      default: {
        base: "size-8",
        icon: "size-4",
      },
      xs: {
        base: "size-6",
        icon: "size-4",
      },
      sm: {
        base: "size-7",
        icon: "size-4",
      },
      md: {
        base: "size-8",
        icon: "size-5",
      },
      lg: {
        base: "size-11",
        icon: "size-6",
      },
    },
  },
  defaultVariants: {
    size: "default",
  },
});
