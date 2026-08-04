import { Copy, EllipsisVertical, Eye, Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/base/shadcn/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/base/shadcn/dropdown-menu';
import { useI18n } from '@/components/hooks/i18n';

import type { Role } from '../../../mock/types';

type RoleActionsCellProps = {
  role: Role;
  /** Opens the edit sheet (custom roles only). */
  onOpen: (role: Role) => void;
  /** Opens the read-only permissions dialog (View action for default roles). */
  onViewPermissions: (role: Role) => void;
  onDuplicate: (role: Role) => void;
  onDelete: (role: Role) => void;
};

/**
 * Row actions. Administrator = a single View (eye) button opening the permissions dialog — it's
 * neither editable nor duplicable. Other default roles = a kebab menu with View + Duplicate (View
 * opens the dialog). Custom roles = Edit (opens the sheet) + Duplicate + Delete.
 * Mirrors the repo kebab pattern (apps/case .../cells/case-actions-menu-cell.tsx).
 */
export default function RoleActionsCell({
  role,
  onOpen,
  onViewPermissions,
  onDuplicate,
  onDelete,
}: RoleActionsCellProps) {
  const { t } = useI18n();

  // Administrator: no menu, just View (reserved role, can't be edited or duplicated).
  if (role.code === 'tenant_admin') {
    return (
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          iconOnly
          aria-label={t('admin.roles_page.view_aria')}
          onClick={() => onViewPermissions(role)}
        >
          <Eye />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" iconOnly aria-label={t('admin.roles_page.actions_aria')}>
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {role.isDefault ? (
            <>
              <DropdownMenuItem onClick={() => onViewPermissions(role)}>
                <Eye />
                {t('admin.roles_page.action.view')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDuplicate(role)}>
                <Copy />
                {t('admin.roles_page.action.duplicate')}
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem onClick={() => onOpen(role)}>
                <Pencil />
                {t('admin.roles_page.action.edit')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDuplicate(role)}>
                <Copy />
                {t('admin.roles_page.action.duplicate')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(role)} className="text-destructive focus:text-destructive">
                <Trash2 />
                {t('admin.roles_page.action.delete')}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
