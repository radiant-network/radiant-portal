import HorizontalBarChart from '@/components/base/charts/bar-charts/horizontal-bar-chart';
import ChartPalettePreview from '@/components/base/charts/palettes/chart-palette-preview';
import type { ChartTooltipPayload } from '@/components/base/charts/type';
import Container from '@/components/base/container';
import NavbarLangSwitcher from '@/components/base/navbar/main-navbar-lang-switcher';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/shadcn/card';
import { useI18n } from '@/components/hooks/i18n';

import IncludeIcon from '../asset/include-icon';
import { mondoData } from '../mocks/mondo';

const mondoAxis = {
  x: { dataKey: 'count', label: '# of participants' },
  y: {
    dataKey: 'mondo_id',
    width: 180,
    tickFormatter: (value: string) => value.replace(/\(MONDO:\d+\)/g, ''),
    label: 'Diagnosis (MONDO)',
  },
};

/** Landing hero: logo lockup + language switcher, headline, and the MONDO diagnosis chart. */
function Hero() {
  const { t } = useI18n();

  return (
    <section className="bg-background w-full border-b">
      {/* Header: logo lockup + language switcher */}
      <Container className="flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <IncludeIcon width={40} height={42} />
          <span className="text-lg font-semibold tracking-tight">{t('landing.include.hero.wordmark')}</span>
        </div>
        <NavbarLangSwitcher />
      </Container>

      {/* Hero body */}
      <Container className="grid max-w-7xl gap-8 px-4 pb-12 sm:px-6 lg:grid-cols-2 lg:items-center">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t('landing.include.hero.title')}</h1>
          <p className="text-muted-foreground text-base">{t('landing.include.hero.description')}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('landing.include.hero.mondo_chart_title')}</CardTitle>
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
      </Container>
    </section>
  );
}

export default Hero;
