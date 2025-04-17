import { Moon, Sun } from 'lucide-react';

import { Button } from '@/components/base/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/base/ui/dropdown-menu';
import { Theme, useTheme } from './theme-context';

export function ThemeToggle({ className }: { className?: string }) {
  const { toggleTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" iconOnly size="xs" className={className}>
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => toggleTheme(Theme.LIGHT)}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => toggleTheme(Theme.DARK)}>Dark</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
