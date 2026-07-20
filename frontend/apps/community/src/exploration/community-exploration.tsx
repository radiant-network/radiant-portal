import { useCallback, useEffect, useMemo, useState } from 'react';
import { ListFilter } from 'lucide-react';

import TableIndexResult from '@/components/base/data-table/data-table-index-result';
import HeaderNavigation from '@/components/base/navigation/header-navigation';
import { Button } from '@/components/base/shadcn/button';
import { Card, CardContent } from '@/components/base/shadcn/card';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/base/shadcn/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/base/shadcn/select';
import { useI18n } from '@/components/hooks/i18n';

import { fetchCommunityMembers } from './mocks/community-members-mock';
import type { CommunitySort } from './mocks/community-model';
import CommunityFilters from './community-filters';
import CommunityMemberCard from './community-member-card';
import CommunitySearch from './community-search';

const PAGE_SIZE = 25;
const MAX_VISIBLE_PAGES = 5;
const SEARCH_DEBOUNCE_MS = 250;

/**
 * Builds the page-number sequence, collapsing gaps into `'ellipsis'` markers.
 * TODO(design-system): this windowing logic is duplicated with the Storybook
 * `InteractivePagination` story — extract into a shared `getPaginationRange`
 * helper (or a controlled `PaginationNav` wrapper) so all consumers reuse it.
 */
function getPageNumbers(currentPage: number, totalPages: number): Array<number | 'ellipsis'> {
  if (totalPages <= MAX_VISIBLE_PAGES) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: Array<number | 'ellipsis'> = [1];
  if (currentPage > 3) {
    pages.push('ellipsis');
  }
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  if (currentPage < totalPages - 2) {
    pages.push('ellipsis');
  }
  pages.push(totalPages);
  return pages;
}

export default function CommunityExploration() {
  const { t } = useI18n();
  // `searchInput` mirrors the field live; `search` is the debounced term used to filter + highlight.
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [roles, setRoles] = useState<string[]>([]);
  const [areasOfInterest, setAreasOfInterest] = useState<string[]>([]);
  const [sort, setSort] = useState<CommunitySort>('newest');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);

  const { members, total } = useMemo(
    () => fetchCommunityMembers({ search, roles, areasOfInterest, sort, pageIndex, pageSize: PAGE_SIZE }),
    [search, roles, areasOfInterest, sort, pageIndex],
  );

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / PAGE_SIZE)), [total]);

  // Debounce the live input into the committed search term (also resets to page 1).
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPageIndex(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Any change to the result set sends the user back to the first page.
  const handleRolesChange = (value: string[]) => {
    setPageIndex(1);
    setRoles(value);
  };
  const handleAreasOfInterestChange = (value: string[]) => {
    setPageIndex(1);
    setAreasOfInterest(value);
  };
  const handleSortChange = (value: string) => {
    setPageIndex(1);
    setSort(value as CommunitySort);
  };
  const handleClearFilters = () => {
    setPageIndex(1);
    setRoles([]);
    setAreasOfInterest([]);
  };
  const goToPage = useCallback((page: number) => setPageIndex(Math.max(1, Math.min(page, totalPages))), [totalPages]);

  const pageNumbers = getPageNumbers(pageIndex, totalPages);

  return (
    <>
      <HeaderNavigation title={t('community.title')} variant="info" isLoading={false} />
      <main className="bg-muted min-h-0 flex-1 overflow-auto p-6">
        <Card className="w-full">
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-end gap-3">
                <div className="w-96 space-y-1">
                  <label className="text-muted-foreground text-sm">{t('community.search.label')}</label>
                  <CommunitySearch
                    value={searchInput}
                    onValueChange={setSearchInput}
                    placeholder={t('community.search.placeholder')}
                  />
                </div>
                <Button variant="outline" size="sm" onClick={() => setFiltersOpen(open => !open)}>
                  <ListFilter />
                  {t('community.filters.toggle')}
                </Button>
                <Select value={sort} onValueChange={handleSortChange}>
                  <SelectTrigger size="sm" className="w-44">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">{t('community.sort.newest')}</SelectItem>
                    <SelectItem value="oldest">{t('community.sort.oldest')}</SelectItem>
                    <SelectItem value="name">{t('community.sort.name')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {filtersOpen && (
                <CommunityFilters
                  roles={roles}
                  onRolesChange={handleRolesChange}
                  areasOfInterest={areasOfInterest}
                  onAreasOfInterestChange={handleAreasOfInterestChange}
                  onClear={handleClearFilters}
                />
              )}
            </div>

            <div className="space-y-4">
              <TableIndexResult total={total} pageIndex={pageIndex} pageSize={PAGE_SIZE} loading={false} />

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {members.map(member => (
                  <CommunityMemberCard key={member.id} member={member} highlight={search} />
                ))}
              </div>

              {totalPages > 1 && (
                <Pagination className="ml-auto mr-0 w-fit justify-end">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious onClick={() => goToPage(pageIndex - 1)} />
                    </PaginationItem>
                    {pageNumbers.map((page, index) =>
                      page === 'ellipsis' ? (
                        <PaginationItem key={`ellipsis-${index}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      ) : (
                        <PaginationItem key={page}>
                          <PaginationLink isActive={page === pageIndex} onClick={() => goToPage(page)}>
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ),
                    )}
                    <PaginationItem>
                      <PaginationNext onClick={() => goToPage(pageIndex + 1)} />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
