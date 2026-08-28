import { useMemo } from 'react';

import type { ActionResponse } from '@/api/api';
import CheckboxGroupField, { type CheckboxGroupFieldItem } from '@/components/base/checkboxes/checkbox-group-field';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/base/shadcn/accordion';
import { Skeleton } from '@/components/base/shadcn/skeleton';

import { ScopeBadge } from './role-scope-badges';
import { ACTION_SCOPES, useGrantableActions } from './use-grantable-actions';

type RolePermissionPickerProps = {
  value: string[];
  onChange: (actionCodes: string[]) => void;
  invalid?: boolean;
};

function RolePermissionPicker({ value, onChange, invalid }: RolePermissionPickerProps) {
  const { data: actions, isLoading } = useGrantableActions();

  const groups = useMemo(
    () =>
      ACTION_SCOPES.map(scope => ({
        scope,
        actions: (actions ?? []).filter(action => action.scope === scope),
      })).filter(group => group.actions.length > 0),
    [actions],
  );

  if (isLoading) {
    return <Skeleton className="h-40 w-full" />;
  }

  const toItems = (scopeActions: ActionResponse[]): CheckboxGroupFieldItem[] =>
    scopeActions.map(action => ({
      id: action.code!,
      label: action.name ?? action.code!,
      description: action.description,
    }));

  const handleGroupChange = (scopeActions: ActionResponse[], selected: string[]) => {
    const groupCodes = scopeActions.map(action => action.code);
    onChange([...value.filter(code => !groupCodes.includes(code)), ...selected]);
  };

  return (
    <Accordion type="multiple" defaultValue={[...ACTION_SCOPES]}>
      {groups.map(group => (
        <AccordionItem key={group.scope} value={group.scope} className="border-b-0">
          <AccordionTrigger chevronPlacement="right" className="py-2">
            <ScopeBadge scope={group.scope} />
          </AccordionTrigger>
          <AccordionContent>
            <CheckboxGroupField
              box
              className="gap-3"
              aria-invalid={invalid}
              data={toItems(group.actions)}
              value={value.filter(code => group.actions.some(action => action.code === code))}
              onValueChange={selected => handleGroupChange(group.actions, selected)}
            />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
export default RolePermissionPicker;
