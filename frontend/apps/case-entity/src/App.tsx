import { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router';
import { AudioWaveform, ClipboardList } from 'lucide-react';
import useSWR from 'swr';

import { ApiError, CaseEntity } from '@/api/api';
import Container from '@/components/base/container';
import TabsNav, { TabsContent, TabsList, TabsListItem } from '@/components/base/navigation/tabs-nav/tabs-nav';
import PageError from '@/components/base/page/page-error';
import { Button } from '@/components/base/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';
import { useI18n } from '@/components/hooks/i18n';
import { caseApi } from '@/utils/api';

import DetailsTab from './components/details/details-tab';
import Header from './components/layout/header';
import VariantsTab from './components/variants/variants-tab';
import { CaseEntityTabs } from './types';

export const CaseEntityContext = createContext<CaseEntity | undefined>(undefined);

const TAB_SEARCH_PARAM = 'tab';

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
  const params = useParams<{ caseId: string }>();
  const mainRef = useRef<HTMLDivElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<CaseEntityTabs>(
    (searchParams.get(TAB_SEARCH_PARAM) as CaseEntityTabs) ?? CaseEntityTabs.Details,
  );
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

  /**
   * Set active tab by searchParams (from urls)
   */
  useEffect(() => {
    setActiveTab((searchParams.get(TAB_SEARCH_PARAM) as CaseEntityTabs) ?? CaseEntityTabs.Details);
  }, [searchParams]);

  /**
   * Reset scroll position when changing tab
   */
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [activeTab]);

  const handleOnTabChange = useCallback((value: CaseEntityTabs) => {
    setSearchParams({ tab: value });
    setActiveTab(value);
  }, []);

  if (!isLoading && error?.status === 404) {
    return (
      <PageError
        status="404"
        message={t('case_entity.not_found')}
        className="h-screen"
        extra={
          <Link to="/">
            <Button>{t('case_entity.not_found.button')}</Button>
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
    <CaseEntityContext value={data}>
      <main ref={mainRef} className="bg-muted h-screen overflow-auto">
        <Header data={data} isLoading={isLoading} />
        <TabsNav value={activeTab} onValueChange={handleOnTabChange}>
          <TabsList className="pt-4 px-6 bg-background" contentClassName="mx-auto">
            <TabsListItem value={CaseEntityTabs.Details}>
              <ClipboardList />
              {t('case_entity.details.title')}
            </TabsListItem>
            {hasVariants ? (
              <TabsListItem value={CaseEntityTabs.Variants}>
                <AudioWaveform />
                {t('case_entity.variants.title')}
              </TabsListItem>
            ) : (
              <Tooltip>
                <TooltipTrigger>
                  <TabsListItem disabled value={CaseEntityTabs.Variants}>
                    <AudioWaveform />
                    {t('case_entity.variants.title')}
                  </TabsListItem>
                </TooltipTrigger>
                <TooltipContent>{t('case_entity.details.no_variants')}</TooltipContent>
              </Tooltip>
            )}
          </TabsList>
          <Container>
            <TabsContent value={CaseEntityTabs.Details} className="p-0 md:p-3">
              <DetailsTab caseEntity={data} isLoading={isLoading} />
            </TabsContent>
          </Container>
          <TabsContent value={CaseEntityTabs.Variants} className="py-0">
            <VariantsTab isLoading={isLoading} caseEntity={data} />
          </TabsContent>
        </TabsNav>
      </main>
    </CaseEntityContext>
  );
}
