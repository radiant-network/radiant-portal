import ChartPalettePreview from '@/components/base/charts/palettes/chart-palette-preview';
import PieChart from '@/components/base/charts/pie-charts/pie-chart';
import type { ChartTooltipPayload } from '@/components/base/charts/type';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/shadcn/card';
import { useI18n } from '@/components/hooks/i18n';

import { ethnicityData, raceData, sexData } from '../mocks/demographics';

const tooltip = (payload: ChartTooltipPayload) => (
  <div className="flex items-center gap-2">
    <ChartPalettePreview patternIndex={payload.patternIndex} />
    <span>{payload.label}</span>
    <span className="font-bold">{payload.count}</span>
  </div>
);

const CHARTS = [
  { key: 'sex', data: sexData },
  { key: 'race', data: raceData },
  { key: 'ethnicity', data: ethnicityData },
] as const;

/** Demographics breakdown: three pie charts (sex, race, ethnicity). */
function Demographics() {
  const { t } = useI18n();

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{t('landing.include.demographics.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {CHARTS.map(({ key, data }) => (
            <PieChart
              key={key}
              data={data}
              pies={data.map(d => d.label)}
              title={t(`landing.include.demographics.${key}`)}
              tooltip={tooltip}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default Demographics;
