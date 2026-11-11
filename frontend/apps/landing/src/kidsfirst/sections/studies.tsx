import { BookOpenText, Users } from 'lucide-react';

import SectionHeading from '@/components/base/landing/section-heading';
import StudiesShowcase, {
  StudiesAccent,
  StudiesArrows,
  StudiesStackOrder,
} from '@/components/base/landing/studies-showcase';
import { Badge } from '@/components/base/shadcn/badge';
import StatItem, { StatItemLayout } from '@/components/base/stat-item/stat-item';
import { useI18n } from '@/components/hooks/i18n';
import { thousandNumberFormat } from '@/components/lib/number-format';

import { studies, studiesTotal, type Study } from '../mocks/studies';

function StudySlide({ study }: { study: Study }) {
  const { t, language } = useI18n();
  const lang = language?.startsWith('fr') ? 'fr' : 'en';

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-primary-foreground text-xl font-bold tracking-tight">{study.name}</h3>
      <p className="text-primary-foreground/80 text-sm">{study.description[lang]}</p>
      <hr className="border-primary-foreground/20" />
      <div className="flex items-center gap-6">
        <StatItem
          icon={<Users />}
          value={thousandNumberFormat(study.participantCount)}
          label={t('landing.kidsfirst.studies.participants')}
          iconClassName="text-primary-foreground"
          labelClassName="text-primary-foreground/90"
        />
        <Badge className="shrink-0 border-transparent bg-[var(--magenta-7)] uppercase text-white">
          {t(`landing.kidsfirst.studies.domains.${study.domain}`)}
        </Badge>
      </div>
    </div>
  );
}

/** Studies section: section heading + "Studies" side panel and a carousel of study slides. */
function Studies() {
  const { t } = useI18n();

  return (
    <div className="space-y-8">
      <SectionHeading title={t('landing.kidsfirst.studies.section_title')} />
      <StudiesShowcase
        accent={StudiesAccent.Carousel}
        arrows={StudiesArrows.Sides}
        stackOrder={StudiesStackOrder.PanelFirst}
        icon={<BookOpenText />}
        count={studiesTotal}
        label={t('landing.kidsfirst.studies.title')}
        description={t('landing.kidsfirst.studies.description')}
        ctaLabel={t('landing.kidsfirst.studies.view_all')}
        items={studies}
        getItemKey={study => study.name}
        renderItem={study => <StudySlide study={study} />}
        statLayout={StatItemLayout.Inline}
      />
    </div>
  );
}

export default Studies;
