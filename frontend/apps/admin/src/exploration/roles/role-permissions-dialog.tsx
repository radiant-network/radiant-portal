import { LockIcon } from 'lucide-react';

import type { RoleResult } from '@/api/api';
import { Button } from '@/components/base/shadcn/button';
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/base/shadcn/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';

import { ScopeBadge } from './role-scope-badges';

type RolePermissionsDialogProps = {
  role?: RoleResult;
  onOpenChange: (open: boolean) => void;
};

/** Read-only view of what a role grants, composed from the actions the role carries. */
function RolePermissionsDialog({ role, onOpenChange }: RolePermissionsDialogProps) {
  const { t } = useI18n();

  const actions = role?.actions ?? [];

  return (
    <Dialog open={!!role} onOpenChange={onOpenChange}>
      <DialogContent variant="stickyBoth" size="sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {role?.name}
            {role?.is_default && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex">
                    <LockIcon className="size-4 text-muted-foreground" />
                  </span>
                </TooltipTrigger>
                <TooltipContent>{t('admin.users.roles.permissions.locked')}</TooltipContent>
              </Tooltip>
            )}
          </DialogTitle>
          <DialogDescription>{t('admin.users.roles.permissions.description')}</DialogDescription>
        </DialogHeader>
        <DialogBody className="space-y-4 overflow-y-auto">
          {actions.length === 0 && (
            <p className="text-sm text-muted-foreground">{t('admin.users.roles.permissions.empty')}</p>
          )}
          {actions.map(action => (
            <div key={action.code} className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium">{action.name}</span>
                <ScopeBadge scope={action.scope} />
              </div>
              {action.description && <p className="text-sm text-muted-foreground">{action.description}</p>}
            </div>
          ))}
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{t('common.close')}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export default RolePermissionsDialog;
