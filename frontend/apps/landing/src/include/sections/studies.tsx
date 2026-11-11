import { BookOpenText, Users } from 'lucide-react';

import StudiesShowcase from '@/components/base/landing/studies-showcase';
import StatItem from '@/components/base/stat-item/stat-item';
import { useI18n } from '@/components/hooks/i18n';
import { thousandNumberFormat } from '@/components/lib/number-format';

import { studies, studiesTotal, type Study } from '../mocks/studies';

function StudySlide({ study }: { study: Study }) {
  const { t, language } = useI18n();
  const lang = language?.startsWith('fr') ? 'fr' : 'en';

  return (
    <div className="flex flex-col gap-4">
      <div className="text-primary text-2xl font-bold tracking-tight">{study.title}</div>
      <h3 className="text-lg font-semibold tracking-tight">{study.name[lang]}</h3>
      <p className="text-muted-foreground text-sm">{study.description[lang]}</p>
      <StatItem
        icon={<Users />}
        value={thousandNumberFormat(study.participantCount)}
        label={t('landing.include.data_release.stats.participants')}
      />
    </div>
  );
}

/** Studies section: dark "Studies" side panel + a carousel showing one study per slide. */
function Studies() {
  const { t } = useI18n();

  return (
    <StudiesShowcase
      icon={<BookOpenText />}
      count={studiesTotal}
      label={t('landing.include.studies.title')}
      description={t('landing.include.studies.description')}
      ctaLabel={t('landing.include.studies.view_all')}
      items={studies}
      getItemKey={study => study.title}
      renderItem={study => <StudySlide study={study} />}
    />
  );
}

export default Studies;
