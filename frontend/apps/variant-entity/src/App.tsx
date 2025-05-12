import { useCallback, useEffect, useState } from 'react';
import BackLink from '@/components/base/navigation/back-link';
import TabsNav, { TabsContent, TabsList, TabsListItem } from '@/components/base/navigation/tabs-nav/tabs-nav';
import { Badge } from '@/components/base/ui/badge';
import { Link, useLocation, useParams } from 'react-router';
import OverviewTab from './components/overview/overview-tab';
import EvidenceTab from './components/evidence-tab';
import FrequencyTab from './components/frequency-tab';
import ConditionsTab from './components/conditions-tab';
import TranscriptsTab from './components/transcripts/transcripts-tab';
import CasesTab from './components/cases/cases-tab';
import { VariantEntityTabs } from './types';
import { variantsApi } from '@/utils/api';
import { VariantHeader, ApiError } from '@/api/api';
import useSWR from 'swr';
import { Skeleton } from '@/components/base/ui/skeleton';
import { useI18n } from '@/components/hooks/i18n';
import Result from '@/components/base/result';
import { Button } from '@/components/base/ui/button';

type VariantHeaderInput = {
  key: string;
  locusId: string;
};

async function fetchVariantHeader(input: VariantHeaderInput) {
  const response = await variantsApi.getVariantHeader(input.locusId);
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
      <Result
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

  // To avoid hydration mismatch with hash in ssr
  if (!activeTab) {
    return null;
  }

  return (
    <main className="bg-muted/40 h-screen overflow-auto">
      <div className="flex flex-col gap-4 bg-background pt-6 px-6">
        <Link to="/">
          <BackLink>{t('variantEntity.header.variants')}</BackLink>
        </Link>
        {isLoading ? (
          <Skeleton className="w-96 h-8" />
        ) : (
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{data?.hgvsg}</h1>
            {data?.assembly_version && <Badge variant="outline">{data.assembly_version}</Badge>}
            <Badge>{t('variantEntity.header.germline')}</Badge>
          </div>
        )}
      </div>
      <TabsNav value={activeTab} onValueChange={handleOnTabChange}>
        <TabsList className="pt-6 px-6 bg-background">
          <TabsListItem value={VariantEntityTabs.Overview}>{t('variantEntity.overview.title')}</TabsListItem>
          <TabsListItem value={VariantEntityTabs.Evidence}>{t('variantEntity.evidence.title')}</TabsListItem>
          <TabsListItem value={VariantEntityTabs.Frequency}>{t('variantEntity.frequency.title')}</TabsListItem>
          <TabsListItem value={VariantEntityTabs.Conditions}>{t('variantEntity.conditions.title')}</TabsListItem>
          <TabsListItem value={VariantEntityTabs.Transcripts}>{t('variantEntity.transcripts.title')}</TabsListItem>
          <TabsListItem value={VariantEntityTabs.Cases}>{t('variantEntity.cases.title')}</TabsListItem>
        </TabsList>
        <div className="px-6">
          <TabsContent value={VariantEntityTabs.Overview} className="py-6">
            <OverviewTab />
          </TabsContent>
          <TabsContent value={VariantEntityTabs.Evidence} className="py-6">
            <EvidenceTab />
          </TabsContent>
          <TabsContent value={VariantEntityTabs.Frequency} className="py-6">
            <FrequencyTab />
          </TabsContent>
          <TabsContent value={VariantEntityTabs.Conditions} className="py-6">
            <ConditionsTab />
          </TabsContent>
          <TabsContent value={VariantEntityTabs.Transcripts} className="py-6">
            <TranscriptsTab />
          </TabsContent>
          <TabsContent value={VariantEntityTabs.Cases} className="py-6">
            <CasesTab />
          </TabsContent>
        </div>
      </TabsNav>
    </main>
  );
}
