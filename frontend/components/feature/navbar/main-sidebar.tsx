import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
  useSidebar,
} from '@/components/base/ui/sidebar';
import { BaseMainNavbarProps } from './main-navbar-types';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/base/ui/collapsible';
import { ChevronRight, CircleAlert, LogOutIcon, PanelLeftClose, PanelLeftOpen, UserIcon } from 'lucide-react';
import { AvatarUserDetails } from './main-navbar-user-avatar';
import { Button } from '@/components/base/ui/button';
import BetaFeaturesSheet from '../admin/beta-features-sheet';
import { useI18n } from '@/components/hooks/i18n';
import { cn } from '@/components/lib/utils';

type MainSidebarProps = BaseMainNavbarProps & {
  betaSuperMode: boolean;
  onBetaSuperModeChange: (value: boolean) => void;
  placement?: 'left' | 'right';
};

function MainSidebar({
  logo,
  links,
  actions,
  userDetails,
  onLogoutClick,
  betaSuperMode,
  onBetaSuperModeChange,
  placement,
}: MainSidebarProps) {
  const { t } = useI18n();
  const { open, toggleSidebar } = useSidebar();

  return (
    <Sidebar side={placement} collapsible="icon">
      <SidebarHeader>
        <div
          className="h-12 [&_img]:w-auto [&_img]:h-full"
          onClick={e => {
            if (e.metaKey && e.altKey) {
              onBetaSuperModeChange(!betaSuperMode);
            }
          }}
        >
          {logo}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {links.map(item => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton tooltip={item.title} asChild variant="default">
                  <div>
                    {item.icon}
                    <span>{item.title}</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
            {betaSuperMode && (
              <BetaFeaturesSheet
                trigger={
                  <SidebarMenuItem key="beta">
                    <SidebarMenuButton
                      tooltip="Beta"
                      asChild
                      variant="default"
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:text-destructive-foreground active:bg-destructive/90 active:text-destructive-foreground"
                    >
                      <div>
                        <CircleAlert />
                        <span>Beta</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                }
              />
            )}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarMenu>
            {actions.map(item =>
              item.subItems?.length ? (
                <Collapsible key={item.title} asChild defaultOpen={item.active} className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item.title}>
                        {item.icon && item.icon}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.subItems.map((subItem, index) =>
                          subItem.separator ? (
                            <SidebarSeparator key={`separator-${item.title}${index}`} />
                          ) : (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton>
                                {subItem.icon && subItem.icon}
                                <span>{subItem.title}</span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ),
                        )}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild variant="default" tooltip={item.title}>
                    <div>
                      {item.icon}
                      <span>{item.title}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ),
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <AvatarUserDetails
          {...userDetails}
          className="group-data-[collapsible=icon]:!p-0"
          avatarClassName="size-8"
          detailsClassName="group-data-[collapsible=icon]:!hidden"
        />
        <SidebarMenu>
          <SidebarMenuItem key="profile">
            <SidebarMenuButton asChild variant="default" tooltip="Profile">
              <div>
                <UserIcon />
                <span>
                  {t('mainNavbar.userDetails.profile', {
                    defaultValue: 'Profile',
                  })}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem key="logout">
            <SidebarMenuButton asChild variant="default" tooltip="Sign out" onClick={onLogoutClick}>
              <div>
                <LogOutIcon />
                <span>
                  {t('mainNavbar.userDetails.signOut', {
                    defaultValue: 'Sign out',
                  })}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div
          className={cn('flex', {
            'justify-end': placement === 'left',
            'justify-start': placement === 'right',
          })}
        >
          <Button iconOnly onClick={() => toggleSidebar()} size="sm" variant="ghost">
            {open ? <PanelLeftClose /> : <PanelLeftOpen />}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export default MainSidebar;
