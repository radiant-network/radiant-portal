import { CloudCog, FileSearch, SquareArrowOutUpRight } from 'lucide-react';

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
        <div key={item.key} className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <span className="bg-primary/10 text-primary flex size-14 shrink-0 items-center justify-center rounded-full [&_svg]:size-7">
              {item.icon}
            </span>
            <h3 className="text-xl font-semibold tracking-tight">
              {t(`landing.include.documentation.${item.key}.title`)}
            </h3>
          </div>
          <p className="text-muted-foreground">{t(`landing.include.documentation.${item.key}.description`)}</p>
          <div className="flex flex-wrap gap-3">
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
          </div>
        </div>
      ))}
    </div>
  );
}

export default Documentation;
