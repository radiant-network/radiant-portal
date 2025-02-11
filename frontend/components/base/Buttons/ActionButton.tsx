import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../DropdownMenu';
import { type VariantProps } from "class-variance-authority";

import { Button } from "./Button";
import { buttonVariants, buttonVariantsType } from "./";

import { cn } from '@/lib/utils';
// Define types for the props
interface Action {
  label: string;
  onClick: () => void;
}

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<buttonVariantsType> {
  children: React.ReactNode;
  actions: Action[];
  onDefaultAction: () => void;
  className?: string;
}

function ActionButton({ actions, className, children, onDefaultAction, size, variant }: ActionButtonProps) {
  return (
    <div className={ cn("flex items-center") }>
      {/* Default Action Button */}
      <Button
        className={ cn(buttonVariants({ variant, size, className }), 'px-2') }
        onClick={onDefaultAction}
      >
        {children}
      </Button>

      {/* Dropdown Button */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className={ cn(buttonVariants({ variant, size, className }), 'px-2') }>
            ...
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="bg-white">
          {actions.map((action, index) => (
            <DropdownMenuItem
              key={index}
              onClick={action.onClick}
            >
              {action.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default ActionButton;
