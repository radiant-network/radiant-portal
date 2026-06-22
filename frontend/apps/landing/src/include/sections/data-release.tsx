import type { ReactNode } from 'react';
import { BookOpenText, Dna, FileText, Fingerprint, TestTube, User } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/shadcn/card';
import StatItem from '@/components/base/stat-item/stat-item';
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

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{t('landing.include.data_release.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-6 lg:grid-cols-1 xl:grid-cols-2">
          {dataReleaseStats.map(stat => (
            <StatItem
              key={stat.key}
              className="min-w-0"
              icon={ICONS[stat.key]}
              value={typeof stat.value === 'number' ? thousandNumberFormat(stat.value) : stat.value}
              label={t(`landing.include.data_release.stats.${stat.key}`)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default DataRelease;
