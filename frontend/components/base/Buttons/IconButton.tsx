import React from "react";
import { VariantProps } from "tailwind-variants";
import { iconButtonVariants } from "./button.variants";
import { LucideProps } from "lucide-react";

export type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof iconButtonVariants> & {
    icon: React.ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >;
    iconClassName?: string;
  };

const IconButton = ({
  icon: Icon,
  size,
  variant,
  className,
  iconClassName,
  ...props
}: IconButtonProps) => {
  const style = iconButtonVariants({ size, variant });

  return (
    <button {...props} className={style.base({ className })}>
      <Icon className={style.icon({ className: iconClassName })} />
    </button>
  );
};

export default IconButton;
