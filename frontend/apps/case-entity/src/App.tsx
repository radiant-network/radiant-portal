import { useCallback, useEffect, useState } from 'react';
import BackLink from '@/components/base/navigation/back-link';
import TabsNav, { TabsContent, TabsList, TabsListItem } from '@/components/base/navigation/tabs-nav/tabs-nav';
import { Badge } from '@/components/base/ui/badge';
import { Link, useLocation, useParams } from 'react-router';
import DetailsTab from './components/details/details-tab';
import VariantsTab from './components/variants/variants-tab';
import { CaseEntityTabs } from './types';
import { caseApi } from '@/utils/api';
import { CaseEntity, ApiError } from '@/api/api';
import useSWR from 'swr';
import { Skeleton } from '@/components/base/ui/skeleton';
import { useI18n } from '@/components/hooks/i18n';
import Result from '@/components/base/result';
import { Button } from '@/components/base/ui/button';
import Container from '@/components/base/container';
import { Users } from 'lucide-react';

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

  console.log('>>> data', data);

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

  return (
    <main className="bg-muted/40 h-screen overflow-auto">
      <div className="bg-background">
        <Container>
          <div className="flex flex-col gap-4 pt-6 px-6">
            <Link to="/case-exploration">
              <BackLink>{t('caseEntity.header.cases')}</BackLink>
            </Link>
            {isLoading ? (
              <Skeleton className="w-96 h-8" />
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{t('caseEntity.header.case')} {data?.case_id}</h1>
                <Badge variant="secondary"><Users />{t('caseEntity.header.germline')}</Badge>
                <Badge variant="outline">{data?.case_analysis_code}</Badge>
              </div>
            )}
          </div>
        </Container>
      </div>
      <TabsNav value={activeTab} onValueChange={handleOnTabChange}>
        <TabsList className="pt-6 px-3 bg-background" contentClassName="min-[1440px]:px-3 max-w-8xl mx-auto">
          <TabsListItem value={CaseEntityTabs.Details}>{t('caseEntity.details.title')}</TabsListItem>
          <TabsListItem value={CaseEntityTabs.Variants}>{t('caseEntity.variants.title')}</TabsListItem>
        </TabsList>
        <div className="px-6 ">
          <Container>
            <div>
              <TabsContent value={CaseEntityTabs.Details} className="py-6">
                <DetailsTab />
              </TabsContent>
              <TabsContent value={CaseEntityTabs.Variants} className="py-6">
                <VariantsTab />
              </TabsContent>
            </div>
          </Container>
        </div>
      </TabsNav>
    </main>
  );
}

