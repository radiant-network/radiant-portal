import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/base/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/base/ui/dropdown-menu';
import useIsMobile from '@/components/hooks/use-is-mobile';
import { cn } from '@/components/lib/utils';

import MainNavbarLink, { MainNavbarLinkProps } from './main-navbar-button';

export interface MainNavbarItemProps extends Omit<MainNavbarLinkProps, 'children'> {
  title: string;
  icon: React.ReactNode;
  active?: boolean;
  subItems?: ((MainNavbarLinkProps & { separator?: never }) | { separator: true })[];
  responsive?: boolean;
  onClick?: () => void;
}

function MainNavbarItem({ responsive = true, icon, title, subItems, ...props }: MainNavbarItemProps) {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  if (isMobile && responsive) {
    return subItems?.length ? (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <MainNavbarLink
            title={title}
            icon={icon}
            data-state={isOpen ? 'open' : 'closed'}
            rightIcon={<ChevronRight className="transition-transform duration-200 group-data-[state=open]:rotate-90" />}
            {...(props as any)}
            className={cn('group', props.className)}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="flex flex-col ml-5">
          {subItems
            .filter(item => !item.separator)
            .map(item => (
              <MainNavbarLink key={item.title} {...item} />
            ))}
        </CollapsibleContent>
      </Collapsible>
    ) : (
      <MainNavbarLink title={title} icon={icon} {...(props as any)} />
    );
  }

  const navbarButton = <MainNavbarLink icon={icon} title={title} {...(props as any)} />;

  if (subItems?.length) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none" asChild>
          {navbarButton}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuGroup>{subItems.map(renderDropdownItem)}</DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return navbarButton;
}

const renderDropdownItem = (item: NonNullable<MainNavbarItemProps['subItems']>[0]) => {
  if (item.separator) {
    return <DropdownMenuSeparator key="separator" />;
  }

  const menuItem = (
    <DropdownMenuItem key={item.title}>
      {item.icon} {item.title}
    </DropdownMenuItem>
  );

  if (item.as === 'a') {
    return (
      <a key={item.title} href={item.href} target="_blank" rel="noopener noreferrer">
        {menuItem}
      </a>
    );
  }

  if (item.as === 'button') {
    return (
      <DropdownMenuItem key={item.title} {...item}>
        {item.icon} {item.title}
      </DropdownMenuItem>
    );
  }

  if (item.as === Link && item.to) {
    return (
      <Link key={item.title} to={item.to}>
        {menuItem}
      </Link>
    );
  }

  return menuItem;
};

export default MainNavbarItem;
