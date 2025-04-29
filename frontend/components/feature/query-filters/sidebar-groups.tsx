import { Droplet } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
  SidebarTrigger,
} from '@/components/base/ui/sidebar';
import { useI18n } from '@/components/hooks/i18n';
import { useConfig } from '@/components/model/applications-config';
import { useState } from 'react';
import VariantIcon from '@/components/base/icons/variant-icon';
import GeneIcon from '@/components/base/icons/gene-icon';
import FrequencyIcon from '@/components/base/icons/frequency-icon';
import PathogenicityIcon from '@/components/base/icons/pathogenicity-icon';
import OccurenceIcon from '@/components/base/icons/occurence-icon';
import { tv } from 'tailwind-variants';

// Icon mapping for different aggregation groups
const iconMap = {
  organization: Droplet,
  variant: VariantIcon,
  gene: GeneIcon,
  pathogenicity: PathogenicityIcon,
  frequency: FrequencyIcon,
  occurrence: OccurenceIcon,
};

const buttonVariants = tv({
  base: 'h-8 text-md text-secondary dark:text-foreground px-2',
  variants: {
    open: {
      true: 'w-full',
      false: 'w-8 justify-center',
    },
    selected: {
      true: 'bg-accent text-accent-foreground',
    },
    smallOpen: {
      true: 'ml-1',
      false: 'ml-0',
    },
  },
  defaultVariants: {
    selected: false,
    smallCollapsed: false,
  },
});
interface SidebarGroupsProps {
  onItemSelect?: (itemId: string | null) => void;
  selectedItemId?: string | null;
}

export function SidebarGroups({ onItemSelect, selectedItemId: externalSelectedItemId }: SidebarGroupsProps) {
  const { t } = useI18n();
  const config = useConfig();
  const { open } = useSidebar();
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
      className={'!static flex flex-col w-full bg-primary dark:bg-secondary h-[100%]'}
    >
      <SidebarContent className="[&_svg]:!size-6">
        <SidebarGroup className="flex-1 pr-3">
          <SidebarMenu>
            <SidebarTrigger className={buttonVariants({ open: false, selected: false, smallOpen: open })} />
            {Object.entries(aggregationGroups).map(([id]) => {
              const Icon = iconMap[id as keyof typeof iconMap];
              return (
                <SidebarMenuItem key={id}>
                  <SidebarMenuButton
                    asChild
                    className={buttonVariants({ open, selected: selectedItemId === id })}
                    onClick={e => {
                      e.preventDefault();
                      handleItemClick(id);
                    }}
                  >
                    <div>
                      <Icon />
                      {open && (
                        <span className="ml-2">
                          {t(`queryFilters.sidebarPanel.filters.${id}`, id.charAt(0).toUpperCase() + id.slice(1))}
                        </span>
                      )}
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
