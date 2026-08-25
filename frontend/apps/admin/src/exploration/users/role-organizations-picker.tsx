import { useMemo } from 'react';
import { Search } from 'lucide-react';

import MultiSelector from '@/components/base/data-entry/multi-selector/multi-selector';
import type { MultiSelectorOption } from '@/components/base/data-entry/multi-selector/multi-selector.types';
import { Label } from '@/components/base/shadcn/label';
import SwitchField from '@/components/base/switches/switch-field';
import { useI18n } from '@/components/hooks/i18n';
import { useTenant } from '@/components/hooks/use-tenant';

import { useOrganizations } from '../organizations/use-organizations';

export const ALL_ORGANIZATIONS = '*';
export const NO_ORGANIZATIONS: string[] = [];

type RoleOrganizationsPickerProps = {
  value: string[];
  onChange: (orgCodes: string[]) => void;
  invalid?: boolean;
};

/** Organizations an org-scoped role applies at, revealed inside the role's box once it is checked. */
function RoleOrganizationsPicker({ value, onChange, invalid }: RoleOrganizationsPickerProps) {
  const { t } = useI18n();
  const { tenant } = useTenant();
  const { data: organizations, isLoading } = useOrganizations(tenant);

  const isAllOrganizations = value.includes(ALL_ORGANIZATIONS);
  const showSearchIcon = value.length === 0;

  const options = useMemo<MultiSelectorOption[]>(
    () =>
      (organizations ?? [])
        .filter(organization => !!organization.code)
        .map(organization => ({
          value: organization.code!,
          label: (
            <span>
              {organization.code}
              <span className="text-muted-foreground"> — {organization.name}</span>
            </span>
          ),
          badgeLabel: organization.code!,
          searchText: `${organization.code} ${organization.name ?? ''}`.toLowerCase(),
        })),
    [organizations],
  );

  /** Search on orgs code and name */
  const filterOption = (value: string, search: string) => {
    const option = options.find(candidate => candidate.value === value);
    return String(option?.searchText ?? value).includes(search.toLowerCase()) ? 1 : 0;
  };

  return (
    <div className="flex flex-col gap-2 border-t border-border pt-3">
      <Label className="flex items-center gap-1">
        {t('admin.users.roles.organizations')}
        <span className="text-destructive">*</span>
      </Label>
      {!isAllOrganizations && (
        <div className="relative">
          {showSearchIcon && (
            <Search className="pointer-events-none absolute left-3 top-2.5 z-10 size-4 text-muted-foreground" />
          )}
          <MultiSelector
            options={options}
            defaultOptions={options}
            value={value}
            onChange={onChange}
            disabled={isLoading}
            openOnFocus
            hidePlaceholderWhenSelected
            multiline
            placeholder={t('admin.users.roles.organizations_placeholder')}
            commandProps={{ filter: filterOption }}
            inputProps={showSearchIcon ? { className: 'pl-8' } : undefined}
            aria-invalid={invalid}
            emptyIndicator={
              <p className="p-2 text-center text-sm text-muted-foreground">{t('common.table.no_result')}</p>
            }
          />
        </div>
      )}
      <SwitchField
        label={t('admin.users.roles.all_organizations')}
        checked={isAllOrganizations}
        onCheckedChange={checked => onChange(checked ? [ALL_ORGANIZATIONS] : NO_ORGANIZATIONS)}
      />
      {invalid && (
        <p className="text-xs font-medium text-destructive">{t('admin.users.roles.errors.organizations_required')}</p>
      )}
    </div>
  );
}
export default RoleOrganizationsPicker;
