import { useCallback, useEffect, useState } from 'react';
import TabsNav, { TabsContent, TabsList, TabsListItem } from '@/components/base/navigation/tabs-nav/tabs-nav';
import { BadgeProps } from '@/components/base/ui/badge';
import { Link, useLocation, useParams } from 'react-router';
import OverviewTab from './components/overview/overview-tab';
import EvidenceTab from './components/evidence/evidence-tab';
import TranscriptsTab from './components/transcripts/transcripts-tab';
import CasesTab from './components/cases/cases-tab';
import { VariantEntityTabs } from './types';
import { variantsApi } from '@/utils/api';
import { VariantHeader, ApiError } from '@/api/api';
import useSWR from 'swr';
import { useI18n } from '@/components/hooks/i18n';
import PageError from '@/components/base/page/page-error';
import { Button } from '@/components/base/ui/button';
import Container from '@/components/base/container';
import PageHeader from '@/components/base/page/page-header';

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
        message={t('variantEntity.notFound')}
        className="h-screen"
        extra={
          <Link to="/">
            <Button>{t('variantEntity.notFound.button')}</Button>
          </Link>
        }
      />
    );
  }

  const pageHeaderBadges: BadgeProps[] = [];
  if (data?.assembly_version) {
    pageHeaderBadges.push({ variant: 'outline', children: data?.assembly_version });
  }
  pageHeaderBadges.push({ children: t('variantEntity.header.germline') });

  // To avoid hydration mismatch with hash in ssr
  if (!activeTab) {
    return null;
  }

  return (
    <main className="bg-muted h-screen overflow-auto">
      <PageHeader isLoading={isLoading} title={data?.hgvsg} badges={pageHeaderBadges} />
      <TabsNav value={activeTab} onValueChange={handleOnTabChange}>
        <TabsList className="pt-4 px-3 bg-background" contentClassName="min-[1440px]:px-3 mx-auto">
          <TabsListItem value={VariantEntityTabs.Overview}>{t('variantEntity.overview.title')}</TabsListItem>
          {/* SJRA-389 <TabsListItem value={VariantEntityTabs.Frequency}>{t('variantEntity.frequency.title')}</TabsListItem> */}
          <TabsListItem value={VariantEntityTabs.EvidenceAndConditions}>
            {t('variantEntity.evidence.title')}
          </TabsListItem>
          <TabsListItem value={VariantEntityTabs.Transcripts}>{t('variantEntity.transcripts.title')}</TabsListItem>
          <TabsListItem value={VariantEntityTabs.Cases}>{t('variantEntity.cases.tab')}</TabsListItem>
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
