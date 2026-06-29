import Container from '@/components/base/container';
import AnchorLink from '@/components/base/navigation/anchor-link';
import { Button } from '@/components/base/shadcn/button';
import { useI18n } from '@/components/hooks/i18n';

import chicagoLogo from '../asset/chicago.png';
import chopLogo from '../asset/chop.png';
import chuLogo from '../asset/chu.png';
import facebookIcon from '../asset/facebook-f.svg';
import instagramIcon from '../asset/instagram.svg';
import linkedinIcon from '../asset/linkedin-in.svg';
import uncLogo from '../asset/unc.png';
import vanderbiltLogo from '../asset/vanderbilt.png';
import velseraLogo from '../asset/velsera.png';
import xIcon from '../asset/x-twitter.svg';
import youtubeIcon from '../asset/youtube.svg';

const LINK_COLUMNS = [
  {
    key: 'about',
    links: [
      { key: 'about_kids_first', href: 'https://kidsfirstdrc.org/about/' },
      { key: 'community', href: 'https://kidsfirstdrc.org/community/' },
      { key: 'faqs', href: 'https://kidsfirstdrc.org/faqs/' },
    ],
  },
  {
    key: 'resources',
    links: [
      { key: 'data', href: 'https://kidsfirstdrc.org/portal/' },
      { key: 'tools', href: 'https://kidsfirstdrc.org/tools/' },
      { key: 'help_center', href: 'https://kidsfirstdrc.org/help-center/' },
    ],
  },
  {
    key: 'news',
    links: [
      { key: 'articles', href: 'https://kidsfirstdrc.org/news/' },
      { key: 'events', href: 'https://kidsfirstdrc.org/events/' },
      { key: 'press', href: 'https://kidsfirstdrc.org/category/press/' },
    ],
  },
] as const;

const PARTNERS = [
  { src: chopLogo, alt: "Children's Hospital of Philadelphia", href: 'https://d3b.center/' },
  { src: chuLogo, alt: 'CHU Sainte-Justine', href: 'https://www.chusj.org/Home' },
  { src: uncLogo, alt: 'UNC Health', href: 'https://www.unchealth.org/home' },
  { src: chicagoLogo, alt: 'University of Chicago', href: 'https://ctds.uchicago.edu/' },
  { src: velseraLogo, alt: 'Velsera', href: 'https://velsera.com/' },
  { src: vanderbiltLogo, alt: 'Vanderbilt University Medical Center', href: 'https://medschool.vanderbilt.edu/' },
];

const SOCIALS = [
  { src: facebookIcon, href: 'https://www.facebook.com/kidsfirstDRC', label: 'Facebook' },
  { src: xIcon, href: 'https://twitter.com/kidsfirstDRC', label: 'X' },
  { src: linkedinIcon, href: 'https://www.linkedin.com/company/kidsfirstdrc/', label: 'LinkedIn' },
  { src: instagramIcon, href: 'https://www.instagram.com/kidsfirstdrc/', label: 'Instagram' },
  { src: youtubeIcon, href: 'https://www.youtube.com/channel/UCK9sPu0j4_ci4m3nNFa6gVw', label: 'YouTube' },
];

function FooterLinkColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div className="flex flex-col gap-3">
      <h4 className="text-xl font-semibold tracking-wide">{title}</h4>
      <ul className="flex flex-col gap-2">
        {links.map(link => (
          <li key={link.href}>
            <AnchorLink href={link.href} target="_blank" rel="noreferrer" variant="white" size="sm" external={false}>
              {link.label}
            </AnchorLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Landing footer: link columns, partner logos, social links and legal disclaimer. */
function Footer() {
  const { t } = useI18n();

  return (
    <footer className="text-white" style={{ backgroundColor: 'var(--primary-gradient)' }}>
      <Container className="max-w-8xl px-4 py-20 sm:px-6">
        <hr className="mb-6 border-white/20" />

        <div className="grid gap-10 md:grid-cols-2">
          <div className="grid grid-cols-3 gap-8">
            {LINK_COLUMNS.map(col => (
              <FooterLinkColumn
                key={col.key}
                title={t(`landing.kidsfirst.footer.columns.${col.key}.title`)}
                links={col.links.map(link => ({
                  label: t(`landing.kidsfirst.footer.columns.${col.key}.links.${link.key}`),
                  href: link.href,
                }))}
              />
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-center text-lg font-semibold tracking-wide md:text-left">
              {t('landing.kidsfirst.footer.partners_title')}
            </h4>
            <div className="grid grid-cols-3 items-center gap-x-12 gap-y-6 md:grid-cols-2 lg:grid-cols-3">
              {PARTNERS.map(partner => (
                <a key={partner.alt} href={partner.href} target="_blank" rel="noreferrer">
                  <img src={partner.src} alt={partner.alt} className="h-10 w-auto max-w-[140px] object-contain" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            {SOCIALS.map(({ src, href, label }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}>
                <img src={src} alt="" className="size-5" />
              </a>
            ))}
          </div>
          <span className="text-sm text-white">{t('landing.kidsfirst.footer.follow')}</span>
          <Button asChild className="bg-[var(--cyan-6)] text-white hover:brightness-95">
            <a href="mailto:support@kidsfirstdrc.org">{t('landing.kidsfirst.footer.email')}</a>
          </Button>
          <AnchorLink
            href="https://kidsfirstdrc.org/policies/#privacy"
            target="_blank"
            rel="noreferrer"
            variant="white"
            size="sm"
            external={false}
          >
            {t('landing.kidsfirst.footer.privacy')}
          </AnchorLink>
          <AnchorLink
            href="https://kidsfirstdrc.org/policies/#cookies"
            target="_blank"
            rel="noreferrer"
            variant="white"
            size="sm"
            external={false}
          >
            {t('landing.kidsfirst.footer.cookies')}
          </AnchorLink>
        </div>

        <hr className="my-6 border-white/20" />

        <p className="text-center text-sm leading-relaxed text-white md:text-left">
          {t('landing.kidsfirst.footer.disclaimer')}
        </p>
        <p className="mt-2 text-center text-sm text-white md:text-left">{t('landing.kidsfirst.footer.copyright')}</p>
      </Container>
    </footer>
  );
}

export default Footer;
