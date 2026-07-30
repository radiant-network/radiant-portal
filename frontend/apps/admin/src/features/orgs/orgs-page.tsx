import { useMemo, useState } from 'react';
import { PaginationState } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import DataTable from '@/components/base/data-table/data-table';
import { Button } from '@/components/base/shadcn/button';
import { Card, CardContent } from '@/components/base/shadcn/card';
import { useI18n } from '@/components/hooks/i18n';

import { MOCK_ORGS } from '../../mock/data';
import type { Organization } from '../../mock/types';

import type { OrgFormValues } from './org-form.types';
import OrgSheet from './org-sheet';
import OrgsTableFilters, { OrgsFilterState } from './orgs-table-filters';
import { getOrgsColumns, getOrgsColumnSettings } from './orgs-table-settings';

const EMPTY_FILTERS: OrgsFilterState = { search: '', categories: [] };

function matchesFilters(org: Organization, filters: OrgsFilterState): boolean {
  const query = filters.search.trim().toLowerCase();
  if (query) {
    // Search matches either the code or the name (both lowercased).
    const haystack = `${org.code} ${org.name}`.toLowerCase();
    if (!haystack.includes(query)) return false;
  }
  if (filters.categories.length && !filters.categories.includes(org.category_code)) {
    return false;
  }
  return true;
}

/** The Organizations section: count header + Add organization, the orgs table, and the Add/Edit sheet (mock data). */
export default function OrgsPage() {
  const { t } = useI18n();
  const [orgs, setOrgs] = useState<Organization[]>(MOCK_ORGS);
  const [filters, setFilters] = useState<OrgsFilterState>(EMPTY_FILTERS);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 20 });
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);

  // Default order: alphabetical by full name. The Name/Category headers can override with asc/desc.
  const rows = useMemo(
    () => orgs.filter(org => matchesFilters(org, filters)).sort((a, b) => a.name.localeCompare(b.name)),
    [orgs, filters],
  );

  const openAdd = () => {
    setEditingOrg(null);
    setSheetOpen(true);
  };
  const openEdit = (org: Organization) => {
    setEditingOrg(org);
    setSheetOpen(true);
  };

  const handleSave = (values: OrgFormValues, orgCode?: string) => {
    if (orgCode) {
      // Edit is name-only; code + category are immutable after creation.
      setOrgs(prev => prev.map(o => (o.code === orgCode ? { ...o, name: values.name } : o)));
      toast.success(t('admin.org.ok.updated'));
    } else {
      setOrgs(prev => [{ code: values.code, name: values.name, category_code: values.category_code }, ...prev]);
      toast.success(t('admin.org.ok.created'));
    }
  };

  const columns = useMemo(() => getOrgsColumns(t, { onEdit: openEdit }), [t]);
  const columnSettings = useMemo(() => getOrgsColumnSettings(t), [t]);

  const handleFilterChange = (next: OrgsFilterState) => {
    setFilters(next);
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  };

  return (
    <Card className="h-auto w-full">
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold">{t('admin.orgs.count', { total: orgs.length })}</h2>
            <p className="text-sm text-muted-foreground">{t('admin.orgs.subtitle')}</p>
          </div>
          <Button onClick={openAdd}>
            <Plus />
            {t('admin.orgs.add')}
          </Button>
        </div>

        <DataTable
          id="admin-orgs"
          columns={columns}
          data={rows}
          defaultColumnSettings={columnSettings}
          loadingStates={{ total: false, list: false }}
          total={rows.length}
          TableFilters={<OrgsTableFilters value={filters} onChange={handleFilterChange} />}
          pagination={{ type: 'locale', state: pagination, onPaginationChange: setPagination }}
          enableColumnOrdering
          enableFullscreen
          tableIndexResultPosition="bottom"
        />
      </CardContent>

      <OrgSheet open={sheetOpen} onOpenChange={setSheetOpen} org={editingOrg} orgs={orgs} onSave={handleSave} />
    </Card>
  );
}
