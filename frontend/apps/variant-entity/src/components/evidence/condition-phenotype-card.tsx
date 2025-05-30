import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/ui/card';
import { useI18n } from '@/components/hooks/i18n';
import { Tabs, TabsList, TabsTrigger } from '@/components/base/ui/tabs';
import { Input } from '@/components/base/ui/input';
import { Search } from 'lucide-react';
import { Accordion } from '@/components/base/ui/accordion';
import GeneAccordionItem from './gene-accordion-item';

function ConditionPhenotypeCard() {
  const { t } = useI18n();

  const fakeData: any[] = [
    {
      symbol: 'BRAF',
      vep_impact: 'HIGH',
      conditions: [
        {
          condition: 'Aplastic anemia',
          inheritence: ['AD'],
          action: '2345678',
        },
        {
          condition: 'Folate deficiency anemia',
          inheritence: ['AR'],
          action: '2345679',
        },
      ],
    },
    {
      symbol: 'TP21',
      conditions: [],
    },
  ];

  return (
    <Card>
      <CardHeader className="flex">
        <CardTitle className="text-xl font-semibold">{t('variantEntity.evidence.gene.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-2">
          <Tabs defaultValue="omim">
            <TabsList>
              <TabsTrigger value="omim">
                {t('variantEntity.evidence.gene.filters.omim', {
                  count: 20,
                })}
              </TabsTrigger>
              <TabsTrigger value="orphanet">
                {t('variantEntity.evidence.gene.filters.orphanet', {
                  count: 10,
                })}
              </TabsTrigger>
              <TabsTrigger value="hpo">
                {' '}
                {t('variantEntity.evidence.gene.filters.hpo', {
                  count: 54,
                })}
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Input
            startIcon={Search}
            placeholder={t('variantEntity.evidence.gene.filters.searchPlaceholder')}
            wrapperClassName="max-w-[320px] w-full"
          />
        </div>
        <Accordion type="multiple" defaultValue={fakeData.map((_, idx) => `${idx}`)} className="space-y-2">
          {fakeData.map((item, index) => (
            <GeneAccordionItem key={`cond-phe-gene-${index}`} value={`${index}`} data={item} />
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}

export default ConditionPhenotypeCard;
