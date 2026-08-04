import { Lock } from 'lucide-react';

import { Badge } from '@/components/base/shadcn/badge';
import { Button } from '@/components/base/shadcn/button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/base/shadcn/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';

import { PERMISSIONS_BY_CODE, roleName, SCOPE_BADGE_VARIANT } from '../mock/data';
import type { Role } from '../mock/types';

type ViewPermissionsDialogProps = {
  role: Role | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /**
   * Opt-in Edit affordance (Roles page only). When provided and the role is custom, the footer
   * shows an Edit button that hands off to the edit sheet. Omitted elsewhere (e.g. the Member
   * sheet), the dialog stays strictly view-only. Never shown for default roles.
   */
  onEdit?: (role: Role) => void;
};

/**
 * Read-only modal listing a role's permissions (backend "actions") with each one's scope and
 * description. Shared by the Roles page and the Member sheet. Default roles are locked (a footer
 * note explains why); custom roles can offer an Edit hand-off via `onEdit`.
 */
export default function ViewPermissionsDialog({ role, open, onOpenChange, onEdit }: ViewPermissionsDialogProps) {
  const { t } = useI18n();

  const canEdit = !!role && !role.isDefault && !!onEdit;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="sm" variant="stickyBoth">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-1.5">
            {role ? roleName(role, t) : ''}
            {/* Default roles are locked; the lock icon carries a tooltip explaining why. */}
            {role?.isDefault && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    {/* 16px icon in a 24×24 hover target. Not focusable: the dialog autofocuses on
                        open, which would pop the tooltip — hover-only keeps it quiet. */}
                    <span className="inline-flex size-6 items-center justify-center opacity-50">
                      <Lock className="size-4" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>{t('admin.roles_page.lock_tooltip')}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </DialogTitle>
          <DialogDescription>{t('admin.user.permissions_modal_subtitle')}</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <ul className="flex flex-col gap-4">
            {role?.permissions.map(code => {
              const scope = PERMISSIONS_BY_CODE[code]?.scope;
              return (
                <li key={code} className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{t(`admin.permissions.${code}.name`)}</span>
                    {scope && (
                      <Badge variant={SCOPE_BADGE_VARIANT[scope]} className="font-normal">
                        {t(`admin.roles.scope.${scope}`)}
                      </Badge>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">{t(`admin.permissions.${code}.description`)}</span>
                </li>
              );
            })}
          </ul>
        </DialogBody>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {t('admin.role.close')}
          </Button>
          {/* Custom roles (Roles page only) get an Edit hand-off to the sheet. */}
          {canEdit && (
            <Button type="button" onClick={() => onEdit!(role!)}>
              {t('admin.roles_page.action.edit')}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
