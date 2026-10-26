import { useState } from 'react';
import parse from 'html-react-parser';
import { MapPin, Search } from 'lucide-react';
import useSWR from 'swr';

import { AutoComplete, type Option } from '@/components/base/data-entry/auto-complete';
import { useI18n } from '@/components/hooks/i18n';
import { useTenant } from '@/components/hooks/use-tenant';
import { genesApi } from '@/utils/api';

import { type Genome, parseLocus } from './libs/genome';

const MIN_SEARCH_LENGTH = 2;
const LOCUS_PREFIX = 'locus:';
const GENE_PREFIX = 'gene:';

type SearchOption = Option & { display: string; filter: string };

type CNVProfileSearchProps = {
  genome: Genome;
  onSearch: (query: string) => Promise<boolean>;
};

function CNVProfileSearch({ genome, onSearch }: CNVProfileSearchProps) {
  const { t } = useI18n();
  const { tenant } = useTenant();
  const [searchValue, setSearchValue] = useState('');
  const [notFound, setNotFound] = useState(false);

  const locus = parseLocus(genome, searchValue);
  const { data: genes = [], isLoading } = useSWR(
    searchValue.length >= MIN_SEARCH_LENGTH && !locus ? ['cnv-profile-gene-search', tenant, searchValue] : null,
    async () => (await genesApi.geneAutoComplete(tenant, searchValue)).data,
    { revalidateOnFocus: false, keepPreviousData: true },
  );

  const options: SearchOption[] = locus
    ? [
        {
          value: `${LOCUS_PREFIX}${searchValue}`,
          label: (
            <span className="flex items-center gap-2">
              <MapPin className="size-4 text-muted-foreground" />
              {t('case_entity.variants.cnv_profile.navbar.go_to_locus', { locus: searchValue })}
            </span>
          ),
          display: searchValue,
          filter: `${LOCUS_PREFIX}${searchValue}`,
        },
      ]
    : genes.map(gene => ({
        value: `${GENE_PREFIX}${gene.source?.name ?? ''}`,
        label: (
          <div className="flex flex-col gap-0.5">
            <span className="text-sm text-foreground">{parse(gene.highlight?.name || gene.source?.name || '')}</span>
            <span className="text-xs text-muted-foreground">{parse(gene.highlight?.id || gene.source?.id || '')}</span>
          </div>
        ),
        display: gene.source?.name ?? '',
        filter: `${gene.source?.name ?? ''}${gene.source?.id ?? ''}`,
      }));

  const handleChange = async (value: string) => {
    if (!value) return;
    const query = value.startsWith(LOCUS_PREFIX) ? value.slice(LOCUS_PREFIX.length) : value.slice(GENE_PREFIX.length);
    setNotFound(!(await onSearch(query)));
  };

  return (
    <div className="flex items-center gap-2">
      <AutoComplete<SearchOption>
        className="w-80"
        placeholder={t('case_entity.variants.cnv_profile.navbar.search_placeholder')}
        options={options}
        loading={isLoading}
        debounceDelay={200}
        minSearchLength={MIN_SEARCH_LENGTH}
        optionFilterProp="filter"
        optionLabelProp="display"
        leftAddon={<Search className="size-4 text-muted-foreground" />}
        aria-invalid={notFound}
        onSearch={value => {
          setSearchValue(value.trim());
          setNotFound(false);
        }}
        onChange={handleChange}
      />
      {notFound && (
        <span role="alert" className="text-xs text-destructive">
          {t('case_entity.variants.cnv_profile.navbar.not_found')}
        </span>
      )}
    </div>
  );
}

export default CNVProfileSearch;
