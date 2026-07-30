import { Search } from 'lucide-react';

import MultiSelector from '@/components/base/data-entry/multi-selector/multi-selector';
import { Switch } from '@/components/base/shadcn/switch';
import { useI18n } from '@/components/hooks/i18n';
import { cn } from '@/components/lib/utils';

import { MOCK_ORGS } from '../../mock/data';

import { OrgOptionLabel } from './org-option-label';

/** Sentinel org code meaning "all organizations". */
const ALL_ORGS = '*';

type OrgAssignmentFieldProps = {
  /** Selected org codes. `['*']` = all organizations. */
  value: string[];
  onChange: (orgCodes: string[]) => void;
  /** Required-org error state (red border + message). Set once the user has attempted to submit. */
  error?: boolean;
};

/** Inline org picker for an org-scoped role: a searchable multi-select + an "All organizations" toggle. */
export default function OrgAssignmentField({ value, onChange, error = false }: OrgAssignmentFieldProps) {
  const { t } = useI18n();
  const allSelected = value.includes(ALL_ORGS);

  const options = MOCK_ORGS.map(org => ({
    value: org.code,
    label: <OrgOptionLabel code={org.code} name={org.name} />,
    badgeLabel: org.code.toUpperCase(),
  }));

  // Show the leading search icon only in the empty state (once orgs are chosen, chips fill the row).
  const showSearchIcon = value.length === 0;

  return (
    <div className="flex flex-col gap-2 border-t border-border pt-3">
      <span className="flex items-center gap-1 text-sm font-medium text-foreground">
        {t('admin.user.orgs_label')}
        <span className="text-destructive">*</span>
      </span>
      {!allSelected && (
        <div className="relative">
          {showSearchIcon && (
            <Search className="pointer-events-none absolute left-3 top-2.5 z-10 size-4 text-muted-foreground" />
          )}
          <MultiSelector
            value={value}
            onChange={onChange}
            defaultOptions={options}
            placeholder={t('admin.user.orgs_placeholder')}
            openOnFocus
            hidePlaceholderWhenSelected
            wrapBadges
            className={cn(error && 'border-destructive')}
            inputProps={showSearchIcon ? { className: 'pl-8' } : undefined}
          />
        </div>
      )}
      <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
        <Switch
          size="sm"
          checked={allSelected}
          onCheckedChange={checked => onChange(checked === true ? [ALL_ORGS] : [])}
        />
        {t('admin.user.all_orgs')}
      </label>
      {error && <p className="text-sm text-destructive">{t('admin.user.err.org_required')}</p>}
    </div>
  );
}
