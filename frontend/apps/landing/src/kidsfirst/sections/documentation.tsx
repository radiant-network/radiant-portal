import { SquareArrowOutUpRight } from 'lucide-react';

import Container from '@/components/base/container';
import CtaPanel from '@/components/base/landing/cta-panel';
import { Button } from '@/components/base/shadcn/button';
import { useI18n } from '@/components/hooks/i18n';

const externalButtonClass = 'border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white';

const ITEMS = [
  { key: 'find_inspiration', href: 'https://kidsfirstdrc.org/publications/' },
  { key: 'get_answers', href: 'https://kidsfirstdrc.org/help-center/' },
] as const;

/** Documentation section: Find Inspiration + Get Answers, on a dark band. */
function Documentation() {
  const { t } = useI18n();

  return (
    <section className="text-white" style={{ backgroundColor: 'var(--primary-gradient)' }}>
      <Container className="max-w-8xl pt-24 sm:px-6">
        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          {ITEMS.map(item => (
            <CtaPanel
              key={item.key}
              size="lg"
              centerOnMobile
              title={<span className="uppercase">{t(`landing.kidsfirst.documentation.${item.key}.title`)}</span>}
              description={t(`landing.kidsfirst.documentation.${item.key}.description`)}
              descriptionClassName="text-white/90"
              footer={
                <Button asChild variant="outline" className={externalButtonClass}>
                  <a href={item.href} target="_blank" rel="noreferrer">
                    {t(`landing.kidsfirst.documentation.${item.key}.button`)} <SquareArrowOutUpRight />
                  </a>
                </Button>
              }
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

export default Documentation;
