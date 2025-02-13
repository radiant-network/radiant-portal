import { VariantProps } from "tailwind-variants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../DropdownMenu";
import { Button } from "./Button";
import { cn } from "@/lib/utils";
import { MoreHorizontalIcon } from "lucide-react";
import { actionButtonVariants } from "./button.variants";

// Define types for the props
interface Action {
  label: string;
  onClick: () => void;
}

interface ActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof actionButtonVariants> {
  children: React.ReactNode;
  actions: Action[];
  onDefaultAction: () => void;
  className?: string;
}

function ActionButton({
  actions,
  className,
  children,
  onDefaultAction,
  size,
  variant,
}: ActionButtonProps) {
  const style = actionButtonVariants({ size, variant });

  return (
    <div className={cn("flex items-center", className)}>
      {/* Default Action Button */}
      <Button
        size={size}
        variant={variant}
        onClick={onDefaultAction}
        className={cn("rounded-r-none", style.defaultButton())}
      >
        {children}
      </Button>

      {/* Dropdown Button */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size={size}
            variant={variant}
            className={cn("rounded-l-none", style.actionsButton())}
          >
            <MoreHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="bg-white">
          {actions.map((action, index) => (
            <DropdownMenuItem key={index} onClick={action.onClick}>
              {action.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default ActionButton;
