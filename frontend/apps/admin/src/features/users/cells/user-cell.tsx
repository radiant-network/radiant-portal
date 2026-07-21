import { useI18n } from '@/components/hooks/i18n';

import type { AdminUser } from '../../../mock/types';

/** Identity cell: full name (with a "(You)" suffix for the signed-in user) over a muted email. */
export default function UserCell({ user }: { user: AdminUser }) {
  const { t } = useI18n();
  return (
    <div className="flex flex-col">
      <span className="font-medium text-foreground">
        {user.firstName} {user.lastName}
        {user.isCurrentUser && <span className="font-normal text-muted-foreground"> ({t('admin.users.you')})</span>}
      </span>
      <span className="text-sm text-muted-foreground">{user.email}</span>
    </div>
  );
}
