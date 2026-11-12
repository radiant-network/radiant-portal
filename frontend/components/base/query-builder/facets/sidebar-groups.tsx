import { useState } from 'react';
import { BadgeCheckIcon, Droplet, PanelLeftClose, PanelLeftOpen, Star, UserRoundIcon } from 'lucide-react';
import { tv } from 'tailwind-variants';

import FrequencyIcon from '@/components/base/icons/frequency-icon';
import GeneIcon from '@/components/base/icons/gene-icon';
import OccurrenceIcon from '@/components/base/icons/occurrence-icon';
import PathogenicityIcon from '@/components/base/icons/pathogenicity-icon';
import VariantIcon from '@/components/base/icons/variant-icon';
import {
  FAVORITES_GROUP_KEY,
  useFacetFavorites,
} from '@/components/base/query-builder/facets/hooks/use-facet-favorites';
import { Button } from '@/components/base/shadcn/button';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from '@/components/base/shadcn/sidebar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import type { AggregationConfig } from '@/components/cores/applications-config';
import { useI18n } from '@/components/hooks/i18n';
import { cn } from '@/components/lib/utils';

// Icon mapping for different aggregation groups
const iconMap = {
  organization: Droplet,
  panel: Droplet,
  variant: VariantIcon,
  gene: GeneIcon,
  pathogenicity: PathogenicityIcon,
  frequency: FrequencyIcon,
  occurrence: OccurrenceIcon,
  parental_analysis: UserRoundIcon,
  metric_qc: BadgeCheckIcon,
};

const buttonVariants = tv({
  base: 'text-sidebar-foreground',
  variants: {
    selected: {
      true: 'bg-sidebar-accent text-sidebar-accent-foreground',
    },
  },
  defaultVariants: {
    selected: false,
  },
});
interface SidebarGroupsProps {
  onItemSelect?: (itemId: string | null) => void;
  selectedItemId?: string | null;
  aggregationGroups: AggregationConfig;
  brand?: boolean;
}

export function SidebarGroups({
  onItemSelect,
  aggregationGroups,
  selectedItemId: externalSelectedItemId,
  brand = true,
}: SidebarGroupsProps) {
  const { t } = useI18n();
  const { open, setOpen } = useSidebar();
  const favorites = useFacetFavorites();
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

  return (
    <Sidebar
      id="sidebar-facets"
      variant="sidebar"
      collapsible="icon"
      brand={brand}
      disableMobileSheet
      className={cn('static! flex flex-col w-full', brand && 'bg-primary dark:bg-secondary')}
    >
      <SidebarContent>
        <SidebarGroup>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                id="sidebar-group-toggle-sidebar"
                iconOnly
                aria-label={open ? t('a11y.facets_sidebar.collapse') : t('a11y.facets_sidebar.expand')}
                onClick={() => setOpen(!open)}
                className={buttonVariants({
                  className: 'mb-1 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                })}
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
          {favorites && (
            <>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    data-cy="sidebar-group-favorites"
                    className={buttonVariants({ selected: selectedItemId === FAVORITES_GROUP_KEY })}
                    onClick={() => handleItemClick(FAVORITES_GROUP_KEY)}
                    tooltip={t('query_filters.sidebar_panel.filters.favorites')}
                  >
                    <Star />
                    <span>{t('query_filters.sidebar_panel.filters.favorites')}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
              <SidebarSeparator className="mx-0 my-2" />
            </>
          )}
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
