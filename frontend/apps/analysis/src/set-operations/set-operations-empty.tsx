import { Trans } from 'react-i18next';

import AnchorLink from '@/components/base/navigation/anchor-link';
import { useI18n } from '@/components/hooks/i18n';

import logo1 from '../exploration/cards/assets/newsletter-widget-1.svg';

function SetOperationsEmpty() {
  const { t } = useI18n();
  return (
    <div className="flex flex-col items-center gap-6 max-w-[800px]">
      <div className="flex items-start justify-center gap-6 self-stretch">
        <img alt="Logo circles" src={logo1} width={156} height={158} />
      </div>

      <div className="flex items-center flex-col gap-1">
        <h5 className="text-base font-bold">{t('analysis.set_operations.empty.title')}</h5>
        <p className="text-sm text-center">
          <Trans
            i18nKey="analysis.set_operations.empty.description"
            components={{
              variant: <AnchorLink size="sm" href="/variants" />,
            }}
          />
        </p>
      </div>
    </div>
  );
}
export default SetOperationsEmpty;
