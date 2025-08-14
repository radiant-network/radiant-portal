import { useState } from 'react';
import { Droplet, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { tv } from 'tailwind-variants';

import FrequencyIcon from '@/components/base/icons/frequency-icon';
import GeneIcon from '@/components/base/icons/gene-icon';
import OccurrenceIcon from '@/components/base/icons/occurrence-icon';
import PathogenicityIcon from '@/components/base/icons/pathogenicity-icon';
import VariantIcon from '@/components/base/icons/variant-icon';
import { Button } from '@/components/base/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/base/ui/sidebar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';
import { useI18n } from '@/components/hooks/i18n';
import { useConfig } from '@/components/model/applications-config';

// Icon mapping for different aggregation groups
const iconMap = {
  organization: Droplet,
  variant: VariantIcon,
  gene: GeneIcon,
  pathogenicity: PathogenicityIcon,
  frequency: FrequencyIcon,
  occurrence: OccurrenceIcon,
};

const buttonVariants = tv({
  base: 'text-secondary dark:text-foreground',
  variants: {
    selected: {
      true: 'bg-accent text-accent-foreground',
    },
  },
  defaultVariants: {
    selected: false,
  },
});
interface SidebarGroupsProps {
  onItemSelect?: (itemId: string | null) => void;
  selectedItemId?: string | null;
}

export function SidebarGroups({ onItemSelect, selectedItemId: externalSelectedItemId }: SidebarGroupsProps) {
  const { t } = useI18n();
  const config = useConfig();
  const { open, toggleSidebar } = useSidebar();
  const [internalSelectedItemId, setInternalSelectedItemId] = useState<string | null>(null);

  // Use external state if provided, otherwise use internal state
  const selectedItemId = externalSelectedItemId !== undefined ? externalSelectedItemId : internalSelectedItemId;

  const handleItemClick = (itemId: string) => {
    const newSelectedId = selectedItemId === itemId ? null : itemId;
    setInternalSelectedItemId(newSelectedId);
    if (onItemSelect) {
      onItemSelect(newSelectedId);
    }
  };

  // Get aggregation groups from config
  const aggregationGroups = config.variant_exploration.aggregations;

  return (
    <Sidebar
      variant="sidebar"
      collapsible="icon"
      className={'static! flex flex-col w-full bg-primary dark:bg-secondary '}
    >
      <SidebarContent>
        <SidebarGroup>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                iconOnly
                onClick={() => toggleSidebar()}
                className={buttonVariants({ className: 'mb-1' })}
                size="sm"
                variant="ghost"
              >
                {open ? <PanelLeftClose /> : <PanelLeftOpen />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" align="center">
              {open ? t('query_filters.sidebar_panel.collapse') : t('query_filters.sidebar_panel.expand')}
            </TooltipContent>
          </Tooltip>
          <SidebarMenu>
            {Object.entries(aggregationGroups).map(([id]) => {
              const Icon = iconMap[id as keyof typeof iconMap];
              const label = t(`query_filters.sidebar_panel.filters.${id}`);
              return (
                <SidebarMenuItem key={id}>
                  <SidebarMenuButton
                    asChild
                    className={buttonVariants({ selected: selectedItemId === id })}
                    onClick={e => {
                      e.preventDefault();
                      handleItemClick(id);
                    }}
                    tooltip={label}
                  >
                    <div>
                      <Icon />
                      <span>{label}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
