import type { Organization } from '../../../mock/types';

/**
 * Organization identity cell: the CODE on top (uppercased for display — codes are stored lowercase)
 * over the muted full name. The code is a button that opens the Edit sheet (a second entry point
 * alongside the row pencil); falls back to plain text if no handler. Mirrors the Members `UserCell`.
 */
export default function OrgCell({ org, onEdit }: { org: Organization; onEdit?: () => void }) {
  return (
    <div className="flex flex-col">
      {onEdit ? (
        <button
          type="button"
          onClick={onEdit}
          className="w-fit cursor-pointer text-left font-medium uppercase text-foreground"
        >
          {org.code}
        </button>
      ) : (
        <span className="font-medium uppercase text-foreground">{org.code}</span>
      )}
      <span className="text-sm text-muted-foreground">{org.name}</span>
    </div>
  );
}
