import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router';

import Container from '@/components/base/container';
import TabsNav, { TabsContent, TabsList, TabsListItem } from '@/components/base/navigation/tabs-nav/tabs-nav';
import { useI18n } from '@/components/hooks/i18n';
import { usePatientIdFromParam } from '@/utils/helper';

import ClinicalTrialsTab from './clinical-trials/clinical-trials-tab';
import GenomicsTab from './genomics/genomics-tab';
import ImagingTab from './imaging/imaging-tab';
import LaboratoryTab from './laboratory/laboratory-tab';
import Header from './layout/header';
import Sidebar from './layout/sidebar';
import OverviewTab from './overview/overview-tab';
import TimelineTab from './timeline/timeline-tab';
import TreatmentsTab from './treatments/treatments-tab';
import TumorBoardTab from './tumor-board/tumor-board-tab';
import { PatientEntityTabs } from './patient-entity-tabs';

const TAB_ORDER: { value: PatientEntityTabs; i18nKey: string }[] = [
  { value: PatientEntityTabs.Overview, i18nKey: 'patient_entity.tabs.overview' },
  { value: PatientEntityTabs.Timeline, i18nKey: 'patient_entity.tabs.timeline' },
  { value: PatientEntityTabs.Treatments, i18nKey: 'patient_entity.tabs.treatments' },
  { value: PatientEntityTabs.Genomics, i18nKey: 'patient_entity.tabs.genomics' },
  { value: PatientEntityTabs.TumorBoard, i18nKey: 'patient_entity.tabs.tumor_board' },
  { value: PatientEntityTabs.Laboratory, i18nKey: 'patient_entity.tabs.laboratory' },
  { value: PatientEntityTabs.Imaging, i18nKey: 'patient_entity.tabs.imaging' },
  { value: PatientEntityTabs.ClinicalTrials, i18nKey: 'patient_entity.tabs.clinical_trials' },
];

export default function App() {
  const { t } = useI18n();
  const patientId = usePatientIdFromParam();
  const mainRef = useRef<HTMLDivElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<PatientEntityTabs>(
    (searchParams.get('tab') as PatientEntityTabs) ?? PatientEntityTabs.Overview,
  );

  const handleOnTabChange = useCallback(
    (value: PatientEntityTabs) => {
      setSearchParams({ tab: value });
      setActiveTab(value);
    },
    [setSearchParams],
  );

  useEffect(() => {
    if (searchParams.get('tab') != null) {
      setActiveTab(searchParams.get('tab') as PatientEntityTabs);
      return;
    }
    setActiveTab(PatientEntityTabs.Overview);
    setSearchParams({ tab: PatientEntityTabs.Overview });
  }, []);

  useEffect(() => {
    if (searchParams.get('tab') != null) {
      setActiveTab(searchParams.get('tab') as PatientEntityTabs);
    }
  }, [searchParams.get('tab')]);

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeTab]);

  if (!activeTab) {
    return null;
  }

  return (
    <main ref={mainRef} className="bg-muted h-screen overflow-auto">
      <Header patientId={patientId} />
      <TabsNav value={activeTab} onValueChange={handleOnTabChange}>
        <TabsList className="pt-4 px-3 bg-background" contentClassName="mx-auto">
          {TAB_ORDER.map(({ value, i18nKey }) => (
            <TabsListItem key={value} value={value}>
              {t(i18nKey)}
            </TabsListItem>
          ))}
        </TabsList>
        <Container>
          <div className="grid gap-4 items-start max-w-8xl mx-auto w-full p-0 md:p-3 lg:grid-cols-[minmax(15rem,20rem)_minmax(0,1fr)]">
            <Sidebar />
            <div className="min-w-0">
              <TabsContent value={PatientEntityTabs.Overview}>
                <OverviewTab />
              </TabsContent>
              <TabsContent value={PatientEntityTabs.Timeline}>
                <TimelineTab />
              </TabsContent>
              <TabsContent value={PatientEntityTabs.Treatments}>
                <TreatmentsTab />
              </TabsContent>
              <TabsContent value={PatientEntityTabs.Genomics}>
                <GenomicsTab />
              </TabsContent>
              <TabsContent value={PatientEntityTabs.TumorBoard}>
                <TumorBoardTab />
              </TabsContent>
              <TabsContent value={PatientEntityTabs.Laboratory}>
                <LaboratoryTab />
              </TabsContent>
              <TabsContent value={PatientEntityTabs.Imaging}>
                <ImagingTab />
              </TabsContent>
              <TabsContent value={PatientEntityTabs.ClinicalTrials}>
                <ClinicalTrialsTab />
              </TabsContent>
            </div>
          </div>
        </Container>
      </TabsNav>
    </main>
  );
}
