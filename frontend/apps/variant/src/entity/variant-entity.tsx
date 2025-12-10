import { useCallback, useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router';
import useSWR from 'swr';

import { ApiError, VariantHeader } from '@/api/api';
import Container from '@/components/base/container';
import TabsNav, { TabsContent, TabsList, TabsListItem } from '@/components/base/navigation/tabs-nav/tabs-nav';
import PageError from '@/components/base/page/page-error';
import PageHeader from '@/components/base/page/page-header';
import { BadgeProps } from '@/components/base/shadcn/badge';
import { Button } from '@/components/base/shadcn/button';
import { useI18n } from '@/components/hooks/i18n';
import { VariantEntityTabs } from '@/types';
import { variantsApi } from '@/utils/api';

import CasesTab from './cases/cases-tab';
import EvidenceTab from './evidence/evidence-tab';
import OverviewTab from './overview/overview-tab';
import TranscriptsTab from './transcripts/transcripts-tab';

const TAB_SEARCH_PARAM = 'tab';

type VariantHeaderInput = {
  key: string;
  locusId: string;
};

async function fetchVariantHeader(input: VariantHeaderInput) {
  const response = await variantsApi.getGermlineVariantHeader(input.locusId);
  return response.data;
}

export default function App() {
  const { t } = useI18n();
  const params = useParams<{ locusId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<VariantEntityTabs>(
    (searchParams.get(TAB_SEARCH_PARAM) as VariantEntityTabs) ?? VariantEntityTabs.Overview,
  );

  const { data, error, isLoading } = useSWR<VariantHeader, ApiError, VariantHeaderInput>(
    {
      key: 'variant-header',
      locusId: params.locusId!,
    },
    fetchVariantHeader,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    },
  );

  /**
   * Set active tab by searchParams (from urls)
   */
  useEffect(() => {
    setActiveTab((searchParams.get(TAB_SEARCH_PARAM) as VariantEntityTabs) ?? VariantEntityTabs.Overview);
  }, [searchParams]);

  const handleOnTabChange = useCallback(
    (value: VariantEntityTabs) => {
      setSearchParams({ tab: value });
      setActiveTab(value);
    },
    [setSearchParams],
  );

  if (!isLoading && error?.status === 404) {
    return (
      <PageError
        status="404"
        message={t('variant_entity.not_found')}
        className="h-screen"
        extra={
          <Link to="/">
            <Button>{t('variant_entity.not_found.button')}</Button>
          </Link>
        }
      />
    );
  }

  const pageHeaderBadges: BadgeProps[] = [];
  if (data?.assembly_version) {
    pageHeaderBadges.push({ variant: 'outline', children: data?.assembly_version });
  }
  pageHeaderBadges.push({ children: t('variant_entity.header.germline') });

  // To avoid hydration mismatch with search params in ssr
  if (!activeTab) {
    return null;
  }

  return (
    <main className="bg-muted h-screen overflow-auto">
      <PageHeader isLoading={isLoading} title={data?.hgvsg} badges={pageHeaderBadges} />
      <TabsNav value={activeTab} onValueChange={handleOnTabChange}>
        <TabsList className="pt-4 px-3 bg-background" contentClassName="mx-auto">
          <TabsListItem value={VariantEntityTabs.Overview}>{t('variant_entity.overview.title')}</TabsListItem>
          <TabsListItem value={VariantEntityTabs.EvidenceAndConditions}>
            {t('variant_entity.evidence.title')}
          </TabsListItem>
          <TabsListItem value={VariantEntityTabs.Transcripts}>{t('variant_entity.transcripts.title')}</TabsListItem>
          <TabsListItem value={VariantEntityTabs.Cases}>{t('variant_entity.cases.tab')}</TabsListItem>
        </TabsList>
        <div className="px-0 sm:px-3">
          <Container>
            <div className="max-w-8xl mx-auto w-full">
              <TabsContent value={VariantEntityTabs.Overview} className="p-0 sm:py-3">
                <OverviewTab />
              </TabsContent>
              <TabsContent value={VariantEntityTabs.EvidenceAndConditions} className="p-0 sm:py-3">
                <EvidenceTab />
              </TabsContent>
              <TabsContent value={VariantEntityTabs.Transcripts} className="p-0 sm:py-3">
                <TranscriptsTab />
              </TabsContent>
              <TabsContent value={VariantEntityTabs.Cases} className="p-0 sm:py-3">
                <CasesTab />
              </TabsContent>
            </div>
          </Container>
        </div>
      </TabsNav>
    </main>
  );
}
