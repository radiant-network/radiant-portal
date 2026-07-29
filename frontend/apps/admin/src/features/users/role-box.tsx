import { Badge } from '@/components/base/shadcn/badge';
import { Button } from '@/components/base/shadcn/button';
import { Checkbox } from '@/components/base/shadcn/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';
import { cn } from '@/components/lib/utils';

import { getRoleScopes, roleIsOrgScoped, SCOPE_BADGE_VARIANT } from '../../mock/data';
import type { Role } from '../../mock/types';

import OrgAssignmentField from './org-assignment-field';

type RoleBoxProps = {
  role: Role;
  checked: boolean;
  orgCodes: string[];
  onToggle: (checked: boolean) => void;
  onOrgCodesChange: (orgCodes: string[]) => void;
  onViewPermissions: () => void;
  /** Non-toggleable (e.g. self-guard: you can't grant yourself this role). View permissions stays live. */
  disabled?: boolean;
  /** Tooltip text explaining why the box is locked; shown on hover/focus when `disabled`. */
  disabledReason?: string;
};

/**
 * A single selectable role "box" (mirrors the design-system radio-group box pattern; the shared
 * checkbox-box component isn't in Storybook yet — FE dev ticket). Checkbox + name + description +
 * "View permissions" + scope badge(s); expands to an inline org picker when an org-scoped role is checked.
 */
export default function RoleBox({
  role,
  checked,
  orgCodes,
  onToggle,
  onOrgCodesChange,
  onViewPermissions,
  disabled = false,
  disabledReason,
}: RoleBoxProps) {
  const { t } = useI18n();
  const scopes = getRoleScopes(role);
  const showOrgPicker = checked && roleIsOrgScoped(role);

  const box = (
    <div
      className={cn('rounded-md border border-input', checked && 'border-primary bg-accent', disabled && 'opacity-60')}
    >
      {/*
       * The whole box is one clickable <label> tied to the checkbox (mirrors the radio-group box pattern).
       * Interactive descendants (the "View permissions" button) don't toggle the checkbox — per the HTML
       * spec a label does nothing for clicks on its interactive content. The org picker sits OUTSIDE the
       * label so clicking within it never toggles the role off. When `disabled`, the checkbox is locked
       * (label clicks are no-ops on a disabled control) but "View permissions" stays live — inspecting a
       * role is read-only and harmless.
       */}
      <label
        htmlFor={`role-${role.code}`}
        className={cn('flex items-start gap-3 p-4', disabled ? 'cursor-not-allowed' : 'cursor-pointer')}
      >
        <Checkbox
          id={`role-${role.code}`}
          checked={checked}
          disabled={disabled}
          onCheckedChange={value => onToggle(value === true)}
          className="mt-0.5"
        />
        {/* Left column (name + description) grows; scope badge(s) stay top-right so a long description
            wraps within its own column instead of crowding the badges. */}
        <div className="flex flex-1 items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-foreground">{role.label}</span>
            <p className="text-sm text-muted-foreground">
              {t(`admin.roles.${role.code}.description`)}{' '}
              <Button
                type="button"
                variant="link"
                className="h-auto p-0 align-baseline text-sm"
                onClick={onViewPermissions}
              >
                {t('admin.user.view_permissions')}
              </Button>
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {scopes.map(scope => (
              <Badge key={scope} variant={SCOPE_BADGE_VARIANT[scope]} className="font-normal">
                {t(`admin.roles.scope.${scope}`)}
              </Badge>
            ))}
          </div>
        </div>
      </label>
      {/* Org picker, indented to align under the role name (label padding + checkbox width + gap). */}
      {showOrgPicker && (
        <div className="pb-4 pl-11 pr-4">
          <OrgAssignmentField value={orgCodes} onChange={onOrgCodesChange} />
        </div>
      )}
    </div>
  );

  // Locked (self-guard): explain why on hover/focus via a tooltip over the whole faded box, mirroring
  // the disabled Delete button. "View permissions" inside stays clickable.
  if (disabled && disabledReason) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{box}</TooltipTrigger>
          <TooltipContent>{disabledReason}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return box;
}
