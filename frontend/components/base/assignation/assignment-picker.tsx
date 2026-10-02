import { type ComponentProps, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';

import { Avatar as AssigneesAvatar } from '@/components/base/avatar/avatar';
import type { AvatarButtonVariant, AvatarUser } from '@/components/base/avatar/avatar.types';
import { getInitials, getUserColor } from '@/components/base/avatar/avatar.utils';
import { Avatar, AvatarFallback, type AvatarSize } from '@/components/base/shadcn/avatar';
import { Button } from '@/components/base/shadcn/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/base/shadcn/popover';
import { Spinner } from '@/components/base/shadcn/spinner';
import { useI18n } from '@/components/hooks/i18n';

export type AssignmentPickerProps = {
  candidates: AvatarUser[];
  assignees: AvatarUser[];
  canEdit?: boolean;
  currentUserId?: string;
  isLoading?: boolean;
  size?: AvatarSize;
  buttonVariant?: AvatarButtonVariant;
  align?: ComponentProps<typeof PopoverContent>['align'];
  onApply: (users: AvatarUser[]) => void;
  onOpenChange?: (open: boolean) => void;
};

function matchesSearch(user: AvatarUser, search: string) {
  const term = search.trim().toLowerCase();
  if (!term) return true;
  return [user.name, user.email].some(value => value?.toLowerCase().includes(term));
}

function haveSameUsers(a: AvatarUser[], b: AvatarUser[]) {
  return a.length === b.length && a.every(user => b.some(other => other.id === user.id));
}

function AssignmentPicker({
  candidates,
  assignees,
  canEdit = true,
  currentUserId,
  isLoading = false,
  size = 'md',
  buttonVariant,
  align = 'end',
  onApply,
  onOpenChange,
}: AssignmentPickerProps) {
  const { t } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<AvatarUser[]>(assignees);
  const [search, setSearch] = useState('');

  const results = candidates.filter(
    user => !draft.some(selected => selected.id === user.id) && matchesSearch(user, search),
  );
  const hasSelection = draft.length > 0;
  const isDirty = !haveSameUsers(draft, assignees);

  function handleOpenChange(next: boolean) {
    if (next) {
      setDraft(assignees);
      setSearch('');
    }
    setOpen(next);
    onOpenChange?.(next);
  }

  function handleSelect(user: AvatarUser) {
    setDraft([...draft, user]);
    setSearch('');
    inputRef.current?.focus();
  }

  function handleRemove(user: AvatarUser) {
    setDraft(draft.filter(selected => selected.id !== user.id));
    inputRef.current?.focus();
  }

  function handleRemoveAll() {
    setDraft([]);
    setSearch('');
    inputRef.current?.focus();
  }

  function handleApply() {
    onApply(draft);
    handleOpenChange(false);
  }

  function renderResults() {
    if (isLoading) {
      return (
        <div className="flex justify-center py-4">
          <Spinner />
        </div>
      );
    }

    if (results.length === 0) {
      return (
        <p className="py-4 text-center text-sm text-muted-foreground">
          {t('common.assignment_picker.no_members_found')}
        </p>
      );
    }

    return results.map(user => (
      <button
        key={user.id}
        type="button"
        onClick={() => handleSelect(user)}
        className="flex w-full items-start gap-2 rounded-sm px-2 py-1.5 text-left hover:bg-accent focus-visible:bg-accent focus-visible:outline-none"
      >
        <Avatar size="xs" className="shrink-0">
          <AvatarFallback color={getUserColor(user.id)}>{getInitials(user)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">
            {user.name}
            {user.id === currentUserId && (
              <span className="font-normal text-muted-foreground"> {t('common.assignment_picker.you')}</span>
            )}
          </p>
          {user.email && <p className="truncate text-xs text-muted-foreground">{user.email}</p>}
        </div>
      </button>
    ));
  }

  if (!canEdit) {
    return <AssigneesAvatar users={assignees} size={size} canAssign={false} buttonVariant={buttonVariant} />;
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={t('a11y.assignment_picker.open')}
          className="rounded-full focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <AssigneesAvatar users={assignees} size={size} showDetails={!open} buttonVariant={buttonVariant} />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align={align}
        className="w-72 p-0"
        onOpenAutoFocus={event => {
          event.preventDefault();
          inputRef.current?.focus();
        }}
      >
        <div className="border-b">
          {hasSelection && (
            <div className="flex flex-col gap-1 px-2 pt-2">
              {draft.map(user => (
                <div key={user.id} className="flex items-center gap-1.5 rounded-md bg-muted p-1 text-sm">
                  <Avatar size="2xs" className="shrink-0">
                    <AvatarFallback color={getUserColor(user.id)}>{getInitials(user)}</AvatarFallback>
                  </Avatar>
                  <span className="shrink-0 font-medium">{user.name}</span>
                  {user.email && <span className="min-w-0 truncate text-muted-foreground">{user.email}</span>}
                  <Button
                    variant="ghost"
                    size="3xs"
                    iconOnly
                    className="ml-auto shrink-0 text-muted-foreground"
                    aria-label={t('a11y.assignment_picker.remove_user', { name: user.name })}
                    onClick={() => handleRemove(user)}
                  >
                    <X />
                  </Button>
                </div>
              ))}
            </div>
          )}
          <div className="flex h-10 items-center gap-2 px-3">
            {!hasSelection && <Search className="size-4 shrink-0 text-muted-foreground" />}
            <input
              ref={inputRef}
              value={search}
              onChange={event => setSearch(event.target.value)}
              placeholder={hasSelection ? undefined : t('common.assignment_picker.search_placeholder')}
              aria-label={t('common.assignment_picker.search_placeholder')}
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          {hasSelection && (
            <div className="px-3 pb-2">
              <Button variant="link" size="xs" className="h-auto p-0" onClick={handleRemoveAll}>
                {t('common.assignment_picker.remove_all')}
              </Button>
            </div>
          )}
        </div>

        <div className="max-h-72 overflow-y-auto p-1">{renderResults()}</div>

        {isDirty && (
          <div className="flex justify-end border-t p-2">
            <Button size="sm" onClick={handleApply}>
              {t('common.assignment_picker.apply')}
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

export default AssignmentPicker;
