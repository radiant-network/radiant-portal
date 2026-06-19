import type { ReactNode } from 'react';
import { Dna, FileText, FlaskConical, TestTube, Users, UsersRound } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/shadcn/card';
import StatItem from '@/components/base/stat-item/stat-item';
import { useI18n } from '@/components/hooks/i18n';
import { thousandNumberFormat } from '@/components/lib/number-format';

import { type DataReleaseStatKey, dataReleaseStats } from '../mocks/data-release';

const ICONS: Record<DataReleaseStatKey, ReactNode> = {
  studies: <FlaskConical />,
  participants: <Users />,
  biospecimens: <TestTube />,
  families: <UsersRound />,
  files: <FileText />,
  variants: <Dna />,
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
              value={thousandNumberFormat(stat.value)}
              label={t(`landing.include.data_release.stats.${stat.key}`)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default DataRelease;
