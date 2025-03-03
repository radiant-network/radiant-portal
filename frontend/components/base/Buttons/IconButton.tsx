import React from "react";
import { VariantProps } from "tailwind-variants";
import { iconButtonVariants } from "./button.variants";
import { LucideProps } from "lucide-react";
import { Spinner } from "../spinner";

export type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof iconButtonVariants> & {
    icon: React.ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >;
    iconClassName?: string;
    loading?: boolean;
  };
const IconButton = ({
  icon: Icon,
  size,
  variant,
  className,
  iconClassName,
  loading = false,
  disabled = false,
  ...props
}: IconButtonProps) => {
  const style = iconButtonVariants({ size, variant });

  return (
    <button
      {...props}
      className={style.base({ className })}
      disabled={disabled || loading}
    >
      {loading ? (
        <Spinner className={style.icon({ className: iconClassName })} />
      ) : (
        <Icon className={style.icon({ className: iconClassName })} />
      )}
    </button>
  );
};

export default IconButton;
