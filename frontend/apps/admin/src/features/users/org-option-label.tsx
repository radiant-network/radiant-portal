/**
 * Shared "CODE — Name" option label: uppercase code + muted name, matching the typography of the
 * Cases list "Prescribing Institution" filter. Used by both the Users org filter and the role-box
 * org picker so the two stay identical. Codes are stored lowercase and uppercased for display (CSS),
 * so the option key/value stays lowercase (filtering + selection) while only the display uppercases.
 */
export function OrgOptionLabel({ code, name }: { code: string; name: string }) {
  return (
    <span>
      <span className="uppercase">{code}</span>
      <span className="text-muted-foreground"> — {name}</span>
    </span>
  );
}
