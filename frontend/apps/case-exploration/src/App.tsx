import TabsNav, { TabsContent, TabsList, TabsListItem } from '@/components/base/navigation/tabs-nav/tabs-nav';
import { useI18n } from '@/components/hooks/i18n';
import Container from '@/components/base/container';
import { CaseExplorationTabs } from './types';
import { useCallback, useState } from 'react';
import CasesTab from './components/cases/cases-tab';
//import AssaysTab from './components/assays/assays-tab';

export default function App() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<CaseExplorationTabs>(CaseExplorationTabs.Case);

  const handleOnTabChange = useCallback((value: CaseExplorationTabs) => {
    window.history.pushState({}, '', `#${value}`);
    setActiveTab(value);
  }, []);

  return (
    <main className={`bg-muted/40 h-screen overflow-auto p-6`}>
      <div className="p-6 bg-background border rounded-lg">
        <TabsNav value={activeTab} onValueChange={handleOnTabChange}>
          <Container>
            <TabsList className="pt-6 px-3 bg-background" contentClassName="min-[1440px]:px-3 max-w-8xl mx-auto">
              <TabsListItem value={CaseExplorationTabs.Case}>{t('caseExploration.case.title')}</TabsListItem>
              {/* @TODO:Only cases if needed for the first release  */}
              {/* <TabsListItem value={CaseExplorationTabs.Assays}>{t('caseExploration.assays.title')}</TabsListItem> */}
            </TabsList>
          </Container>
          <Container>
            <TabsContent value={CaseExplorationTabs.Case} className="py-6">
              <CasesTab />
            </TabsContent>
            {/* @TODO:Only cases if needed for the first release  */}
            {/* <TabsContent value={CaseExplorationTabs.Assays} className="py-6"> */}
            {/*   <AssaysTab /> */}
            {/* </TabsContent> */}
          </Container>
        </TabsNav>
      </div>
    </main>
  );
}
