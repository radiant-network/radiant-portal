import Container from '@/components/base/container';
import { useI18n } from '@/components/hooks/i18n';

import chopLogo from '../asset/footer/chop-logo.svg';
import chusjLogo from '../asset/footer/chusj-logo.svg';
import lindaLogo from '../asset/footer/linda-logo.svg';
import vanderbiltLogo from '../asset/footer/vanderbilt-logo.svg';
import velseraLogo from '../asset/footer/verlsera-logo.png';

const LOGOS = [
  { src: lindaLogo, alt: 'Linda Crnic Institute for Down Syndrome' },
  { src: chopLogo, alt: "Children's Hospital of Philadelphia" },
  { src: vanderbiltLogo, alt: 'Vanderbilt University Medical Center' },
  { src: chusjLogo, alt: 'CHU Sainte-Justine' },
  { src: velseraLogo, alt: 'Velsera' },
];

/** Landing footer: partner institution logos + legal disclaimer. */
function Footer() {
  const { t } = useI18n();

  return (
    <footer className="bg-background w-full">
      <Container className="w-full px-4 py-10 sm:px-6 lg:px-12">
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 md:justify-between">
          {LOGOS.map(logo => (
            <img key={logo.alt} src={logo.src} alt={logo.alt} className="h-14 w-auto max-w-[180px] object-contain" />
          ))}
        </div>
        <hr className="border-border my-8" />
        <p className="text-muted-foreground text-xs leading-relaxed">{t('landing.include.footer.legal')}</p>
      </Container>
    </footer>
  );
}

export default Footer;
