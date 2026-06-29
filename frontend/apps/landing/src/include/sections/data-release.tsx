import type { ReactNode } from 'react';
import { BookOpenText, Dna, FileText, Fingerprint, TestTube, User } from 'lucide-react';

import StatGrid, { type StatGridItem } from '@/components/base/landing/stat-grid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/shadcn/card';
import { useI18n } from '@/components/hooks/i18n';
import { thousandNumberFormat } from '@/components/lib/number-format';

import { type DataReleaseStatKey, dataReleaseStats } from '../mocks/data-release';

const ICONS: Record<DataReleaseStatKey, ReactNode> = {
  studies: <BookOpenText />,
  participants: <User />,
  biospecimens: <TestTube />,
  genomes: <Dna />,
  files: <FileText />,
  transcriptomes: <Fingerprint />,
};

/** Data-release summary: six key figures of the current release. */
function DataRelease() {
  const { t } = useI18n();

  const items: StatGridItem[] = dataReleaseStats.map(stat => ({
    key: stat.key,
    icon: ICONS[stat.key],
    value: typeof stat.value === 'number' ? thousandNumberFormat(stat.value) : stat.value,
    label: t(`landing.include.data_release.stats.${stat.key}`),
  }));

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{t('landing.include.data_release.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <StatGrid items={items} className="grid-cols-3 lg:grid-cols-1 xl:grid-cols-2" />
      </CardContent>
    </Card>
  );
}

export default DataRelease;
