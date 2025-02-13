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
      <button
        onClick={onDefaultAction}
        className={cn(style.base(), "rounded-r-none")}
      >
        {children}
      </button>

      {/* Dropdown Button */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className={cn(style.base(), style.actionsButton())}>
            <MoreHorizontalIcon />
          </button>
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
