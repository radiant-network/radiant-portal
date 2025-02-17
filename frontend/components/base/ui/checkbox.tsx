import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { tv, VariantProps } from "tailwind-variants";

const checkboxVariants = tv({
  slots: {
    base: "peer shrink-0 rounded-sm border border-black ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground",
    icon: "",
  },
  variants: {
    size: {
      default: {
        base: "w-4 h-4",
        icon: "w-3 h-3",
      },
      xs: {
        base: "w-3.5 h-3.5",
        icon: "w-3 h-3",
      },
      sm: {
        base: "w-4 h-4",
        icon: "w-3 h-3",
      },
      md: {
        base: "w-5 h-5",
        icon: "w-4 h-4",
      },
      lg: {
        base: "w-6 h-6",
        icon: "w-5 h-5",
      },
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> &
    VariantProps<typeof checkboxVariants>
>(({ className, size, ...props }, ref) => {
  const style = checkboxVariants({ size });

  return (
    <CheckboxPrimitive.Root
      ref={ref}
      className={style.base({ className })}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn("flex items-center justify-center text-current")}
      >
        <Check className={style.icon()} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
