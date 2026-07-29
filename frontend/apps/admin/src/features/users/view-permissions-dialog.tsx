import { Badge } from '@/components/base/shadcn/badge';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/base/shadcn/dialog';
import { useI18n } from '@/components/hooks/i18n';

import { PERMISSIONS_BY_CODE, SCOPE_BADGE_VARIANT } from '../../mock/data';
import type { Role } from '../../mock/types';

type ViewPermissionsDialogProps = {
  role: Role | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/** Small modal listing a role's permissions (backend "actions") with each one's description. */
export default function ViewPermissionsDialog({ role, open, onOpenChange }: ViewPermissionsDialogProps) {
  const { t } = useI18n();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="sm" variant="stickyHeader">
        <DialogHeader>
          <DialogTitle>{role ? t(`admin.roles.${role.code}.name`) : ''}</DialogTitle>
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
      </DialogContent>
    </Dialog>
  );
}
