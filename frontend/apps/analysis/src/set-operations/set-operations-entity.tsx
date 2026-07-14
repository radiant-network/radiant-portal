import { useCallback, useState } from 'react';
import { Dna, FlaskConical, Users } from 'lucide-react';

import { MultiSelectorOption } from '@/components/base/data-entry/multi-selector/multi-selector.types';
import PageHeader from '@/components/base/page/page-header';
import { Card, CardContent } from '@/components/base/shadcn/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/base/shadcn/tabs';
import { useI18n } from '@/components/hooks/i18n';

import { mockSets, UserSetOption } from './mocks/user-set';
import SetOperationsEmpty from './set-operations-empty';
import SetOperationsLanding from './set-operations-landing';
import SetOperationsVennChart from './set-operations-venn-chart';

enum Step {
  EMPTY = 'empty',
  LANDING = 'landing',
  VENN = 'venn',
}

export type SetSelectOption = {
  value: string;
  icon: any;
  disabled: boolean;
};

export function getSetTypesList(sets: UserSetOption[]): SetSelectOption[] {
  return [
    {
      value: 'participants',
      icon: Users,
      disabled: sets.filter(set => set.setType == 'participants').length < 2,
    },
    {
      value: 'biospecimens',
      icon: FlaskConical,
      disabled: sets.filter(set => set.setType == 'biospecimens').length < 2,
    },
    {
      value: 'variants_germline',
      icon: Dna,
      disabled: sets.filter(set => set.setType == 'variants_germline').length < 2,
    },
    {
      value: 'variants_somatic',
      icon: Dna,
      disabled: sets.filter(set => set.setType == 'variants_somatic').length < 2,
    },
  ];
}

function SetOperationsEntity() {
  const { t } = useI18n();
  const [step, setStep] = useState<Step>(Step.LANDING);
  const [setType, setSetType] = useState<string | undefined>(undefined);
  const [selectedSets, setSelectedSets] = useState<string[]>([]);
  const [setOptions, setSetOptions] = useState<MultiSelectorOption[]>([]);

  const setTypesList = getSetTypesList(mockSets);

  const handleLandingCompare = () => {
    setStep(Step.VENN);
  };

  const handleValueChange = useCallback(
    (value: string) => {
      setSetType(value);
      setSelectedSets([]);
      setSetOptions(
        mockSets
          .filter(item => item.setType === value)
          .map(item => ({
            value: item.id,
            label: item.tag,
          })),
      );
    },
    [mockSets],
  );

  return (
    <>
      <PageHeader
        title={t('analysis.set_operations.title')}
        variant="info"
        isLoading={false}
        previousPageUrl="/analysis"
      />
      <main className="bg-muted min-h-0 flex-1 overflow-auto p-6">
        {/* @TODO: To remove, it just a quick debug menu */}
        <div className="flex gap-6 mb-2">
          <i>DEBUG MENU: Venn charts are statics at the moment.</i>
          <Tabs value={step}>
            <TabsList className="w-full h-7">
              {[Step.EMPTY, Step.LANDING].map(value => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground"
                  onClick={() => {
                    setStep(value);
                  }}
                >
                  <>{value}</>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        <Card>
          <CardContent className="flex flex-col gap-6 items-center">
            {step == Step.EMPTY && <SetOperationsEmpty />}

            {step == Step.LANDING && (
              <SetOperationsLanding
                setTypesList={setTypesList}
                setType={setType}
                setOptions={setOptions}
                selectedSets={selectedSets}
                onSetsChange={setSelectedSets}
                onValueChange={handleValueChange}
                onCompare={handleLandingCompare}
              />
            )}

            {step == Step.VENN && setType !== undefined && (
              <SetOperationsVennChart
                userSets={mockSets}
                defaultSetType={setType}
                setDefaultSetType={setSetType}
                defaultSelectedSets={selectedSets}
                setDefaultSelectedSets={setSelectedSets}
                setTypesList={setTypesList}
              />
            )}
          </CardContent>
        </Card>
      </main>
    </>
  );
}
export default SetOperationsEntity;
