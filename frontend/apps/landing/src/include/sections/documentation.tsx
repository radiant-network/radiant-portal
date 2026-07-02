import { CloudCog, FileSearch, SquareArrowOutUpRight } from 'lucide-react';

import CtaPanel from '@/components/base/landing/cta-panel';
import { Button } from '@/components/base/shadcn/button';
import { useI18n } from '@/components/hooks/i18n';

const ITEMS = [
  { key: 'center', icon: <FileSearch />, citation: true },
  { key: 'participate', icon: <CloudCog />, citation: false },
] as const;

/** Documentation section: Documentation Center + Participate, each with CTAs. */
function Documentation() {
  const { t } = useI18n();

  return (
    <div className="grid gap-8 rounded-xl bg-muted p-8 md:grid-cols-2 md:gap-12 md:p-10">
      {ITEMS.map(item => (
        <CtaPanel
          key={item.key}
          icon={item.icon}
          title={t(`landing.include.documentation.${item.key}.title`)}
          description={t(`landing.include.documentation.${item.key}.description`)}
          footer={
            <>
              <Button asChild>
                <a href="#">
                  {t(`landing.include.documentation.${item.key}.cta`)} <SquareArrowOutUpRight />
                </a>
              </Button>
              {item.citation && (
                <Button asChild variant="outline">
                  <a href="#">{t('landing.include.documentation.center.citation')}</a>
                </Button>
              )}
            </>
          }
        />
      ))}
    </div>
  );
}

export default Documentation;
