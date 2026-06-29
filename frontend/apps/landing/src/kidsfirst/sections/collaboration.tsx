import type { CSSProperties } from 'react';
import { SquareArrowOutUpRight } from 'lucide-react';

import ResourceTile from '@/components/base/landing/resource-tile';
import SectionHeading from '@/components/base/landing/section-heading';
import { Button } from '@/components/base/shadcn/button';
import { useI18n } from '@/components/hooks/i18n';
import { numberFormatWithAbbrv } from '@/components/lib/number-format';

import cavaticaLogo from '../asset/cavatica-login-logo.png';
import geneticEngineering from '../asset/genetic_engineering.png';
import pedcbioportalLogo from '../asset/pedcbioportal.png';
import { variantsCount } from '../mocks/collaboration';

const externalButtonClass = 'border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white';

const navyTileBackground: CSSProperties = {
  background:
    'radial-gradient(50% 50% at 50% 50%, var(--primary-gradient) 0%, rgba(34, 43, 92, 0.6) 100%), var(--primary-gradient)',
  backgroundRepeat: 'no-repeat',
};

/** Collaboration section: section heading + three external-resource tiles. */
function Collaboration() {
  const { t } = useI18n();

  return (
    <div className="space-y-8">
      <SectionHeading
        title={t('landing.kidsfirst.collaboration.section_title')}
        subtitle={t('landing.kidsfirst.collaboration.subtitle')}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Germline Variants */}
        <ResourceTile
          className="border-0 bg-[var(--purple-6)] text-white"
          descriptionClassName="text-white/90"
          title={
            <span className="flex items-center gap-3">
              <img src={geneticEngineering} alt="" className="size-8 shrink-0" />
              {`${numberFormatWithAbbrv(variantsCount)}+ ${t('landing.kidsfirst.collaboration.germline_variants.title')}`}
            </span>
          }
          description={t('landing.kidsfirst.collaboration.germline_variants.description')}
          footer={
            <Button asChild className="bg-[var(--cyan-6)] text-white hover:brightness-95">
              <a href="#">{t('landing.kidsfirst.collaboration.germline_variants.button')}</a>
            </Button>
          }
        />

        {/* CAVATICA */}
        <ResourceTile
          className="border-0 text-white"
          style={navyTileBackground}
          descriptionClassName="text-white/90"
          title={<img src={cavaticaLogo} alt="CAVATICA" className="h-8 w-auto" />}
          description={t('landing.kidsfirst.collaboration.cavatica.description')}
          footer={
            <Button asChild variant="outline" className={externalButtonClass}>
              <a href="https://www.cavatica.org/" target="_blank" rel="noreferrer">
                {t('landing.kidsfirst.collaboration.cavatica.button')} <SquareArrowOutUpRight />
              </a>
            </Button>
          }
        />

        {/* PedcBioPortal */}
        <ResourceTile
          className="border-0 text-white"
          style={navyTileBackground}
          descriptionClassName="text-white/90"
          title={
            <span className="inline-flex rounded-md bg-white p-2">
              <img src={pedcbioportalLogo} alt="PedcBioPortal" className="h-8 w-auto" />
            </span>
          }
          description={t('landing.kidsfirst.collaboration.pedcbioportal.description')}
          footer={
            <Button asChild variant="outline" className={externalButtonClass}>
              <a href="https://pedcbioportal.org/" target="_blank" rel="noreferrer">
                {t('landing.kidsfirst.collaboration.pedcbioportal.button')} <SquareArrowOutUpRight />
              </a>
            </Button>
          }
        />
      </div>
    </div>
  );
}

export default Collaboration;
