import React from "react";
import { VariantProps } from "tailwind-variants";
import { iconButtonVariants } from "./button.variants";
import { LucideProps } from "lucide-react";
import { cn } from "@/components/lib/utils";

export type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof iconButtonVariants> & {
    icon: React.ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >;
  };

const IconButton = ({
  icon: Icon,
  size,
  variant,
  ...props
}: IconButtonProps) => {
  const style = iconButtonVariants({ size, variant });

  return (
    <button {...props} className={cn(style.base(), props.className)}>
      <Icon className={style.icon()} />
    </button>
  );
};

export default IconButton;
