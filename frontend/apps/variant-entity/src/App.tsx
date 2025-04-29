import { useCallback, useEffect, useState } from 'react';
import BackLink from '@/components/base/navigation/back-link';
import TabsNav, { TabsContent, TabsList, TabsListItem } from '@/components/base/navigation/tabs-nav/tabs-nav';
import { Badge } from '@/components/base/ui/badge';
import { Link, useLocation } from 'react-router';
import OverviewTab from './components/overview-tab';
import EvidenceTab from './components/evidence-tab';
import FrequencyTab from './components/frequency-tab';
import ConditionsTab from './components/conditions-tab';
import TranscriptsTab from './components/transcripts-tab';
import CasesTab from './components/cases-tab';

export enum VariantEntityTabs {
  Overview = 'overview',
  Evidence = 'evidence',
  Frequency = 'frequency',
  Conditions = 'conditions',
  Transcripts = 'transcripts',
  Cases = 'cases',
}

export default function App() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<VariantEntityTabs>(VariantEntityTabs.Overview);

  useEffect(() => {
    // To handle initial load
    if (location.hash) {
      const tab = location.hash.replace('#', '') as VariantEntityTabs;
      if (Object.values(VariantEntityTabs).includes(tab)) {
        setActiveTab(tab);
      }
    }
  }, [location]);

  const handleOnTabChange = useCallback((value: VariantEntityTabs) => {
    window.history.pushState({}, '', `#${value}`);
    setActiveTab(value);
  }, []);

  return (
    <main className="bg-muted h-full">
      <div className="flex flex-col gap-4 bg-background pt-6 px-6">
        <Link to="/">
          <BackLink>Variants</BackLink>
        </Link>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">chr7:1212342453234</h1>
          <Badge>Germline</Badge>
        </div>
      </div>
      <TabsNav value={activeTab} onValueChange={handleOnTabChange}>
        <TabsList className="pt-6 px-6 bg-background">
          <TabsListItem value={VariantEntityTabs.Overview}>Overview</TabsListItem>
          <TabsListItem value={VariantEntityTabs.Evidence}>Evidence</TabsListItem>
          <TabsListItem value={VariantEntityTabs.Frequency}>Frequency</TabsListItem>
          <TabsListItem value={VariantEntityTabs.Conditions}>Conditions</TabsListItem>
          <TabsListItem value={VariantEntityTabs.Transcripts}>Transcripts</TabsListItem>
          <TabsListItem value={VariantEntityTabs.Cases}>Cases</TabsListItem>
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
