import CheckboxGroupField from '@/components/base/checkboxes/checkbox-group-field';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/base/shadcn/accordion';
import { Badge } from '@/components/base/shadcn/badge';
import { useI18n } from '@/components/hooks/i18n';

import { PERMISSIONS, RESERVED_ACTION_CODE, SCOPE_BADGE_VARIANT } from '../../mock/data';
import type { ActionScope } from '../../mock/types';

/** Network actions first, then Organization — matches the scope order used in the badges. */
const SCOPES: ActionScope[] = ['tenant', 'org'];

type PermissionPickerProps = {
  value: string[];
  onChange: (next: string[]) => void;
  /** Turns the groups red once a submit has revealed the "pick at least one" error. */
  invalid?: boolean;
};

/**
 * Permission (action) selector for the role sheet: the action catalog grouped into a scope
 * accordion (Network / Organization), each section a boxed checkbox list. The one reserved action
 * (`can_manage_user`) is excluded — it's bound to the Administrator role and can't be granted to a
 * custom role. Both sections are open by default. Names/descriptions come from `admin.permissions.*`.
 *
 * Note: the shared CheckboxGroupField's `box` variant hardcodes `p-4`; we override the vertical
 * padding to 10px (`!py-2.5`) per the design. A DS follow-up should expose a padding/size variant.
 */
export default function PermissionPicker({ value, onChange, invalid }: PermissionPickerProps) {
  const { t } = useI18n();
  const selectable = PERMISSIONS.filter(p => p.code !== RESERVED_ACTION_CODE);

  return (
    <Accordion type="multiple" defaultValue={SCOPES} className="flex flex-col">
      {SCOPES.map(scope => {
        const inScope = selectable.filter(p => p.scope === scope);
        if (!inScope.length) return null;

        const items = inScope.map(p => ({
          id: p.code,
          label: t(`admin.permissions.${p.code}.name`),
          description: t(`admin.permissions.${p.code}.description`),
        }));
        const scopeCodes = inScope.map(p => p.code);
        const selectedInScope = value.filter(code => scopeCodes.includes(code));

        return (
          <AccordionItem key={scope} value={scope} className="border-b-0">
            <AccordionTrigger chevronPlacement="right" className="py-3 hover:no-underline">
              <Badge variant={SCOPE_BADGE_VARIANT[scope]} className="font-normal">
                {t(`admin.roles.scope.${scope}`)}
              </Badge>
            </AccordionTrigger>
            <AccordionContent>
              <CheckboxGroupField
                box
                data={items}
                value={selectedInScope}
                aria-invalid={invalid ? true : undefined}
                onValueChange={nextInScope => {
                  // Merge this group's selection back with the other group's untouched selection.
                  const otherScopes = value.filter(code => !scopeCodes.includes(code));
                  onChange([...otherScopes, ...nextInScope]);
                }}
                // The box variant hardcodes p-4; override just the vertical padding to 10px on each
                // item's container (its direct child div). DS follow-up: expose a padding variant.
                className="[&_[data-slot=checkbox-group-item]>div]:!py-2.5"
              />
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
