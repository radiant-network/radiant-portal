import { ArrowRight, BookOpenText, Users } from 'lucide-react';

import { Button } from '@/components/base/shadcn/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/base/shadcn/carousel';
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
    <div className="grid overflow-hidden rounded-xl border lg:grid-cols-[1fr_2fr]">
      {/* Side panel */}
      <div className="bg-primary text-primary-foreground order-2 flex flex-col gap-6 p-8 lg:order-1">
        <StatItem
          icon={<BookOpenText />}
          value={studiesTotal}
          label={t('landing.include.studies.title')}
          iconClassName="text-primary-foreground"
          labelClassName="text-primary-foreground/90"
        />
        <p className="text-primary-foreground/90 text-sm">{t('landing.include.studies.description')}</p>
        <Button asChild variant="secondary" className="self-start">
          <a href="#">
            {t('landing.include.studies.view_all')} <ArrowRight />
          </a>
        </Button>
      </div>

      {/* Carousel */}
      <div className="bg-background order-1 min-w-0 p-8 lg:order-2">
        <Carousel opts={{ align: 'start' }} className="w-full">
          <CarouselContent>
            {studies.map(study => (
              <CarouselItem key={study.title}>
                <StudySlide study={study} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="mt-6 flex justify-center gap-2">
            <CarouselPrevious className="static translate-y-0" />
            <CarouselNext className="static translate-y-0" />
          </div>
        </Carousel>
      </div>
    </div>
  );
}

export default Studies;
