import { Avatar, AvatarFallback } from '@/components/base/ui/avatar';
import MainNavbarItem from './main-navbar-item';
import { LogOutIcon, UserIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/base/ui/dropdown-menu';
import { tv, VariantProps } from 'tailwind-variants';
import { cn } from '@/components/lib/utils';
import { useI18n } from '@/components/hooks/i18n';

interface NavbarUserAvatarProps {
  userDetails: {
    name: string;
    email: string;
  };
  avatarClassName?: string;
  onLogoutClick: () => void;
}

function NavbarUserAvatar({ userDetails: { name, email }, onLogoutClick, avatarClassName }: NavbarUserAvatarProps) {
  const { t } = useI18n();

  return (
    <>
      <div className="block md:hidden">
        <AvatarUserDetails name={name} email={email} avatarClassName={avatarClassName} />
        {/* SJRA-389 <MainNavbarItem title="Profile" as="button" icon={<UserIcon />} className="w-full" onClick={() => {}} /> */}
        <MainNavbarItem title="Sign out" as="button" icon={<LogOutIcon />} className="w-full" onClick={onLogoutClick} />
      </div>
      <div className="hidden md:flex">
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <UserAvatar name={name} className={avatarClassName} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="py-1.5 px-2">
              <UserDetails name={name} email={email} size="sm" />
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {/* SJRA-389 <DropdownMenuItem>
                <UserIcon />{' '}
                {t('mainNavbar.userDetails.profile', {
                  defaultValue: 'Profile',
                })}
              </DropdownMenuItem> */}
              <DropdownMenuItem onClick={onLogoutClick}>
                <LogOutIcon />{' '}
                {t('mainNavbar.userDetails.signOut', {
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
  avatarClassName,
  detailsClassName,
}: {
  name: string;
  email: string;
  avatarClassName?: string;
  detailsClassName?: string;
  className?: string;
} & VariantProps<typeof userDetailsVariant>) {
  return (
    <div className={cn('flex items-center p-2 gap-3', className)}>
      <UserAvatar name={name} className={avatarClassName} />
      <UserDetails className={detailsClassName} name={name} email={email} size={size} />
    </div>
  );
}

function UserAvatar({ name, className }: { className?: string; name: string }) {
  return (
    <Avatar className={cn('size-9', className)}>
      <AvatarFallback className="bg-cyan/20 text-cyan-foreground text-sm">{getInitials(name)}</AvatarFallback>
    </Avatar>
  );
}

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/);

  if (words.length >= 2) {
    return words[0][0] + words[1][0];
  } else {
    return words[0].substring(0, 2);
  }
}

export default NavbarUserAvatar;
