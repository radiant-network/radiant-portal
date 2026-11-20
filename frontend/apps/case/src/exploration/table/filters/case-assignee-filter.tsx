import { useState } from 'react';
import { Check, Search, User } from 'lucide-react';

import type { CaseAssignee } from '@/api/api';
import { ASSIGNATION_CONSTANTS } from '@/components/base/assignation/constants';
import type { AvatarUser } from '@/components/base/avatar/avatar.types';
import { getInitials, getUserColor } from '@/components/base/avatar/avatar.utils';
import { Avatar, AvatarFallback } from '@/components/base/shadcn/avatar';
import { Badge } from '@/components/base/shadcn/badge';
import { Button } from '@/components/base/shadcn/button';
import { ButtonGroup } from '@/components/base/shadcn/button-group';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/base/shadcn/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/base/shadcn/popover';
import { Switch } from '@/components/base/shadcn/switch';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';
import { cn } from '@/components/lib/utils';

import { toAvatarUser } from '../../../components/case-assignment';

type CaseAssigneeFilterProps = {
  assignees: CaseAssignee[];
  selected: string[];
  currentUserId?: string;
  onSelect: (selected: string[]) => void;
};

function matchesSearch(_value: string, search: string, keywords?: string[]) {
  const term = search.trim().toLowerCase();
  return keywords?.some(keyword => keyword.toLowerCase().includes(term)) ? 1 : 0;
}

function CaseAssigneeFilter({ assignees, selected, currentUserId, onSelect }: CaseAssigneeFilterProps) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);

  const isAssignable = !!currentUserId && assignees.some(assignee => assignee.user_id === currentUserId);
  const isMyCases = isAssignable && selected.includes(currentUserId);
  const others = selected.filter(id => id !== currentUserId);
  const options: AvatarUser[] = [
    { id: ASSIGNATION_CONSTANTS.NOT_ASSIGNED_USER_ID, name: t('case_exploration.case.filters.unassigned') },
    ...assignees.filter(assignee => assignee.user_id !== currentUserId).map(toAvatarUser),
  ];
  const orderedOptions = [
    ...options.filter(option => pinnedIds.includes(option.id)),
    ...options.filter(option => !pinnedIds.includes(option.id)),
  ];

  function handleOpenChange(next: boolean) {
    if (next) setPinnedIds(others);
    setOpen(next);
  }

  function handleMyCasesChange(checked: boolean) {
    onSelect(checked && currentUserId ? [...selected, currentUserId] : others);
  }

  function handleToggle(id: string) {
    const nextOthers = others.includes(id) ? others.filter(other => other !== id) : [...others, id];
    onSelect(isMyCases && currentUserId ? [currentUserId, ...nextOthers] : nextOthers);
  }

  function handleClear() {
    onSelect(isMyCases && currentUserId ? [currentUserId] : []);
  }

  const countBadge = others.length > 0 && <Badge className="size-5 items-center justify-center">{others.length}</Badge>;

  const dropdown = (
    <PopoverContent align="start" className="w-72 p-0">
      <Command label={t('common.assignment_picker.search_placeholder')} filter={matchesSearch}>
        <CommandInput
          placeholder={t('common.assignment_picker.search_placeholder')}
          leftAddon={<Search size={16} className="text-muted-foreground mr-1" />}
          wrapperClassName="h-10 border-0 border-b rounded-none"
        />
        <CommandList className="max-h-60">
          <CommandEmpty>{t('common.assignment_picker.no_members_found')}</CommandEmpty>
          <CommandGroup>
            {orderedOptions.map(option => {
              const isSelected = others.includes(option.id);
              const isUnassigned = option.id === ASSIGNATION_CONSTANTS.NOT_ASSIGNED_USER_ID;
              return (
                <CommandItem
                  key={option.id}
                  value={option.id}
                  keywords={[option.name, option.email ?? '']}
                  onSelect={() => handleToggle(option.id)}
                  className={cn('items-start gap-2', { 'bg-accent': isSelected })}
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <Avatar size="xs" className="shrink-0 self-start">
                      <AvatarFallback color={isUnassigned ? 'neutral' : getUserColor(option.id)}>
                        {isUnassigned ? <User className="size-4 opacity-60" /> : getInitials(option)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className={cn('truncate text-sm font-medium', { 'text-muted-foreground': isUnassigned })}>
                        {option.name}
                      </p>
                      {option.email && <p className="truncate text-xs text-muted-foreground">{option.email}</p>}
                    </div>
                  </div>
                  {isSelected && <Check className="mt-0.5 size-4 shrink-0" />}
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </Command>
      {others.length > 0 && (
        <div className="border-t p-1">
          <Button variant="ghost" size="sm" className="w-full" onClick={handleClear}>
            {t('common.actions.clear')}
          </Button>
        </div>
      )}
    </PopoverContent>
  );

  if (!isAssignable) {
    return (
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="border-dashed">
            <User />
            <span>{t('case_exploration.case.filters.assignee_id')}</span>
            {countBadge}
          </Button>
        </PopoverTrigger>
        {dropdown}
      </Popover>
    );
  }

  return (
    <div className="flex items-center border-r pr-2">
      <ButtonGroup>
        <Tooltip>
          <TooltipTrigger asChild>
            <label className="flex h-8 cursor-pointer items-center gap-2 rounded-l-lg border border-input bg-background px-2.5 text-sm leading-none font-medium shadow-xs">
              <Switch size="sm" checked={isMyCases} onCheckedChange={handleMyCasesChange} />
              {t('case_exploration.case.filters.my_cases')}
            </label>
          </TooltipTrigger>
          <TooltipContent>{t('case_exploration.case.filters.my_cases_tooltip')}</TooltipContent>
        </Tooltip>
        <Popover open={open} onOpenChange={handleOpenChange}>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="px-4"
                  aria-label={t('case_exploration.case.filters.assignee_id_tooltip')}
                >
                  <User />
                  {countBadge}
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent>{t('case_exploration.case.filters.assignee_id_tooltip')}</TooltipContent>
          </Tooltip>
          {dropdown}
        </Popover>
      </ButtonGroup>
    </div>
  );
}

export default CaseAssigneeFilter;
