import { useCallback, useEffect, useState } from 'react';
import TabsNav, { TabsContent, TabsList, TabsListItem } from '@/components/base/navigation/tabs-nav/tabs-nav';
import { Link, useLocation, useParams } from 'react-router';
import DetailsTab from './components/details/details-tab';
import VariantsTab from './components/variants/variants-tab';
import { CaseEntityTabs } from './types';
import { caseApi } from '@/utils/api';
import { CaseEntity, ApiError } from '@/api/api';
import useSWR from 'swr';
import { useI18n } from '@/components/hooks/i18n';
import Result from '@/components/base/result';
import { Button } from '@/components/base/ui/button';
import Container from '@/components/base/container';
import Header from './components/layout/header';
import { AudioWaveform, ClipboardList } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';

type CaseEntityInput = {
  key: string;
  caseId: string;
};

async function fetchCaseEntity(input: CaseEntityInput) {
  const response = await caseApi.caseEntity(input.caseId);
  return response.data;
}

export default function App() {
  const { t } = useI18n();
  const location = useLocation();
  const params = useParams<{ caseId: string }>();
  const [activeTab, setActiveTab] = useState<CaseEntityTabs>();

  const { data, error, isLoading } = useSWR<CaseEntity, ApiError, CaseEntityInput>(
    {
      key: 'case-entity',
      caseId: params.caseId!,
    },
    fetchCaseEntity,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    },
  );

  useEffect(() => {
    // To handle initial load
    if (location.hash) {
      const tab = location.hash.replace('#', '') as CaseEntityTabs;
      if (Object.values(CaseEntityTabs).includes(tab)) {
        setActiveTab(tab);
      }
    } else {
      setActiveTab(CaseEntityTabs.Details);
    }
  }, [location]);

  const handleOnTabChange = useCallback((value: CaseEntityTabs) => {
    window.history.pushState({}, '', `#${value}`);
    setActiveTab(value);
  }, []);

  if (!isLoading && error?.status === 404) {
    return (
      <Result
        status="404"
        message={t('caseEntity.notFound')}
        className="h-screen"
        extra={
          <Link to="/">
            <Button>{t('caseEntity.notFound.button')}</Button>
          </Link>
        }
      />
    );
  }

  // To avoid hydration mismatch with hash in ssr
  if (!activeTab) {
    return null;
  }

  const hasVariants = (data?.assays ?? []).some(assay => assay.has_variants);

  return (
    <main className="bg-muted/40 h-screen overflow-auto">
      <Header data={data} isLoading={isLoading} />
      <TabsNav value={activeTab} onValueChange={handleOnTabChange}>
        <TabsList className="pt-4 px-3 bg-background" contentClassName="min-[1440px]:px-3 mx-auto">
          <TabsListItem value={CaseEntityTabs.Details}><ClipboardList />{t('caseEntity.details.title')}</TabsListItem>
          {hasVariants ? (
            <TabsListItem value={CaseEntityTabs.Variants}>
              <AudioWaveform />{t('caseEntity.variants.title')}
            </TabsListItem>
          ) : (
            <Tooltip>
              <TooltipTrigger>
                <TabsListItem disabled value={CaseEntityTabs.Variants}>
                  <AudioWaveform />{t('caseEntity.variants.title')}
                </TabsListItem>
              </TooltipTrigger>
              <TooltipContent>{t("caseEntity.details.no_variants")}</TooltipContent>
            </Tooltip>
          )}
        </TabsList>
        <Container>
          <TabsContent value={CaseEntityTabs.Details} className="p-6">
            <DetailsTab data={data} />
          </TabsContent>
        </Container>
        <TabsContent value={CaseEntityTabs.Variants} noMargin>
          <VariantsTab caseEntity={data} isLoading={isLoading} />
        </TabsContent>
      </TabsNav>
    </main>
  );
}

