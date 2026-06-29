import type { ReactNode } from 'react';
import { Atom, BookOpenText, Dna, FileText, TestTube, Users } from 'lucide-react';

import HorizontalBarChart from '@/components/base/charts/bar-charts/horizontal-bar-chart';
import ChartPalettePreview from '@/components/base/charts/palettes/chart-palette-preview';
import PieChart from '@/components/base/charts/pie-charts/pie-chart';
import type { ChartTooltipPayload } from '@/components/base/charts/type';
import Container from '@/components/base/container';
import SectionHeading from '@/components/base/landing/section-heading';
import StatGrid, { type StatGridItem } from '@/components/base/landing/stat-grid';
import { Button } from '@/components/base/shadcn/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/shadcn/card';
import { useI18n } from '@/components/hooks/i18n';
import { thousandNumberFormat } from '@/components/lib/number-format';

import { type StatKey, stats } from '../mocks/data-release';
import { ethnicityData, familyCompositionData, raceData } from '../mocks/demographics';
import { mondoData } from '../mocks/mondo';

const STAT_ICONS: Record<StatKey, ReactNode> = {
  studies: <BookOpenText />,
  participants: <Users />,
  variants: <Atom />,
  biospecimens: <TestTube />,
  files: <FileText />,
  genomes: <Dna />,
};

const PIE_CHARTS = [
  { key: 'family_composition', data: familyCompositionData },
  { key: 'race', data: raceData },
  { key: 'ethnicity', data: ethnicityData },
] as const;

const pieTooltip = (payload: ChartTooltipPayload) => (
  <div className="flex items-center gap-2">
    <ChartPalettePreview patternIndex={payload.patternIndex} />
    <span>{payload.label}</span>
    <span className="font-bold">{payload.count}</span>
  </div>
);

/** Accelerating Research: gradient section with key figures and the MONDO + demographics charts. */
function AcceleratingResearch() {
  const { t } = useI18n();

  const statItems: StatGridItem[] = stats.map(stat => ({
    key: stat.key,
    icon: STAT_ICONS[stat.key],
    value: typeof stat.value === 'number' ? thousandNumberFormat(stat.value) : stat.value,
    label: t(`landing.kidsfirst.accelerating_research.stats.${stat.key}`),
  }));

  const mondoAxis = {
    x: { dataKey: 'count', label: t('landing.kidsfirst.accelerating_research.mondo_chart.axis.x_label') },
    y: {
      dataKey: 'mondo_id',
      width: 180,
      tickFormatter: (value: string) => value.replace(/\(MONDO:\d+\)/g, ''),
      label: t('landing.kidsfirst.accelerating_research.mondo_chart.axis.y_label'),
    },
  };

  return (
    <section
      className="text-white"
      style={{
        background:
          'linear-gradient(56deg, var(--secondary-gradient-1) 0.64%, var(--secondary-gradient-2) 17.42%, var(--secondary-gradient-3) 39.14%, var(--secondary-gradient-4) 58.88%, var(--secondary-gradient-5) 76.65%, var(--secondary-gradient-6) 90.47%, var(--secondary-gradient-7) 99.36%)',
      }}
    >
      <Container className="max-w-8xl space-y-12 px-4 py-16 sm:px-6">
        <div className="grid gap-8 md:grid-cols-[1fr_2fr] md:items-center">
          <div className="space-y-6">
            <SectionHeading
              title={t('landing.kidsfirst.accelerating_research.title')}
              align="left"
              titleClassName="text-white"
            />
            <p className="text-xl text-white/90">{t('landing.kidsfirst.accelerating_research.description')}</p>
            <Button asChild className="bg-[var(--cyan-6)] text-white hover:brightness-95">
              <a href="#">{t('landing.kidsfirst.accelerating_research.get_started')}</a>
            </Button>
          </div>

          <StatGrid
            items={statItems}
            className="grid-cols-3 md:grid-cols-2 lg:grid-cols-3"
            size="lg"
            iconClassName="text-white"
            labelClassName="text-white/90"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('landing.kidsfirst.accelerating_research.mondo_chart.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <HorizontalBarChart
                axis={mondoAxis}
                data={mondoData}
                tooltip={(payload: ChartTooltipPayload) => (
                  <div className="flex items-center gap-2">
                    <ChartPalettePreview patternIndex={payload.patternIndex} />
                    <span>{payload.mondo_id}</span>
                    <span className="font-bold">{payload.count}</span>
                  </div>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('landing.kidsfirst.accelerating_research.demographics.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {PIE_CHARTS.map(({ key, data }) => (
                  <PieChart
                    key={key}
                    data={data}
                    pies={data.map(d => d.label)}
                    title={t(`landing.kidsfirst.accelerating_research.demographics.${key}`)}
                    tooltip={pieTooltip}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </section>
  );
}

export default AcceleratingResearch;
