import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router';
import useSWR from 'swr';

import { ApiError, VariantHeader } from '@/api/api';
import Container from '@/components/base/container';
import TabsNav, { TabsContent, TabsList, TabsListItem } from '@/components/base/navigation/tabs-nav/tabs-nav';
import PageError from '@/components/base/page/page-error';
import PageHeader from '@/components/base/page/page-header';
import { BadgeProps } from '@/components/base/ui/badge';
import { Button } from '@/components/base/ui/button';
import { useI18n } from '@/components/hooks/i18n';
import { variantsApi } from '@/utils/api';

import CasesTab from './components/cases/cases-tab';
import EvidenceTab from './components/evidence/evidence-tab';
import OverviewTab from './components/overview/overview-tab';
import TranscriptsTab from './components/transcripts/transcripts-tab';
import { VariantEntityTabs } from './types';

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
  const location = useLocation();
  const params = useParams<{ locusId: string }>();
  const [activeTab, setActiveTab] = useState<VariantEntityTabs>();

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

  useEffect(() => {
    // To handle initial load
    if (location.hash) {
      const tab = location.hash.replace('#', '') as VariantEntityTabs;
      if (Object.values(VariantEntityTabs).includes(tab)) {
        setActiveTab(tab);
      }
    } else {
      setActiveTab(VariantEntityTabs.Overview);
    }
  }, [location]);

  const handleOnTabChange = useCallback((value: VariantEntityTabs) => {
    window.history.pushState({}, '', `#${value}`);
    setActiveTab(value);
  }, []);

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

  // To avoid hydration mismatch with hash in ssr
  if (!activeTab) {
    return null;
  }

  return (
    <main className="bg-muted h-screen overflow-auto">
      <PageHeader isLoading={isLoading} title={data?.hgvsg} badges={pageHeaderBadges} />
      <TabsNav value={activeTab} onValueChange={handleOnTabChange}>
        <TabsList className="pt-4 px-3 bg-background" contentClassName="min-[1440px]:px-3 mx-auto">
          <TabsListItem value={VariantEntityTabs.Overview}>{t('variant_entity.overview.title')}</TabsListItem>
          {/* SJRA-389 <TabsListItem value={VariantEntityTabs.Frequency}>{t('variant_entity.frequency.title')}</TabsListItem> */}
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
              {/* SJRA-389 <TabsContent value={VariantEntityTabs.Frequency} className="py-3">
                <FrequencyTab />
              </TabsContent> */}
              <TabsContent value={VariantEntityTabs.Transcripts} className="p-3 sm:py-3">
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
