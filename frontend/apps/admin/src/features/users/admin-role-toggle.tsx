import { Button } from '@/components/base/shadcn/button';
import { Checkbox } from '@/components/base/shadcn/checkbox';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/base/shadcn/hover-card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';
import { cn } from '@/components/lib/utils';

import type { Role } from '../../mock/types';

type AdminRoleToggleProps = {
  /** The Administrator (`tenant_admin`) role — supplies the label + description. */
  role: Role;
  checked: boolean;
  onToggle: (checked: boolean) => void;
  onViewPermissions: () => void;
  /** Locked (self-guard: you can't grant yourself Administrator). Still removable if already held. */
  disabled?: boolean;
  /** Tooltip text shown when locked, mirroring the disabled Delete button. */
  disabledReason?: string;
};

/**
 * The Administrator grant, promoted out of the additive roles list onto the sheet's identity row
 * (Edit) or as a standalone row under Member details (Add). Rendered as a compact bordered "box"
 * (mirrors the role-box style): a whole-box-clickable checkbox + label. Hovering the box opens a
 * card (to its left) with the role description + a "View permissions" link (same dialog as the role
 * boxes). When self-guard-locked, the box is disabled with an explanatory tooltip instead.
 */
export default function AdminRoleToggle({
  role,
  checked,
  onToggle,
  onViewPermissions,
  disabled = false,
  disabledReason,
}: AdminRoleToggleProps) {
  const { t } = useI18n();

  const box = (
    <label
      htmlFor={`role-${role.code}`}
      className={cn(
        'inline-flex items-center gap-2 rounded-md border px-4 py-3',
        checked ? 'border-primary bg-accent' : 'border-input',
        disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
      )}
    >
      <Checkbox
        id={`role-${role.code}`}
        checked={checked}
        disabled={disabled}
        onCheckedChange={value => onToggle(value === true)}
      />
      <span className="text-sm font-medium text-foreground">{t(`admin.roles.${role.code}.name`)}</span>
    </label>
  );

  // Locked (self-guard): a tooltip explains why. Wrap in a focusable span — a disabled control emits
  // no hover/focus events for Radix to catch. Skip the description hover card so popups don't stack.
  if (disabled && disabledReason) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span tabIndex={0} className="inline-flex">
              {box}
            </span>
          </TooltipTrigger>
          <TooltipContent>{disabledReason}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Enabled: hovering the box opens the description + "View permissions" card, to the LEFT of the box.
  return (
    <HoverCard openDelay={150} closeDelay={100}>
      <HoverCardTrigger asChild>{box}</HoverCardTrigger>
      <HoverCardContent side="left" align="start" className="w-72">
        <p className="text-sm text-muted-foreground">
          {t('admin.user.admin_access')} (
          <Button
            type="button"
            variant="link"
            className="h-auto p-0 align-baseline text-sm"
            onClick={onViewPermissions}
          >
            {t('admin.user.admin_access_link')}
          </Button>
          )
        </p>
      </HoverCardContent>
    </HoverCard>
  );
}
