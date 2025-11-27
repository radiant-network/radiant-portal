import { Moon, Sun } from 'lucide-react';

import { Button } from '@/components/base/ui/button';

import { Theme, useTheme } from './theme-context';

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      iconOnly
      className={className}
      onClick={() => toggleTheme(theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT)}
    >
      <Sun className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
    </Button>
  );
}
