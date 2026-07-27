import { useI18n } from '@/components/hooks/i18n';

import type { AdminUser } from '../../../mock/types';

/**
 * Identity cell: full name (with a "(You)" suffix for the signed-in user) over a muted email.
 * The name is a button that opens the Edit sheet (a second entry point alongside the row pencil);
 * only the name is clickable so the email stays selectable. Falls back to plain text if no handler.
 */
export default function UserCell({ user, onEdit }: { user: AdminUser; onEdit?: () => void }) {
  const { t } = useI18n();
  const name = (
    <>
      {user.firstName} {user.lastName}
      {user.isCurrentUser && <span className="font-normal text-muted-foreground"> ({t('admin.users.you')})</span>}
    </>
  );
  return (
    <div className="flex flex-col">
      {onEdit ? (
        <button type="button" onClick={onEdit} className="w-fit cursor-pointer text-left font-medium text-foreground">
          {name}
        </button>
      ) : (
        <span className="font-medium text-foreground">{name}</span>
      )}
      <span className="text-sm text-muted-foreground">{user.email}</span>
    </div>
  );
}
