import { Trans } from 'react-i18next';

import HorizontalBarChart from '@/components/base/charts/bar-charts/horizontal-bar-chart';
import ChartPalettePreview from '@/components/base/charts/palettes/chart-palette-preview';
import type { ChartTooltipPayload } from '@/components/base/charts/type';
import Container from '@/components/base/container';
import NavbarLangSwitcher from '@/components/base/navbar/main-navbar-lang-switcher';
import { Button } from '@/components/base/shadcn/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/shadcn/card';
import { useI18n } from '@/components/hooks/i18n';

import IncludeIcon from '../asset/include-icon';
import pageHeader from '../asset/page-header.jpg';
import { mondoData } from '../mocks/mondo';

function Hero() {
  const { t } = useI18n();

  const mondoAxis = {
    x: { dataKey: 'count', label: t('landing.include.hero.mondo_chart.axis.x_label') },
    y: {
      dataKey: 'mondo_id',
      width: 180,
      tickFormatter: (value: string) => value.replace(/\(MONDO:\d+\)/g, ''),
      label: t('landing.include.hero.mondo_chart.axis.y_label'),
    },
  };

  return (
    <section
      className="relative w-full overflow-hidden bg-no-repeat text-white"
      // TODO use color from Include theme
      style={{ backgroundColor: '#1c3863', backgroundImage: `url(${pageHeader})` }}
    >
      <Container className="relative max-w-7xl px-4 py-12 sm:px-6">
        <div className="flex justify-end mb-4">
          <NavbarLangSwitcher className="border-white/40 hover:bg-white/10 border text-white hover:text-white" />
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <IncludeIcon />
              <span className="text-3xl font-semibold tracking-tight">{t('landing.include.hero.wordmark')}</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              <Trans
                i18nKey="landing.include.hero.title"
                components={{ accent: <span className="text-[var(--color-radiant-400)]" /> }}
              />
            </h1>
            <p className="text-base text-white/80">{t('landing.include.hero.description')}</p>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <a href="#">{t('landing.include.hero.login')}</a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-white/40 hover:bg-white/10 bg-transparent text-white hover:text-white"
              >
                <a href="#">{t('landing.include.hero.signup')}</a>
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t('landing.include.hero.mondo_chart.title')}</CardTitle>
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
        </div>
      </Container>
    </section>
  );
}

export default Hero;
