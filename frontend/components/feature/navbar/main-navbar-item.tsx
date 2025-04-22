import React, { useState } from 'react';
import useIsMobile from '@/components/hooks/use-is-mobile';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/base/ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/base/ui/dropdown-menu';
import MainNavbarButton, { MainNavbarButtonProps } from './main-navbar-button';
import { ButtonProps } from '@/components/base/ui/button';
import { cn } from '@/components/lib/utils';

export interface MainNavbarItemProps extends Omit<ButtonProps, 'children'> {
  title: string;
  icon: React.ReactNode;
  active?: boolean;
  subItems?: ((MainNavbarButtonProps & { separator?: never }) | { separator: true })[];
  responsive?: boolean;
}

function MainNavbarItem({ responsive = true, icon, title, subItems, ...props }: MainNavbarItemProps) {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  if (isMobile && responsive) {
    return subItems?.length ? (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <MainNavbarButton
            title={title}
            icon={icon}
            data-state={isOpen ? 'open' : 'closed'}
            rightIcon={<ChevronRight className="transition-transform duration-200 group-data-[state=open]:rotate-90" />}
            {...props}
            className={cn('group', props.className)}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="flex flex-col ml-5">
          {subItems
            .filter(item => !item.separator)
            .map(item => (
              <MainNavbarButton key={item.title} {...item} />
            ))}
        </CollapsibleContent>
      </Collapsible>
    ) : (
      <MainNavbarButton title={title} icon={icon} {...props} />
    );
  }

  const navbarButton = <MainNavbarButton icon={icon} title={title} {...props} />;

  if (subItems?.length) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none" asChild>
          {navbarButton}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuGroup>
            {subItems.map(item =>
              item.separator ? (
                <DropdownMenuSeparator key="separator" />
              ) : (
                <DropdownMenuItem key={item.title}>
                  {item.icon} {item.title}
                </DropdownMenuItem>
              ),
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return navbarButton;
}

export default MainNavbarItem;
