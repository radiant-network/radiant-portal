import Container from '@/components/base/container';
import NavbarLangSwitcher from '@/components/base/navbar/main-navbar-lang-switcher';
import { Button } from '@/components/base/shadcn/button';
import { useI18n } from '@/components/hooks/i18n';

import heroImage from '../asset/hero.png';
import kidsFirstLogo from '../asset/kids-first-logo.svg';

const HERO_GRADIENT =
  'linear-gradient(56deg, var(--secondary-gradient-1) 0.64%, var(--secondary-gradient-2) 17.42%, var(--secondary-gradient-3) 39.14%, var(--secondary-gradient-4) 58.88%, var(--secondary-gradient-5) 76.65%, var(--secondary-gradient-6) 90.47%, var(--secondary-gradient-7) 99.36%)';

function Hero() {
  const { t } = useI18n();

  return (
    <section
      className="relative w-full overflow-hidden text-white"
      style={{ backgroundColor: 'var(--primary-gradient)' }}
    >
      {/* Mobile: faded background image (hidden on lg+) */}
      <img
        src={heroImage}
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-10 md:hidden"
      />

      <Container className="relative z-10 max-w-8xl px-4 pt-12 sm:px-6">
        {/* Lang switcher — kept for consistency with the Include landing */}
        <div className="flex mb-3 justify-end">
          <NavbarLangSwitcher className="border-white/40 hover:bg-white/10 border text-white hover:text-white" />
        </div>

        <div className="grid items-end gap-8 md:grid-cols-[3fr_2fr] lg:grid-cols-[1fr_1fr] lg:gap-20">
          {/* Left column: branding + text + CTAs */}
          <div className="space-y-6 self-start pb-6 text-center lg:text-left">
            <img
              src={kidsFirstLogo}
              alt={t('landing.kidsfirst.hero.logo_alt')}
              className="mx-auto h-[158px] w-[117px] lg:mx-0"
            />
            <h1 className="text-5xl font-bold uppercase leading-tight tracking-tight">
              {t('landing.kidsfirst.hero.title')}
            </h1>
            <div className="space-y-3 text-white/80">
              <p className="text-xl">{t('landing.kidsfirst.hero.description')}</p>
              <p className="text-xl font-medium">{t('landing.kidsfirst.hero.getting_started')}</p>
              <p className="text-sm">{t('landing.kidsfirst.hero.free')}</p>
            </div>
            <div className="mx-auto grid w-fit grid-cols-1 gap-3 md:grid-cols-2 lg:mx-0">
              <Button asChild className="bg-[var(--magenta-7)] text-white hover:brightness-95">
                <a href="#">{t('landing.kidsfirst.hero.login')}</a>
              </Button>
              <Button asChild className="bg-[var(--cyan-6)] text-white hover:brightness-95">
                <a href="#">{t('landing.kidsfirst.hero.signup')}</a>
              </Button>
            </div>
          </div>

          {/* Right column (image + gradient) */}
          <div className="self-end">
            {/* Tablet (md→lg): contained image, overflowing slightly above the gradient */}
            <div className="relative hidden h-[500px] md:block lg:hidden">
              <div
                className="absolute inset-x-0 bottom-0 top-[40px] rounded-t-2xl opacity-75"
                style={{ background: HERO_GRADIENT }}
              />
              <img src={heroImage} alt="" className="relative h-full w-full object-cover object-left-bottom" />
            </div>

            {/* Desktop (lg+): the photo overflows onto the gradient */}
            <div className="relative hidden lg:block">
              <img
                src={heroImage}
                alt=""
                className="relative z-10 mx-auto block max-h-[562px] w-auto max-w-none lg:ml-[70px] lg:mr-[38px]"
              />
              <div
                className="absolute bottom-0 left-8 right-0 top-[54px] rounded-t-2xl opacity-75"
                style={{ background: HERO_GRADIENT }}
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default Hero;
