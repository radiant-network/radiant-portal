import { LogOutIcon } from 'lucide-react';
import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

import { getInitials } from '@/components/base/avatar';
import type { AvatarSize } from '@/components/base/shadcn/avatar';
import { Avatar, AvatarFallback } from '@/components/base/shadcn/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/base/shadcn/dropdown-menu';
import { useI18n } from '@/components/hooks/i18n';
import { cn } from '@/components/lib/utils';

import MainNavbarItem from './main-navbar-item';

interface NavbarUserAvatarProps {
  userDetails: {
    name: string;
    email: string;
  };
  avatarSize?: AvatarSize;
  onLogoutClick: () => void;
}

function NavbarUserAvatar({ userDetails: { name, email }, onLogoutClick, avatarSize }: NavbarUserAvatarProps) {
  const { t } = useI18n();

  return (
    <>
      <div className="block md:hidden">
        <AvatarUserDetails name={name} email={email} avatarSize={avatarSize} />
        {/* SJRA-389 <MainNavbarItem title="Profile" as="button" icon={<UserIcon />} className="w-full" onClick={() => {}} /> */}
        <MainNavbarItem title="Sign out" as="button" icon={<LogOutIcon />} className="w-full" onClick={onLogoutClick} />
      </div>
      <div className="hidden md:flex">
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <NavbarAvatar name={name} size={avatarSize} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="py-1.5 px-2">
              <UserDetails name={name} email={email} size="sm" />
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {/* SJRA-389 <DropdownMenuItem>
                <UserIcon />{' '}
                {t('main_navbar.user_details.profile', {
                  defaultValue: 'Profile',
                })}
              </DropdownMenuItem> */}
              <DropdownMenuItem onClick={onLogoutClick}>
                <LogOutIcon />{' '}
                {t('main_navbar.user_details.sign_out', {
                  defaultValue: 'Sign out',
                })}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}

const userDetailsVariant = tv({
  slots: {
    name: 'font-medium whitespace-nowrap text-ellipsis overflow-hidden',
    email: 'text-sm text-muted-foreground whitespace-nowrap text-ellipsis overflow-hidden',
  },
  variants: {
    size: {
      default: {},
      sm: {
        name: 'text-sm',
        email: 'text-xs',
      },
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export function UserDetails({
  name,
  email,
  size,
  className,
}: { name: string; email: string; className?: string } & VariantProps<typeof userDetailsVariant>) {
  const styles = userDetailsVariant({ size });

  return (
    <div className={cn('overflow-hidden', className)}>
      <div className={styles.name()}>{name}</div>
      <div className={styles.email()}>{email}</div>
    </div>
  );
}

export function AvatarUserDetails({
  name,
  email,
  size,
  className,
  avatarSize,
  detailsClassName,
}: {
  name: string;
  email: string;
  avatarSize?: AvatarSize;
  detailsClassName?: string;
  className?: string;
} & VariantProps<typeof userDetailsVariant>) {
  return (
    <div className={cn('flex items-center p-2 gap-3', className)}>
      <NavbarAvatar name={name} size={avatarSize} />
      <UserDetails className={detailsClassName} name={name} email={email} size={size} />
    </div>
  );
}

function NavbarAvatar({ name, size = 'lg' }: { name?: string; size?: AvatarSize }) {
  return (
    <Avatar size={size}>
      <AvatarFallback>{getInitials({ name: name ?? '' })}</AvatarFallback>
    </Avatar>
  );
}

export default NavbarUserAvatar;
